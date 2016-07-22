'use strict';
 
import React from 'react';
import StylingGlobals from '../StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import TabBar from '../Components/TabBar.js';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  AsyncStorage,
} from 'react-native';
 
import Communications from 'react-native-communications';
//import Composer from 'react-native-message-composer';
var Composer = require('NativeModules').RNMessageComposer;
 
class ShareSecret extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      ph: '',
      uid: ''
    }
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.currentSecret = this.props.route.cookieData;
  }

  sendText() {
    this.updateSentStatus();
      /*
      Composer.composeMessageWithArgs({
          'messageText': 'I want to share a secret with you: ',
          'subject':'My Sample Subject',
          'recipients':['5415130548']
      },
      (result) => {
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
      */
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

  componentDidMount() {
    console.log(this.props.route.cookieData);
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
          <Text style={styles.prompt}>Enter phone number</Text>
          <TextInput 
            style={styles.phoneInput}
            autoFocus={true}
            keyboardType={'numeric'} 
            ref="ph"
            onChangeText={(ph) => this.setState({ph})}
            selectionColor={StylingGlobals.colors.navColor}
          />
          <BigButton do={() => this.sendText()}>
            Continue
          </BigButton>
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
});

module.exports = ShareSecret;