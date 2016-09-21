'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import GetSecrets from '../Globals/GetSecrets.js';
import StylingGlobals from '../StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

class ClaimSecret extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: 'ImpoliteEnergy'
    }
    this.verificationCodes = this.props.db.child('indexes').child('verificationCodes');
    this.verifiedIndex = this.props.db.child('indexes').child('verified');
  }

  verifyCode() {
    this.verificationCodes.orderByValue().equalTo(this.state.code).once('value', (snapshot) => {
      let valReturned = snapshot.val();
      if (valReturned) {
        var codeKey = Object.keys(valReturned)[0];
        AsyncStorage.getItem('userData').then((user_data_json) => { 
          if (user_data_json) {
            let user_data = JSON.parse(user_data_json);
            //this.verifiedIndex.child(user_data.uid).set(true);
            //this.verificationCodes.child(codeKey).remove();
            //this.props.navigator.push({name: 'MySecrets'});
          };
        });
      } else {
        // Sorry, we can't find you
      }
    });
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={styles.header}>
            Enter your code
          </Text>
          <TextInput
            style={styles.codeInput}  
            autoFocus={true}
            onChangeText={(text) => this.setState({code})}
            value={this.state.code} />
          <BigButton do={() => this.verifyCode()}>
            Submit
          </BigButton>        
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  header: {
    marginLeft: 30,
    marginTop: 20,
    fontSize: 16,
    marginBottom: 5,
  },
  codeInput: {
    backgroundColor: '#fff',
    height: 45,
    borderWidth: 1,
    borderColor: '#eee',
    paddingLeft: 5,
    marginLeft: 30,
    marginRight: 30,
  },
});


module.exports = ClaimSecret;
