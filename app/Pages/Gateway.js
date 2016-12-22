'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals';
import ArrowLink from '../Components/ArrowLink';
import Utility from '../Globals/UtilityFunctions';
import actions from '../State/Actions/Actions';
import User from '../Globals/User';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import { connect } from 'react-redux';
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

const FBSDK = require('react-native-fbsdk');
const FBLoginManager = require('NativeModules').FBLoginManager;
const {
  LoginManager,
  LoginButton,
  AccessToken
} = FBSDK;

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
    this.props.actions.toggleAnimation();
    if (!this.props.isConnected) {
      this.props.actions.toggleAnimation();
      this.props.actions.setError("Sorry, you're not connected to the internet");
    } else if (this.validateEmail(this.props.emailAddress)) {
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

  componentWillMount() {
    const dispatchConnected = isConnected => this.props.actions.setIsConnected(isConnected);
    NetInfo.isConnected.fetch().then().done(() => {
      NetInfo.isConnected.addEventListener('change', dispatchConnected);
    });

    AsyncStorage.removeItem('hasBeenIntroduced');
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.props.actions.setIsConnected(isConnected);
    });
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

          <View style={styles.fbContainer}>
            <LoginButton
                style={styles.fbutton}
                readPermissions={["public_profile", "email"]}
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      this.props.actions.setError("Sorry, there was an error. Either try email registration or skip for now.");
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          this.props.db.authWithOAuthToken('facebook', data.accessToken.toString(), (error, authData) => {
                            if (error) {
                              this.props.actions.setError("Sorry, there was an error. Either try email registration or skip for now.");
                            } else {
                              AsyncStorage.setItem('userData', JSON.stringify(authData));
                              Utility.setLocalAuth();
                              var email = Utility.escapeEmail(authData.auth.token.email);
                              this.userIndex.child(email).set(true);
                              this.users.child(authData.uid).set({email: email, secrets: {} });
                              this.props.navigator.push({name: 'SelectCategory'})
                            }
                          })
                        }
                      )
                    }
                  }
                }
                onLogoutFinished={() => console.log("logout.")}
            />
          </View>
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
  fbContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  fbutton: {
    width: 295,
    flex: 1,
    height: 55,
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

export default connect(mapStateToProps, mapDispatchToProps)(Gateway)
