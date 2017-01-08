import {
  AsyncStorage,
  NetInfo
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
  LoginManager,
} = FBSDK;

import actions from '../State/Actions/Actions';
import Firebase from 'firebase';
const FirebaseURL = 'https://glaring-torch-4659.firebaseio.com/';

var Utility = {
	dbURL: FirebaseURL,
	authStatus: false,
	verified: false,
	ref: new Firebase(FirebaseURL),

	getRef: function () {
		return new Firebase(this.dbURL)
	},

	getAuthStatus: function() {
	  var ref = Utility.getRef();
	  var authData = ref.getAuth();
	  if (authData) {
	    return true;
	  } else {
	    return false;
	  }
	},

  getFacebookAuth: function() {
    AccessToken.getCurrentAccessToken().then((fbToken) => {
      if (fbToken) {
        this.setLocalAuth(true);
      }
    });
  },

  unAuth: function() {
    var ref = this.getRef();
    ref.unauth();
  },

  setLocalAuth: function (setTo) {
    this.authStatus = setTo;
  },

	getVerificationStatus: function(uid) {
		this.ref.child('indexes').child('verified').child(uid).once('value', (snapshot)=> {
			this.verified = snapshot.val();
		});
	},

	escapeEmail(email) {
		return (email || '').replace('.', ',');
	},

	logout: function() {
    AccessToken.getCurrentAccessToken().then((fbToken) => {
      if (fbToken) {
        LoginManager.logOut();
      } else {
        this.unAuth();
      }
      this.setLocalAuth(false);
      actions.setNotifications(0);
      AsyncStorage.removeItem('secrets');
    });
	},

  resetState(animating = false, errorMessage = "", formInput = "") {
    if (animating !== false) {
      actions.setAnimation(false);
    }

    if (errorMessage !== "") {
      actions.removeError();
    }

    if (formInput !== "") {
      actions.updateFormInput("");
    }
  },

  checkConnection: function() {
    NetInfo.isConnected.fetch().then().done((connStatus) => {
      if (!connStatus) {
        actions.setError("You don't seem to be connected to the internet");
      }
    });
  },

}

module.exports = Utility;
