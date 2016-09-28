'use strict';

import React, { Component } from 'react';
import SelectCategory from './app/Pages/SelectCategory.js';
import SelectSecret from './app/Pages/SelectSecret.js';
import ShareSecret from './app/Pages/ShareSecret.js';
import AskNumber from './app/Pages/AskNumber.js';
import SecretCode from './app/Pages/SecretCode.js';
import MySecrets from './app/Pages/MySecrets.js';
import YourAnswer from './app/Pages/YourAnswer.js';
import MyAccount from './app/Pages/MyAccount.js';
import CreateYourOwn from './app/Pages/CreateYourOwn.js';
import SignIn from './app/Pages/SignIn.js';
import StylingGlobals from './app/Globals/StylingGlobals.js';
import Gateway from './app/Pages/Gateway.js';
import ClaimSecret from './app/Pages/ClaimSecret.js';
import RegistrationInterim from './app/Pages/RegistrationInterim.js';
import Utility from './app/Globals/UtilityFunctions.js';
import GetSecrets from './app/Globals/GetSecrets.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
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
        case 'AskNumber':
        case 'SecretCode':
        case 'CreateSecret':
        case 'MySecrets':
        case 'MyAccount':
        case 'SignIn':
        case 'Register':
        case 'YourAnswer':
        case 'Facebook':
        case 'RegistrationInterim':
        case 'ClaimSecret':
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
      case 'AskNumber':
        return (
          <Text style={styles.navBarTitleText}>Your Number</Text>
        );  
      case 'SecretCode':
        return (
          <Text style={styles.navBarTitleText}>Create Secret Code</Text>
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
      case 'ClaimSecret':
        return (
          <Text style={styles.navBarTitleText}>Claim Secret</Text>
        );
      case 'RegistrationInterim':  
        return (
          <Text style={styles.navBarTitleText}>Welcome</Text>
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
    totalResults: '';
  }

  // Processes data and sets up event listeners after all data is received from the remote
  allRemoteSecretsRetrieved() {
    this.setNotificationCount(); 
    this.listenForUpdatesToSecrets(); 
    GetSecrets.pushSecretsToAsyncStore();
  }    

  // Waits until all remote secrets are received then calls the implementation function
  checkIfRemoteSecretsReceived() { // Add optional arg and move to GetSecrets? Doubt I can use a mixin there
    this.setTimeout (
      () => {
        if (GetSecrets.remoteSecrets.length === GetSecrets.totalResults) {
          this.allRemoteSecretsRetrieved();
        } else {
          this.checkIfRemoteSecretsReceived();
        }
      },
      1000
    )
  }

  // Compares the local and remote secrets and then sets the notification count on detecting differences
  setNotificationCount() {
    AsyncStorage.getItem('notificationCount').then((notificationCount) => {
      let count = (this.state.remoteSecrets.length - this.state.localSecrets.length) + Number(notificationCount);
      let arrLength = this.state.localSecrets.length - 1;
      let updatedSecrets = []
      
      this.state.localSecrets.forEach((item, index) => {
        if (JSON.stringify(this.state.remoteSecrets[index]) !== JSON.stringify(this.state.localSecrets[index])) {
          count = count + 1;
          this.setUpdatedSecrets(this.state.remoteSecrets[index].key);
        }
        if (arrLength === index) {
          AsyncStorage.setItem('notificationCount', String(count));
          if (updatedSecrets.length > 0) {
            AsyncStorage.setItem('updatedSecrets', JSON.stringify(updatedSecrets));
          }
        }
      })
    });
  }

  // Sets local key / value pair for the secrets that have been freshly updated; notification related
  setUpdatedSecrets(key) {
    AsyncStorage.getItem('updatedSecrets').then((updatedSecretsString) => {
      if (!updatedSecrets) {
        var updatedSecrets = {}
      } else {
        var updatedSecrets = JSON.parse(updatedSecretsString);
      }
      updatedSecrets[key] = true;
      AsyncStorage.setItem('updatedSecrets', JSON.stringify(updatedSecrets)); 
    });
  }

  listenForUpdatesToSecrets() { // All notification
    AsyncStorage.getItem('userData').then((user_data_json) => { 
      if (user_data_json) {
        let user_data = JSON.parse(user_data_json);
        this.DB.child('users').child(user_data.uid).child('secrets').on('child_changed', (childSnapshot) => {
          var change = childSnapshot.val(); // TODO Try and filter out user initiated changes
          AsyncStorage.getItem('notificationCount').then((notificationCount) => {
            if (!notificationCount) { var notificationCount = 0 }
            let count = Number(notificationCount) + 1;
            AsyncStorage.setItem('notificationCount', String(count));
          });
          this.setUpdatedSecrets(childSnapshot.key())
        })
      } else {
        // What to do if the system can't find any user data?
      }
    });
  }

  // This function listens for any firebase auth, saves the auth data, and transitions anon auths to signed in auths when appropriate
  anonAuthHandler() {
    this.DB.onAuth((authData) => {
      if (authData) {
        if (authData.provider === 'anonymous') {
          AsyncStorage.setItem('userData', JSON.stringify(authData));
        } else {
          AsyncStorage.getItem('userData').then((user_data_string) => { 
            if (user_data_string) {
              let user_data = JSON.parse(user_data_string);
              if (user_data.provider === 'anonymous') {
                var anonRef = this.DB.child('users').child(user_data.uid);
                anonRef.once('value', (anonSnapshot) => {
                  let anonData = anonSnapshot.val();
                  if (anonData && anonData.secrets) {
                    this.DB.child('users').child(authData.uid).child('secrets').update(anonData.secrets);
                  }
                  anonRef.remove();
                });
              }
            } else { // First time login, non-anon option chosen
              AsyncStorage.setItem('userData', JSON.stringify(authData));
            }
          });
        }
      } 
    })   
  }

  checkVerificationStatus() {
    AsyncStorage.getItem('userData').then((user_data_string) => { 
      if (user_data_string) {
        let user_data = JSON.parse(user_data_string);
        Utility.getVerificationStatus(user_data.uid);
      }
    });
  }

  componentWillMount() {
    /*if (Utility.getAuthStatus()) {
      Utility.setLocalAuth(true);
    }*/
    GetSecrets.getLocalSecrets();
    GetSecrets.getRemoteSecrets();
    this.anonAuthHandler();
    this.checkVerificationStatus();
  }

  componentDidMount() {
    this.checkIfRemoteSecretsReceived();
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
      case 'AskNumber':
        return (
          <AskNumber navigator={navigator} route={route} db={this.db} />
        );  
      case 'SecretCode':
        return (
          <SecretCode navigator={navigator} route={route} db={this.db} />
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
      case 'ClaimSecret':
        return (
          <ClaimSecret navigator={navigator} route={route} db={this.db} />
        );    
      case 'SignIn':
      case 'Register':
        return (
          <SignIn navigator={navigator} route={route} db={this.db}/>
        );
      case 'RegistrationInterim':
        return (
          <RegistrationInterim navigator={navigator} route={route}/>
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
          name: "SelectCategory"
        }} />
    );
  }
};

ReactMixin(ShowMe.prototype, ReactTimer);

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
