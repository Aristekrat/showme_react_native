'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ArrowLink from '../Components/ArrowLink.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  LoginButton
} = FBSDK;

class Gateway extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',
      validEmail: true
    },
    this.userIndex = this.props.db.child('userIndex');
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
      self.setState({validEmail: false});
    }
  }
  render() {
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Image style={styles.heroImage} source={require("../img/chat21.png")} />

          <View style={styles.fbContainer}>
            <Text style={styles.fbText}>Continue with Facebook</Text>
            <LoginButton style={styles.fbutton} />
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
            { this.state.validEmail ?
                null
                : 
                <Text style={styles.errorText}>Please use a valid email</Text>
            }
          </View>
          <ArrowLink skipTo={() => this.props.navigator.push({name: 'SelectCategory'})}>Skip for Now</ArrowLink>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  errorText: {
    marginTop: 5,
    color: StylingGlobals.colors.mainColor
  }
});

module.exports = Gateway;
