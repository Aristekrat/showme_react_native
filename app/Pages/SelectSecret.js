'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/SelectableSecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions';
import SendSecret from '../Globals/SendSecret.js';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  ListView,
  AsyncStorage,
  InteractionManager,
} from 'react-native';

class SelectSecret extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isReady: false,
    }
    this.secrets = [];
    this.profileName = "Anonymous";
    this.knownUser = this.props.userId ? this.props.userId : false;
    this.category = this.props.route.category ? this.props.route.category : "Social";
    this.publicSecrets = this.props.db.child('publicSecrets').child(this.category);
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

  vote(action, voteState, key, voteAmt) {
    if (this.knownUser) {
      if (!this.state[key] || this.state[key] !== action) { // Checks the local record of voting history, if no vote or diff vote...
        this.setState({[key]: action}) // questionable whether this should still be here.
        if (!voteState) { // First vote
          this.postUsersVote(action, key);
          this.postVoteAmt(voteAmt, key);
        } else if (voteState !== action) { // Reverse vote
          this.postUsersVote(action, key);
          this.postVoteAmt((voteAmt * 2), key);
        }
      }
    } else {
      this.props.actions.setError("You must be logged in to vote");
    }
  }

  selectSecret() {
    if (this.props.userId) {
      GetSecrets.pushPrivateSecret(this.props.route.cookieData.text, user_data.uid, user_data.profileName, (psData) => {
       this.props.actions.updateSecretKey(psData.key);
      }, (error) => {
       if (error == "Error: PERMISSION_DENIED: Permission denied") {
         this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
       } else {
         this.props.actions.setError("We're sorry, there was an error connecting to the server");
       }
     })
    } else {
      this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
    }
    /*
    AsyncStorage.getItem('userData').then((user_data_string) => {
      if (user_data_string) {
        let user_data = JSON.parse(user_data_string);
        if (!user_data.profileName) {
          user_data.profileName = "Anonymous";
        }
        SendSecret.lookUpSenderPH(user_data.uid);
        if (this.props.route.publicSecret) {
           GetSecrets.pushPrivateSecret(this.props.route.cookieData.text, user_data.uid, user_data.profileName, (psData) => {
            this.props.actions.updateSecretKey(psData.key);
          }, (error) => {
            if (error == "Error: PERMISSION_DENIED: Permission denied") {
              this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
            } else {
              this.props.actions.setError("We're sorry, there was an error connecting to the server");
            }
          })
        }
      } else {
        this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
      }
    });
    */
  }

  componentWillMount() {
    Utility.resetState(false, this.props.error);

    if (!this.props.userId) {
      AsyncStorage.getItem('userData').then((user_data_string) => {
        if (user_data_string) {
          let user_data = JSON.parse(user_data_string);
          if (user_data.uid) {
            this.knownUser = user_data.uid;
            this.props.actions.updateUserId(user_data.uid);
          }
        }
      });
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: true});
    });

    this.publicSecrets.orderByPriority().on("child_added", (snapshot) => {
      var secret = snapshot.val();
      secret.key = snapshot.key;
      if (this.knownUser) {
        secret.vote = secret.votes[this.knownUser];
      }
      delete secret.votes;
      this.secrets.push(secret);
      this.setState({
        source: this.state.source.cloneWithRows(this.secrets),
      });
    }, (errorObject) => {
      this.props.actions.setError("Sorry, we experienced a network error");
    });

    AsyncStorage.getItem('userData').then((user_data_string) => {
      if (user_data_string) {
        let user_data = JSON.parse(user_data_string);
        if (!user_data.profileName) {
          user_data.profileName = "Anonymous";
        }
      }
    })

    /*
    Utility.firebaseApp.auth().onAuthStateChanged((user) => {
      console.log("EXECUTED", user);
      if (!user) {
        this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
      }
    });
    */

  }

  render() {
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
        <ActivityIndicator animationControl={this.props.animating}/>
        {this.props.error ? <Text style={styles.warning}>{this.props.error}</Text> : null }
        {!this.state.isReady ? <ActivityIndicator animationControl={true}/> :
        <ListView
          dataSource= {
            this.state.source
          }
          initialListSize={5}
          renderRow={(rowData) => {
            return (
              <Secret
                secretText={rowData.text}
                count={rowData.score}
                key={rowData.key}
                id={rowData.key}
                selectSecret={() => {
                  this.props.actions.toggleAnimation();
                  this.props.navigator.push({name: 'ShareSecret', cookieData: rowData, publicSecret: true, contacts: this.props.route.contacts})}
                }
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
        }
        </ScrollView>
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

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    error: state.error,
    userId: state.userId,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSecret);
