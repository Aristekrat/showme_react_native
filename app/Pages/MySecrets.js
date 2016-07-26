'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/MySecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import ArrowLink from '../Components/ArrowLink.js';
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

class MySecrets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displaying: "",
      uid: "",
      animating: true,
    };
    this.mySecrets = [];
    this.answersList = [];
    this.users = this.props.db.child('users');
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.answers = this.props.db.child('answers');
  }

  getAnswer(usArray, key) {
    if (usArray[key].sentState === 'SO') {
      this.answers.child(key).on('value', (snapshot) => {
        var answer = snapshot.val();
        answer.key = key; 
        this.answersList.push(answer);
      });
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('updatedSecrets').then((updatedSecretsString) => {
      if (updatedSecretsString) {
        this.setState({updatedSecrets: JSON.parse(updatedSecretsString)});
      };
    });
    // TODO refactor to a gen use utility function, used in index.ios.js as well
    AsyncStorage.getItem('userData').then((user_data_json) => { // What to do if the system can't find any user data? Needs protection
      let user_data = JSON.parse(user_data_json);
      this.setState({uid: user_data.uid});

      // Lookup keys associated with user
      this.users.child(user_data.uid).child('secrets').once('value', (snapshot) => {
        var userSecrets = snapshot.val();
        if (userSecrets) {
          var userKeys = Object.keys(userSecrets);
          var resultsCount = userKeys.length - 1;
          // Find all the secret entries
          userKeys.forEach((result, count) => {
            this.getAnswer(userSecrets, result);
            
            this.privateSecrets.child(result).on('value', (secret) => {
              var sv = secret.val()
              sv.state = userSecrets[result]; // Show state from the users table, not the secrets table
              if (this.answersList[this.answersList.length - 1]) {
                if (this.answersList[this.answersList.length - 1].key === result) {
                  sv.answer = this.answersList.pop()
                }
              }
              sv.key = result;
              this.mySecrets.push(sv)
              // At the end of iteration, display results
              if (count === resultsCount) {
                this.initalDisplay()
                this.listSecrets()
                this.toggleActivityIndicator()
                AsyncStorage.setItem('secrets', JSON.stringify(this.mySecrets));
              }
            })
          })
        } else {
          this.toggleActivityIndicator();
          this.initalDisplay();
        }
      })
    });
  }

  componentDidMount() {
    AsyncStorage.getItem('secrets').then((secrets_data_json) => {
      if (secrets_data_json) {
        let secrets_data = JSON.parse(secrets_data_json);
        this.listSecrets(secrets_data);
      }
    })
  }

  // Needs to be moved to common utils
  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }

  initalDisplay() {
    if (this.mySecrets.length === 0) { // User has no secrets
      this.setState({displaying: "NR"})
    } else {
      this.setState({displaying: this.mySecrets[0].state.sentState}); // Probably want to refine this function to load the last / most updated, OK for now
    }
  }

  removeNotifications(key) {
    if (this.state.updatedSecrets && this.state.updatedSecrets[key]) {
      var removeViewed = JSON.parse(JSON.stringify(this.state.updatedSecrets));
      delete removeViewed[key];
      AsyncStorage.setItem('updatedSecrets', String(removeViewed));
      AsyncStorage.setItem('notificationCount', String(0));
    };
  }

  setUpdateSecretFunc(currentState, item) {
    if (currentState === 'CR') { // determines the correct route to link to, should probably split this functionality off
      return this.props.navigator.push({ name: 'ShareSecret', cookieData: item });
    } else if (currentState === 'QS' || currentState === 'RR') {
      return this.props.navigator.push({ name: 'YourAnswer', cookieData: item })
    } else if (currentState === 'SO') {
      return null;
    }
  }

  setAskerName(askerID, askerName) {
    if (this.state.uid === askerID) {
      return "You";
    } else if (!askerName) {
      return "Anonymous";
    } else {
      return askerName;
    }
  }

  listSecrets (arrayOfSecrets) { // This function is doing too much. Bits of it need to be split off
    let currentState = this.state.displaying;
    if (!arrayOfSecrets) { // refactor to use default arg
      var arrayOfSecrets = this.mySecrets;
    }
    return arrayOfSecrets.map((item, index) => {
      if (item.state.sentState === currentState) {
        item.askerName = this.setAskerName(item.askerID, item.askerName);
        this.removeNotifications(item.key);
        return (
          <Secret 
            author={item.askerName} 
            question={item.question} 
            answer={item.answer ? 'A: ' + item.answer.responderAnswer : null} 
            updateSecret={() =>  this.setUpdateSecretFunc(currentState, item)}
            updated={this.state.updatedSecrets ? this.state.updatedSecrets[item.key] : false}
            />
        );
      }
    });
  }

  setTab(state) {
    this.setState({displaying: state});
    this.listSecrets();
  }

  render() {
    let helperText;
    let secretsList = this.listSecrets();
    switch(this.state.displaying) {
      case "SO":
        helperText = null;
        break;
      case "QS":
      case "RR":
        helperText = <Text style={styles.helperText}>Tap to write your answer</Text>
        break;
      case "CR":
        helperText = <Text style={styles.helperText}>Tap to send</Text>
        break;
      case "NR":
        helperText = <View>
                      <Text style={styles.helperText}>You don't have any secrets yet, would you like to make one?</Text>
                      <ArrowLink skipTo={() => this.props.navigator.push({name: 'SelectCategory'})}>Select Secret</ArrowLink>
                    </View>
    }
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableHighlight 
                style={[styles.headerButton, styles.firstHeaderButton, this.state.displaying === "SO" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor} 
                onPress={() => this.setTab('SO')} >
              <Text style={styles.headerButtonText}>Answered</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={[styles.headerButton, this.state.displaying === "QS" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('QS')}>
              <Text style={styles.headerButtonText}>Sent</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={[styles.headerButton, this.state.displaying === "RR" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('RR')}>
              <Text style={styles.headerButtonText}>Requested</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={[styles.headerButton, this.state.displaying === "CR" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('CR')}>
              <Text style={styles.headerButtonText}>Not Sent</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.contentContainer}>
            <ActivityIndicator animationControl={this.state.animating}/>
            {secretsList[0] || this.state.animating ? helperText : <Text style={styles.helperText}>No secrets of this type yet</Text> }
            {secretsList}
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
    textAlign: 'center',
    fontSize: 12
  },
  helperText: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5
  }
});

module.exports = MySecrets;
