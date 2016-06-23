'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/MySecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  AsyncStorage
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
      displaying: "BR",
      uid: "",
      animating: true
    } 
    this.mySecrets = []
    this.users = this.props.db.child('users');
    this.privateSecrets = this.props.db.child('privateSecrets');
  }

  componentWillMount(){
    let self = this;
    // What to do if the system can't find any user data?
    AsyncStorage.getItem('userData').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json); 
      self.setState({uid: user_data.uid});
      // Lookup keys associated with user
      self.users.child(user_data.uid).child('secrets').once('value', (snapshot) => {
        for (var result in snapshot.val()) {
            // Get result by key
            this.privateSecrets.child(result).on('value', (secret) => {
              this.mySecrets.push(secret.val())
            })
        }
      })
    });
  }

  componentDidMount () {
    this.setTimeout (
      () => { 
        this.forceUpdate();
        this.listSecrets();
        this.toggleActivityIndicator();
      }, 
      1000
    );
  }

  // Needs to be moved to common utils
  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }

  listSecrets() {
    let currentState = this.state.displaying;
    return this.mySecrets.map(function (item) {
      if (item.state === currentState) {
        return (
          <Secret author={item.askerName} question={item.question} answer={item.responderAnswer} />
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
                style={[styles.headerButton, styles.firstHeaderButton, this.state.displaying === "BR" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor} 
                onPress={() => this.setTab('BR')} >
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
            <TouchableHighlight 
                style={[styles.headerButton, this.state.displaying === "Requested" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('Requested')}>
              <Text style={styles.headerButtonText}>Not Sent</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.contentContainer}>
            <ActivityIndicator animationControl={this.state.animating}/>
            {this.listSecrets()}
          </View>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

ReactMixin(MySecrets.prototype, ReactTimer);

var styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1, 
    borderBottomColor: StylingGlobals.colors.accentPressDown,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  active: {
    backgroundColor: StylingGlobals.colors.accentPressDown,
  },
  headerButton: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
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
