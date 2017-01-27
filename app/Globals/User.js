'use strict'

import {
  AsyncStorage
} from 'react-native';
import Utility from './UtilityFunctions.js';
import GetSecrets from '../Globals/GetSecrets.js';
import actions from '../State/Actions/Actions';

function User(db, usersTable, navigator) {
  this.db = db;
  this.usersTable = usersTable;
  this.navigator = navigator;
}

User.prototype.anonAuth = function () {
  this.db.authAnonymously((err, authData) => {
    if (err || !authData) {
      actions.setError("Sorry, there was a problem. Are you connected to the internet?");
    } else {
      this.usersTable.child(authData.uid).set({email: ""});
      this.navigator.push({name: 'RegistrationInterim'});
    }
  })
};

User.prototype.postLoginProcessing = function(uid) {
  actions.updateUserId(uid);
  this.db.child('users').child(uid).once('value', (snapshot) => {
    let userRecord = snapshot.val();
    userRecord.uid = uid;
    AsyncStorage.setItem('userData', JSON.stringify(userRecord));

  });
  AsyncStorage.removeItem('secrets');
  AsyncStorage.removeItem('updatedSecrets');
  Utility.setLocalAuth(true);
  GetSecrets.getRemoteSecrets(uid);
}

User.prototype.login = function (username, password, registrationFlag = false, referred = false) {
    let email = username.trim();
    actions.toggleAnimation();
    actions.removeError();
    //Utility.checkConnection();
    this.db.authWithPassword({
      email: email,
      password: password
    }, (error, userData) => {
      if (error) {
        this.errorHandler(error);
      } else {
        actions.toggleAnimation();
        this.postLoginProcessing(userData.uid);
        if (referred) {
          Utility.resetState(true, true, true);
          this.navigator.pop();
        } else if (registrationFlag) {
          this.navigator.push({name: 'RegistrationInterim'});
        } else {
          Utility.resetState(true, true);
          this.navigator.push({name: 'SelectCategory', refresh: true});
        }
      }
    })
}



User.prototype.forgotPassword = function (username) {
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
}

User.prototype.errorHandler = function (error) {
  actions.toggleAnimation();
  switch (error.code) {
    case 'INVALID_EMAIL':
      actions.setError('Please enter a valid email address');
      break;
    case 'INVALID_USER':
      actions.setError('We did not find your email address. Do you need to register?');
      break;
    case 'INVALID_PASSWORD':
      actions.setError('Incorrect password');
      break;
    default:
      actions.displaySkip(true);
      actions.setError('We encountered an error, probably due to a bad connection. Either retry or skip for now.');
      break;
  }
}

export default User;
