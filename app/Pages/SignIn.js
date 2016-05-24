'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
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

/*
var React = require('react-native');
var TabBar = require('../Components/TabBar.js');
var SelectSecret = require('./SelectSecret.js');
var ShareSecret = require('./ShareSecret.js');
var MySecrets = require('./MySecrets.js');
var MyAccount = require('./MyAccount.js');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  TextInput,
  ActivityIndicatorIOS,
} = React;
*/

/*
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;
*/

class SignIn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      animating: false,
      username: this.props.route.cookieData,
      password: ''
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
    this.toggleActivityIndicator()
    
    if (self.state.username !== '' || self.state.password !== '') {
      self.props.db.createUser({
        email: self.state.username,
        password: self.state.password
      }, function (error, userData) {
        if (error) {
          self.toggleActivityIndicator();
          console.log("Error creating user:", error);
          // Add error Handling
        } else {
          self.toggleActivityIndicator();
          var userEmail = {}
          userEmail["registeredEmail"] = self.escapeEmail(self.state.username);
          self.usersIndex.push(userEmail);
          // Success notification before moving?
          self.props.navigator.push({name: 'SelectCategory'})
        }
      }) // End parent function
    }
  }

  submitUser () {
    if (this.props.route.name === 'Register') {
      this.registerUser()
    } else if (this.props.route.name === 'SignIn') {
      this.loginUser()
    }
  }

  componentDidMount () {

  }

  render(){
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
});

module.exports = SignIn;
