import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

class BigButton extends React.Component {
  render() {
    return (
      <TouchableHighlight 
          style={styles.bigButtonContainer} 
          underlayColor={StylingGlobals.colors.pressDown} 
          onPress={this.props.do} >
          <Text style={styles.buttonText}>{this.props.children}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  bigButtonContainer: {
  	backgroundColor: StylingGlobals.colors.mainColor,
  	marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 15,
  	padding: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
});

module.exports = BigButton;