import {
  AsyncStorage
} from 'react-native';

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

	getVerificationStatus: function(uid) {
		this.ref.child('indexes').child('verified').child(uid).once('value', (snapshot)=> {
			this.verified = snapshot.val();
		});
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
}

module.exports = Utility;
