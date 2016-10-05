'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/SelectableSecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
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
  constructor(props) {
    super(props);
    this.state = {
      source: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      warning: false,
      animating: true,
    }
    this.secrets = [];
    this.knownUser = false;
    this.publicSecrets = this.props.db.child('publicSecrets').child(this.props.route.category);
  }

  // Needs to be moved to common utils
  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }

  postUsersVote(theVote, key) {
    var updateData = {};
    updateData[this.knownUser] = theVote;
    this.publicSecrets.child(key).child('votes').update(updateData);
  }

  postVoteAmt(voteAmt, key) {
    this.publicSecrets.child(key).child('score').transaction((currentRank) => {
      return currentRank + voteAmt;
    }, (error, committed, snapshot) => {
      var foo = snapshot.val();
      this.publicSecrets.child(key).setPriority(-foo);
    });
  }

  // problems: voteState doesn't update without an app refresh, probably need to save secrets locally and check that
  // Need to streamline all the checks, perhaps split it up or figure out a system that can do it all once. 
  vote(action, voteState, key, voteAmt) {
    if (this.knownUser) {
      if (!this.state[key] || this.state[key] !== action) { // Checks the local record of voting history, if no vote or diff vote...
        this.setState({[key]: action}) 
        if (!voteState) { // First vote
          this.postUsersVote(action, key);
          this.postVoteAmt(voteAmt, key);
        } else if (voteState !== action) { // Reverse vote
          this.postUsersVote(action, key);
          this.postVoteAmt((voteAmt * 2), key);
        }
      }
    } else {
      this.setState({warning: true});
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('userData').then((user_data_string) => { // What to do if the system can't find any user data?
      if (user_data_string) {
        let user_data = JSON.parse(user_data_string);
        if (user_data.uid) {
          this.knownUser = user_data.uid;
        } 
      }
    });

    // Does some processing and then adds the secrets to the View.
    this.publicSecrets.orderByPriority().on("child_added", (snapshot) => {
      var secret = snapshot.val();
      secret.key = snapshot.key();
      secret.vote = secret.votes[this.knownUser];
      delete secret.votes;
      this.secrets.push(secret);
      this.setState({
        source: this.state.source.cloneWithRows(this.secrets),
        animating: false,
      });
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code); // TODO real error handling
    })
  }
  
  render() {
    return (
      <View style={StylingGlobals.container}>
        <ActivityIndicator animationControl={this.state.animating}/>
        {this.state.warn ? <Text style={styles.warning}>You must login to vote</Text> : null }
        <ListView
          dataSource= {
            this.state.source
          }
          renderRow={(rowData) => {
            return (
              <Secret 
                secretText={rowData.text}
                count={rowData.score} 
                key={rowData.key}
                id={rowData.key}
                selectSecret={() => {this.props.navigator.push({name: 'ShareSecret', cookieData: rowData, publicSecret: true, contacts: this.props.route.contacts})}} 
                vote={rowData.vote}
                upvote={() => { 
                    this.vote('upvote', rowData.vote, rowData.key, 1); 
                  }  
                }
                downvote={() => { 
                    this.vote('downvote', rowData.vote, rowData.key, -1); 
                  } 
                }
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
  },
  warning: {
    textAlign: 'center',
    color: StylingGlobals.colors.mainColor,
    marginTop: 5,
  },
});


module.exports = SelectSecret;
