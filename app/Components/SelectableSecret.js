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

/*
var React = require('react-native');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;
*/

class Secret extends React.Component {
  render() {
    return (
      <TouchableHighlight underlayColor={StylingGlobals.colors.accentPressDown} onPress={this.props.selectSecret}>
        <View style={styles.secretContainer}>
          <Text style={styles.secretText}>{this.props.secretText}</Text> 
          <Image 
            source={require("../img/right-arrow.png")}
            style={StylingGlobals.rightArrow} />      
        </View>
      </TouchableHighlight>
    )
  }
}

var styles = StyleSheet.create({
    secretContainer: {
      borderBottomColor: '#FDDCDC',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      padding: 10,
      flexWrap: 'wrap',
    },
    secretText: {
      fontSize: 12,
      color: '#444',
      width: 310,
    },
});

module.exports = Secret;