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
 
//import Communications from 'react-native-communications';
//import Composer from 'react-native-message-composer';
var Composer = require('NativeModules').RNMessageComposer;
//onValueChange={(contact) => this.setState({category, index: 0})}>

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
    familyName: 'Unterfend',
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
      ph: dummy[0].phoneNumbers[0].number,
    } 
  }

  render () {
    return (
      <View style={styles.userContacts}>
        <PickerIOS 
          selectedValue={this.state.contact}
          onValueChange={
            (contactIndex) => {
              this.setState({ph: dummy[contactIndex].phoneNumbers[0].number, contact: contactIndex});
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
    }
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.currentSecret = this.props.route.cookieData;
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

  tempFunc() {
    var other;
    if (this.currentSecret.askerID === '25c07e84-dca3-415e-9f61-f2a6a6d6147a') {
      other = '5fc1427d-6be6-4e06-b71e-4bc64a251ff1';
    } else {
      other = '25c07e84-dca3-415e-9f61-f2a6a6d6147a';
    }
    return other; 
  }

  updateSentStatus() {
    var responderId = this.tempFunc();
    var updatedSecret = {
      responderID: responderId,
    };
    this.privateSecrets.child(this.currentSecret.key).update(updatedSecret);
    this.users.child(this.currentSecret.askerID).child('secrets').child(this.currentSecret.key).update({sentState: 'QS'});
    this.users.child(responderId).child('secrets').child(this.currentSecret.key).update({sentState: 'RR'});
  }

  componentWillMount() {
    //console.log("OMGHERE", this.props.route.contacts); Getting it.
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
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={styles.prompt}>Choose who you want to send to...</Text>
          <UserContacts ref="userContacts" />
          <Text style={styles.label}>You'll have a chance to review before you send</Text>
          <BigButton do={() => this.sendText(this.refs.userContacts.state.ph)}>
            Continue
          </BigButton>
          <Text style={styles.exclusive}>Show Me is exclusively available on iPhones</Text>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
};
 
/*
          <Text style={styles.prompt}>Enter phone number</Text>
          <TextInput 
            style={styles.phoneInput}
            autoFocus={true}
            keyboardType={'numeric'} 
            ref="ph"
            onChangeText={(ph) => this.setState({ph})}
            selectionColor={StylingGlobals.colors.navColor}
          />

            phoneInput: {
    backgroundColor: '#fff',
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    height: 45,
    borderColor: StylingGlobals.colors.border,
    borderWidth: 1  
  },

   var secretData = {text: this.state.text, category: this.refs.catPicker.state.category, score: 1, votes: voteData, '.priority': -1};
        

*/

var styles = StyleSheet.create({
  prompt: {
    marginLeft: 30,
    marginTop: 20,
  },
  userContacts: {
    marginTop: -20,
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