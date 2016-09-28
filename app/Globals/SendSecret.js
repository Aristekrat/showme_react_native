import Contacts from 'react-native-contacts';
import Utility from './UtilityFunctions.js';
import {
  AsyncStorage
} from 'react-native';
const Composer = require('NativeModules').RNMessageComposer;

const SendSecret = {
  DB: Utility.getRef(),
  senderPH: "",

  // Needs the uid, but it's the only one. Can call it as an arg. 
  saveArgs: function (receiverPH, receiverName, senderUID, key, props) {
    this.receiverPH = receiverPH.replace(/[^0-9 ]/g, "").split(' ').join('');
    this.receiverName = receiverName;
    this.senderUID = senderUID;
    this.key = key;
    this.navigator = props.navigator;
    this.route = props.route;
    this.lookUpIdWithPH(this.receiverPH, 'receiverId', true);
  },

  router: function (secretCode) {
    if (secretCode) {
      this.success();
      //this.sendText(this.receiverPH, secretCode);
    } else if (!this.receiverId) {
      this.navigator.push({name: 'SecretCode', cookieData: this.route.cookieData, key: this.key, receiverPH: this.receiverPH});
    } else {
      this.success();
      // this.sendText(this.receiverPH, secretCode);
    }
  },

  success: function () {
    let privateSecretUpdate = {
      responderID: this.receiverId,
      responderPH: this.receiverPH,
      responderName: this.receiverName,
      askerPH: this.senderPH,
    };
    this.updateSentStatus(privateSecretUpdate);
  },

  lookUpSenderPH: function (uid) {
    this.DB.child('indexes').child('phoneNumberIndex').once('value', (snapshot) => {
      if (snapshot.hasChild(uid)) {
        let phIndex = snapshot.val();
        this.senderPH = phIndex[uid].replace(/[^0-9 ]/g, "").split(' ').join('');
      } 
    }); 
  },

  lookUpIdWithPH: function (ph, assignVal, routeAfter) {
    this.DB.child('indexes').child('phoneNumberIndex').orderByValue().equalTo(ph).once('value', (snapshot) => { 
      let valReturned = snapshot.val();
      if (valReturned) {
        this[assignVal] = Object.keys(valReturned)[0];
      } else {
        this[assignVal] = "";
      }

      if (routeAfter) {
        this.router();
      }
    });
  },

  sendText: function(phoneNumber, secretCode) {   
    Composer.composeMessageWithArgs({
        'messageText': 'I want to share a secret with you: <url> Your secret code is "' + secretCode + '"',
        'subject':'My Sample Subject',
        'recipients': [phoneNumber]
    }, (result) => {
          switch(result) {
              case Composer.Sent:
                  this.navigator.push({name: 'SelectCategory', modalText: 'Message Sent'});
                  break;
              case Composer.Cancelled:
                  this.navigator.push({name: 'SecretCode'})
                  console.log('user cancelled sending the message');
                  break;
              case Composer.Failed:
                  this.navigator.push({name: 'SecretCode', modalText: 'Sorry, sending text failed. Try again?'})
                  break;
              case Composer.NotSupported:
                  this.navigator.push({name: 'SelectCategory', modalText: 'Sorry, your device is unsupported'});
                  console.log('this device does not support sending texts');
                  break;
              default:
                  this.navigator.push({name: 'SecretCode', modalText: 'Network Error'});
                  break;
          }
      }
    );
  },

  updateSentStatus: function(updatedSecret) {
    this.DB.child('privateSecrets').child(this.key).update(updatedSecret); //DB Dependency
    this.DB.child('users').child(this.senderUID).child('secrets').child(this.key).update({sentState: 'QS'});
    if (updatedSecret.responderID) {
      this.DB.child('users').child(updatedSecret.responderID).child('secrets').child(this.key).update({sentState: 'RR'}); // DB Dependency
    }
  },

}

module.exports = SendSecret;