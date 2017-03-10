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
import * as firebase from 'firebase';
const FirebaseConfig = {
  apiKey: 'AIzaSyARDyBVxphYfkamoXUe-jITn_l65_apd2U',
  authDomain: 'glaring-torch-4659.firebaseapp.com',
  databaseURL: 'https://glaring-torch-4659.firebaseio.com/'
};

const firebaseApp = firebase.initializeApp(FirebaseConfig);

//const FirebaseURL = 'https://glaring-torch-4659.firebaseio.com/';

var Utility = {
  dbConfig: FirebaseConfig,
	authStatus: false,
	verified: false,
  isAnonymous: true,
  ref: firebaseApp.database().ref(),
  firebaseApp: firebaseApp,
  //ref: Firebase.database.ref(),
	//ref: new Firebase(FirebaseURL),

	getRef: function () {
    return firebaseApp.database().ref();
		//return new Firebase(this.dbURL)
	},


	getAuthStatus: function() {
    let user = this.firebaseApp.auth().currentUser;
    if (user) {
      if (user.providerData.length > 0 && user.providerData[0].providerId) {
        this.provider = user.providerData[0].providerId;
      }
      return true;
    } else {
      return false;
    }
    /*
    var ref = Utility.getRef();
	  var authData = ref.getAuth();
	  if (authData) {
	    return true;
	  } else {
	    return false;
	  }
    */
	},

  /*
  getFacebookAuth: function() {
    AccessToken.getCurrentAccessToken().then((fbToken) => {
      if (fbToken) {
        this.setLocalAuth(true);
      }
    });
  },
  */

  checkAllAuth: function (){
    //this.getFacebookAuth();
    let signInAuth = this.getAuthStatus();
    if (!this.authStatus && signInAuth) {
      this.setLocalAuth(true);
    }
  },

  unAuth: function() {
    this.firebaseApp.auth().signOut().then(() => {
      console.log("Successfully logged out");
    }).catch((error) => {
      console.log(error)
    })
    /*
    var ref = this.getRef();
    ref.unauth();
    */
  },

  setLocalAuth: function (setTo) {
    this.authStatus = setTo;
  },

  setProvider: function (provider) {
    this.provider = provider;
  },

	getVerificationStatus: function(uid) {
		this.ref.child('indexes').child('verified').child(uid).once('value', (snapshot)=> {
			this.verified = snapshot.val();
		});
	},

	escapeEmail: function(email) {
		return (email || '').replace('.', ',');
	},

  validateEmail: function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  validateStringInput: function(string, stringName) {
    if (string === "" || !string) {
      actions.setError("Please enter your " + stringName);
      return false;
    } else if (string.length < 6) {
      actions.setError("Your " + stringName + " is too short");
      return false;
    } else if (string.length > 500) {
      actions.setError("Your " + stringName + " is too long");
      return false;
    } else {
      return true;
    }
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

  resetState: function(animating = false, errorMessage = "", formInput = "") {
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

  /*
  setLocalSecurityLevel: function(uid) {
    this.ref.child('users').child(uid).child('securityEnabled').once('value', (snapshot) => {
      actions.setSecurityLevel(snapshot.val());
    })
  },
  */

  /*
  getSecSetting: function(uid) {
    if (uid) {
      this.setLocalSecurityLevel(uid)
    } else {
      AsyncStorage.getItem('userData').then((user_data_string) => {
        if (user_data_string) {
          let user_data = JSON.parse(user_data_string);
          this.setLocalSecurityLevel(user_data.uid)
        } else {
          console.log("USER NOT FOUND");
        }
      });
    }
  },
  */

  checkConnection: function() {
    NetInfo.isConnected.fetch().then().done((connStatus) => {
      if (!connStatus) {
        actions.setError("You don't seem to be connected to the internet");
      }
    });
  },

}

module.exports = Utility;
