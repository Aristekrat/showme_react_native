'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/MySecret.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight
} from 'react-native';
/*
var React = require('react-native');
var StylingGlobals = require('../StylingGlobals.js');
var Secret = require('../Components/MySecret');
var TabBar = require('../Components/TabBar.js');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight
} = React;
*/

class MySecrets extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displaying: "Answered"
    } 
    this.mySecrets = [{
      author: 'Foo',
      question: 'Where?',
      answer: 'The place',
      state: 'Answered',
    }, {
      author: 'Boo',
      question: 'Who?',
      answer: 'The thing',
      state: 'Answered',
    }, {
      author: 'You',
      question: 'Do?',
      answer: '(none yet)',
      state: 'Asked',
    }, {
      author: 'Sue',
      question: 'Why?',
      answer: 'You haven\'t answered yet. Tap to answer now',
      state: 'Requested',
    }]
  }
  listSecrets() {
    let currentState = this.state.displaying;
    return this.mySecrets.map(function (item) {
      if (item.state === currentState) {
        return (
          <Secret author={item.author} question={item.question} answer={item.answer} />
        );
      }
    });
  }
  setTab(state) {
    this.setState({displaying: state});
    this.listSecrets();
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableHighlight 
                style={[styles.headerButton, styles.firstHeaderButton, this.state.displaying === "Answered" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor} 
                onPress={() => this.setTab('Answered')} >
              <Text style={styles.headerButtonText}>Answered</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={[styles.headerButton, this.state.displaying === "Asked" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('Asked')}>
              <Text style={styles.headerButtonText}>Asked</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={[styles.headerButton, this.state.displaying === "Requested" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('Requested')}>
              <Text style={styles.headerButtonText}>Requested</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.contentContainer}>
            {this.listSecrets()}
          </View>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1, 
    borderBottomColor: StylingGlobals.colors.accentPressDown,
    flexDirection: 'row',
    justifyContent: 'space-around',
    //marginRight: 15,
  },
  active: {
    backgroundColor: StylingGlobals.colors.accentPressDown,
  },
  headerButton: {
    padding: 20,
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: StylingGlobals.colors.navColor,
  },
  firstHeaderButton: {
    borderLeftWidth: 0,
  },
  headerButtonText: {
    textAlign: 'center'
  },
});

module.exports = MySecrets;
