'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

class Secret extends React.Component {
  render() {
    return (
      <TouchableHighlight underlayColor={StylingGlobals.colors.accentPressDown} onPress={this.props.selectSecret}>
        <View style={styles.secretContainer}>
          <Text style={styles.secretText}>{this.props.secretText}</Text> 
          <Image 
            source={require("../img/right-arrow.png")}
            style={[StylingGlobals.rightArrow, styles.secretArrow]} />      
        </View>
      </TouchableHighlight>
    )
  }
}

// style={[styles.button, StylingGlobals.horizontalCenter]} 

var styles = StyleSheet.create({
    secretContainer: {
      borderBottomColor: '#FDDCDC',
      borderBottomWidth: 1,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    secretText: {
      fontSize: 12,
      color: '#444',
      flex: 4,
      paddingTop: 5,
    },
    secretArrow: {

    },
});

module.exports = Secret;