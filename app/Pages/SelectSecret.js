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

class SelectSecret extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      source: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
    this.secrets = [];
    this.publicSecrets = this.props.db.child('publicSecrets');
  }
  upvote(key) {
    this.publicSecrets.child(this.props.route.category).child(key).child('score').transaction(function(currentRank) {
      return currentRank + 1;
    });
  }
  downvote(key) {
    this.publicSecrets.child(this.props.route.category).child(key).child('score').transaction(function(currentRank) {
      return currentRank - 1;
    });
  }
  componentWillMount() {
    this.props.db.child('publicSecrets').child(this.props.route.category).orderByChild('score').startAt(-5).on("child_added", (snapshot) => {
      var secret = snapshot.val();
      secret.key = snapshot.key();
      this.secrets.push(secret);
      this.setState({
        source: this.state.source.cloneWithRows(this.secrets)
      })
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code); // TODO real error handling
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
                secretText={rowData.text}
                count={rowData.score} 
                selectSecret={() => {this.props.navigator.push({name: 'ShareSecret', cookieData: rowData})}} 
                upvote={() => this.upvote(rowData.key)}
                downvote={() => this.downvote(rowData.key)}
              />
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
