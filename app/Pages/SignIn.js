'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ArrowLink from '../Components/ArrowLink.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import Utility from '../Globals/UtilityFunctions.js';
import GetSecrets from '../Globals/GetSecrets.js';
import { connect } from 'react-redux';
import actions from '../State/Actions/Actions';
import User from '../Globals/User';
const FBSDK = require('react-native-fbsdk');
const FBLoginManager = require('NativeModules').FBLoginManager;
const {
  LoginManager,
  LoginButton,
  AccessToken
} = FBSDK;
import Perf from 'react-addons-perf';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  ScrollView,
  TextInput,
  AsyncStorage
} from 'react-native';

class SignIn extends Component {
  constructor(props){
    super(props);
    this.usersIndex = this.props.db.child('indexes').child('userIndex');
    this.users = this.props.db.child('users');
    this.userFunctions = new User(this.props.db, this.users, this.props.navigator);
  }

  submitUser() {
    if (this.props.email !== '' && this.props.password !== '') {
      this.userFunctions.login(this.props.email, this.props.password, false, this.props.route.message);
    } else {
      this.props.actions.setError('Please enter an email and password');
    }
  }

  forgot() {
    if (!this.props.email) {
      this.props.actions.setError('Please enter your email address');
    } else {
      this.userFunctions.forgotPassword(this.props.email);
    }
  }

  switchToRegister() {
    this.props.actions.removeError();
    this.props.navigator.push({name: 'Register'});
  }


  componentWillMount() {
    if (this.props.route.message) {
      this.props.actions.setError(this.props.route.message);
    }
  }

  componentDidMount() {
    Perf.printWasted();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator animationControl={this.props.animating}/>
        <ScrollView style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.textInput}
                ref="email"
                autoFocus={true}
                keyboardType={'email-address'}
                value={this.props.email}
                onEndEditing={(text) => {this.refs.password.focus()}}
                onChangeText={(email) => this.props.actions.updateFormInput(email) }
                selectionColor={StylingGlobals.colors.mainColor} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.textInput}
              ref="password"
              onChangeText={(password) => this.props.actions.updatePassword(password) }
              secureTextEntry={true}
              selectionColor={StylingGlobals.colors.navColor} />
          </View>
          <TouchableHighlight
              style={styles.button}
              underlayColor={StylingGlobals.colors.pressDown}
              onPress={() => this.submitUser()}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableHighlight>
          {
            this.props.errorMessage ?
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{this.props.errorMessage}</Text>
            </View>
            :
            null
          }
          {
            this.props.route.message ?
            <View style={styles.fbContainer}>
              <LoginButton
                  style={styles.fbutton}
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
                                this.props.navigator.pop();
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
            :
            null
          }
          {
            this.props.displaySkip ?
            <View style={styles.forgotPasswordBlock}>
              <ArrowLink skipTo={() => this.props.navigator.push({name: 'SelectCategory'})} >Skip</ArrowLink>
            </View>
            :
            <View style={styles.forgotPasswordBlock}>
              <ArrowLink skipTo={()=> this.forgot()}>Forgot Password</ArrowLink>
            </View>
          }
          {
            this.props.route.cookieData ?
            null
            :
            <View style={styles.switchBlock}>
              <ArrowLink skipTo={()=> this.switchToRegister()}>Register Instead</ArrowLink>
            </View>
          }
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: StylingGlobals.container,
  form: {
    marginTop: 50
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 7
  },
  label: {
    fontSize: 12,
    textAlign: 'left',
    margin: 10,
    marginTop: 22,
    width: 60,
  },
  textInput: {
    height: 55,
    padding: 2,
    marginTop: 4,
    marginBottom: 8,
    borderColor: StylingGlobals.colors.textInputBorder,
    borderWidth: 1,
    width: 250,
    backgroundColor: '#fff'
  },
  button: {
  	padding: 10,
  	backgroundColor: StylingGlobals.colors.mainColor,
    marginTop: 14,
    width: 250,
    marginLeft: 80,
    height: 55,
  },
  buttonText: {
    textAlign: 'center',
    color: StylingGlobals.colors.textColorOne,
    marginTop: 6,
    fontSize: 16,
  },
  switchBlock: {

  },
  forgotPasswordBlock: {
    marginTop: 15,
  },
  fbContainer: {
    marginTop: 25,
    marginBottom: 0,
    width: 250,
    marginLeft: 90,
  },
  fbutton: {
    height: 45,
    width: 250,
  },
  errorContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  errorText: {
    flex: 1,
    marginTop: 15,
    textAlign: 'center',
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    email: state.emailAddress,
    password: state.password,
    errorMessage: state.error,
    displaySkip: state.displaySkip,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
