'use strict';
 
import React from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
// import Contacts from 'react-native-contacts';

import {
  StyleSheet,
  Text,
  View,
  PickerIOS,
  AsyncStorage,
} from 'react-native';
 
// var Composer = require('NativeModules').RNMessageComposer;

const PickerItemIOS = PickerIOS.Item;

/*
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
*/

class UserContacts extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      contact: 0,
      contacts: this.props.contacts.filter(this.filterSecrets),
      ph: this.props.contacts[0].phoneNumbers[0].number,
      firstName: this.props.contacts[0].givenName
    } 
  }

  // Removes contacts without a phone number
  filterSecrets(contact) {
    if (contact.phoneNumbers[0]) {
      if (!contact.familyName) { // Adds a blank string instead of undefined for unknown names
        contact.familyName = "";
      }
      if (!contact.givenName) {
        contact.givenName = "";
      }
      return true;
    } else {
      return false;
    }
  }

  render () {
    return (
      <View style={styles.userContacts}>
        <PickerIOS 
          selectedValue={this.state.contact}
          onValueChange={
            (contactIndex) => {
              this.setState({ph: this.state.contacts[contactIndex].phoneNumbers[0].number, contact: contactIndex, firstName: this.state.contacts[contactIndex].givenName});
            } 
          }>
          {this.state.contacts.map((contact, index) => (
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

var styles = StyleSheet.create({
  userContacts: {
    marginTop: -20,
  },
});

module.exports = UserContacts;