'use strict';
 
import React from 'react';
import StylingGlobals from '../StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import TabBar from '../Components/TabBar.js';
import Contacts from 'react-native-contacts';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  PickerIOS,
  AsyncStorage,
} from 'react-native';
 
var Composer = require('NativeModules').RNMessageComposer;

const PickerItemIOS = PickerIOS.Item;

const dummy = [
  { 
    givenName: 'Prof. David',
    thumbnailPath: '',
    phoneNumbers: [{ number: '(111) 953-0253', label: 'mobile' } ],
    familyName: 'Aguilera',
    emailAddresses: [],
    recordID: 66 
  },
  { 
    givenName: 'Billie',
    thumbnailPath: '',
    phoneNumbers: [ { number: '(222) 886-0400', label: 'mobile' } ],
    emailAddresses: [],
    recordID: 76 
  },
  { 
    givenName: 'Meredith',
    thumbnailPath: '',
    phoneNumbers: [ { number: '(333) 305-8735', label: 'home' } ],
    familyName: 'Bowles',
    emailAddresses: [ { email: 'aman_uruloki@hotmail.com', label: '' } ],
    recordID: 90 
  },
  { 
    givenName: 'Brian',
    thumbnailPath: '/var/mobile/Containers/Data/Application/DB2F7899-15D3-437B-90E4-6EFDCAE0655A/tmp/thumbimage_TNpXx.png',
    phoneNumbers: 
     [ { number: '(444) 513-0548', label: 'mobile' },
       { number: '(541) 935-0404', label: 'home' } ],
    familyName: 'Case',
    emailAddresses: [ { email: 'aristekrat@gmail.com', label: 'home' } ],
    recordID: 33 
  },   
];

class UserContacts extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      contact: 0,
      ph: dummy[0].phoneNumbers[0].number, // dummy ref, change this
      firstName: dummy[0].givenName,
    } 
  }

  // Currently just adds a blank family name if none exists
  filterSecrets() {
    dummy.map((contact, index) => { // dummy ref, change this
      if (!contact.familyName) {
        contact.familyName = "";
      }
    })
  }

  componentWillMount() {
    this.filterSecrets();
  }

  render () {
    return (
      <View style={styles.userContacts}>
        <PickerIOS 
          selectedValue={this.state.contact}
          onValueChange={
            (contactIndex) => {
              this.setState({ph: dummy[contactIndex].phoneNumbers[0].number, contact: contactIndex, firstName: dummy[contactIndex].givenName}); // dummy ref, change this
            } 
          }>
          {dummy.map((contact, index) => (
            <PickerItemIOS
              key={contact}
              value={index}
              label={contact.givenName + " " + contact.familyName } />
          ))}
        </PickerIOS>
      </View>
    );
  }
};

class ShareSecret extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      ph: '',
      uid: '',
      contacts: '',
      informationNeeded: 'ReceiverNumber',
    }
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.phIndex = this.props.db.child('phoneNumberIndex');
    this.currentSecret = this.props.route.cookieData;
  }

  lookup(receiverPH, firstName) {
    if (this.state.informationNeeded === 'SenderNumber') {
      this.phIndex.child(this.state.uid).set(this.state.userPH);
      // this.sendText(receiverPH);
      // Full success flow
    } else {
      this.phIndex.once('value', (snapshot) => {
        let phIndex = snapshot.val();
        let phKeys = Object.keys(phIndex)
        let lastKey = phKeys[phKeys.length - 1];
        if (!snapshot.hasChild(this.state.uid)) {
          this.setState({informationNeeded: 'SenderNumber'});
        } else {
          const senderPH = phIndex[this.state.uid];
          let receiverId = this.checkForReceiverId(phIndex, lastKey, receiverPH);
          let privateSecretUpdate = {
            responderID: receiverId,
            responderPH: receiverPH,
            responderName: firstName,
            askerPH: senderPH
          };
          this.updateSentStatus(privateSecretUpdate);
          //this.sendText(receiverPH);
        }
      });
    }
  }

  checkForReceiverId(phoneNumberIndex, lastKey, receiverPH) {
    for (var key in phoneNumberIndex) {
      if (receiverPH === phoneNumberIndex[key]) {
        return key // Receiving user known
      } else if (key === lastKey) {
        return "" // Iteration is at an end
      } else {
        continue;
      }
    }
  }

  sendText(phoneNumber) {   
    Composer.composeMessageWithArgs({
        'messageText': 'I want to share a secret with you: ',
        'subject':'My Sample Subject',
        'recipients': [phoneNumber]
    }, (result) => {
          switch(result) {
              case Composer.Sent:
                  console.log('the message has been sent');
                  break;
              case Composer.Cancelled:
                  console.log('user cancelled sending the message');
                  break;
              case Composer.Failed:
                  console.log('failed to send the message');
                  break;
              case Composer.NotSupported:
                  console.log('this device does not support sending texts');
                  break;
              default:
                  console.log('something unexpected happened');
                  break;
          }
      }
    );
  }

  updateSentStatus(updatedSecret) {
    /*var responderId = this.tempFunc();
    var updatedSecret = {
      responderID: responderId,
      responderPH: this.state.ph,
    };*/
    this.privateSecrets.child(this.currentSecret.key).update(updatedSecret);
    this.users.child(this.currentSecret.askerID).child('secrets').child(this.currentSecret.key).update({sentState: 'QS'});
    if (updatedSecret.responderID) {
      this.users.child(responderId).child('secrets').child(this.currentSecret.key).update({sentState: 'RR'});
    }
  }

  componentWillMount() {
    //console.log(this.props.route.contacts); Getting it.
  }

  componentDidMount() {
    AsyncStorage.getItem('userData')
      .then((user_data_json) => {
        if (!user_data_json) {
          console.log("ERR - NO DATA");
        } else {
          let user_data = JSON.parse(user_data_json);
          this.setState({uid: user_data.uid});
        }
    });
  }

  render() {
    let theAsk;
    let topMessage;
    let middleMessage;
    let bottomMessage;
    switch(this.state.informationNeeded) {
      case "ReceiverNumber":
        topMessage = <Text style={styles.prompt}>Choose who you want to send to...</Text>
        theAsk = <UserContacts ref="userContacts" />
        middleMessage = <Text style={styles.label}>You'll have a chance to review before you send</Text>
        bottomMessage = <Text style={styles.exclusive}>Show Me is exclusively available on iPhones</Text>
        break; 
      case "SenderNumber":
        topMessage = <Text style={styles.prompt}>Please enter your phone number</Text>
        theAsk = <TextInput 
                    style={styles.textInput}
                    onChangeText={(PH) => this.setState({userPH: PH})}
                    selectionColor={StylingGlobals.colors.navColor} />
        middleMessage = null;
        bottomMessage = <Text style={styles.exclusive}>Sorry, we will only need to do this once</Text>
        break;
    }
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          {topMessage}
          {theAsk}
          {middleMessage}
          <BigButton do={() => this.lookup(this.refs.userContacts.state.ph, this.refs.userContacts.state.firstName)}>
            Continue
          </BigButton>
          {bottomMessage}
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  prompt: {
    marginLeft: 30,
    marginTop: 20,
  },
  userContacts: {
    marginTop: -20,
  },
  textInput: {
    height: 50,
    padding: 2,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 30,
    borderColor: '#eee',
    borderWidth: 1,
    width: 350,
    backgroundColor: '#fff'
  },
  label: {
    marginLeft: 30,
    fontSize: 12,
  },
  exclusive: {
    marginLeft: 30,
    fontSize: 12,
  },
});

module.exports = ShareSecret;