'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
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
      animating: true,
      uid: "",
      updatedSecrets: [],
    };
    this.mySecrets = this.props.route.secret ? this.props.route.secret : [];
  }

  componentWillMount() {
    AsyncStorage.getItem('userData').then((user_data_json) => { 
      if (user_data_json) {
        let user_data = JSON.parse(user_data_json);
        this.setState({uid: user_data.uid});
      };
    });
    
    if (this.mySecrets.length > 0) {
      var updated = {}
      updated[this.props.route.secret.key] = true;
      this.setState({updatedSecrets: updated});
    }
    // Gets the initial data that will help the system determine if a secret has been updated
    AsyncStorage.getItem('updatedSecrets').then((updatedSecretsString) => {
      console.log("UPDATEDSECRETSSTRING", updatedSecretsString);
      if (updatedSecretsString) {
        this.setState({updatedSecrets: Object.assign(this.state.updatedSecrets, JSON.parse(updatedSecretsString)) });
      };
    });

    AsyncStorage.getItem('secrets').then((secrets_data_string) => {
      console.log(secrets_data_string);
      if (secrets_data_string) {
        let secrets_data = JSON.parse(secrets_data_string);
        this.mySecrets = this.mySecrets.concat(secrets_data);
        this.initalDisplay();
        this.listSecrets();
        this.toggleActivityIndicator();
      } else if (!this.props.route.secret && !secrets_data_string) {
        this.setState({displaying: 'NR'});
        this.toggleActivityIndicator();
      }
    });

    AsyncStorage.getItem('contacts').then((contacts_string) => {
      this.contacts = JSON.parse(contacts_string);
    });
  }

  // Removes notifications from AsyncStorage, the timing of the call is determined in listSecrets
  removeNotifications(key) {
    if (this.state.updatedSecrets && this.state.updatedSecrets[key]) {
      var removeViewed = JSON.parse(JSON.stringify(this.state.updatedSecrets));
      delete removeViewed[key];
      AsyncStorage.setItem('updatedSecrets', JSON.stringify(removeViewed));
      AsyncStorage.setItem('notificationCount', String(0));
    };
  }

  // Determines the correct route for a secret to link to in listSecrets
  setUpdateSecretFunc(currentState, item) {
    if (currentState === 'CR') { 
      return this.props.navigator.push({ name: 'ShareSecret', cookieData: item, contacts: this.contacts });
    } else if (currentState === 'QS' || currentState === 'RR') {
      return this.props.navigator.push({ name: 'YourAnswer', cookieData: item })
    } else if (currentState === 'SO') {
      return null;
    }
  }

  // Sets the 'Asker' field in an individual secret, called in listSecrets
  setAskerName(askerID, askerName) {
    if (this.state.uid && this.state.uid === askerID) {
      return "You";
    } else if (!askerName) {
      return "Anonymous";
    } else {
      return askerName;
    }
  }

  // Adds a special notification to a secret if the other person has answered
  setAnswerNotifiction(itemState) {
    if (itemState.sentState === 'QS' && itemState.answerState === 'RA' || itemState.sentState === 'RR' && itemState.answerState === 'AA') {
      return "They've answered! To see it, write your own answer now.";
    } else {
      return null;
    }
  }

  // The main implementation function to actually wire secrets in the view
  listSecrets (arrayOfSecrets = this.mySecrets) { 
    let currentState = this.state.displaying;
    return arrayOfSecrets.map((item, index) => {
      if (item.state.sentState === currentState) {
        let answerNotification = this.setAnswerNotifiction(item.state);
        item.askerName = this.setAskerName(item.askerID, item.askerName);
        this.removeNotifications(item.key);
        return (
          <Secret 
            author={item.askerName} 
            question={item.question}
            key={item.key}
            answer={item.answer ? 'A: ' + item.answer.responderAnswer : null} 
            answerNotification={answerNotification}
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

  // Needs to be moved to common utils
  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }

  // Chooses which tab to display on first View load
  initalDisplay() {
    if (this.mySecrets.length === 0) { // User has no secrets
      this.setState({displaying: "NR"})
    } else {
      this.setState({displaying: this.mySecrets[0].state.sentState}); // Probably want to refine this function to load the last / most updated, OK for now
    }
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
        helperText = <Text style={styles.helperText}>Tap to answer</Text>
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
            {helperText}
            {secretsList}
          </View>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

// This conditional stopped working
// {secretsList[0] || this.state.animating ? helperText : <Text style={styles.helperText}>No secrets of this type yet</Text> }

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
