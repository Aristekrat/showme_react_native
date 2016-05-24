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

/*
var React = require('react-native');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
} = React;
*/

class MyAccount extends React.Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['My Secrets', 'New Secret', 'Select Secret', 'My Account']),
    }
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
          <TouchableHighlight style={styles.button} underlayColor="#ccc">
            <Text>Button</Text>
          </TouchableHighlight>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableHighlight 
              underlayColor={StylingGlobals.colors.pressDown} 
              style={styles.tripleDotButton}>
                <Text style={styles.tripleDotText}>{rowData}</Text>
              </TouchableHighlight>} 
          style={styles.tripleDotMenu} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  tripleDotMenu: {
    width: 120,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  tripleDotButton: {
    backgroundColor: StylingGlobals.colors.mainColor,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    height: 45,
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripleDotText: {
    color: '#fff',
  }
});


module.exports = MyAccount;
