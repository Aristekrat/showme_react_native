'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import BigButton from '../Components/BigButton.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import ArrowLink from '../Components/ArrowLink.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
} from 'react-native';

class RegistrationInterim extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={StylingGlobals.header}>Do you have a secret code?</Text>
          <Text style={StylingGlobals.paragraph}>You would have got this in a text from a friend</Text>
          <View style={styles.buttonContainer}>
            <TouchableHighlight onPress={() => this.props.navigator.push({name: 'ClaimSecret'}) } style={styles.button}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.props.navigator.push({name: 'SelectCategory'}) } style={styles.button}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: StylingGlobals.colors.mainColor,
    padding: 12,
    height: 50,
    width: 115,
    marginRight: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  }
});

module.exports = RegistrationInterim;
