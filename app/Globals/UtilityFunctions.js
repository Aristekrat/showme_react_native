import {
  AsyncStorage
} from 'react-native';

import Firebase from 'firebase';
const FirebaseURL = 'https://glaring-torch-4659.firebaseio.com/';

var Utility = {
	getRef: function () {
		return new Firebase(FirebaseURL)
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
	unAuth: function() {
	  var ref = this.getRef();
	  ref.unauth();
	},
	setLocalAuth: function (setTo) {
		this.authStatus = setTo;
	},
	escapeEmail(email) {
		return (email || '').replace('.', ',');
	},
	logout: function() {
		this.unAuth();
		this.setLocalAuth(false);
	},
	authStatus: false
}

/*
  getRef: function() {
    return new Firebase(FirebaseURL)
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
  unAuth: function() {
    var ref = this.getRef();
    ref.unauth();
  },
*/

module.exports = Utility;