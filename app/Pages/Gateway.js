'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals';
import ArrowLink from '../Components/ArrowLink';
import Utility from '../Globals/UtilityFunctions';
import actions from '../State/Actions/Actions';
import User from '../Globals/User';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import { connect } from 'react-redux';
import FButton from '../Components/FButton.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
  NetInfo,
} from 'react-native';

class Gateway extends React.Component {
  constructor(props) {
    super(props);
    this.userIndex = this.props.db.child('indexes').child('userIndex');
    this.users = this.props.db.child('users');
    this.userFunctions = new User(this.props.db, this.users, this.props.navigator);
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  escapeEmail(email) {
    return (email || '').replace('.', ',');
  }

  checkEmail() {
    // Utility.checkConnection();
    this.props.actions.toggleAnimation();
    if (this.validateEmail(this.props.emailAddress)) {
      this.userIndex.once('value', (snapshot) => {
        if (snapshot.hasChild(this.escapeEmail(this.props.emailAddress))) {
          this.props.navigator.push({name: 'SignIn', cookieData: this.props.emailAddress}); // Go to login
        } else {
          this.props.navigator.push({name: 'Register', cookieData: this.props.emailAddress}); // Go to registration
        }
      });
    } else {
      this.props.actions.toggleAnimation();
      this.props.actions.setError("Please enter a valid email");
    }
  }

  fbSuccessCB(authData, props) {
    AsyncStorage.setItem('userData', JSON.stringify(authData));
    Utility.setLocalAuth(true);
    var email = Utility.escapeEmail(authData.auth.token.email); // These four lines are different in Gateway & SignIn
    props.db.child('indexes').child('userIndex').child(email).set(true);
    props.db.child('users').child(authData.uid).update({email: email});
    props.navigator.push({name: 'RegistrationInterim'});
  }

  componentWillMount() {
    AsyncStorage.removeItem('hasBeenIntroduced');
  }

  render() {
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Image style={styles.heroImage} source={require("../img/show-me-skirt.png")} />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroText}>Show Me lets you trade secrets with your friends.</Text>
            <Text style={styles.heroText}>We reveal secret answers only when both of you have answered.</Text>
          </View>

          <View style={styles.emailContainer}>
            <Text style={styles.emailContinueText}>Continue with Email</Text>
            <View style={styles.emailButtonContainer}>
              <TextInput
                  placeholder="Your email"
                  style={styles.emailTextInput}
                  ref="emailAddress"
                  autoCapitalize="none"
                  keyboardType={'email-address'}
                  onChangeText={(emailAddress) => this.props.actions.updateFormInput(emailAddress)} />
              <TouchableHighlight
                  style={styles.emailButton}
                  underlayColor={StylingGlobals.colors.pressDown}
                  onPress={() => this.checkEmail()} >
                <Image style={styles.emailRightArrow} source={require("../img/arrow-right.png")} />
              </TouchableHighlight>
            </View>
            { this.props.error ?
                <Text style={styles.errorText}>{this.props.error}</Text>
                :
                null
            }
          </View>

          <ActivityIndicator animationControl={this.props.animating}/>

          <FButton successCB={this.fbSuccessCB} db={this.props.db} navigator={this.props.navigator} />

          <ArrowLink skipTo={() => this.userFunctions.anonAuth() }>Skip for Now</ArrowLink>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heroImage: {
    width: 185,
    height: 185,
    alignSelf: 'center',
    marginTop: -15,
  },
  heroTextContainer: {
    marginBottom: 15,
    marginTop: -15,
  },
  heroText: {
    textAlign: 'center',
    marginBottom: 7,
  },
  emailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  emailContinueText: {
    textAlign: 'center',
    marginBottom: 5,
  },
  emailButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  emailTextInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 2,
    height: 55,
    width: 240,
    backgroundColor: '#fff',
  },
  emailButton: {
    backgroundColor: StylingGlobals.colors.mainColor,
    padding: 2,
    height: 55,
    width: 55,
  },
  emailRightArrow: {
    width: 43,
    height: 43,
    marginTop: 3,
    marginLeft: 6,
    tintColor: '#fff',
  },
  bottomContainer: {
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
  },
  errorText: {
    marginTop: 5,
    color: StylingGlobals.colors.mainColor
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    error: state.error,
    emailAddress: state.emailAddress,
    isConnected: state.isConnected,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return { actions : actions }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gateway);
