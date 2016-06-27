'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Secret from '../Components/MySecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
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
  constructor(props){
    super(props);
    this.state = {
      displaying: "",
      uid: "",
      animating: true,
    } 
    this.mySecrets = []
    this.users = this.props.db.child('users');
    this.privateSecrets = this.props.db.child('privateSecrets');
  }

  componentWillMount(){
    AsyncStorage.getItem('userData').then((user_data_json) => { // What to do if the system can't find any user data?
      let user_data = JSON.parse(user_data_json);
      user_data.secrets = {};
      
      // Lookup keys associated with user
      this.users.child(user_data.uid).child('secrets').once('value', (snapshot) => {
        var userSecrets = snapshot.val();
        var userKeys = Object.keys(userSecrets);
        var resultsCount = userKeys.length - 1;
        
        // Find all the secret entries
        userKeys.forEach((result, count) => {
          this.privateSecrets.child(result).on('value', (secret) => {
            var sv = secret.val()
            sv.state = userSecrets[result]; // Show state from the users table, not the secrets table
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
      })
    });
  }

  componentDidMount () {
    AsyncStorage.getItem('secrets').then((secrets_data_json) => {
      if (secrets_data_json) {
        let secrets_data = JSON.parse(secrets_data_json);
        this.listSecrets(secrets_data); // Pretty imperfect. Leaves the wheel spinning and doesn't do initial display properly. Come back to this.
      }
    })
  }

  // Needs to be moved to common utils
  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }

  initalDisplay() {
    if (this.mySecrets.length === 0) {
      // Pop a link over to secret select
      console.log("Improperly reached here");
    } else {
      // Probably want to refine this function to load the last / most updated, OK for now,
      this.setState({displaying: this.mySecrets[0].state})
    }
  }

  listSecrets (arrayOfSecrets) {
    let currentState = this.state.displaying;
    if (!arrayOfSecrets) {
      var arrayOfSecrets = this.mySecrets;
    }
    return arrayOfSecrets.map((item) => {
      if (item.state === currentState) {
        return (
          <Secret 
            author={item.askerName} 
            question={item.question} 
            answer={item.responderAnswer} 
            updateSecret={() => this.props.navigator.push({ name: 'YourAnswer', cookieData: item }) } />
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
    switch(this.state.displaying) {
      case "BR":
        helperText = null;
        break;
      case "QS":
      case "RR":
        helperText = <Text style={styles.helperText}>Tap to write your answer</Text>
        break;
      case "CR":
        helperText = <Text style={styles.helperText}>Tap to send</Text>
    }
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableHighlight 
                style={[styles.headerButton, styles.firstHeaderButton, this.state.displaying === "BR" ? styles.active : null]} 
                underlayColor={StylingGlobals.colors.accentColor} 
                onPress={() => this.setTab('BR')} >
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
            {this.listSecrets()}
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
