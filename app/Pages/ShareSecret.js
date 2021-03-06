'use strict';
 
import React from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import UserContacts from '../Components/UserContacts.js';
import TabBar from '../Components/TabBar.js';
import SendSecret from '../Globals/SendSecret.js';
import GetSecrets from '../Globals/GetSecrets.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
// import Contacts from 'react-native-contacts';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  PickerIOS,
  AsyncStorage,
} from 'react-native';
 
// var Composer = require('NativeModules').RNMessageComposer;

class ShareSecret extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      ph: '',
      key: '',
      animating: false,
      error: '',
    };
    uid: '';
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
    this.answers = this.props.db.child('answers');
  }

  componentWillMount() {
    if (!this.props.route.cookieData) {
      this.setState({key: null});
    } else if (!this.props.route.cookieData.key) {
      this.setState({key: null});
    } else {
      this.setState({key: this.props.route.cookieData.key});
    };

    AsyncStorage.getItem('userData')
      .then((user_data_json) => {
        if (!user_data_json) {
          console.log("ERR - NO DATA");
        } else {
          let user_data = JSON.parse(user_data_json);
          this.uid = user_data.uid;
          if (this.props.route.publicSecret) {
            //this.pushPrivateSecret(user_data.uid);
            GetSecrets.pushPrivateSecret(this.props.route.cookieData.text, user_data.uid, (psData)=> {
              this.setState({key: psData.key});
            }, ()=> {
              this.setState({error: "We're sorry, there was an error connecting to the server"})
            })
          }
          SendSecret.lookUpSenderPH(user_data.uid);
        }
    });
  }

  // this.props.route.contacts === "PermissionDenied"
  render() {
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          {this.props.route.contacts === "PermissionDenied" ?
            <View>
              <Text style={styles.prompt}>Enter Phone Number</Text>
              <Text style={styles.label}>Enter the phone number of who you want to send this secret to</Text>
              <TextInput style={styles.textInput} 
                autoFocus={true}
                onChangeText={(ph) => this.setState({ph, error: ""})}/>
              <Text style={styles.label}>If you let ShowMe access contacts we can find it for you</Text>
              <BigButton do={() => { 
                  var filteredString = this.state.ph.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ').join('');
                  if (isNaN(parseInt(filteredString))) {
                    this.setState({error: "Please enter a number"});
                  } else if (filteredString.length < 9) {
                    this.setState({error: "Please enter a 10 digit number"});
                  } else {
                    this.setState({animating: true});
                    SendSecret.saveArgs(filteredString, "Anonymous", this.uid, this.state.key, this.props);
                  }
                }}>
                Continue
              </BigButton>
            </View>
            : 
            <View>
              <Text style={styles.prompt}>Choose who you want to send to...</Text>
              <UserContacts ref="userContacts" contacts={this.props.route.contacts}/>
              <Text style={styles.label}>You'll have a chance to review before you send</Text>
              <BigButton do={() => { 
                  this.setState({animating: true});
                  SendSecret.saveArgs(this.refs.userContacts.state.ph, this.refs.userContacts.state.firstName, this.uid, this.state.key, this.props); 
                }}>
                Continue
              </BigButton>
            </View>
          }
          <Text style={styles.exclusive}>Show Me is exclusively available on iPhones</Text>
          <ActivityIndicator animationControl={this.state.animating} />
          {
            this.state.error == "" ? null :
            <Text style={styles.error}>{this.state.error}</Text>
          }
          
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  prompt: {
    marginLeft: 30,
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  textInput: {
    height: 50,
    padding: 2,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 30,
    borderColor: '#eee',
    borderWidth: 1,
    width: 350,
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

module.exports = ShareSecret;