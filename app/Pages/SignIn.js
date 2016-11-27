'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ArrowLink from '../Components/ArrowLink.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import SelectSecret from './SelectSecret.js';
import ShareSecret from './ShareSecret.js';
import MySecrets from './MySecrets.js';
import MyAccount from './MyAccount.js';
import Utility from '../Globals/UtilityFunctions.js';
import GetSecrets from '../Globals/GetSecrets.js';
import { connect } from 'react-redux';
import actions from '../State/Actions/Actions';
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
  }

  errorHandler(error) {
    //this.toggleActivityIndicator();
    this.props.actions.toggleAnimation();
    switch (error.code) {
      case 'INVALID_EMAIL':
        this.props.actions.setError('Invalid email.');
        //this.setState({response: 'Invalid email.'}); // Enter correct email
        break;
      case 'INVALID_USER':
        this.props.actions.setError('Invalid user.');
        //this.setState({response: 'Invalid user.'}); // Display forgot
        break;
      case 'INVALID_PASSWORD':
        this.props.actions.setError('Invalid password.');
        //this.setState({response: 'Invalid password.'}); // Display forgot
        break;
      default:
        this.props.actions.setError('Unknown error.');
        //this.setState({response: 'Unknown error.'}); // Display skip
        break;
    }
  }

  registerUser() {
    this.props.actions.toggleAnimation();
    //this.setState({response: ''});
    this.props.actions.removeError();
    let email = this.props.username.trim();

    this.props.db.createUser({
      email: email,
      password: this.props.password
    }, (error, userData) => {
      if (error) {
        this.errorHandler(error);
      } else {
        var t = Utility.escapeEmail(email)
        this.users.child(userData.uid).set({email: email, secrets: {} });
        this.usersIndex.child(t).set(true);
        this.loginUser(true);
      }
    }) // End parent function
  }

  loginUser(registrationFlag) {
    let email = this.props.username.trim();
    //this.toggleActivityIndicator();
    this.props.actions.toggleAnimation();
    //this.setState({response: ''});
    this.props.actions.removeError();

    this.props.db.authWithPassword({
      email: email,
      password: this.props.password
    }, (error, userData) => {
      if (error) {
        this.errorHandler(error);
      } else {
        this.props.actions.setError('Success.');
        //this.setState({response: 'Success.'});
        //this.toggleActivityIndicator();
        this.props.actions.toggleAnimation();
        AsyncStorage.setItem('userData', JSON.stringify(userData));
        Utility.setLocalAuth(true);
        GetSecrets.getRemoteSecrets();
        if (!registrationFlag) {
          this.props.navigator.push({name: 'SelectCategory', refresh: true});
        } else {
          this.props.navigator.push({name: 'RegistrationInterim', refresh: false});
        }
      }
    })
  }

  submitUser() {
    if (this.props.username !== '' && this.props.password !== '') {
      if (this.props.route.name === 'Register') {
        this.registerUser()
      } else if (this.props.route.name === 'SignIn') {
        this.loginUser()
      }
    } else {
      this.props.actions.setError('Empty email or password.');
      //this.setState({response: 'Empty email or password.'}); // Enter all fields
    }
  }

  forgotPassword() {
    this.props.db.resetPassword({
      email: this.props.username
    }, function (error) {
        if (error) {
          switch (error.code) {
            case "INVALID_USER":
              this.props.actions.setError('User not found.');
              //this.setState({response: 'User not found.'}); // Probably want to display registration query
              break;
            default:
              this.props.actions.setError('Unknown error.');
              //this.setState({response: 'Unknown error.'}); // Display skip
              break;
          }
        } else {
          this.props.actions.setError('Forgot password success.');
          //this.setState({response: 'Forgot password success.'}); // Display success notification
        }
    });
  }

  switchToRegister() {
    this.props.actions.removeError();
    //this.setState({response: ''});
    this.props.navigator.push({name: 'Register'})
    this.initialLink();
  }

  switchToLogin() {
    this.props.actions.removeError();
    this.props.navigator.push({name: 'SignIn'})
    this.initialLink();
  }

  initialLink() {
    if (this.props.route.name === "Register" && !this.props.route.cookieData) {
      this.props.actions.setError('Empty register.');
      //this.setState({response: 'Empty register.'})
    } else if (this.props.route.name === "SignIn" && !this.props.route.cookieData) {
      this.props.actions.setError('Empty sign in.');
      //this.setState({response: 'Empty sign in.'})
    }
  }

  componentWillMount() {
    this.initialLink();
    if (this.props.route.cookieData) {
      this.props.actions.updateUserId(this.props.route.cookieData);
    }
  }

  render() {
    let responseBlock;
    switch (this.props.response) { // TODO - make this consistent and add unit tests
      case "":
        responseBlock = null;
        break;
      case "Invalid email.":
        responseBlock = <InvalidEmail />;
        break;
      case "Invalid user.":
      case "Invalid password.":
        responseBlock = <ForgotPassword forgotPassword={() => this.forgotPassword()} />;
        break;
      case "Unknown error.":
        responseBlock = <View style={styles.errorContainer}>
                          <Text style={styles.errorText}>We encountered an error, probably due to a bad connection. Either retry or skip for now.</Text>
                          <ArrowLink skipTo={() => this.props.navigator.push({name: 'SelectCategory'})} />
                        </View>
        break;
      case "Empty email or password.":
        responseBlock = <EnterAllFields />;
        break;
      case "Success.":
        responseBlock = <SuccessNotification />;
        break;
      case "Forgot password success.":
        responseBlock = <FPSuccessNotification />;
        break;
      case "User not found.":
        responseBlock = <View style={styles.errorContainer}>
                          <Text style={styles.errorText}>We did not find your email address. Do you need to register?</Text>
                          <ArrowLink skipTo={()=> this.switchToRegister()}>Register</ArrowLink>
                        </View>;
        break;
      case "Empty register.":
        responseBlock = <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Already registered? Sign in</Text>
          <ArrowLink skipTo={()=> this.switchToLogin()}>Sign In</ArrowLink>
        </View>;
        break;
      case "Empty sign in.":
        responseBlock = <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Dont have an account yet? Register</Text>
          <ArrowLink skipTo={()=> this.switchToRegister()}>Register</ArrowLink>
        </View>;
        break;
    }
    return (
      <View style={styles.container}>
        <ActivityIndicator animationControl={this.props.animating}/>
        <ScrollView style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.textInput}
                ref="username"
                autoFocus={true}
                keyboardType={'email-address'}
                value={this.props.username}
                onEndEditing={(text) => {this.refs.password.focus()}}
                onChangeText={(username) => this.props.actions.updateUserId(username) }
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
            <Text style={styles.buttonText}>{this.props.route.name === 'Register' ? 'Sign Up' : 'Sign In'}</Text>
          </TouchableHighlight>
          {responseBlock}
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

class InvalidEmail extends React.Component {
  render() {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Please enter a valid email address.</Text>
      </View>
    );
  }
}

class ForgotPassword extends React.Component {
  render() {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Incorrect email or password.</Text>
        <TouchableHighlight
          onPress={this.props.forgotPassword}
          underlayColor={StylingGlobals.colors.accentPressDown}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

class EnterAllFields extends React.Component {
  render() {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Please enter an email and password.</Text>
      </View>
    )
  }
}

class SuccessNotification extends React.Component {
  render() {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.successText}>Success!</Text>
      </View>
    );
  }
}

class FPSuccessNotification extends React.Component {
  render() {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Password reset successfully. Please check your email.</Text>
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
    margin: 15,
    width: 60,
  },
  textInput: {
    height: 40,
    padding: 2,
    marginTop: 4,
    marginBottom: 8,
    borderColor: '#eee',
    borderWidth: 1,
    width: 250,
    backgroundColor: '#fff'
  },
  button: {
  	padding: 10,
  	backgroundColor: StylingGlobals.colors.mainColor,
    marginTop: 14,
    width: 250,
    marginLeft: 90,
  },
  buttonText: {
    textAlign: 'center',
    color: StylingGlobals.colors.textColorOne,
  },
  forgotPassword: {
    color: StylingGlobals.colors.mainColor,
    marginTop: 15,
    textAlign: 'center'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -7,
  },
  errorContainer: {
    marginLeft: 60,
    marginRight: 20,
  },
  errorText: {
    flex: 1,
    marginTop: 15,
  },
  successText: {
    color: StylingGlobals.colors.pressDown,
    fontSize: 18,
    textAlign: 'center',
    marginRight: 20,
    marginTop: 10,
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    username: state.userId,
    password: state.password,
    response: state.error,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
