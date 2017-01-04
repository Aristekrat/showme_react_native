'use strict';

import React, { Component } from 'react';
import SelectCategory from './app/Pages/SelectCategory.js';
import SelectSecret from './app/Pages/SelectSecret.js';
import ShareSecret from './app/Pages/ShareSecret.js';
import SecretCode from './app/Pages/SecretCode.js';
import MySecrets from './app/Pages/MySecrets.js';
import YourAnswer from './app/Pages/YourAnswer.js';
import MyAccount from './app/Pages/MyAccount.js';
import CreateYourOwn from './app/Pages/CreateYourOwn.js';
import SignIn from './app/Pages/SignIn.js';
import Register from './app/Pages/Register.js';
import StylingGlobals from './app/Globals/StylingGlobals.js';
import Gateway from './app/Pages/Gateway.js';
import ClaimSecret from './app/Pages/ClaimSecret.js';
import RegistrationInterim from './app/Pages/RegistrationInterim.js';
import Utility from './app/Globals/UtilityFunctions.js';
import GetSecrets from './app/Globals/GetSecrets.js';
import Title from './app/Components/Title.js';
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

import { Provider } from 'react-redux';
import store from './app/State/Store';
import actions from './app/State/Actions/Actions';
import { connect } from 'react-redux';

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
    this.compareLocalAndRemoteSecrets();
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

  // Not sure if I want to use this or just count the number of objs in updatedSecrets
  addNotificationsToAsyncStorage(notificationNum) {
    AsyncStorage.getItem('notificationCount').then((notification_count_string) => {
      if (notification_count_string) {
        let totalNotifications = Number(notification_count_string) + notificationNum;
        AsyncStorage.setItem(String(totalNotifications));
      } else {
        AsyncStorage.setItem(String(notificationNum));
      }
    })
  }

  addUpdatedSecretsToAsyncStorage(updatedSecretsHash) {
    AsyncStorage.getItem('updatedSecrets').then((updated_secrets_string) => {
      if (updated_secrets_string) {
        let updated_secrets = JSON.parse(updated_secrets_string);
        let combinedObj = Object.assign(updated_secrets, updatedSecretsHash);
        AsyncStorage.setItem('updatedSecrets', JSON.stringify(combinedObj));
      } else {
        AsyncStorage.setItem('updatedSecrets', JSON.stringify(updatedSecretsHash));
      }
    });
  }

  // Compares the local and remote secrets and then sets the notification count & updated secrets hash on detecting differences
  compareLocalAndRemoteSecrets() {
    let count = (this.state.remoteSecrets.length - this.state.localSecrets.length) + Number(store.getState().notifications);
    let arrLength = this.state.localSecrets.length - 1;

    this.state.localSecrets.forEach((item, index) => { // Checks for differences between remote and local secrets
      if (JSON.stringify(this.state.remoteSecrets[index]) !== JSON.stringify(this.state.localSecrets[index])) {
        count = count + 1;
        actions.pushUpdatedSecret(this.state.remoteSecrets[index].key);
      }
      if (arrLength === index) { // the for loop is at an end
        actions.incrementNotifications(count);
        this.addUpdatedSecretsToAsyncStorage(store.getState().updatedSecrets);
      }
    });
  }

  listenForUpdatesToSecrets() { // All notification
    AsyncStorage.getItem('userData').then((user_data_json) => {
      if (user_data_json) {
        let user_data = JSON.parse(user_data_json);
        this.DB.child('users').child(user_data.uid).child('secrets').on('child_changed', (childSnapshot) => {
          let key = childSnapshot.key();
          let newUpdate = {}
          newUpdate[key] = true;
          actions.incrementNotifications(1); // TODO Try and filter out user initiated changes
          actions.pushUpdatedSecret(key);
          this.addUpdatedSecretsToAsyncStorage(newUpdate);
        })
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

  componentWillMount() {
    if (Utility.getAuthStatus()) {
      Utility.setLocalAuth(true);
    }

    AsyncStorage.getItem('userData').then((user_data_string) => {
      if (user_data_string) {
        let user_data = JSON.parse(user_data_string);
        actions.updateUserId(user_data.uid);
        Utility.getVerificationStatus(user_data.uid);
      }
    });

    AsyncStorage.getItem('updatedSecrets').then((updated_secrets_string) => {
      if (updated_secrets_string) {
        let updatedSecrets = JSON.parse(updated_secrets_string);
        actions.pushMultipleUpdatedSecrets(updatedSecrets);
        actions.setNotifications(Object.keys(updatedSecrets).length);
      }
    })

    GetSecrets.getLocalSecrets();
    GetSecrets.getRemoteSecrets();
    this.anonAuthHandler();
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
          <SecretCode navigator={navigator} route={route} db={this.db} store={store} />
        );
      case 'CreateYourOwn':
        return (
          <CreateYourOwn navigator={navigator} route={route} db={this.db} store={store} />
        );
      case 'Gateway':
        return (
          <Gateway navigator={navigator} route={route} db={this.db} store={store} />
        );
      case 'MyAccount':
        return (
          <MyAccount navigator={navigator} route={route} store={store}/>
        );
      case 'ClaimSecret':
        return (
          <ClaimSecret navigator={navigator} route={route} db={this.db} store={store} />
        );
      case 'SignIn':
        return (
          <SignIn navigator={navigator} route={route} db={this.db} />
        );
      case 'Register':
        return (
          <Register navigator={navigator} route={route} db={this.db} />
        );
      case 'RegistrationInterim':
        return (
          <RegistrationInterim navigator={navigator} route={route} store={store} />
        );
      default:
        return (
          <SelectCategory navigator={navigator} route={route} db={this.db} store={store} />
        );
      }
  }

  render () {
    return (
    <Provider store={store}>
      <Navigator
        ref={(navigator) => { this.navigator = navigator}}
        renderScene={this.renderScene}
        db={this.DB}
        cookieData={''}
        navigationBar={
          <Navigator.NavigationBar
              routeMapper={Title}
              style={styles.navBar} />
        }
        initialRoute={{name: "SignIn"}}
        />
      </Provider>
    );
  }
};

const styles = StyleSheet.create({
    navBar: {
      backgroundColor: StylingGlobals.colors.navColor,
      borderBottomColor: StylingGlobals.colors.pressDown,
      borderBottomWidth: 1,
    },
});

ReactMixin(ShowMe.prototype, ReactTimer);

AppRegistry.registerComponent('ShowMe', () => ShowMe);
