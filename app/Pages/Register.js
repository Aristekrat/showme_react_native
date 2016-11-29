'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ArrowLink from '../Components/ArrowLink.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import Utility from '../Globals/UtilityFunctions.js';
import GetSecrets from '../Globals/GetSecrets.js';
import { connect } from 'react-redux';
import actions from '../State/Actions/Actions';
import User from '../Globals/User';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  ScrollView,
  TextInput,
  AsyncStorage
} from 'react-native';

class Register extends Component {
  constructor(props){
    super(props);
    this.usersIndex = this.props.db.child('indexes').child('userIndex');
    this.users = this.props.db.child('users');
    this.userFunctions = new User(this.props.db, this.users, this.props.navigator);
  }

  registerUser() {
    this.props.actions.toggleAnimation();
    this.props.actions.removeError();
    let email = this.props.username.trim();

    this.props.db.createUser({
      email: email,
      password: this.props.password
    }, (error, userData) => {
      if (error) {
        this.userFunctions.errorHandler(error);
      } else {
        var t = Utility.escapeEmail(email)
        this.users.child(userData.uid).set({email: email, secrets: {} });
        this.usersIndex.child(t).set(true);
        this.userFunctions.login(email, this.props.password);
      }
    }) // End parent function
  }

  submitUser() {
    if (this.props.username !== '' && this.props.password !== '') {
      this.registerUser();
    } else {
      this.props.actions.setError('Please enter an email and password');
    }
  }

  forgot() {
    if (!this.props.username) {
      this.props.actions.setError('Please enter your email address');
    } else {
      this.userFunctions.forgotPassword(this.props.username);
    }
  }

  switchToLogin() {
    this.props.actions.removeError();
    this.props.navigator.push({name: 'SignIn'});
  }

  componentWillMount() {
    if (this.props.route.cookieData) {
      this.props.actions.updateUserId(this.props.route.cookieData);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator animationControl={this.props.animating}/>
        <ScrollView style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.textInput}
                ref="username"
                autoFocus={true}
                keyboardType={'email-address'}
                value={this.props.username}
                onEndEditing={(text) => {this.refs.password.focus()}}
                onChangeText={(username) => this.props.actions.updateUserId(username) }
                selectionColor={StylingGlobals.colors.mainColor} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.textInput}
              ref="password"
              onChangeText={(password) => this.props.actions.updatePassword(password) }
              secureTextEntry={true}
              selectionColor={StylingGlobals.colors.navColor} />
          </View>
          <TouchableHighlight
              style={styles.button}
              underlayColor={StylingGlobals.colors.pressDown}
              onPress={() => this.submitUser()}>
            <Text style={styles.buttonText}>{this.props.route.name === 'Register' ? 'Sign Up' : 'Sign In'}</Text>
          </TouchableHighlight>
          {
            this.props.errorMessage ?
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{this.props.errorMessage}</Text>
            </View>
            :
            null
          }
          {
            this.props.displaySkip ?
            <View style={styles.forgotPasswordBlock}>
              <ArrowLink skipTo={() => this.props.navigator.push({name: 'SelectCategory'})} >Skip</ArrowLink>
            </View>
            :
            <View style={styles.forgotPasswordBlock}>
              <ArrowLink skipTo={()=> this.forgot()}>Forgot Password</ArrowLink>
            </View>
          }
          {
            this.props.route.cookieData ?
            null
            :
            <View style={styles.switchBlock}>
              <ArrowLink skipTo={()=> this.switchToRegister()}>Login Instead</ArrowLink>
            </View>
          }
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: StylingGlobals.container,
  form: {
    marginTop: 50
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 7
  },
  label: {
    fontSize: 12,
    textAlign: 'left',
    margin: 15,
    width: 60,
  },
  textInput: {
    height: 40,
    padding: 2,
    marginTop: 4,
    marginBottom: 8,
    borderColor: '#eee',
    borderWidth: 1,
    width: 250,
    backgroundColor: '#fff'
  },
  button: {
  	padding: 10,
  	backgroundColor: StylingGlobals.colors.mainColor,
    marginTop: 14,
    width: 250,
    marginLeft: 90,
  },
  buttonText: {
    textAlign: 'center',
    color: StylingGlobals.colors.textColorOne,
  },
  forgotPasswordBlock: {
    marginTop: 15,
  },
  errorContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  errorText: {
    flex: 1,
    marginTop: 15,
    textAlign: 'center',
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    username: state.userId,
    password: state.password,
    errorMessage: state.error,
    displaySkip: state.displaySkip,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
