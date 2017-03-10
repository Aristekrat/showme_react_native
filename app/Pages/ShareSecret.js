'use strict';

import React from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import UserContacts from '../Components/UserContacts.js';
import TabBar from '../Components/TabBar.js';
import SendSecret from '../Globals/SendSecret.js';
import GetSecrets from '../Globals/GetSecrets.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import actions from '../State/Actions/Actions';
import { connect } from 'react-redux';
import Utility from '../Globals/UtilityFunctions.js';
import Contacts from 'react-native-contacts';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  PickerIOS,
  AsyncStorage,
  InteractionManager,
} from 'react-native';

class ShareSecret extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isReady: false,
    }
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.answers = this.props.db.child('answers');
  }

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error);

    if (this.props.route.cookieData && this.props.route.cookieData.key) {
      this.props.actions.updateSecretKey(this.props.route.cookieData.key);
    };

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
  }

  componentDidMount() {
    if (!Utility.authStatus) {
      this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to login first'});
    } else {
      InteractionManager.runAfterInteractions(() => {
        this.setState({isReady: true});
      });
    }
  }

  render() {
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          {!this.state.isReady ? <ActivityIndicator animationControl={true}/> :
          <View>
          { this.props.route.contacts === "PermissionDenied" || !this.props.contactsPermission ?
            <View>
              <Text style={styles.prompt}>Enter your friends Phone Number</Text>
              <TextInput style={styles.textInput}
                autoFocus={true}
                onChangeText={(phoneNumber) => {
                  this.props.actions.updatePhoneNumber(phoneNumber);
                } }/>
              <Text style={styles.label}>If you let ShowMe access contacts we can find it for you</Text>
              <BigButton do={() => {
                  var filteredString = this.state.ph.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ').join('');
                  if (isNaN(parseInt(filteredString))) {
                    this.props.actions.setError("Please enter a number");
                  } else if (filteredString.length < 9) {
                    this.props.actions.setError("Please enter a 10 digit number");
                  } else {
                    this.props.actions.toggleAnimation();
                    SendSecret.saveArgs(filteredString, "Anonymous", this.props.userId, this.props.secretKey, this.props);
                  }
                }}>
                Continue
              </BigButton>
            </View>
            :
            <View>
              <Text style={StylingGlobals.header}>Choose who you want to send to...</Text>
              <UserContacts contacts={this.props.route.contacts}/>
              <Text style={styles.label}>You will have a chance to review before you send</Text>
              <BigButton do={() => {
                  this.props.actions.toggleAnimation();
                  SendSecret.saveArgs(this.props.phoneNumber, this.props.firstName, this.props.userId, this.props.secretKey, this.props);
                }}>
                Continue
              </BigButton>
            </View>
          }
          </View>
          }
          {!this.state.isReady ? null : <Text style={styles.exclusive}>Show Me is exclusively available on iPhones</Text>}
          <ActivityIndicator animationControl={this.props.animating} />
          {
            this.props.error ? <Text style={styles.error}>{this.props.error}</Text> : null
          }
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
};

ReactMixin(ShareSecret.prototype, ReactTimer);

var styles = StyleSheet.create({
  prompt: {
    width: 300,
    marginLeft: 30,
    fontSize: 16,
    marginTop: 25,
    marginBottom: 5,
  },
  textInput: {
    height: 50,
    padding: 2,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 30,
    borderColor: '#eee',
    borderWidth: 1,
    width: 315,
    backgroundColor: '#fff'
  },
  label: {
    marginLeft: 30,
    fontSize: 12,
  },
  exclusive: {
    marginLeft: 30,
    fontSize: 12,
  },
  error: {
    marginLeft: 30,
    color: StylingGlobals.colors.pressDown,
    marginTop: 12,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    error: state.error,
    contactsPermission: state.contactsPermission,
    phoneNumber: state.phoneNumber,
    secretKey: state.secretKey,
    firstName: state.firstName,
    userId: state.userId,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareSecret);
