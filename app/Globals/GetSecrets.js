import {
  AsyncStorage
} from 'react-native';
import Utility from './UtilityFunctions.js';

const GetSecrets = {
	DB: Utility.getRef(),
	remoteSecrets: [],
	localSecrets: [],
	totalResults: '', // Num val, set to a string on app start so it will never eq true to a number on initialize

  // Used within get remote secrets to set the local state
  _setRemoteSecrets: function(state, key, answer = null) {
    this.DB.child('privateSecrets').child(key).on('value', (secret) => {
      var sv = secret.val();
      sv.state = state;
      sv.key = key;
      sv.answer = answer;
      this.remoteSecrets.push(sv);
    })
  },

	getLocalSecrets: function () {
    AsyncStorage.getItem('secrets').then((secret_data_string) => {
      if (secret_data_string) {
        let secret_data = JSON.parse(secret_data_string);
        this.localSecrets = secret_data;
      }
    })
  },

  // Queries the DB for all remote secrets
  getRemoteSecrets: function() {
  	this.remoteSecrets.length = 0;
    this.totalResults = '';
    AsyncStorage.getItem('userData').then((user_data_json) => {
      if (user_data_json) {
        let user_data = JSON.parse(user_data_json); // TODO Needs to check AUTH, implement this at the end
        this.DB.child('users').child(user_data.uid).child('secrets').once('value', (snapshot) => {
          var userSecrets = snapshot.val();
          if (userSecrets) {
            var userKeys = Object.keys(userSecrets);
            this.totalResults = userKeys.length;

            userKeys.forEach((result, count) => {
              if (userSecrets[result].sentState === 'SO') {
                this.DB.child('answers').child(result).on('value', (snapshot) => {
                  var answer = snapshot.val();
                  answer.key = result;
                  this._setRemoteSecrets(userSecrets[result], result, answer);
                });
              } else {
                this._setRemoteSecrets(userSecrets[result], result);
              }
            })
          }
        })
      } 
    });
  },

  // Pushes one new secret obj to the local store.
  pushLocalSecret: function (newSecret) {
    AsyncStorage.getItem('secrets').then((secrets_data_string) => {
      if (secrets_data_string) {
        let secrets_data = JSON.parse(secrets_data_string);
        secrets_data.push(newSecret);
        AsyncStorage.setItem('secrets', JSON.stringify(secrets_data));
      } else {
        AsyncStorage.setItem('secrets', JSON.stringify(newSecret));
      }
    });
  },

  pushPrivateSecret: function(text, uid, successCB, errCB) {
    let psData = {question: text, askerID: uid, askerName: '', responderID: '', responderName: ''};
    let privateSecret = this.DB.child('privateSecrets').push(psData, (err, snapshot) => {
      if (err) {
        errCB();
      } else {
        var sKey = privateSecret.key();
        let initialState = {answerState: 'NA', sentState: 'CR'};
        this.DB.child('answers').child(sKey).set({askerAnswer: '', responderAnswer: ''});
        this.DB.child('users').child(uid).child('secrets').child(sKey).set(initialState);
        psData.key = sKey;
        psData.state = initialState;
        psData.answer = null;
        GetSecrets.pushLocalSecret(psData);
        if (successCB) {
          successCB(psData);
        }
      }
    });
  },

  pushSecretsToAsyncStore: function () {
  	let remoteSecrets = this.remoteSecrets;
		AsyncStorage.setItem('secrets', JSON.stringify(remoteSecrets));
  },

}

module.exports = GetSecrets;
