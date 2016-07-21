'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  TextInput,
  AsyncStorage,
} from 'react-native';

class YourAnswer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      answer: '',
      animating: false
    }
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
  }
  
  responderOrAsker(localID, secret) {
    if (localID === secret.askerID) {
      return "askerAnswer";
    } else if (localID === secret.responderID) {
      return "responderAnswer";
    } else {
      // the user is seeing a secret they shouldn't, serious error
      return null
    }
  }

  // Needs to be moved to common utils
  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }

  notify(notificationText) {
    this.toggleActivityIndicator();
    this.setState({notificationText: notificationText});
  }

  submitAnswer() {
    if (this.state.answer.length > 5) {
      this.toggleActivityIndicator()
      let secretID = this.props.route.cookieData.key;
      AsyncStorage.getItem('userData').then((user_data_json) => {
        let user_data = JSON.parse(user_data_json); 
        let userStatus = this.responderOrAsker(user_data.uid, this.props.route.cookieData);
        let updatedAnswer = {};
        updatedAnswer[userStatus] = this.state.answer;
        this.privateSecrets.child(secretID).update(updatedAnswer, this.notify('Success'));
        var otherAnswer = userStatus === 'responderAnswer' ? 'askerAnswer' : 'responderAnswer';
        if (this.props.route.cookieData[otherAnswer]) {
          this.users.child(this.props.route.cookieData.responderID).child('secrets').child(secretID).set('BR');
          this.users.child(this.props.route.cookieData.askerID).child('secrets').child(secretID).set('BR');
        }
      })
    } else {
      this.setState({notificationText: 'Please provide an answer'});
    }
  }

  render() {
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.form}>
          <View>
            <Text>Q: {this.props.route.cookieData.question}</Text>
            <TextInput
                style={styles.textInput}  
                autoFocus={true}
                onChangeText={(answer) => this.setState({answer})}
                value={this.state.answer} />
          </View>
          <ActivityIndicator animationControl={this.state.animating}/>
          <TouchableHighlight style={[styles.button, StylingGlobals.horizontalCenter]} onPress={() => this.submitAnswer()}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableHighlight>
          {this.state.notificationText ? <Text style={styles.notificationText}>{this.state.notificationText}</Text> : null}
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  form: {
    padding: 20
  },
  textInput: {
    backgroundColor: '#fff',
    height: 40,
    borderWidth: 1,
    borderColor: '#eee',
    paddingLeft: 5,
    marginTop: 12,
    marginBottom: 12
  },
  notificationText: {
    color: StylingGlobals.colors.mainColor,
    textAlign: 'center',
    marginTop: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: StylingGlobals.colors.mainColor,
    height: 45,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});


module.exports = YourAnswer;
