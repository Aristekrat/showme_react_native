'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
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
    this.answers = this.props.db.child('answers');
    this.currentSecret = this.props.route.cookieData;
  }
  
  responderOrAsker(localID, secret) {
    if (localID === secret.askerID) {
      return "askerAnswer";
    } else if (localID === secret.responderID) {
      return "responderAnswer";
    } else {
      // the user is seeing a secret they shouldn't, serious error
      return null;
    }
  }

  toggleActivityIndicator() { // Needs to be moved to common utils
    this.setState({animating: !this.state.animating});
  }

  notify(notificationText) {
    this.toggleActivityIndicator();
    this.setState({notificationText: notificationText});
  }

  submitAnswer() {
    if (this.state.answer.length > 5) {
      this.toggleActivityIndicator()
      let secretID = this.currentSecret.key;
      AsyncStorage.getItem('userData').then((user_data_json) => {
        let user_data = JSON.parse(user_data_json); 
        let userStatus = this.responderOrAsker(user_data.uid, this.props.route.cookieData);
        let updatedAnswer = {};
        updatedAnswer[userStatus] = this.state.answer;
        this.answers.child(secretID).update(updatedAnswer, this.updateUsersTable(userStatus, user_data.uid));
      })
    } else {
      this.setState({notificationText: 'Please provide an answer'});
    }
  }

  updateUsersTable(userStatus, userId) {
    this.answers.child(this.currentSecret.key).once('value', (snapshot) => {
      var ans = snapshot.val();
      if (ans.askerAnswer && ans.responderAnswer) {
        var update = {answerState: 'BR', sentState: 'SO'}
        this.performUserSecretsUpdate(update);
      } else {
        var secretState = userStatus === 'askerAnswer' ? 'AA' : 'RA'
        var update = {answerState: secretState}
        this.performUserSecretsUpdate(update);
      };
    });
  }

  performUserSecretsUpdate(stateToUpdate) {
    if (this.currentSecret.responderID) {
      this.users.child(this.currentSecret.responderID).child('secrets').child(this.currentSecret.key).update(stateToUpdate);
    }
    if (this.currentSecret.askerID) {
      this.users.child(this.currentSecret.askerID).child('secrets').child(this.currentSecret.key).update(stateToUpdate);
    }
    this.notify("Success! We'll notify you when you both answer");
    this.setTimeout (
      () => { this.props.navigator.pop(); }, 
      1000    
    );
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
          <TouchableHighlight style={[styles.button, StylingGlobals.horizontalCenter]} 
              onPress={() => this.submitAnswer()}
              underlayColor={StylingGlobals.colors.pressDown}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableHighlight>
          {this.state.notificationText ? <Text style={styles.notificationText}>{this.state.notificationText}</Text> : null}
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

ReactMixin(YourAnswer.prototype, ReactTimer);

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
