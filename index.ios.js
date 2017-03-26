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
import BetaLock from './app/Pages/BetaLock.js';
import BetaExplanation from './app/Pages/BetaExplanation.js';
import SignIn from './app/Pages/SignIn.js';
import Register from './app/Pages/Register.js';
import Gateway from './app/Pages/Gateway.js';
import ClaimSecret from './app/Pages/ClaimSecret.js';
import RegistrationInterim from './app/Pages/RegistrationInterim.js';
import PrivacyPolicy from './app/Pages/PrivacyPolicy.js';
import ChangeUserName from './app/Pages/ChangeUserName.js';
import Title from './app/Components/Title.js';
import generator from './app/Components/CodeGenerator/CodeGenerator.js';
import Utility from './app/Globals/UtilityFunctions.js';
import GetSecrets from './app/Globals/GetSecrets.js';
import StylingGlobals from './app/Globals/StylingGlobals.js';
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

import { Provider } from 'react-redux';
import store from './app/State/Store';
import actions from './app/State/Actions/Actions';
import { connect } from 'react-redux';

class ShowMe extends React.Component {
  constructor(props) {
    super(props)
    this.DB = Utility.ref;
    this.firebase = Utility.firebaseApp;
    this.state = {
      remoteSecrets: [],
      localSecrets: [],
    }
  }

  // Processes data and sets up event listeners after all data is received from the remote
  allRemoteSecretsRetrieved() {
    GetSecrets.compareLocalAndRemoteSecrets();
    GetSecrets.writeRemoteSecretsToAsyncStore();
    let uid = store.getState().userId;
    if (uid) {
      GetSecrets.listenForUpdatesToSecrets(uid);
    }
  }

  // This function listens for any firebase auth, saves the auth data, and transitions anon auths to signed in auths when appropriate
  anonAuthHandler() {
    Utility.firebaseApp.auth().onAuthStateChanged((authData) => {
      if (authData) {
        Utility.isAnonymous = authData.isAnonymous
        if (!authData.isAnonymous) {
          AsyncStorage.getItem("smAnonFlag").then((anonFlag) => {
            if (anonFlag) {
              let oldUID = JSON.parse(anonFlag);
              let anonRef = this.DB.child('users').child(oldUID);
              anonRef.once('value', (anonSnapshot) => {
                let anonData = anonSnapshot.val();
                if (anonData && anonData.secrets) {
                  this.DB.child('users').child(authData.uid).child('secrets').update(anonData.secrets);
                }
                AsyncStorage.removeItem('smAnonFlag');
              });
            }
          })
        }
      }
    });
  }

  componentWillMount() {
    Utility.firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        actions.updateUserId(user.uid);
        Utility.setLocalAuth(true);
      }
    });

    AsyncStorage.getItem('smUserData').then((user_data_string) => {
      if (user_data_string) {
        let user_data = JSON.parse(user_data_string);
        actions.updateUserId(user_data.uid);
        Utility.getVerificationStatus(user_data.uid);
        if (user_data.provider) {
          Utility.setProvider(user_data.provider);
        }
      }
    });

    AsyncStorage.getItem('smUpdatedSecrets').then((updated_secrets_string) => {
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
    GetSecrets.checkIfRemoteSecretsReceived(this.allRemoteSecretsRetrieved);
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
          <MyAccount navigator={navigator} route={route} db={this.db} store={store}/>
        );
      case 'ClaimSecret':
        return (
          <ClaimSecret navigator={navigator} route={route} db={this.db} store={store} />
        );
      case 'PrivacyPolicy':
        return (
          <PrivacyPolicy navigator={navigator} route={route} />
        );
      case 'ChangeUserName':
        return (
          <ChangeUserName navigator={navigator} route={route} db={this.db} store={store} />
        );
      case 'BetaLock':
        return (
          <BetaLock navigator={navigator} route={route} db={this.db} firebase={this.firebase} store={store} />
        );
      case 'BetaExplanation':
        return (
          <BetaExplanation navigator={navigator} route={route} db={this.db} store={store} />
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
        initialRoute={{name: "CreateYourOwn"}}
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
