'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView
} from 'react-native';

class MyAccount extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={StylingGlobals.container}>

        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Native!
          </Text>
          <Text style={styles.instructions}>
            To get started, edit index.ios.js!!
          </Text>
          <Text style={styles.instructions}>
            Press Cmd+R to reload,{'\n'}
            Cmd+D or shake for dev menu
          </Text>
        </View>
        
      </View>
    );
  }
}

var styles = StyleSheet.create({

});


module.exports = MyAccount;
