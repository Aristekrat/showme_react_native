'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import generator from '../Components/CodeGenerator/CodeGenerator.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import SendSecret from '../Globals/SendSecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

class SecretCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      generated: false,
      animating: false,
    }
    this.verificationIndex = this.props.db.child('indexes').child('verificationCodes');
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  generate() {
    if (!this.state.generated) {
      this.setState({generated: true});
    }
    
    var secretCode = generator(1,1);
    for (var i = 0; secretCode.length > i; i++) {
      secretCode[i] = this.capitalizeFirstLetter(secretCode[i]);
    }
    this.setState({code: secretCode.join('')});
  }

  createCode() {
    let psKey = this.props.route.key;
    let ph = this.props.route.receiverPH;
    let filteredPH = ph.replace(/[^0-9 ]/g, "").split(' ').join('');
    if (this.state.code) {
      this.setState({animating: true});
      this.verificationIndex.child(psKey).set(this.state.code);
      SendSecret.router(this.state.code);
    } else {
      this.setState({error: "Please enter a secret pass code"});
    }
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={styles.header}>
            Create a secret pass code
          </Text>
          <TextInput
            style={styles.codeInput}  
            autoFocus={true}
            onChangeText={(text) => this.setState({code})}
            value={this.state.code} />
          <Text style={styles.paragraph}>We'll use this to securely identify your friend</Text>
          <BigButton do={() => this.createCode()}>
            Submit
          </BigButton> 
          {
            this.state.error ?
            <Text style={styles.error}>{this.state.error}</Text> :
            null 
          }
          <Text style={styles.or}>- or -</Text>
          <Text style={styles.paragraph}>Have us make a secret code for you</Text>
          <BigButton do={() => this.generate()}>
            {this.state.generated ? "Make Another" : "Make one for Me"}
          </BigButton>
           <ActivityIndicator animationControl={this.state.animating} />        
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
  error: {
    marginLeft: 30,
    fontSize: 16,
    color: StylingGlobals.colors.pressDown,
    marginRight: 30,
  },
  paragraph: {
    marginTop: 5,
    marginLeft: 30,
    fontSize: 12,
  },
  or: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  }
});

module.exports = SecretCode;
