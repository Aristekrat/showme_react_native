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
  }
  sendText() {
    var self = this;
    console.log(this.state.ph.length);
    
    // Should look up whether this is already a private secret, update if so. If not:
    // Not 100% sure this will work within the push function, need to test
    this.privateSecrets.push({
        question: this.props.route.cookieData.text, 
        state: 'QS', 
        askerID: self.state.uid, 
        askerName: '', 
        askerAnswer: '', 
        responderID: this.state.ph, 
        responderName: '', 
        responderAnswer: ''}, 
        function (err, snapshot) {

        }
    );
        
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

  componentDidMount() {
    console.log(this.props.route.cookieData);
    AsyncStorage.getItem('userData')
      .then((user_data_json) => {
        if (!user_data_json) {
          // Err
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
            Send Text
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
  }
});

module.exports = ShareSecret;