'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import ArrowLink from '../Components/ArrowLink.js';
import Utility from '../Globals/UtilityFunctions.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  AsyncStorage,
  TouchableHighlight
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
    this.state = {
      emailAddress: '',
      validEmail: true
    },
    this.userIndex = this.props.db.child('indexes').child('userIndex');
    this.users = this.props.db.child('users');
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  escapeEmail(email) {
    return (email || '').replace('.', ',');
  }

  checkEmail() {
    var self = this;
    if (self.validateEmail(self.state.emailAddress)) {
      self.userIndex.once('value', function (snapshot) {
        if (snapshot.hasChild(self.escapeEmail(self.state.emailAddress))) {
          // Go to login
          self.props.navigator.push({name: 'SignIn', cookieData: self.state.emailAddress})
        } else {
          // Go to registration
          self.props.navigator.push({name: 'Register', cookieData: self.state.emailAddress})
        }
      });
    } else {
      self.setState({validEmail: false});
    }
  }

  anonAuth() {
    this.props.db.authAnonymously((err, authData) => {
      if (err) {
        // handle failure 
        console.log("ERROR", err);
      } else {
        this.users.child(authData.uid).set({email: ""});
        this.props.navigator.push({name: 'RegistrationInterim'});
      };
    });
  };

  componentWillMount() {
    // AsyncStorage.removeItem('userData');
    //AsyncStorage.removeItem('notificationCount');
    //FBLoginManager.logOut();
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
                  onChangeText={(emailAddress) => this.setState({emailAddress})} />
              <TouchableHighlight 
                  style={styles.emailButton} 
                  underlayColor={StylingGlobals.colors.pressDown} 
                  onPress={() => this.checkEmail()} >
                <Image style={styles.emailRightArrow} source={require("../img/arrow-right.png")} />
              </TouchableHighlight>
            </View>
            { this.state.validEmail ?
                null
                : 
                <Text style={styles.errorText}>Please use a valid email</Text>
            }
          </View>

          <View style={styles.fbContainer}>
            <LoginButton 
                style={styles.fbutton}
                readPermissions={["public_profile", "email"]}
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      // Error handling
                      alert("login has error: " + result.error);
                    } else if (result.isCancelled) {
                      //alert("login is cancelled.");
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          this.props.db.authWithOAuthToken('facebook', data.accessToken.toString(), (error, authData) => {
                            if (error) {
                              // Error handling
                              console.log('Firebase login failed!', error);
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
          <ArrowLink skipTo={() => this.anonAuth() }>Skip for Now</ArrowLink>
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
    width: 285,
    flex: 1,
    height: 45, 
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
    height: 44,
    width: 240,
    backgroundColor: '#fff',
  },
  emailButton: {
    backgroundColor: StylingGlobals.colors.mainColor,
    padding: 2,
    height: 44,
    width: 44,
  },
  emailRightArrow: {
    width: 35,
    height: 35,
    marginTop: 2,
    marginLeft: 4,
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

module.exports = Gateway;
