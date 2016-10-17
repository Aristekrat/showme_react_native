'use strict';
 
import React from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';

import {
  StyleSheet,
  Text,
  View,
  PickerIOS,
  AsyncStorage,
} from 'react-native';

const PickerItemIOS = PickerIOS.Item;

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