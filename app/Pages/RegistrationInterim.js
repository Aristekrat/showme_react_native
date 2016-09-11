'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import StylingGlobals from '../StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

class RegistrationInterim extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={styles.header}>
            Do you have a secret code?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableHighlight 
                style={styles.button} 
                underlayColor={StylingGlobals.colors.accentColor} 
                onPress={() => this.props.navigator.push({name: 'ClaimSecret'}) } >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={styles.button} 
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.props.navigator.push({name: 'SelectCategory'}) }>
              <Text style={styles.buttonText}>No</Text>
            </TouchableHighlight>
          </View>
          <Text style={styles.bottomText}>
            If you got an invitation from a friend, it would be in there
          </Text>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  header: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
  	margin: 15,
    padding: 15,
    width: 120,
  	backgroundColor: StylingGlobals.colors.mainColor,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  bottomText: {
    marginLeft: 20,
    fontSize: 12,
  }
});


module.exports = RegistrationInterim;
