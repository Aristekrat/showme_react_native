'use strict';
 
import React from 'react';
import StylingGlobals from '../StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import TabBar from '../Components/TabBar.js';
import SendSecret from '../Globals/SendSecret.js';
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
 
class AskNumber extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      userPH: '',
      contacts: '',
    };
    uid: '';
    //this.privateSecrets = this.props.db.child('privateSecrets');
    //this.users = this.props.db.child('users');
    //this.phIndex = this.props.db.child('phoneNumberIndex');
    //this.currentSecret = this.props.route.cookieData;
  }

  componentWillMount() {
    //console.log(this.props.route.contacts); Getting it.
  }

  componentDidMount() {
    AsyncStorage.getItem('userData')
      .then((user_data_json) => {
        if (!user_data_json) {
          console.log("ERR - NO DATA");
        } else {
          let user_data = JSON.parse(user_data_json);
          this.uid = user_data.uid;
        }
    });
  }

  render() {
    /*
    let theAsk;
    let topMessage;
    let middleMessage;
    let bottomMessage;
    switch(this.state.informationNeeded) {
      case "ReceiverNumber":
        topMessage = <Text style={styles.prompt}>Choose who you want to send to...</Text>
        theAsk = <UserContacts ref="userContacts" />
        middleMessage = <Text style={styles.label}>You'll have a chance to review before you send</Text>
        bottomMessage = <Text style={styles.exclusive}>Show Me is exclusively available on iPhones</Text>
        break; 
      case "SenderNumber":
        topMessage = <Text style={styles.prompt}>Please enter your phone number</Text>
        theAsk = <TextInput 
                    style={styles.textInput}
                    onChangeText={(PH) => this.setState({userPH: PH})}
                    selectionColor={StylingGlobals.colors.navColor} />
        middleMessage = null;
        bottomMessage = <Text style={styles.exclusive}>Sorry, we will only need to do this once</Text>
        break;
    }
    */
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={styles.prompt}>Please enter your phone number</Text>
          <TextInput style={styles.textInput}
            onChangeText={(PH) => this.setState({userPH: PH})}
            selectionColor={StylingGlobals.colors.navColor} />
          <Text style={styles.exclusive}>Sorry, we will only need to do this once</Text>  
          <BigButton 
            do={() => SendSecret.lookup(this.refs.userContacts.state.ph, this.refs.userContacts.state.firstName, this.uid, this.props)}>
            Continue
          </BigButton>
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
  },
  userContacts: {
    marginTop: -20,
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
});

module.exports = AskNumber;