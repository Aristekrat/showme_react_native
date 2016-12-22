'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import CategoryPicker from '../Components/CategoryPicker.js';
import GetSecrets from '../Globals/GetSecrets.js';
import Utility from '../Globals/UtilityFunctions.js';
import Contacts from 'react-native-contacts';
import actions from '../State/Actions/Actions';
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

import { connect } from 'react-redux';

class CreateYourOwn extends React.Component {
  constructor(props) {
    super(props);
    this.publicSecrets = this.props.db.child('publicSecrets');
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.answers = this.props.db.child('answers');
  }

  // sets success state after secret submission
  success(secretData) {
    this.props.actions.setAnimation(false);
    this.props.actions.removeError();
    this.props.actions.updateFormInput('');
    this.props.actions.submitSuccess(true);
    this.props.actions.submittedSecret(secretData);
  }

  pushToPrivateSecrets() {
    GetSecrets.pushPrivateSecret(this.props.text, this.props.userId, (psData) => {
      this.success(psData);
    }, () => {
      this.props.actions.setError("We're sorry, there was an error connecting to the server");
    })
  }

  // Pushes to public secrets DB collection & calls pushtoprivate if called with a true val in the first arg
  pushToPublicSecrets(notYet = false) {
    var voteData = {}
    voteData[this.props.userId] = 'upvote';
    let secretData = {text: this.props.text, category: this.refs.catPicker.state.category, score: 1, votes: voteData, '.priority': -1};
    var publicSecret = this.publicSecrets.child(this.refs.catPicker.state.category).push(secretData, (err) => {
      if (err) {
        this.props.actions.setError("We're sorry, there was an error connecting to the server");
      } else {
        notYet ? this.pushToPrivateSecrets() : this.success();
      }
    })
  }

  // An implementation function that calls either pushToPrivateSecrets or publicSecrets with pushToPrivate as a callback
  submitSecret() {
    if (this.props.text !== '') {
      this.props.actions.setAnimation(true);
      if (!this.props.public) {
        this.pushToPrivateSecrets();
      } else {
        this.pushToPublicSecrets(true);
      }
    } else {
      this.props.actions.setError("Please enter your question");
    }
  }

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error, this.props.text);

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
                onChangeText={(text) => this.props.actions.updateFormInput(text)}
                value={this.props.text}
              />
              { this.props.error ? <Text style={styles.errorText}>{this.props.error}</Text> : null }
          </View>
          <View style={styles.row}>
            <Text style={styles.publicExplanatory}>Let other people to use this question?
            { this.props.public ?
              ' Yes' :
              ' No'
            }
            </Text>
            <Switch
              onValueChange={() => this.props.actions.togglePublicSecret() }
              onTintColor={StylingGlobals.colors.pressDown}
              value={this.props.public}>
            </Switch>
          </View>
          { this.props.public ? // category picker for public secrets or nothing
            <View>
              <Text style={styles.label}>Category you would like to submit this secret to...</Text>
              <CategoryPicker ref="catPicker" />
            </View>
            :
            null
          }
          { // Success notification block or submit block
            this.props.submitSuccess ?
            <View>
              <Text style={styles.positiveNotification}>Success!</Text>
              <TouchableHighlight
                  style={styles.button}
                  underlayColor={StylingGlobals.colors.pressDown}
                  onPress={() => {this.props.navigator.push({name: 'ShareSecret', cookieData: this.props.submittedSecret, contacts: this.contacts})}}>
                  <View style={StylingGlobals.horizontalCenter}>
                    <Image
                      source={require("../img/send-secret.png")} style={styles.icon} />
                    <Text style={styles.buttonText}>Send Secret</Text>
                  </View>
              </TouchableHighlight>
              <Text style={styles.smallText}>- or -</Text>
              <TouchableHighlight
                  onPress={() => { this.props.actions.submitSuccess(false); } }
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
          <ActivityIndicator animationControl={this.props.animating} extraStyling={{height:0}}/>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

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
    height: 50,
    borderWidth: 1,
    borderColor: StylingGlobals.colors.textInputBorder,
    padding: 5,
  },
  label: {
    marginBottom: 3
  },
  publicExplanatory: {
    fontSize: 12,
    marginBottom: 4,
  },
  button: {
    backgroundColor: StylingGlobals.colors.mainColor,
    height: 55,
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
    fontSize: 15,
    marginTop: 4,
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

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    error: state.error,
    userId: state.userId,
    text: state.formInput,
    public: state.public,
    submitSuccess: state.submitSuccess,
    submittedSecret: state.submittedSecret,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateYourOwn);
