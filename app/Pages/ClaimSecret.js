'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import GetSecrets from '../Globals/GetSecrets.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
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

  verifyCode() {
    if (!this.props.code) {
      this.props.actions.setError("Please enter a secret code. You would've got this in a friend's text invitation");
    } else {
      this.props.actions.toggleAnimation();
      let whitespaceStripped = this.props.code.replace(/\s/g,'');
      this.verificationCodes.orderByValue().equalTo(whitespaceStripped).once('value', (snapshot) => {
        let valReturned = snapshot.val();
        if (valReturned) {
          this.secretClaimed(valReturned);
        } else {
          this.setErrorState("Sorry, we couldn't find that code");
        }
      }, (err) => {
        this.setErrorState("Sorry, we experienced a network error. Please try again");
      });
    }
  }

  secretClaimed(claimedSecret) {
    let codeKey = Object.keys(claimedSecret)[0];
    this.privateSecrets.child(codeKey).update({responderID: this.props.userId}, //update private secrets with responder ID
      () => {
        this.privateSecrets.child(codeKey).once('value', (childSnapshot) => {
          this.props.actions.toggleAnimation();
          let ps = childSnapshot.val();
          let updatedHash = {}
          updatedHash[codeKey] = true;
          this.props.actions.pushUpdatedSecret(codeKey);
          this.props.actions.incrementNotifications(1);
          GetSecrets.addUpdatedSecretsToAsyncStorage(updatedHash)
          this.users.child(ps.askerID).child('secrets').child(codeKey).once('value', (grandchildSnapshot) => {
            ps.state = {
              "sentState": "RR",
              "answerState": grandchildSnapshot.val().answerState,
            };
            ps.key = codeKey;
            GetSecrets.pushLocalSecret(ps);
            this.props.navigator.push({name: 'MySecrets', secret: ps});
            this.users.child(this.props.userId).child('secrets').child(codeKey).set({answerState: grandchildSnapshot.val().answerState, sentState: 'RR'});
          });
          //this.verificationCodes.child(codeKey).remove();
          //this.verifiedIndex.child(this.props.userId).set(true);
        })
      }
    )
  }

  setErrorState(errorText) {
    this.props.actions.setError(errorText);
    this.props.actions.toggleAnimation();
  }

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error, this.props.code);

    if (!Utility.authStatus && this.props.securityLevel) {
        this.setTimeout (
          () => {
            this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to login first'});
          }, 0
        )
    }

    if (!this.props.userId) {
      AsyncStorage.getItem('userData').then((user_data_string) => {
        if (user_data_string) {
          let user_data = JSON.parse(user_data_string);
          this.props.actions.updateUserId(user_data.uid);
        } else {
          this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to login first'});
        }
      });
    }
  }

  componentDidMount() {
    GetSecrets.checkIfRemoteSecretsReceived(GetSecrets.writeRemoteSecretsToAsyncStore);
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
            onChangeText={(text) => this.props.actions.updateFormInput(text)}
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

ReactMixin(ClaimSecret.prototype, ReactTimer);

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    error: state.error,
    code: state.formInput,
    updatedSecrets: state.updatedSecrets,
    securityLevel: state.securityLevel,
    userId: state.userId,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
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
