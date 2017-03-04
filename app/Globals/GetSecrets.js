import {
  AsyncStorage
} from 'react-native';
import Utility from './UtilityFunctions.js';
import ReactTimer from 'react-timer-mixin';
import actions from '../State/Actions/Actions';
import store from '../State/Store';

const GetSecrets = {
	DB: Utility.getRef(),
	remoteSecrets: [],
	localSecrets: [],
	totalResults: '', // Num val, set to a string on app start so it will never eq true to a number on initialize

  // Used within get remote secrets to set the local state
  _setRemoteSecret: function(state, key, answer = null) {
    this.DB.child('privateSecrets').child(key).on('value', (secret) => {
      var sv = secret.val();
      if (sv) {
        sv.state = state;
        sv.key = key;
        sv.answer = answer;
        this.remoteSecrets.push(sv);
      } else {
        this.totalResults = this.totalResults - 1;
      }
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
  getRemoteSecrets: function(uid = false) {
  	this.remoteSecrets.length = 0;
    this.totalResults = '';
    if (uid) {
      this.uid = uid;
      this.pullDownSecrets(uid)
    } else {
      AsyncStorage.getItem('userData').then((user_data_string) => {
        if (user_data_string) {
          let user_data = JSON.parse(user_data_string); // TODO Needs to check AUTH, implement this at the end
          this.uid = user_data.uid;
          this.pullDownSecrets(user_data.uid)
        }
      });
    }
  },

  pullDownSecrets: function(uid) {
    this.DB.child('users').child(uid).child('secrets').once('value', (snapshot) => {
      var userSecrets = snapshot.val();
      if (userSecrets) {
        var userKeys = Object.keys(userSecrets);
        this.totalResults = userKeys.length;

        userKeys.forEach((result, count) => {
          if (userSecrets[result].sentState === 'SO') {
            this.DB.child('answers').child(result).on('value', (snapshot) => {
              var answer = snapshot.val();
              answer.key = result;
              this._setRemoteSecret(userSecrets[result], result, answer);
            });
          } else {
            this._setRemoteSecret(userSecrets[result], result);
          }
        })
      }
    })
  },

  // Sets the 'Asker' field in an individual secret, called in listSecrets
  _setAskerName: function(askerID, askerName, uid) {
    if (uid && uid === askerID) {
      return "You";
    } else if (!askerName) {
      return "Anonymous";
    } else {
      return askerName;
    }
  },

  // Adds a special notification to a secret if the other person has answered
  _setAnswerNotification: function(itemState) {
    if (itemState.sentState === 'QS' && itemState.answerState === 'RA' || itemState.sentState === 'RR' && itemState.answerState === 'AA') {
      return true;
    } else {
      return false;
    }
  },

  pushPrivateSecret: function(text, uid, profileName = "Anonymous", successCB, errCB) {
    let psData = {question: text, askerID: uid, askerName: profileName, responderID: '', responderName: ''};
    let privateSecret = this.DB.child('privateSecrets').push(psData, (err, snapshot) => {
      if (err) {
        errCB();
      } else {
        var sKey = privateSecret.key;
        let initialState = {answerState: 'NA', sentState: 'CR'};
        this.DB.child('answers').child(sKey).set({askerAnswer: '', responderAnswer: ''});
        console.log(uid, sKey);
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

  // Pushes one new secret obj to the local store.
  pushLocalSecret: function (newSecret) {
    AsyncStorage.getItem('secrets').then((secrets_data_string) => {
      let secretCopy = Object.assign({}, newSecret);
      secretCopy.askerName = this._setAskerName(newSecret.askerID, newSecret.askerName, this.uid);
      secretCopy.answerNotification = this._setAnswerNotification(newSecret.state);
      if (secrets_data_string) {
        let secrets_data = JSON.parse(secrets_data_string);
        if (!Array.isArray(secrets_data)) {
          console.log("pushLocalSecret, invalid data type received ", secrets_data);
        }
        secrets_data.push(secretCopy);
        AsyncStorage.setItem('secrets', JSON.stringify(secrets_data));
      } else {
        let localData = [];
        localData.push(secretCopy);
        AsyncStorage.setItem('secrets', JSON.stringify(localData));
      }
    });
  },

  writeRemoteSecretsToAsyncStore: function () {
    let secretsHash = {};
    let dupsFilteredOut = GetSecrets.remoteSecrets.filter((item) => {
        return secretsHash.hasOwnProperty(item.key) ? false : (secretsHash[item.key] = true);
    });
    let readyToRender = dupsFilteredOut.map((item, index) => {
      item.answerNotification = GetSecrets._setAnswerNotification(item.state);
      item.askerName = GetSecrets._setAskerName(item.askerID, item.askerName, GetSecrets.uid);
      return item;
    });
		AsyncStorage.setItem('secrets', JSON.stringify(readyToRender));
  },

  // Only updates AsyncStorage with updatedSecrets
  addUpdatedSecretsToAsyncStorage: function(updatedSecretsHash) {
    AsyncStorage.getItem('updatedSecrets').then((updated_secrets_string) => {
      if (updated_secrets_string) {
        let updated_secrets = JSON.parse(updated_secrets_string);
        let combinedObj = Object.assign(updated_secrets, updatedSecretsHash);
        AsyncStorage.setItem('updatedSecrets', JSON.stringify(combinedObj));
      } else {
        AsyncStorage.setItem('updatedSecrets', JSON.stringify(updatedSecretsHash));
      }
    });
  },

  listenForUpdatesToSecrets: function(uid) {
    this.DB.child('users').child(uid).child('secrets').on('child_changed', (childSnapshot) => {
      let key = childSnapshot.key;
      let stateUpdate = childSnapshot.val();
      this.notificationHandler(stateUpdate, key);
      this.secretsHandler(uid);
    });
  },

  notificationHandler: function(stateUpdate, key) {
    let userAnsweredOne = (stateUpdate.answerState === "AA" || stateUpdate.answerState === "NA") && stateUpdate.sentState === "QS"
    let userAnsweredTwo = stateUpdate.sentState === "RR" && (stateUpdate.answerState === "RA" || stateUpdate.answerState === "NA");
    if (!userAnsweredOne && !userAnsweredTwo) { //suppresses updates to a user when they're the ones to update a secret
      let newUpdate = {}
      newUpdate[key] = true;
      actions.incrementNotifications(1);
      actions.pushUpdatedSecret(key);
      this.addUpdatedSecretsToAsyncStorage(newUpdate);
    }
  },

  // Could do it's job more efficiently, should be fine for now
  secretsHandler: function(uid) {
    this.getRemoteSecrets(uid);
    this.checkIfRemoteSecretsReceived(this.writeRemoteSecretsToAsyncStore);
  },

  // Manages updated secrets and notifications
  compareLocalAndRemoteSecrets: function() {
    let count = 0;
    let arrLength = this.localSecrets.length - 1;
    if (this.localSecrets.length !== this.remoteSecrets.length) {
      this.writeRemoteSecretsToAsyncStore(this.remoteSecrets);
    } else {
      this.localSecrets.forEach((item, index) => {
        if (JSON.stringify(this.remoteSecrets[index].state) !== JSON.stringify(this.localSecrets[index].state)) { // Checks for differences between remote and local secrets
          count = count + 1;
          actions.pushUpdatedSecret(this.remoteSecrets[index].key);
        }
        if (arrLength === index) { // the for loop is at an end
          actions.incrementNotifications(count);
          this.addUpdatedSecretsToAsyncStorage(store.getState().updatedSecrets);
          //this.listenForUpdatesToSecrets();
        }
      });
    }
  },

  // Clears an updated secret from AsyncStorage and the state tree and decrements the notifications num
  removeNotification: function(key) {
    let updatedSecrets = store.getState().updatedSecrets;
    if (updatedSecrets && updatedSecrets[key]) {
      actions.removeUpdatedSecret(key);
      actions.decrementNotifications(1);
      AsyncStorage.getItem('updatedSecrets').then((updated_secrets_string) => {
        if (updated_secrets_string) {
          let updatedSecrets = JSON.parse(updated_secrets_string);
          delete updatedSecrets[key];
          AsyncStorage.setItem('updatedSecrets', JSON.stringify(updatedSecrets));
        }
      });
    };
  },

  reconcileUpdatedSecrets: function(secretsList, updatedSecrets) { // secretsList = arr of objs; updatedSecrets = hash obj, key: bool
    let secretsListHash = {}
    for (var i = 0; i < secretsList.length; i++) {
      secretsListHash[secretsList[i].key] = true;
    }

    for (var key in updatedSecrets) {
      if (!secretsListHash[key]) {
        this.removeNotification(key);
      }
    }
  },

  checkIfRemoteSecretsReceived: function(successCB) {
    ReactTimer.setTimeout (
      () => {
        if (GetSecrets.remoteSecrets.length === GetSecrets.totalResults) {
          successCB();
        } else {
          this.checkIfRemoteSecretsReceived(successCB);
        }
      },
      500
    )
  }

}

module.exports = GetSecrets;
