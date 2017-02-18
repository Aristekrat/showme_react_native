'use strict';

import React, { Component } from 'react';
import Utility from '../Globals/UtilityFunctions';
import StylingGlobals from '../Globals/StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';

const TitleBar = {
  LeftButton: function(route, navigator, index, navState) {
    if (index !== 0) {
      switch (route.name) {
        case 'MySecrets':
        case 'SelectCategory':
        case 'SelectSecret':
        case 'ShareSecret':
        case 'AskNumber':
        case 'SecretCode':
        case 'CreateYourOwn':
        case 'MySecrets':
        case 'MyAccount':
        case 'SignIn':
        case 'Register':
        case 'YourAnswer':
        case 'Facebook':
        case 'RegistrationInterim':
        case 'ClaimSecret':
        case 'PrivacyPolicy':
        case 'ChangeUserName':
        case 'BetaExplanation':
          return (
            <TouchableHighlight
              onPress={() => navigator.pop()}
              underlayColor={'transparent'}>
              <Image
                source={require("../img/arrow-left.png")}
                style={styles.navBarLeftImage} />
            </TouchableHighlight>
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  },

  RightButton: function(route, navigator, index, navState) {
    return (
      <View>
      { Utility.authStatus ?
        <TouchableHighlight
          style={styles.navBarRightButton}
          underlayColor={'transparent'}
          onPress={() => { Utility.logout(); navigator.replace({name: route.name}); } } >
          <Text style={styles.navBarButtonText}>Logout</Text>
        </TouchableHighlight>
        :
        null
      }
      </View>
    );
  },

  Title: function(route, navigator, index, navState) {
    switch (route.name) {
      case 'MySecrets':
        return (
          <Text style={styles.navBarTitleText}>My Secrets</Text>
        );
      case 'YourAnswer':
        return (
          <Text style={styles.navBarTitleText}>Your Answer</Text>
        );
      case 'SelectCategory':
        return (
          <Text style={styles.navBarTitleText}>Secret Types</Text>
        );
      case 'SelectSecret':
        return (
          <Text style={styles.navBarTitleText}>Select {route.category} Secret</Text>
        );
      case 'ShareSecret':
        return (
          <Text style={styles.navBarTitleText}>Share Secret</Text>
        );
      case 'AskNumber':
        return (
          <Text style={styles.navBarTitleText}>Your Number</Text>
        );
      case 'SecretCode':
        return (
          <Text style={styles.navBarTitleText}>Create Secret Code</Text>
        );
      case 'BetaLock':
        return (
          <Text style={styles.navBarTitleText}>Welcome</Text>
        );
      case 'BetaExplanation':
        return (
          <Text style={styles.navBarTitleText}>Request an Invitation</Text>
        );
      case 'PrivacyPolicy':
        return (
          <Text style={styles.navBarTitleText}>Privacy Policy</Text>
        );
      case 'ChangeUserName':
        return (
          <Text style={styles.navBarTitleText}>Change User Name</Text>
        );
      case 'CreateYourOwn':
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
      case 'RegistrationInterim':
        return (
          <Text style={styles.navBarTitleText}>Register</Text>
        );
      case 'ClaimSecret':
        return (
          <Text style={styles.navBarTitleText}>Claim Secret</Text>
        );
      default:
        return (
          <Text style={styles.navBarTitleText}>Select Secret Type</Text>
        );
    }
  }
};

var styles = StyleSheet.create({
    navBarLeftImage: {
      tintColor: '#fff',
      width: 32,
      height: 32,
      marginTop: 5,
      marginRight: 5,
      marginLeft: 5,
    },
    navBarLeftButton: {
      paddingLeft: 10
    },
    navBarTitleText: {
      color: 'white',
      fontSize: 17,
      fontWeight: '500',
      marginVertical: 9,
    },
    navBarRightButton: {
      paddingRight: 10,
    },
    navBarButtonText: {
      color: '#EEE',
      fontSize: 14,
      marginVertical: 10
    },
});

export default TitleBar
