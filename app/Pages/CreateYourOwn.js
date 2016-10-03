'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import CategoryPicker from '../Components/CategoryPicker.js';
import GetSecrets from '../Globals/GetSecrets.js';
import Contacts from 'react-native-contacts';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Image,
  TextInput,
  TouchableHighlight,
  PickerIOS,
  AsyncStorage
} from 'react-native';

class CreateYourOwn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      public: false,
      animating: false,
      text: '',
      submitSuccess: false,
      uid: '',
      submittedSecret: '',
      errorMessage: ''
    }
    this.publicSecrets = this.props.db.child('publicSecrets');
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.answers = this.props.db.child('answers');
  }

  // Adds a secret to the asyncstore after it is created, so it's visible in MySecrets
  // TODO Refactor to use the utility func
  addLocalSecret(localSecret) {
    localSecret.state = { answerState: 'NA', sentState: 'CR' },
    localSecret.answer = null;
    AsyncStorage.getItem('secrets').then((secrets_data_string) => {
      if (secrets_data_string) {
        let secrets_data = JSON.parse(secrets_data_string);
        secrets_data.push(localSecret);
        AsyncStorage.setItem('secrets', JSON.stringify(secrets_data));
      } else {
        AsyncStorage.setItem('secrets', localSecret);
      }
    });
  };

  // sets success state after secret submission
  success(secretData) {
    this.setState ({
      animating: !this.state.animating, 
      submitSuccess: true, 
      text: '', 
      submittedSecret: secretData,
      errorMessage: '',
    });
  }

  pushToPrivateSecrets() {
    GetSecrets.pushPrivateSecret(this.state.text, this.state.uid, (psData) => {
      this.success(psData);
    }, () => {
      this.setState({errorMessage: "We're sorry, there was an error connecting to the server"});
    })
  }

  // Pushes to public secrets DB collection & calls pushtoprivate if called with a true val in the first arg
  pushToPublicSecrets(notYet = false) {
    var voteData = {}
    voteData[this.state.uid] = 'upvote';
    let secretData = {text: this.state.text, category: this.refs.catPicker.state.category, score: 1, votes: voteData, '.priority': -1};
    var publicSecret = this.publicSecrets.child(this.refs.catPicker.state.category).push(secretData, (err) => {
      if (err) {
        this.setState({errorMessage: "We're sorry, there was an error connecting to the server"})
      } else {
        notYet ? this.pushToPrivateSecrets() : this.success();
      }
    })
  }

  // An implementation function that calls either pushToPrivateSecrets or publicSecrets with pushToPrivate as a callback
  submitSecret() {
    if (this.state.text !== '') {
      this.setState({animating: !this.state.animating});
      if (!this.state.public) {
        this.pushToPrivateSecrets();
      } else {
        this.pushToPublicSecrets(true);
      }
    } else {
      this.setState({errorMessage: 'Please enter your question'})
    }
  }

  clearErrorMessage() {
    if (this.state.errorMessage) {
      this.setState({errorMessage: ''})
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('userData').then((user_data_string) => {
      if (user_data_string) {
        let user_data = JSON.parse(user_data_string); 
        this.setState({uid: user_data.uid});
      }
    });
  }

  componentDidMount() {
    // Check if this is in AsyncStorage. If not, make a call. If so, don't bother.
    Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
        this.contacts = 'PermissionDenied'
        AsyncStorage.setItem('contacts', JSON.stringify(this.contacts));
      } else {
        this.contacts = contacts;
        AsyncStorage.setItem('contacts', JSON.stringify(contacts));
      }
    });
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>Secret Question</Text>
            <TextInput
                style={styles.textInput}  
                autoFocus={true}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
              />
              { this.state.errorMessage ? <Text style={styles.errorText}>{this.state.errorMessage}</Text> : null }
          </View>
          <View style={styles.row}>
            <Text style={styles.publicExplanatory}>Allow other people to use this question? 
            { this.state.public ?
              ' Yes' : 
              ' No'
            }
            </Text>
            <Switch 
              onValueChange={() => this.setState({public: !this.state.public})} 
              onTintColor={StylingGlobals.colors.pressDown}
              value={this.state.public}>
            </Switch>
          </View>
          { this.state.public ? // category picker for public secrets or nothing
            <View>
              <Text style={styles.label}>Category you would like to submit this secret to...</Text>
              <CategoryPicker ref="catPicker" />
            </View> 
            : 
            null
          }
          { // Success notification block or submit block
            this.state.submitSuccess ? 
            <View>
              <Text style={styles.positiveNotification}>Success!</Text>
              <TouchableHighlight 
                  style={styles.button} 
                  underlayColor={StylingGlobals.colors.pressDown} 
                  onPress={() => {this.props.navigator.push({name: 'ShareSecret', cookieData: this.state.submittedSecret, contacts: this.contacts})}}>
                  <View style={StylingGlobals.horizontalCenter}>
                    <Image 
                      source={require("../img/send-secret.png")} style={styles.icon} /> 
                    <Text style={styles.buttonText}>Send Secret</Text>
                  </View>
              </TouchableHighlight>
              <Text style={styles.smallText}>- or -</Text>
              <TouchableHighlight 
                  onPress={() => this.setState({submitSuccess: false})}
                  underlayColor={StylingGlobals.colors.accentPressDown}> 
                 <Text style={styles.linkStyling}>Make Another</Text>
              </TouchableHighlight>
            </View>
            :
            <TouchableHighlight 
              style={[styles.button, StylingGlobals.horizontalCenter]} 
              underlayColor={StylingGlobals.colors.pressDown} 
              onPress={() => this.submitSecret()}>
             <Text style={styles.buttonText}>Create Your Secret</Text>
          </TouchableHighlight>
          }
          <ActivityIndicator animationControl={this.state.animating} extraStyling={{height:0}}/>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
} // original img name: game67

var styles = StyleSheet.create({
  pageContainer: StylingGlobals.container,
  form: {
    padding: 20,
  },
  row: {
    marginBottom: 20
  },
  textInput: {
    backgroundColor: '#fff',
    height: 40,
    borderWidth: 1,
    borderColor: '#eee',
    paddingLeft: 5,
  },
  label: {
    marginBottom: 3
  },
  publicExplanatory: {
    fontSize: 11,
    marginBottom: 4,
  },
  button: {
    backgroundColor: StylingGlobals.colors.mainColor,
    height: 45,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    tintColor: '#fff',
    width: 22,
    height: 22,
    marginRight: 8,
  },
  errorText: {
    color: StylingGlobals.colors.mainColor,
  },
  positiveNotification: {
    textAlign: 'center',
    margin: 5,
    color: StylingGlobals.colors.pressDown,
    fontSize: 20,
  }, 
  smallText: {
    color: StylingGlobals.colors.textColorTwo,
    textAlign: 'center',
    margin: 10,
    fontSize: 10,
  },
  linkStyling: {
    color: StylingGlobals.colors.pressDown,
    textAlign: 'center',
  }
});

module.exports = CreateYourOwn;