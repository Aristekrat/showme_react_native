'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import SkipButton from '../Components/SkipButton.js';
import SelectSecret from './SelectSecret.js';
import ShareSecret from './ShareSecret.js';
import MySecrets from './MySecrets.js';
import MyAccount from './MyAccount.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  TextInput,
  ActivityIndicatorIOS
} from 'react-native';

class SignIn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      animating: false,
      username: this.props.route.cookieData,
      password: '',
      error: ''
    }
    this.usersIndex = this.props.db.child('users');
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
    self.setState({error: ''});
    
    if (self.state.username !== '' || self.state.password !== '') {
      self.props.db.createUser({
        email: self.state.username,
        password: self.state.password
      }, function (error, userData) {
        if (error) {
          self.toggleActivityIndicator();
          switch (error.code) {
            case 'INVALID_EMAIL':
              self.setState({error: 'Invalid email, please check that you entered your email correctly.'});
              break;
            default:
              self.setState({error: 'Registration failed. This is probably due to a connection error.'}); 
              break;
          }
        } else {
          self.toggleActivityIndicator();
          var t = self.escapeEmail(self.state.username)
          self.usersIndex.child(t).set(true)
          // Add success notification before moving
          self.props.navigator.push({name: 'SelectCategory'})
        }
      }) // End parent function
    }
  }

  loginUser() {
    var self = this; 
    self.setState({error: ''});
    self.usersIndex.authWithPassword({
      email: self.state.username, 
      password: self.state.password
    }, function (error, authData) {
      if (error) {
        switch (error.code) {
          case 'INVALID_EMAIL':
            self.setState({error: 'Invalid email, please check that you entered your email correctly.'});
            break;
          case 'INVALID_USER':
            self.setState({error: 'The system did not recognize that email.'});
            break;
          case 'INVALID_PASSWORD':
            self.setState({error: 'The system rejected your credentials.'});
            break;
          default:
            self.setState({error: 'Login failed. This is probably due to a connection error.'}); 
            break;
        }
      } else {
        // Add success notification before moving
        self.props.navigator.push({name: 'SelectCategory'})
      }
    })
  }

  submitUser() {
    if (this.props.route.name === 'Register') {
      this.registerUser()
    } else if (this.props.route.name === 'SignIn') {
      this.loginUser()
    }
  }

  componentDidMount() {

  }

  render() {
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
            <Text style={styles.label}>Password </Text>
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
          { this.state.error ?
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{this.state.error}</Text>
                <SkipButton skipTo={() => this.props.navigator.push({name: 'SelectCategory'})} />
              </View>
                : 
              null
          }
          { this.state.validEmail ?
              <Text style={styles.errorText}>Please use a valid email</Text>
                : 
              null
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
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -7,
  },
  errorContainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  errorText: {
    flex: 1,
    marginTop: 15,
  }
});

module.exports = SignIn;
