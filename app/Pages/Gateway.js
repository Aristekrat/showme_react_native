'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight
} from 'react-native';

/*
var StylingGlobals = require('../StylingGlobals.js');
var React = require('react-native');
var TabBar = require('../Components/TabBar.js');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight,
} = React;
*/

/*
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton
} = FBSDK;
*/

class Gateway extends React.Component {
  constructor(props) {
    super(props);
    state: {
      emailAddress: ''
    }
    this.userIndex = this.props.db.child('users');
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  escapeEmail(email) {
    return (email || '').replace('.', ',');
  }

  isDuplicateEmail(email) {
    this.props.db.child('/registeredEmail'+this.escapeEmail(email)).once('value', function(snapshot) {
      console.log(snapshot.val() !== null);
    });
  }

  checkEmail() {
    var self = this;
    if (self.validateEmail(self.state.emailAddress)) {
      self.userIndex.once('value', function (snapshot) {
        var t = self.state.emailAddress
        if (snapshot.hasChild(self.escapeEmail(self.state.emailAddress))) {
          // Go to login
          console.log("This is a registered email");
          self.props.navigator.push({name: 'SignIn', cookieData: self.state.emailAddress})
        } else {
          // Go to registration
          console.log("This is an unregistered email");
          self.props.navigator.push({name: 'Register', cookieData: self.state.emailAddress})
        }
      });
    } else {
      console.log("Boo!");
      // Add error handling
    }
  }
  // <LoginButton style={styles.fbutton} />
  render() {
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Image style={styles.heroImage} source={require("../img/chat21.png")} />

          <View style={styles.fbContainer}>
            <Text style={styles.fbText}>Continue with Facebook</Text>
            <TouchableHighlight>
              <Text>Placeholder</Text>
            </TouchableHighlight>
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
                <Image style={styles.emailRightArrow} source={require("../img/right-arrow.png")} />
              </TouchableHighlight>
            </View>
          </View>

          <TouchableHighlight 
              style={styles.skipButton} 
              underlayColor={StylingGlobals.colors.accentPressDown} 
              onPress={() => this.props.navigator.push({name: 'SelectCategory'})} >
            <View style={styles.skipContainer}>
              <Text style={styles.skipText}>Skip for Now</Text>
              <Image style={styles.skipRightArrow} source={require("../img/right-arrow.png")} />
            </View>
          </TouchableHighlight>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {

  },
  heroImage: {
    width: 125,
    height: 125,
    alignSelf: 'center',
    tintColor: StylingGlobals.colors.mainColor,
  },
  fbContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,  
  },
  fbText: {
    marginBottom: 5,
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
    marginTop: 15,
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
  skipButton: {
    alignSelf: 'center',
    marginTop: 10,
    padding: 15,
  },
  skipContainer: {
    flexDirection: 'row',
  },
  skipText: {
    color: StylingGlobals.colors.mainColor,
  },
  skipRightArrow: {
    tintColor: StylingGlobals.colors.mainColor,
    width: 11,
    height: 11,
    marginTop: 3,
    marginLeft: 2,
  },
});

module.exports = Gateway;
