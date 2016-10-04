'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import GetSecrets from '../Globals/GetSecrets.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

class ClaimSecret extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      error: '',
      animating: false,
    }
    this.verificationCodes = this.props.db.child('indexes').child('verificationCodes');
    this.verifiedIndex = this.props.db.child('indexes').child('verified');
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
  }

  // TODO refactor this thing, it's much bigger than a well written function should be
  verifyCode() {
    if (!this.state.code) {
      this.setState({error: "Please enter a secret code. You would've got this in a friend's text invitation"});
    } else {
      this.setState({animating: true});
      this.verificationCodes.orderByValue().equalTo(this.state.code).once('value', (snapshot) => {
        let valReturned = snapshot.val();
        if (valReturned) {
          var codeKey = Object.keys(valReturned)[0];
          AsyncStorage.getItem('userData').then((user_data_string) => { 
            if (user_data_string) {
              this.setState({animating: false});
              let user_data = JSON.parse(user_data_string);
              this.privateSecrets.child(codeKey).update({responderID: user_data.uid}, //update private secrets with responder ID
                () => {
                  this.privateSecrets.child(codeKey).once('value', (childSnapshot) => {
                    let ps = childSnapshot.val();
                    ps.state = {
                      "sentState": "RR",
                      "answerState": "NA",
                    };
                    let secret = [ps];
                    GetSecrets.pushLocalSecret(ps); 
                    this.props.navigator.push({name: 'MySecrets', secret: secret});
                  })
                }
              )
              this.verifiedIndex.child(user_data.uid).set(true);
              this.verificationCodes.child(codeKey).remove();
              this.users.child(user_data.uid).child('secrets').child(codeKey).set({answerState: 'NA', sentState: 'RR'}); // answerState is hard code atm, might be AA, need to check in the future
            } else {
              this.setState({error: "Sorry, we can't find your user id. Please log in", animating: false});
            }
          });
        } else {
          this.setState({error: "Sorry, we couldn't find that code", animating: false});
        }
      }, (err) => {
        this.setState({error: "Sorry, we experienced a network error. Please try again", animating: false});
      });     
    }
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={StylingGlobals.header}>
            Enter your code
          </Text>
          <TextInput
            style={StylingGlobals.textInput}  
            autoFocus={true}
            onChangeText={(text) => this.setState({code: text})}
            value={this.state.code} />
          <Text style={styles.paragraph}>Check the text you received for your code</Text>
          <BigButton do={() => this.verifyCode()}>
            Submit
          </BigButton>
          {
            this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null
          }
          <ActivityIndicator animationControl={this.state.animating} />
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  paragraph: {
    marginLeft: 30,
    color: '#555',
    marginTop: 5,
  },
  error: {
    marginLeft: 30,
    fontSize: 16,
    color: StylingGlobals.colors.pressDown,
    marginRight: 30,
  }
});

module.exports = ClaimSecret;
