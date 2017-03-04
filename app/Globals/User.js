'use strict'

import {
  AsyncStorage
} from 'react-native';
import Utility from './UtilityFunctions.js';
import GetSecrets from '../Globals/GetSecrets.js';
import actions from '../State/Actions/Actions';

function User(firebase, db, usersTable, navigator) {
  this.firebase = firebase;
  this.db = db;
  this.usersTable = usersTable;
  this.navigator = navigator;
}

User.prototype.anonAuth = function () {
  this.firebase.auth().signInAnonymously().then((authData) => {
    this.usersTable.child(authData.uid).set({email: "", secrets: {}, securityEnabled: false, profileName: "Anonymous" });
    AsyncStorage.setItem('anonFlag', JSON.stringify(authData.uid));
    this.postLoginProcessing(authData.uid, authData.provider);
  }).catch((error) => {
    actions.setError("Sorry, there was a problem. Are you connected to the internet?");
  });
  /*
  this.db.authAnonymously((err, authData) => {
    if (err || !authData) {
      actions.setError("Sorry, there was a problem. Are you connected to the internet?");
    } else {
      this.usersTable.child(authData.uid).set({email: "", secrets: {}, securityEnabled: false, profileName: "Anonymous" });
      AsyncStorage.setItem('anonFlag', JSON.stringify(authData.uid));
      this.postLoginProcessing(authData.uid, authData.provider);
    }
  })
  */
};

/*
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});
*/

User.prototype.postLoginProcessing = function(uid, provider = "anonymous") {
  this.db.child('users').child(uid).once('value', (snapshot) => {
    let userRecord = snapshot.val();
    userRecord.uid = uid;
    userRecord.provider = provider;
    AsyncStorage.setItem('userData', JSON.stringify(userRecord));
    actions.updateUserId(uid);
  });
  AsyncStorage.removeItem('secrets');
  AsyncStorage.removeItem('updatedSecrets');
  Utility.setLocalAuth(true);
  GetSecrets.getRemoteSecrets(uid);
  GetSecrets.listenForUpdatesToSecrets(uid);
};

User.prototype.login = function (username, password, registrationFlag = false, referred = false) {
    let email = username.trim();
    actions.toggleAnimation();
    actions.removeError();
    //Utility.checkConnection();
    this.firebase.auth().signInWithEmailAndPassword(email, password).then((userData) => {
      actions.toggleAnimation();
      this.postLoginProcessing(userData.uid, userData.provider);
      if (referred) {
        Utility.resetState(true, true, true);
        this.navigator.pop();
      } else if (registrationFlag) {
        this.navigator.push({name: 'RegistrationInterim'}); // Needs to be commented out
      } else {
        Utility.resetState(true, true);
        this.navigator.push({name: 'SelectCategory', refresh: true});
      }
    }).catch((error) => {
      console.log(error);
      this.errorHandler(error);
    })
    /*
    this.db.authWithPassword({
      email: email,
      password: password
    }, (error, userData) => {
      if (error) {
        this.errorHandler(error);
      } else {
        actions.toggleAnimation();
        this.postLoginProcessing(userData.uid, userData.provider);
        if (referred) {
          Utility.resetState(true, true, true);
          this.navigator.pop();
        } else if (registrationFlag) {
          this.navigator.push({name: 'RegistrationInterim'}); // Needs to be commented out
        } else {
          Utility.resetState(true, true);
          this.navigator.push({name: 'SelectCategory', refresh: true});
        }
      }
    })
    */
}

User.prototype.forgotPassword = function (username) {
  let auth = this.firebase.auth();
  auth.sendPasswordResetEmail(username).then(() => {
    actions.setError('Password reset successfully. Please check your email.');
  }, (error) => {
    switch (error.code) {
      case "auth/user-not-found":
        actions.setError('We did not find your email address. Do you need to register?');
        break;
      default:
        actions.displaySkip(true);
        actions.setError('We encountered an error, probably due to a bad connection. Either retry or skip for now.');
        break;
    }
  });
  /*
  this.db.resetPassword({
    email: username
  }, (error) => {
      if (error) {
        switch (error.code) {
          case "INVALID_USER":
            actions.setError('We did not find your email address. Do you need to register?');
            break;
          default:
            actions.displaySkip(true);
            actions.setError('We encountered an error, probably due to a bad connection. Either retry or skip for now.');
            break;
        }
      } else {
        actions.setError('Password reset successfully. Please check your email.');
      }
  });
  */
}

User.prototype.errorHandler = function (error) {
  actions.toggleAnimation();
  switch (error.code) {
    case 'auth/invalid-email':
      actions.setError('Please enter a valid email address');
      break;
    case 'auth/user-not-found':
      actions.setError('We did not find your email address. Do you need to register?');
      break;
    case 'auth/wrong-password':
      actions.setError('Incorrect password');
      break;
    default:
      actions.displaySkip(true);
      actions.setError('We encountered an error, probably due to a bad connection. Either retry or skip for now.');
      break;
  }
};

export default User;
