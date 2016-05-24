'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ShareButton from '../Components/ShareButton.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView, 
  Image
} from 'react-native';

/*
var React = require('react-native');
var TabBar = require('../Components/TabBar.js');
var ShareButton = require('../Components/ShareButton.js');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView, 
  Image,
} = React;
*/

class ShareSecret extends React.Component {
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.content}>
          <Text style={styles.prompt}>How would you like to ask?</Text>
          <ShareButton imgSource={require("../../img/game67.png")} shareType={"Text"} />
          <ShareButton imgSource={require("../../img/chat21.png")} shareType={"Facebook"} />
          <ShareButton imgSource={require("../../img/envelope156.png")} shareType={"Email"} />
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  content: {

  },
  prompt: {
    marginTop: 20,
    marginLeft: 30,
  },
});


module.exports = ShareSecret;
