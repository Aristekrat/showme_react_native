'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/SelectableSecret.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  ListView
} from 'react-native';

/*
var React = require('react-native');
var TabBar = require('../Components/TabBar.js');
var Secret = require('../Components/SelectableSecret.js');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  ListView,
} = React;
*/

class SelectSecret extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      source: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
    this.secrets = []
  }
  componentDidMount() {
    this.props.db.child('publicSecrets').orderByChild('category').equalTo(this.props.route.category).on("child_added", (snapshot) => {
      this.secrets.push(snapshot.val())
      this.setState({
        source: this.state.source.cloneWithRows(this.secrets)
      })
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ListView
          dataSource= {
            this.state.source
          }
          renderRow={(rowData) => {
            return (
              <Secret 
                secretText={rowData.text} selectSecret={() => {this.props.navigator.push({name: 'ShareSecret', userID: rowData.text})}} />
            )
          }} />
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  secretContainer: {
    height: 50,
    marginBottom: 50,
  }
});


module.exports = SelectSecret;
