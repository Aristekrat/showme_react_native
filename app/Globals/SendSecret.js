import Contacts from 'react-native-contacts';
import Utility from './UtilityFunctions.js';
const Composer = require('NativeModules').RNMessageComposer;

import {
  AsyncStorage,
} from 'react-native';

const SendSecret = {
  DB: Utility.getRef(),
  senderPH: "",
  responderId: null,

  // Needs the uid, but it's the only one. Can call it as an arg.
  saveArgs: function (receiverPH, receiverName, senderUID, key, props) {
    this.receiverPH = receiverPH.replace(/[^0-9 ]/g, "").split(' ').join('');
    this.receiverName = receiverName;
    this.senderUID = senderUID;
    this.key = key;
    this.navigator = props.navigator;
    this.route = props.route;
    //this.success();
    this.lookUpIdWithPH(this.receiverPH, 'receiverId');

    this.router();
  },

  lookUpIdWithPH: function (ph, assignVal) {
    this.DB.child('indexes').child('phoneNumbers').child(ph).once('value', (snapshot) => {
    //this.DB.child('indexes').child('phoneNumberIndex').orderByValue().equalTo(ph).once('value', (snapshot) => {
      let valReturned = snapshot.val();
      console.log(valReturned);
      if (valReturned) {
        this[assignVal] = Object.keys(valReturned)[0];
      } else {
        this[assignVal] = "";
      }
    });
  },

  routeToSecretCode: function () {
    this.navigator.push({name: 'SecretCode', receiverName: this.receiverName, userId: this.senderUID, cookieData: this.route.cookieData, key: this.key, receiverPH: this.receiverPH});
  },

  router: function (secretCode) {
    if (secretCode) {
      this.success();
      this.sendText(this.receiverPH, secretCode);
    } else {
      // look up if this PH is in the user's friends table.
      // If so, look it up in the phoneNumberIndex. If it's there,
      // Don't send a text. Just send it within the system
      // Else route to SecretCode
      this.DB.child('users').child(this.senderUID).once('value', (snapshot) => {
        let userData = snapshot.val();
        if (userData.friends) {
          let userFriends = userData.friends;
          if (userFriends[this.receiverPH]) {
            this.DB.child('indexes').child('phoneNumberIndex').child(this.receiverPH).once('value', (grandchildSnapshot) => {
              const result = grandchildSnapshot.val();
              if (result) {
                this.receiverId = result;
                this.success();
                this.navigator.push({name: 'SelectCategory', modalText: 'Message Sent'});
              } else {
                this.routeToSecretCode();
              }
            });
          } else {
            this.routeToSecretCode();
          }
        } else {
          this.routeToSecretCode();
        }

      });
    }
  },

  success: function () {
    let privateSecretUpdate = {
      responderPH: this.receiverPH,
      responderName: this.receiverName,
      askerPH: this.senderPH,
    };
    if (this.receiverId) {
      privateSecretUpdate.responderID = this.receiverId;
    }
    this.updateSentStatus(privateSecretUpdate);
  },

  /*
  lookUpSenderPH: function (uid) {
    this.DB.child('indexes').child('phoneNumberIndex').once('value', (snapshot) => {
      if (snapshot.hasChild(uid)) {
        let phIndex = snapshot.val();
        this.senderPH = phIndex[uid].replace(/[^0-9 ]/g, "").split(' ').join('');
      }
    });
  },
  */

  sendText: function(phoneNumber, secretCode) {
    let link = 'https://itunes.apple.com/us/app/hintsy-send-the-perfect-gifts/id1030972401?mt=8'
    Composer.composeMessageWithArgs({
        'messageText': 'I want to share a secret with you: '+ link +' Your secret code is "' + secretCode + '"',
        'subject':'My Sample Subject',
        'recipients': [phoneNumber]
    }, (result) => {
          switch(result) {
              case Composer.Sent:
                  this.navigator.push({name: 'SelectCategory', modalText: 'Message Sent'});
                  break;
              case Composer.Cancelled:
                  this.navigator.push({name: 'SelectCategory'});
                  break;
              case Composer.Failed:
                  this.navigator.push({name: 'SelectCategory', modalText: 'Sorry, sending text failed. Try again?'})
                  break;
              case Composer.NotSupported:
                  this.navigator.push({name: 'SelectCategory', modalText: 'Sorry, your device is unsupported'});
                  break;
              default:
                  this.navigator.push({name: 'SelectCategory', modalText: 'Network Error'});
                  break;
          }
      }
    );
  },

  updateLocalSecretState: function (secretsArr) {
    let newArr = [];
    secretsArr.forEach((item, index) => {
      let updateIndex;
      if (item.key === this.key) {
        updateIndex = index
      }

      if (index === secretsArr.length) {
        let newArr = secretsArr;
        if (updateIndex) {
          newArr[updateIndex].state.sentState = "RR";
          AsyncStorage.setItem('smSecrets', JSON.stringify(newArr));
        } else {
          console.log("ERR!");
        }
      }
    })
  },

  updateSentStatus: function(updatedSecret) {
    this.DB.child('privateSecrets').child(this.key).update(updatedSecret); //DB Dependency
    this.DB.child('users').child(this.senderUID).child('secrets').child(this.key).update({sentState: 'QS'});
    if (updatedSecret.responderID) {
      this.DB.child('users').child(updatedSecret.responderID).child('secrets').child(this.key).update({sentState: 'RR'}); // DB Dependency
    }
    AsyncStorage.getItem('smSecrets').then((secrets_data_string) => {
      this.updateLocalSecretState(JSON.parse(secrets_data_string))
    });
  },

}

module.exports = SendSecret;
