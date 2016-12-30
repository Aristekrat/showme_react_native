'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/MySecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import ArrowLink from '../Components/ArrowLink.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import { connect } from 'react-redux'

class MySecrets extends React.Component {
  constructor(props) {
    super(props);
    this.mySecrets = this.props.route.secret ? this.props.route.secret : [];
  }

  // Clears both updated secrets and decrements the notifications num
  removeNotification(key) {
    if (this.props.updatedSecrets && this.props.updatedSecrets[key]) {
      this.props.actions.removeUpdatedSecret(key);
      this.props.actions.decrementNotifications(1);
      AsyncStorage.getItem('updatedSecrets').then((updated_secrets_string) => {
        let updatedSecrets = JSON.parse(updated_secrets_string);
        delete updatedSecrets[key];
        AsyncStorage.setItem('updatedSecrets', JSON.stringify(updatedSecrets));
      });
    };
  }

  // Determines the correct route for a secret to link to in listSecrets
  setUpdateSecretFunc(currentState, item) {
    this.removeNotification(item.key);
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
    if (this.props.userId && this.props.userId === askerID) {
      return "You";
    } else if (!askerName) {
      return "Anonymous";
    } else {
      return askerName;
    }
  }

  // Adds a special notification to a secret if the other person has answered
  setAnswerNotification(itemState) {
    if (itemState.sentState === 'QS' && itemState.answerState === 'RA' || itemState.sentState === 'RR' && itemState.answerState === 'AA') {
      return "They've answered! To see it, write your own answer now.";
    } else {
      return null;
    }
  }

  displaySecrets (item) {
    return item.state.sentState === this.props.displaying;
  }

  // The main implementation function to actually wire secrets in the view
  listSecrets (arrayOfSecrets = this.mySecrets) {
    return arrayOfSecrets.map((item, index) => {
        let answerNotification = this.setAnswerNotification(item.state);
        item.askerName = this.setAskerName(item.askerID, item.askerName);
        return (
          <Secret
            author={item.askerName}
            question={item.question}
            key={item.key}
            answer={item.answer ? 'A: ' + item.answer.responderAnswer : null}
            answerNotification={answerNotification}
            updateSecret={() =>  this.setUpdateSecretFunc(this.props.displaying, item)}
            updated={this.props.updatedSecrets[item.key]}
            />
        );
    });
  }

  setTab(state) {
    this.props.actions.setMSDisplayType(state);
  }

  // Chooses which tab to display on first View load
  initialDisplay(secretsArr) {
    if (secretsArr.length === 0) { // User has no secrets
      this.props.actions.setMSDisplayType('NR');
    } else if (this.props.updatedSecrets) { // Display column with an updated secret if there is one
      for (var i = 0; i <= secretsArr.length; i++) {
        if (i === secretsArr.length) {
          this.props.actions.setMSDisplayType(this.mySecrets[0].state.sentState);
        } else if (this.props.updatedSecrets[secretsArr[i].key]) {
          this.props.actions.setMSDisplayType(secretsArr[i].state.sentState);
          break;
        }
      }
    } else {
      this.props.actions.setMSDisplayType(this.mySecrets[0].state.sentState);
    }
  }

  componentWillMount() {
    this.props.actions.setAnimation(true);

    if (!this.props.userId) {
      AsyncStorage.getItem('userData').then((user_data_string) => {
        if (user_data_string) {
          let user_data = JSON.parse(user_data_string);
          this.props.actions.updateUserId(user_data.uid);
        } else {
          this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
        }
      });
    }

    if (this.props.route.secret && this.props.route.secret.key) {
      this.props.actions.pushUpdatedSecret(this.props.route.secret.key);
      this.secretsHash[this.props.route.secret.key] = true;
    }

    AsyncStorage.getItem('secrets').then((secrets_data_string) => {
      if (secrets_data_string) {
        let secrets_data = JSON.parse(secrets_data_string);
        let allSecrets = this.mySecrets.concat(secrets_data);
        let secretsHash = {}
        let dupsFilteredOut = allSecrets.filter((item) => {
            return secretsHash.hasOwnProperty(item.key) ? false : (secretsHash[item.key] = true);
        });
        this.initialDisplay(dupsFilteredOut);
        this.mySecrets = dupsFilteredOut;
        this.props.actions.setAnimation(false);
      } else if (!this.props.route.secret && !secrets_data_string) {
        this.props.actions.setMSDisplayType('NR');
        this.props.actions.setAnimation(false);
      }
    });
  }

  componentDidMount() {
    AsyncStorage.getItem('contacts').then((contacts_string) => {
      if (contacts_string) {
        this.contacts = JSON.parse(contacts_string);
      } else {
        this.contacts = [];
      }
    });
  }

  render() {
    let helperText;
    let currentSecrets = this.mySecrets.filter((item) => {
      return item.state.sentState === this.props.displaying;
    });
    let secretsList = this.listSecrets(currentSecrets);

    switch(this.props.displaying) {
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
                      <Text style={styles.helperText}>You dont have any secrets yet, would you like to make one?</Text>
                      <ArrowLink skipTo={() => this.props.navigator.push({name: 'SelectCategory'})}>Select Secret</ArrowLink>
                    </View>
    }
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableHighlight
                style={[styles.headerButton, styles.firstHeaderButton, this.props.displaying === "SO" ? styles.active : null]}
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('SO')} >
              <Text style={styles.headerButtonText}>Answered</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={[styles.headerButton, this.props.displaying === "QS" ? styles.active : null]}
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('QS')}>
              <Text style={styles.headerButtonText}>Sent</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={[styles.headerButton, this.props.displaying === "RR" ? styles.active : null]}
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('RR')}>
              <Text style={styles.headerButtonText}>Requested</Text>
            </TouchableHighlight>
            <TouchableHighlight
                style={[styles.headerButton, this.props.displaying === "CR" ? styles.active : null]}
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.setTab('CR')}>
              <Text style={styles.headerButtonText}>Not Sent</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.contentContainer}>
            <ActivityIndicator animationControl={this.props.animating}/>
            {secretsList[0] || this.props.animating ? helperText : <Text style={styles.helperText}>No secrets of this type yet</Text> }
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
    marginTop: 15,
    marginBottom: 5
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    userId: state.userId,
    displaying: state.mySecretsType,
    updatedSecrets: state.updatedSecrets,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySecrets);
