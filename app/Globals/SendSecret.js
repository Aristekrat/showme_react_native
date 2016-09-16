import Contacts from 'react-native-contacts';
import Utility from './UtilityFunctions.js';
import {
  AsyncStorage
} from 'react-native';

const Composer = require('NativeModules').RNMessageComposer;

// Need to write a function that checks next steps or just rewrite the lookup function to do so

const SendSecret = {
  DB: Utility.getRef(),
  //phIndex: this.DB.child('indexes').child('phoneNumberIndex'),
  //users: this.DB.child('users'),
  //privateSecrets: this.DB.child('privateSecrets'),

  // Needs the uid, but it's the only one. Can call it as an arg. 
  saveArgs: function (receiverPH, receiverName, senderUID, props) {
    this.receiverPH = receiverPH;
    this.receiverName = receiverName;
    this.senderUID = senderUID;
    this.navigator = props.navigator;
    this.route = props.route;
  },

  // Probably want to preload this data on the ShareSecret page
  // Get it all working first
  router: function () {
    this.DB.child('indexes').child('phoneNumberIndex').once('value', (snapshot) => { 
      let phIndex = snapshot.val();
      let phKeys = Object.keys(phIndex)
      let receiverId = this.checkForReceiverId(phIndex, phKeys[phKeys.length - 1], this.receiverPH);
      if (!receiverId) {
        this.navigator.push({name: 'SecretCode'});
      } else {
        const senderPH = snapshot.hasChild(this.senderUID) ? phIndex[this.senderUID] : '';
        let privateSecretUpdate = {
          responderID: receiverId,
          responderPH: this.receiverPH,
          responderName: this.receiverName,
          askerPH: senderPH,
        };
        this.updateSentStatus(privateSecretUpdate, this.route.cookieData);
        //this.sendText(this.receiverPH);
      }
    });
  },

  success: function () {
    this.DB.child('indexes').child('phoneNumberIndex').once('value', (snapshot) => { 
      let phIndex = snapshot.val();
      const senderPH = snapshot.hasChild(this.senderUID) ? phIndex[this.senderUID] : '';
      let privateSecretUpdate = {
        responderID: receiverId,
        responderPH: this.receiverPH,
        responderName: this.receiverName,
        askerPH: senderPH,
      };
      this.updateSentStatus(privateSecretUpdate, this.route.cookieData);
      this.sendText(this.receiverPH);
    });
  },

  checkForPH: function(uid) {
    this.DB.child('indexes').child('phoneNumberIndex').once('value', (snapshot) => {
      let phIndex = snapshot.val();
      let phKeys = Object.keys(phIndex)
      if (!snapshot.hasChild(uid)) {
        this.navigator.push({name: 'AskNumber'});
        //this.setState({informationNeeded: 'SenderNumber'}); // Change this to a move page signal
      } else {
        // PH Knownn
      }
    });
  },

  checkForReceiverId: function(phoneNumberIndex, lastKey, receiverPH) {
    for (var key in phoneNumberIndex) {
      if (receiverPH === phoneNumberIndex[key]) {
        return key // Receiving user known
      } else if (key === lastKey) {
        return "" // Iteration is at an end
      } else {
        continue;
      }
    }
  },

  sendText: function(phoneNumber) {   
    Composer.composeMessageWithArgs({
        'messageText': 'I want to share a secret with you: ',
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

  //this.currentSecret = this.props.route.cookieData;
  updateSentStatus: function(updatedSecret, currentSecret) {
    this.DB.child('privateSecrets').child(currentSecret.key).update(updatedSecret); //DB Dependency
    this.DB.child('users').child(currentSecret.askerID).child('secrets').child(currentSecret.key).update({sentState: 'QS'}); // currentSecret dependency
    if (updatedSecret.responderID) {
      this.DB.child('users').child(responderId).child('secrets').child(currentSecret.key).update({sentState: 'RR'}); // DB Dependency
    }
  },
}

module.exports = SendSecret;