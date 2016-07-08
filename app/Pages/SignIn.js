'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ArrowLink from '../Components/ArrowLink.js';
import SelectSecret from './SelectSecret.js';
import ShareSecret from './ShareSecret.js';
import MySecrets from './MySecrets.js';
import MyAccount from './MyAccount.js';
import Utility from '../Globals/UtilityFunctions.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicatorIOS,
  AsyncStorage
} from 'react-native';

class SignIn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      animating: false,
      username: this.props.route.cookieData,
      password: '',
      response: ''
    }
    this.usersIndex = this.props.db.child('userIndex');
    this.users = this.props.db.child('users');
  }

  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }

  escapeEmail(email) {
    return (email || '').replace('.', ',');
  }

  registerUser() {
    var self = this;
    this.toggleActivityIndicator();
    self.setState({response: ''});

    self.props.db.createUser({
      email: self.state.username,
      password: self.state.password
    }, function (error, userData) {
      if (error) {
        self.toggleActivityIndicator();
        switch (error.code) {
          case 'INVALID_EMAIL':
            self.setState({response: 'Invalid email.'});
            break;
          default:
            self.setState({response: 'Unknown error.'});
            break;
        }
      } else {
        self.toggleActivityIndicator();
        self.setState({response: 'Success.'});
        var t = self.escapeEmail(self.state.username)
        self.users.child(userData.uid).set({email: self.state.username});
        self.usersIndex.child(t).set(true);
        AsyncStorage.setItem('userData', JSON.stringify(userData));
        Utility.setLocalAuth();
        self.props.navigator.push({name: 'SelectCategory'});
      }
    }) // End parent function
  }

  loginUser() {
    var self = this; 
    self.toggleActivityIndicator();
    self.setState({response: ''});
    self.usersIndex.authWithPassword({
      email: self.state.username, 
      password: self.state.password
    }, function (error, userData) {
      if (error) {
        self.toggleActivityIndicator();
        switch (error.code) {
          case 'INVALID_EMAIL':
            self.setState({response: 'Invalid email.'}); // Enter correct email
            break;
          case 'INVALID_USER':
            self.setState({response: 'Invalid user.'}); // Display forgot
            break;
          case 'INVALID_PASSWORD':
            self.setState({response: 'Invalid password.'}); // Display forgot
            break;
          default:
            self.setState({response: 'Unknown error.'}); // Display skip 
            break;
        }
      } else {
        self.setState({response: 'Success.'});
        self.toggleActivityIndicator();
        AsyncStorage.setItem('userData', JSON.stringify(userData));
        Utility.setLocalAuth(true);
        self.props.navigator.push({name: 'SelectCategory'});
      }
    })
  }

  submitUser() {
    if (this.state.username !== '' && this.state.password !== '') {
      if (this.props.route.name === 'Register') {
        this.registerUser()
      } else if (this.props.route.name === 'SignIn') {
        this.loginUser()
      }
    } else {
      this.setState({response: 'Empty email or password.'}); // Enter all fields
    }
  }

  forgotPassword() {
    var self = this;
    this.props.db.resetPassword({
      email: this.state.username
    }, function (error) {
          if (error) {
            switch (error.code) {
              case "INVALID_USER":
                self.setState({response: 'User not found.'}); // Probably want to display registration query
                break;
              default:
                self.setState({response: 'Unknown error.'}); // Display skip 
            }
          } else {
            self.setState({response: 'Forgot password success.'})
            console.log("Password reset email sent successfully!"); // Display success notification
          }
    });
  }

  switchToRegister() {
    this.setState({response: ''});
    this.props.navigator.push({name: 'Register'})
    this.initialLink();
  }

  switchToLogin() {
    this.setState({response: ''});
    this.props.navigator.push({name: 'SignIn'})
    this.initialLink();
  }

  initialLink() {
    if (this.props.route.name === "Register" && !this.props.route.cookieData) {
      this.setState({response: 'Empty register.'})
    } else if (this.props.route.name === "SignIn" && !this.props.route.cookieData) {
      this.setState({response: 'Empty sign in.'})
    }
  }

  componentWillMount() {
    this.initialLink();
  }

  render() {
    let responseBlock;
    switch (this.state.response) { // TODO - make this consistent and add unit tests
      case "":
        responseBlock = null;
        break;
      case "Invalid email.":
        responseBlock = <InvalidEmail />;
        break;
      case "Invalid user.":
      case "Invalid password.":
        responseBlock = <ForgotPassword />;
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
          <Text style={styles.errorText}>Don't have an account yet? Register</Text>
          <ArrowLink skipTo={()=> this.switchToRegister()}>Register</ArrowLink>
        </View>;
        break;
    }
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS
            animating={this.state.animating}
            style={[styles.centering, {height: 80}]}
            size="large"
        />
        <ScrollView style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={styles.textInput} 
                ref="username"
                autoFocus={true}
                keyboardType={'email-address'}
                value={this.state.username}
                onEndEditing={(text) => {this.refs.password.focus()}}
                onChangeText={(username) => this.setState({username})}
                selectionColor={StylingGlobals.colors.mainColor} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.textInput}
              ref="password"
              onChangeText={(password) => this.setState({password})}
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
          onPress={() => this.forgotPassword()}
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

module.exports = SignIn;
