'use strict';

import React, { Component } from 'react';
import SelectCategory from './app/Pages/SelectCategory.js';
import SelectSecret from './app/Pages/SelectSecret.js';
import ShareSecret from './app/Pages/ShareSecret.js';
import MySecrets from './app/Pages/MySecrets.js';
import YourAnswer from './app/Pages/YourAnswer.js';
import MyAccount from './app/Pages/MyAccount.js';
import CreateYourOwn from './app/Pages/CreateYourOwn.js';
import SignIn from './app/Pages/SignIn.js';
import StylingGlobals from './app/StylingGlobals.js';
import Gateway from './app/Pages/Gateway.js';
import Utility from './app/Globals/UtilityFunctions.js';
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
  AsyncStorage,
} from 'react-native';

import Firebase from 'firebase';
const FirebaseURL = 'https://glaring-torch-4659.firebaseio.com/';

// Refactoring to ES6 will throw an application error, not easily refactored
var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index !== 0) {
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
        case 'YourAnswer':
        case 'Facebook':
          return (
            <TouchableHighlight 
              onPress={() => navigator.pop()} 
              underlayColor={'transparent'}>
              <Image 
                source={require("./app/img/arrow-left.png")}
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
    this.DB = Utility.getRef();
    this.state = {
      remoteSecrets: [],
      localSecrets: [],
    };
  }

  getLocalSecrets() {
    AsyncStorage.getItem('secrets').then((secret_data_json) => {
      let secret_data = JSON.parse(secret_data_json);
      if (secret_data) {
        this.setState({localSecrets: secret_data})
      } 
    })
  }

  getRemoteSecrets() {
    AsyncStorage.getItem('userData').then((user_data_json) => { // What to do if the system can't find any user data?
      let user_data = JSON.parse(user_data_json);
      this.DB.child('users').child(user_data.uid).child('secrets').once('value', (snapshot) => { 
        var userSecrets = snapshot.val();
        if (userSecrets) {
          var userKeys = Object.keys(userSecrets);
          var resultsCount = userKeys.length - 1;
          // Find all the secret entries
          userKeys.forEach((result, count) => {
            this.DB.child('privateSecrets').child(result).on('value', (secret) => {
              var sv = secret.val()
              sv.state = userSecrets[result]; // Show state from the users table, not the secrets table
              sv.key = result;
              this.state.remoteSecrets.push(sv)
              // At the end of iteration, display results
              if (count === resultsCount) {
                this.setNotificationCount();
                AsyncStorage.setItem('secrets', JSON.stringify(this.state.remoteSecrets));
              }
            })
          })
        }
      })
    });
  }

  setNotificationCount() {
    AsyncStorage.getItem('notificationCount').then((notificationCount) => {
      let count = (this.state.remoteSecrets.length - this.state.localSecrets.length) + Number(notificationCount);
      let arrLength = this.state.localSecrets.length - 1;
      
      this.state.localSecrets.forEach((item, index) => {
        if (JSON.stringify(this.state.remoteSecrets[index]) !== JSON.stringify(this.state.localSecrets[index])) {
          count = count + 1; // unclear if this would see the right quantity
        }
        if (arrLength === index) {
          AsyncStorage.setItem('notificationCount', String(count));
        }
      })
    });
  }

  listenForUpdatesToSecrets() {
    AsyncStorage.getItem('userData').then((user_data_json) => { // What to do if the system can't find any user data?
      if (user_data_json) {
        let user_data = JSON.parse(user_data_json);
        this.DB.child('users').child(user_data.uid).child('secrets').on('child_changed', (childSnapshot) => {
          var change = childSnapshot.val();
          if (change !== 'CR' || change !== 'QS') {
            AsyncStorage.getItem('notificationCount').then((notificationCount) => {
              let count = Number(notificationCount) + 1;
              AsyncStorage.setItem('notificationCount', String(count));
            });
          }
        })
      }
    });
  }

  componentWillMount () {
    /*if (Utility.getAuthStatus()) {
      Utility.setLocalAuth(true);
    }*/
    this.getLocalSecrets();
    this.getRemoteSecrets();
  }

  componentDidMount() {
    this.listenForUpdatesToSecrets();
  }

  renderScene (route, navigator) {
    switch (route.name) {
      case 'SelectCategory':
        return (
          <SelectCategory navigator={navigator} route={route} />
        );
      case 'YourAnswer':
        return (
          <YourAnswer navigator={navigator} route={route} db={this.db} />
        );
      case 'MySecrets':
        return (
          <MySecrets navigator={navigator} route={route} db={this.db} />
        );
      case 'SelectSecret':
        return (
          <SelectSecret navigator={navigator} route={route} db={this.db} />
        );
      case 'ShareSecret':
        return (
          <ShareSecret navigator={navigator} route={route} db={this.db} />
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
          <SelectCategory navigator={navigator} route={route} db={this.db} />
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
          name: 'MySecrets'
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
    navBarLeftImage: {
      tintColor: '#fff',
      width: 22,
      height: 22,
      marginTop: 8,
      marginRight: 5,
      marginLeft: 5,
    },
    navBarLeftButton: {
      paddingLeft: 10
    },
    navBarTitleText: {
      color: 'white',
      fontSize: 16,
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
    test: {
      position: 'absolute',
    }
});

AppRegistry.registerComponent('ShowMe', () => ShowMe);
