'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import GetSecrets from '../Globals/GetSecrets.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

import { connect } from 'react-redux';

class ClaimSecret extends React.Component {
  constructor(props) {
    super(props);
    this.verificationCodes = this.props.db.child('indexes').child('verificationCodes');
    this.verifiedIndex = this.props.db.child('indexes').child('verified');
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
  }

  // TODO refactor this thing, it's much bigger than a well written function should be
  verifyCode() {
    if (!this.props.code) {
      this.props.setError("Please enter a secret code. You would've got this in a friend's text invitation");
    } else {
      this.props.toggleAnimation();
      let whitespaceStripped = this.props.code.replace(/\s/g,'');
      this.verificationCodes.orderByValue().equalTo(whitespaceStripped).once('value', (snapshot) => {
        let valReturned = snapshot.val();
        if (valReturned) {
          // Everthing within this block should be abstracted into its own function
          var codeKey = Object.keys(valReturned)[0];
          AsyncStorage.getItem('userData').then((user_data_string) => {
            if (user_data_string) {
              this.props.toggleAnimation();
              let user_data = JSON.parse(user_data_string);
              this.privateSecrets.child(codeKey).update({responderID: user_data.uid}, //update private secrets with responder ID
                () => {
                  this.privateSecrets.child(codeKey).once('value', (childSnapshot) => {
                    let ps = childSnapshot.val();
                    ps.state = {
                      "sentState": "RR",
                      "answerState": "NA",
                    };
                    ps.key = codeKey;
                    let secret = [ps];
                    actions.pushUpdatedSecret(ps.key);
                    GetSecrets.pushLocalSecret(ps);
                    this.props.navigator.push({name: 'MySecrets', secret: secret});
                  })
                }
              )
              this.verifiedIndex.child(user_data.uid).set(true);
              this.users.child(user_data.uid).child('secrets').child(codeKey).set({answerState: 'NA', sentState: 'RR'}); // answerState is hard code atm, might be AA, need to check in the future
            } else {
              this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
            }
          });
        } else {
          this.setErrorState("Sorry, we couldn't find that code");
        }
      }, (err) => {
        this.setErrorState("Sorry, we experienced a network error. Please try again");
      });
    }
  }

  setErrorState(errorText) {
    this.props.setError(errorText);
    this.props.toggleAnimation();
  }

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error, this.props.code);
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
            onChangeText={(text) => this.props.updateFormInput(text)}
            value={this.props.code} />
          <Text style={styles.paragraph}>Check the text you received for your code</Text>
          <BigButton do={() => this.verifyCode()}>
            Submit
          </BigButton>
          {
            this.props.error ? <Text style={styles.error}>{this.props.error}</Text> : null
          }
          <ActivityIndicator animationControl={this.props.animating} />
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    error: state.error,
    code: state.formInput,
    updatedSecrets: state.updatedSecrets,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return actions;
}

var styles = StyleSheet.create({
  paragraph: {
    marginLeft: 30,
    marginTop: 5,
  },
  error: {
    marginLeft: 30,
    fontSize: 16,
    color: StylingGlobals.colors.pressDown,
    marginRight: 30,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ClaimSecret)
