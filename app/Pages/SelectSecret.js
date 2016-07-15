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
  ListView,
  AsyncStorage,
} from 'react-native';

class SelectSecret extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      source: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      uid: ''
    }
    this.secrets = [];
    this.publicSecrets = this.props.db.child('publicSecrets').child(this.props.route.category);
  }
  upvote(key) { 
    if (this.state.uid) {
      this.publicSecrets.child(key).child('score').transaction(function(currentRank) {
        return currentRank + 1;
      });
      var updateData = {};
      updateData[this.state.uid] = 'upvote';
      this.publicSecrets.child(key).child('votes').update(updateData)
    } else {
      // TODO handling for user unknown
    }
  }
  downvote(key) {
    if (this.state.uid) {
      this.publicSecrets.child(key).child('score').transaction(function(currentRank) {
        return currentRank - 1;
      });
      var updateData = {};
      updateData[this.state.uid] = 'downvote';
      this.publicSecrets.child(key).child('votes').update(updateData)
    } else {
      // TODO handling for user unknown
    }
  }
  componentWillMount() {
    AsyncStorage.getItem('userData').then((user_data_json) => { // What to do if the system can't find any user data?
      var user_data = JSON.parse(user_data_json);
      if (user_data.uid) {
        this.setState({uid: user_data.uid});
      }
      this.publicSecrets.orderByChild('score').startAt(-5).on("child_added", (snapshot) => {
        var secret = snapshot.val();
        secret.key = snapshot.key();
        secret.vote = secret.votes[user_data.uid];
        delete secret.votes;
        this.secrets.push(secret);
        this.setState({
          source: this.state.source.cloneWithRows(this.secrets)
        })
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code); // TODO real error handling
      })
    });
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
                vote={rowData.vote}
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
