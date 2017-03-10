'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import BigButton from '../Components/BigButton.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import ArrowLink from '../Components/ArrowLink.js';
import Utility from '../Globals/UtilityFunctions.js';
import { connect } from 'react-redux';
import actions from '../State/Actions/Actions';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  TextInput,
  AsyncStorage,
} from 'react-native';

class ChangeUserName extends React.Component {
  constructor(props) {
    super(props);
    this.users = this.props.db.child('users');
  }

  lookUpUserName(uid) {
    this.users.child(uid).once('value', (snapshot) => {
      let userData = snapshot.val()
      let userName = userData.profileName;
      if (userName) {
        this.props.actions.updateFormInput(userName);
      } else {
        this.props.actions.updateFormInput("Anonymous");
      }
    });
  }

  // Needs success / error handling
  submitUserNameUpdate() {
    if (this.props.userId) {
      this.users.child(this.props.userId).child('profileName').set(this.props.userName);
      this.props.actions.setError("Successfully Updated");
    } else {
      this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to Sign In first'});
    }
  }

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error, this.props.userName);

    if (this.props.userId) {
      this.lookUpUserName(this.props.userId);
    } else {
      AsyncStorage.getItem('smUserData').then((user_data_string) => {
        if (user_data_string) {
          let userData = JSON.parse(user_data_string);
          this.props.actions.updateUserId(userData.uid);
          this.lookUpUserName(userData.uid);
        } else {
          this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to Sign In first'});
        }
      });
    }
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={StylingGlobals.header}>Your current user name:</Text>
          <TextInput
            style={styles.textInput}
            autoFocus={true}
            value={this.props.userName}
            onChangeText={(userName) => this.props.actions.updateFormInput(userName) }
            selectionColor={StylingGlobals.colors.mainColor} />
          <Text style={styles.explanatory}>Your friends will see this as your name on the app</Text>
          <BigButton do={() => this.submitUserNameUpdate()}>
            Update
          </BigButton>
          {
            this.props.error ? <Text style={styles.errorMessage}>{this.props.error}</Text> : null
          }
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 55,
    padding: 2,
    marginTop: 8,
    marginBottom: 8,
    borderColor: StylingGlobals.colors.textInputBorder,
    borderWidth: 1,
    width: 315,
    backgroundColor: '#fff',
    marginLeft: 30,
  },
  explanatory: {
    marginLeft: 30,
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: StylingGlobals.colors.mainColor,
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    userName: state.formInput,
    error: state.error,
    userId: state.userId,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUserName);
