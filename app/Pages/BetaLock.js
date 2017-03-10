'use strict';

import React, { Component } from 'react';
import GetSecrets from '../Globals/GetSecrets.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import ArrowLink from '../Components/ArrowLink';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import User from '../Globals/User';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

import { connect } from 'react-redux';

class BetaLock extends React.Component {
  constructor(props) {
    super(props);
    this.verificationCodes = this.props.db.child('indexes').child('verificationCodes');
    this.pureInvitation = this.props.db.child('indexes').child('pureInvitation');
    this.verifiedIndex = this.props.db.child('indexes').child('verified');
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.userFunctions = new User(Utility.firebaseApp, this.props.db, this.users, this.props.navigator);
  }

  waitOnAuth(counter = 0, codeKey, privateSecret) {
    if (!this.props.userId && counter < 5) {
      this.setTimeout (
        () => {
          this.waitOnAuth(counter++, codeKey, privateSecret);
        }, 500
      )
    } else if (counter > 5) {
      this.verificationCodes.child(codeKey).remove();
      this.props.navigator.push({name: 'SelectCategory', welcomeModal: true});
    } else {
      this.secretClaimed(codeKey, privateSecret);
    }
  }

  verifyCode() {
    if (!this.props.code) {
      this.props.actions.setError("Please enter a secret code.");
    } else {
      this.props.actions.toggleAnimation();
      let whitespaceStripped = this.props.code.replace(/\s/g,'');
      console.log(whitespaceStripped);
      this.verificationCodes.orderByValue().equalTo(whitespaceStripped).once('value', (snapshot) => {
        let valReturned = snapshot.val();
        console.log(valReturned);
        if (valReturned) {
          this.userFunctions.anonAuth();
          let codeKey = Object.keys(valReturned)[0];
          this.privateSecrets.child(codeKey).once('value', (snapshot) => {
            let privateSecret = snapshot.val()
            if (privateSecret) {
              this.waitOnAuth(0, codeKey, privateSecret);
            } else {
              this.verificationCodes.child(codeKey).remove();
              this.pureInvitation.child(whitespaceStripped).remove();
              this.props.actions.toggleAnimation();
              this.props.navigator.push({name: 'SelectCategory', modalText: 'You have the power to invite new users.', modalTitle: 'Welcome', modalSecondaryText: "Select a premade secret or make your own to get started."});
            }
          });
        } else {
          this.setErrorState("Sorry, we couldn't find that code");
        }
      });
    }
  }

  secretClaimed(codeKey, ps) {
    this.privateSecrets.child(codeKey).update({responderID: this.props.userId}, //update private secrets with responder ID
      () => {
          let updatedHash = {}
          updatedHash[codeKey] = true;
          this.props.actions.pushUpdatedSecret(codeKey);
          this.props.actions.incrementNotifications(1);
          GetSecrets.addUpdatedSecretsToAsyncStorage(updatedHash)
          this.users.child(ps.askerID).child('secrets').child(codeKey).once('value', (grandchildSnapshot) => {
            if (grandchildSnapshot.val()) {
              ps.state = {
                "sentState": "RR",
                "answerState": grandchildSnapshot.val().answerState,
              };
            } else {
              ps.state = {
                "sentState": "RR",
                "answerState": ""
              }
            }
            ps.key = codeKey;
            ps.answer = null;
            this.props.actions.toggleAnimation();
            this.props.navigator.push({name: 'MySecrets', secret: ps, modalText: 'You have the power to invite new users.', modalTitle: 'Welcome', modalSecondaryText: "Your security settings are currently 'low', you can register to increase security."});
            this.setTimeout (
              () => {
                this.users.child(this.props.userId).child('secrets').child(codeKey).set({answerState: grandchildSnapshot.val().answerState, sentState: 'RR'});
                this.verifiedIndex.child(this.props.userId).set(true);
                GetSecrets.pushLocalSecret(ps);
              }, 1000
            )
          });
          // this.verificationCodes.child(codeKey).remove();
      }
    )
  }

  setErrorState(errorText) {
    this.props.actions.setError(errorText);
    this.props.actions.toggleAnimation();
  }

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error, this.props.email);
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Image style={styles.heroImage} source={require("../img/show-me-skirt.png")} />
          <Text style={styles.mainHeader}>
            Please enter your invitation
          </Text>
          <Text style={styles.header}>
            You would have received this in a text from a friend or directly from ShowMe.
          </Text>
          <TextInput
            style={StylingGlobals.textInput}
            autoFocus={true}
            placeholder="Secret code"
            onChangeText={(text) => this.props.actions.updateFormInput(text)}
            value={this.props.code} />
          <BigButton do={() => this.verifyCode()}>
            Submit
          </BigButton>
          {
            this.props.error ? <Text style={styles.error}>{this.props.error}</Text> : null
          }
          <ActivityIndicator animationControl={this.props.animating} />
          <ArrowLink skipTo={() => {this.props.navigator.push({name: "BetaExplanation"}); this.props.actions.updateFormInput('')} }>Dont have an invitation?</ArrowLink>
        </ScrollView>
      </View>
    );
  }
}

ReactMixin(BetaLock.prototype, ReactTimer);

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    error: state.error,
    code: state.formInput,
    updatedSecrets: state.updatedSecrets,
    userId: state.userId,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

var styles = StyleSheet.create({
  heroImage: {
    width: 205,
    height: 205,
    alignSelf: 'center',
    marginTop: -15,
    marginBottom: -15,
  },
  mainHeader: {
    marginLeft: 30,
    marginRight: 30,
    fontSize: 18,
    marginBottom: 7,
    textAlign: 'center',
    color: StylingGlobals.colors.mainColor,
    fontWeight: 'bold',
  },
  header: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 7,
    fontSize: 16,
  },
  error: {
    marginLeft: 30,
    fontSize: 16,
    marginRight: 30,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BetaLock)
