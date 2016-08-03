'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

class MySecret extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <TouchableHighlight 
          underlayColor={StylingGlobals.colors.accentPressDown} 
          onPress={this.props.updateSecret}
          style={this.props.updated ? styles.active : null}>
          <View style={styles.secretContainer}>
            <Text style={styles.author}>from {this.props.author}</Text>
            <Text style={styles.question}>Q: {this.props.question}</Text>
            <Text style={styles.answer}>{this.props.answer}</Text>
            <Text style={styles.notification}>{this.props.answerNotification}</Text>
          </View>
      </TouchableHighlight>
    )
  }
}

var styles = StyleSheet.create({
  secretContainer: {
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    marginLeft: 10,
    marginRight: 10,
    padding: 5, 
    flex: 1,
    paddingBottom: 15,
  },
  author: {
    color: '#999',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginRight: 5,
  },
  question: {
    margin: 5,
  },
  active: {
    backgroundColor: StylingGlobals.colors.accentPressDown,
    borderBottomColor: StylingGlobals.colors.border,
    borderBottomWidth: 1,
  },
  answer: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 1,
  },
  notification: {
    marginTop: 5,
    marginLeft: 5,
    fontSize: 10,
    color: StylingGlobals.colors.mainColor
  }
});

module.exports = MySecret;