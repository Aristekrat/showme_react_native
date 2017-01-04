'use strict';

import React from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import actions from '../State/Actions/Actions';
import { connect } from 'react-redux';
import Contacts from 'react-native-contacts';

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
      contacts: []
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

  componentWillMount() {
    // Handles no contacts props. This should rarely get triggered
    if (!this.props.contacts || this.props.contacts == undefined) {
      AsyncStorage.getItem('contacts').then((contacts_string) => {
        if (contacts_string) {
          let contacts_json = JSON.parse(contacts_string)
          this.setState({contacts: contacts_json.filter(this.filterSecrets)})
        } else {
          Contacts.getAll((err, contacts) => {
            if (err) {
              actions.updateContactsPermission(false);
            } else {
              this.setState({contacts: contacts.filter(this.filterSecrets)})
              AsyncStorage.setItem('contacts', JSON.stringify(this.state.contacts));
            }
          });
        }
      })
    } else {
      this.state.contacts = this.props.contacts.filter(this.filterSecrets);
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
              this.props.actions.updatePhoneNumber(this.state.contacts[contactIndex].phoneNumbers[0].number);
              this.props.actions.updateFirstName(this.state.contacts[contactIndex].givenName);
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
