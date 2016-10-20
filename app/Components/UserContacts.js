'use strict';
 
import React from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import actions from '../State/Actions/Actions';
import { connect } from 'react-redux';

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
    }
    this.contacts = this.props.contacts.filter(this.filterSecrets);
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
              this.setState({contact: contactIndex});
              this.props.actions.updatePhoneNumber(this.contacts[contactIndex].phoneNumbers[0].number);
              this.props.actions.updateFirstName(this.contacts[contactIndex].givenName);
            } 
          }>
          {this.contacts.map((contact, index) => (
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

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = function(dispatch, ownProps) {
  actions.dispatch = dispatch;
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContacts);