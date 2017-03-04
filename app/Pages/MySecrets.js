'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import GetSecrets from '../Globals/GetSecrets.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/MySecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import ArrowLink from '../Components/ArrowLink.js';
import SModal from '../Components/SModal.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  AsyncStorage,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux'

class MySecrets extends React.Component {
  constructor(props) {
    super(props);
    this.mySecrets = [];
    this.contacts = [];
    this.state = {
      isReady: false,
    }
  }

  // Determines the correct route for a secret to link to in listSecrets
  setUpdateSecretFunc(currentState, item) {
    GetSecrets.removeNotification(item.key);
    if (currentState === 'CR') {
      return this.props.navigator.push({ name: 'ShareSecret', cookieData: item, contacts: this.contacts });
    } else if (currentState === 'QS' || currentState === 'RR') {
      return this.props.navigator.push({ name: 'YourAnswer', cookieData: item })
    } else if (currentState === 'SO') {
      return null;
    }
  }

  displaySecrets (item) {
    return item.state.sentState === this.props.displaying;
  }

  // The main implementation function to actually wire secrets in the view
  listSecrets (arrayOfSecrets = this.mySecrets) {
    return arrayOfSecrets.map((item, index) => {
        let otherAnswer;
        if (item.answer) {
          otherAnswer = item.askerID === this.props.userId ? item.answer.responderAnswer : item.answer.askerAnswer;
        }
        return (
          <Secret
            author={item.askerName ? item.askerName : "Anonymous"}
            question={item.question}
            key={item.key}
            answer={item.answer ? 'A: ' + otherAnswer : null}
            answerNotification={item.answerNotification ? "They've answered! To see it, write your own answer now." : null}
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
    } else if (this.props.route.secret) {
      this.props.actions.setMSDisplayType(this.props.route.secret.state.sentState);
    } else if (this.props.updatedSecrets) { // Display column with an updated secret if there is one
      for (var i = 0; i <= secretsArr.length; i++) {
        if (i === secretsArr.length) {
          this.props.actions.setMSDisplayType(secretsArr[0].state.sentState);
        } else if (this.props.updatedSecrets[secretsArr[i].key]) {
          this.props.actions.setMSDisplayType(secretsArr[i].state.sentState);
          break;
        }
      }
    } else {
      this.props.actions.setMSDisplayType(secretsArr[0].state.sentState);
    }
  }

  componentWillMount() {
    // Utility.checkAllAuth();

    if (this.props.route.secret && this.props.route.secret.key) {
      this.props.actions.pushUpdatedSecret(this.props.route.secret.key);
    }

    AsyncStorage.getItem('secrets').then((secrets_data_string) => {
      if (secrets_data_string) {
        let secrets_data = JSON.parse(secrets_data_string);
        let allSecrets = this.mySecrets.concat(secrets_data);
        if (this.props.route.secret) {
          allSecrets.push(this.props.route.secret);
        }
        this.initialDisplay(allSecrets);
        this.mySecrets = allSecrets;
        if (this.props.updatedSecrets) {
          GetSecrets.reconcileUpdatedSecrets(this.mySecrets, this.props.updatedSecrets);
        }
      } else if (!this.props.route.secret && !secrets_data_string) {
        this.props.actions.setMSDisplayType('NR');
      } else if (this.props.route.secret) {
        this.mySecrets.push(this.props.route.secret);
        this.initialDisplay(this.mySecrets);
        if (this.props.updatedSecrets) {
          GetSecrets.reconcileUpdatedSecrets(this.mySecrets, this.props.updatedSecrets);
        }
      }
    });
  }

  componentDidMount() {
    if (this.props.route.modalText) {
      this.refs.smodal.setModalVisible(true);
    }

    if (!Utility.authStatus && this.props.securityLevel) {
        this.setTimeout (
          () => {
            this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to login first'});
          }, 0
        )
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: true});
    });

    this.setTimeout (
      () => {
        AsyncStorage.getItem('contacts').then((contacts_string) => {
          if (contacts_string) {
            this.contacts = JSON.parse(contacts_string);
          }
        });
      },
    )

    if (!this.props.userId) {
      AsyncStorage.getItem('userData').then((user_data_string) => {
        if (user_data_string) {
          let user_data = JSON.parse(user_data_string);
          this.props.actions.updateUserId(user_data.uid);
          Utility.getSecSetting(user_data.uid);
        } else {
          this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to sign in first'});
        }
      });
    } else {
      Utility.getSecSetting(this.props.userId);
    }
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
            {secretsList.length > 0 || this.props.displaying === 'NR' ? helperText : <Text style={styles.helperText}>No secrets of this type yet</Text> }
            {!this.state.isReady ? <ActivityIndicator animationControl={true}/> : secretsList}
          </View>
        </ScrollView>
        <SModal modalTitle={this.props.route.modalTitle} modalText={this.props.route.modalText} secondaryText={this.props.route.modalSecondaryText} ref="smodal" />
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
    securityLevel: state.securityLevel,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MySecrets);
