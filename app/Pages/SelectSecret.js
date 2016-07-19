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
  postUsersVote(theVote, key) {
    var updateData = {};
    updateData[this.state.uid] = theVote;
    this.publicSecrets.child(key).child('votes').update(updateData)
  }
  postVoteAmt(voteAmt, key) {
    this.publicSecrets.child(key).child('score').transaction((currentRank) => {
      return currentRank + voteAmt;
    }, (error, committed, snapshot) => {
      var foo = snapshot.val();
      this.publicSecrets.child(key).setPriority(-foo);
    });
  }
  vote(action, currentState, key) {
    if (this.state.uid) { // Known user
      /*
      if (!currentState) { // First vote
        if (action === 'upvote') {
          this.postUsersVote('upvote', key);
          this.postVoteAmt(1, key);
        } else if (action === 'downvote') {
          this.postUsersVote('downvote', key);
          this.postVoteAmt(-1, key);
        }
      } else if (currentState === 'upvote' && action === 'downvote') { // Reverse vote
        this.postUsersVote('downvote', key);
        this.postVoteAmt(-2, key);
      } else if (currentState === 'downvote' && action === 'upvote') {
        this.postUsersVote('upvote', key);
        this.postVoteAmt(2, key);
      } 
      */
      var foo = this.secrets[0]
      foo.score = 1;
      this.setState(foo); // This does update state on this 

      /*var foo; // Allows unlimited voting for dev purposes.
      if (action === 'upvote') {
        foo = 1;
      } else if (action === 'downvote') {
        foo = -1;
      }
      this.postUsersVote(action, key);
      this.postVoteAmt(foo, key);
      */
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
      this.publicSecrets.orderByPriority().on("child_added", (snapshot) => {
        var secret = snapshot.val();
        secret.key = snapshot.key();
        secret.vote = secret.votes[this.state.uid];
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
  render() {
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
                upvote={() => this.vote('upvote', rowData.vote, rowData.key)}
                downvote={() => this.vote('downvote', rowData.vote, rowData.key)}
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
