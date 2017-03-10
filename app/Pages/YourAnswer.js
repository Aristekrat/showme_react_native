'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  TextInput,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux'

class YourAnswer extends React.Component {
  constructor(props){
    super(props);
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.answers = this.props.db.child('answers');
    this.currentSecret = this.props.route.cookieData ? this.props.route.cookieData : null;
  }

  responderOrAsker(localID, secret) {
    if (localID === secret.askerID) {
      return "askerAnswer";
    } else if (localID === secret.responderID) {
      return "responderAnswer";
    } else {
      return false;
    }
  }

  notify(notificationText) {
    this.props.actions.toggleAnimation();
    this.props.actions.setError(notificationText); // Not actually an error here, a success notification instead
  }

  submitAnswer() {
    if (Utility.validateStringInput(this.props.answer, "answer")) {
      let userStatus = this.responderOrAsker(this.props.userId, this.props.route.cookieData);
      if (userStatus) {
        this.props.actions.toggleAnimation();
        let secretID = this.currentSecret.key;
        let updatedAnswer = {};
        updatedAnswer[userStatus] = this.props.answer;
        this.answers.child(secretID).update(updatedAnswer, this.updateUsersTable(userStatus, this.props.userId));
      } else {
        this.props.actions.setError("Sorry, the app has experienced an error");
        this.props.navigator.pop();
      }
    }
  }

  updateUsersTable(userStatus, userId) {
    this.answers.child(this.currentSecret.key).once('value', (snapshot) => {
      var ans = snapshot.val();
      console.log(ans);
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
  }

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error, this.props.answer);

    if (!this.props.route.cookieData || !this.props.route.cookieData.question) {
      this.props.navigator.pop();
    }
  }

  componentDidMount() {
    if (!this.props.userId) {
      AsyncStorage.getItem('smUserData').then((user_data_string) => {
        if (user_data_string) {
          let user_data = JSON.parse(user_data_string);
          this.props.actions.updateUserId(user_data.uid);
        } else {
          this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
        }
      });
    }
  }

  render() {
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.form}>
          <View>
            <Text style={styles.question}>Q: {this.currentSecret ? this.currentSecret.question : "No question"}</Text>
            <TextInput
                style={styles.textInput}
                autoFocus={true}
                onChangeText={(answer) => this.props.actions.updateFormInput(answer)}
                value={this.props.answer} />
          </View>
          <ActivityIndicator animationControl={this.props.animating}/>
          <TouchableHighlight style={[styles.button, StylingGlobals.horizontalCenter]}
              onPress={() => this.submitAnswer()}
              underlayColor={StylingGlobals.colors.pressDown}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableHighlight>
          { this.props.error ? <Text style={styles.notificationText}>{this.props.error}</Text> : null}
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

ReactMixin(YourAnswer.prototype, ReactTimer);

const styles = StyleSheet.create({
  form: {
    padding: 20
  },
  question: {
    fontSize: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    height: 55,
    borderWidth: 1,
    borderColor: StylingGlobals.colors.textInputBorder,
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
    height: 55,
    marginTop: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    answer: state.formInput,
    error: state.error,
    userId: state.userId,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(YourAnswer);
