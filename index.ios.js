/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 **/
'use strict';

import React, { Component } from 'react';
import SelectCategory from './app/Pages/SelectCategory.js';
import SelectSecret from './app/Pages/SelectSecret.js';
import ShareSecret from './app/Pages/ShareSecret.js';
import MySecrets from './app/Pages/MySecrets.js';
import MyAccount from './app/Pages/MyAccount.js';
import CreateYourOwn from './app/Pages/CreateYourOwn.js';
import SignIn from './app/Pages/SignIn.js';
import StylingGlobals from './app/StylingGlobals.js';
import Gateway from './app/Pages/Gateway.js';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TabBarIOS,
  Image,
  Navigator,
  TouchableHighlight,
  ListView,
} from 'react-native';

import Firebase from 'firebase';
const FirebaseURL = 'https://glaring-torch-4659.firebaseio.com/';

/*
var React = require('react-native');
var SelectCategory = require('./app/Pages/SelectCategory.js');
var SelectSecret = require('./app/Pages/SelectSecret.js');
var ShareSecret = require('./app/Pages/ShareSecret.js');
var MySecrets = require('./app/Pages/MySecrets.js');
var MyAccount = require('./app/Pages/MyAccount.js');
var CreateYourOwn = require('./app/Pages/CreateYourOwn.js');
var SignIn = require('./app/Pages/SignIn.js');
var StylingGlobals = require('./app/StylingGlobals');
var Gateway = require('./app/Pages/Gateway.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TabBarIOS,
  Image,
  Navigator,
  TouchableHighlight,
  ListView,
} = React;

const Firebase = require('firebase');
const FirebaseURL = 'https://glaring-torch-4659.firebaseio.com/';
*/

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    switch (route.name) {
      case 'MySecrets':
      case 'SelectCategory':
      case 'SelectSecret':
      case 'ShareSecret':
      case 'CreateSecret':
      case 'MySecrets':
      case 'MyAccount':
      case 'SignIn':
      case 'Register':
      case 'Facebook':
        return (
          <TouchableHighlight onPress={() => navigator.pop()} underlayColor={'transparent'}>
            <Image 
              source={require("./app/img/left207.png")}
              style={styles.navBarRightImage} />
          </TouchableHighlight>
        );
      default:
        return null;
    }
  },

  RightButton: function(route, navigator, index, navState) {
    switch (route.name) {
      default:
        return (
          <Text></Text>
        );
    }
  },

  Title: function(route, navigator, index, navState) {
    switch (route.name) {
      case 'MySecrets':
        return (
          <Text style={styles.navBarTitleText}>My Secrets</Text>
        );
      case 'SelectCategory':
        return (
          <Text style={styles.navBarTitleText}>Select Secret Type</Text>
        );
      case 'SelectSecret':
        return (
          <Text style={styles.navBarTitleText}>Select Secret</Text>
        );
      case 'ShareSecret':
        return (
          <Text style={styles.navBarTitleText}>Share Secret</Text>
        );
      case 'CreateSecret':
        return (
          <Text style={styles.navBarTitleText}>Create Secret</Text>
        );     
      case 'MyAccount':
        return (
          <Text style={styles.navBarTitleText}>My Account</Text>
        );
      case 'Gateway':
        return (
          <Text style={styles.navBarTitleText}>Register or Sign In</Text>
        );    
      case 'SignIn':
        return (
          <Text style={styles.navBarTitleText}>Sign In</Text>
        );      
      case 'Register':
        return (
          <Text style={styles.navBarTitleText}>Register</Text>
        );
      default: 
        return (
          <Text style={styles.navBarTitleText}>Select Secret Type</Text>
        );
    }
  }
};

class ShowMe extends React.Component {
  constructor(props) {
    super(props)
    this.DB = this.getRef()
  }
  getRef() {
    return new Firebase(FirebaseURL)
  }
  renderScene (route, navigator) {
    switch (route.name) {
      case 'SelectCategory':
        return (
          <SelectCategory navigator={navigator} route={route} />
        );
      case 'MySecrets':
        return (
          <MySecrets navigator={navigator} route={route} />
        );
      case 'SelectSecret':
        return (
          <SelectSecret navigator={navigator} route={route} db={this.db} />
        );
      case 'ShareSecret':
        return (
          <ShareSecret navigator={navigator} route={route} />
        );
      case 'CreateSecret':
        return (
          <CreateYourOwn navigator={navigator} route={route} db={this.db}/>
        );
      case 'Gateway':
        return (
          <Gateway navigator={navigator} route={route} db={this.db}/>
        );
      case 'MyAccount':
        return (
          <MyAccount navigator={navigator} route={route} />
        );  
      case 'SignIn':
      case 'Register':
        return (
          <SignIn navigator={navigator} route={route} db={this.db}/>
        );
      default:
        return (
          <SelectCategory navigator={navigator} route={route} />
        );
      }
  }
  render () {
    return (
      <Navigator
        ref={(navigator) => { this.navigator = navigator}}
        renderScene={this.renderScene}
        db={this.DB}
        cookieData={''}
        navigationBar={
          <Navigator.NavigationBar
              routeMapper={NavigationBarRouteMapper}
              style={styles.navBar} />
        }
        initialRoute={{
          name: 'Gateway'
        }} />
    );
  }
};

var styles = StyleSheet.create({
    navBar: {
      backgroundColor: StylingGlobals.colors.navColor,
      borderBottomColor: StylingGlobals.colors.pressDown,
      borderBottomWidth: 1,
    },
    navBarTitleText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
      marginVertical: 9,
    },
    navBarLeftButton: {
      paddingLeft: 10
    },
    navBarRightButton: {
      paddingRight: 15,
    },
    navBarRightImage: {
      tintColor: '#fff',
      width: 22,
      height: 22,
      marginTop: 8,
      marginRight: 5,
      marginLeft: 5,
    },
    navBarButtonText: {
      color: '#EEE',
      fontSize: 16,
      marginVertical: 10
    },
    test: {
      position: 'absolute',
    }
});

AppRegistry.registerComponent('ShowMe', () => ShowMe);
