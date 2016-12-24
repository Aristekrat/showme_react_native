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
    Utility.checkConnection();
    let email = this.props.email.trim();

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
        this.props.actions.toggleAnimation();
        this.userFunctions.login(email, this.props.password, true);
        //AsyncStorage.removeItem('secrets');
      }
    }) // End parent function
  }

  submitUser() {
    if (this.props.email !== '' && this.props.password !== '') {
      this.registerUser();
    } else {
      this.props.actions.setError('Please enter an email and password');
    }
  }

  forgot() {
    if (!this.props.email) {
      this.props.actions.setError('Please enter your email address');
    } else {
      this.userFunctions.forgotPassword(this.props.email);
    }
  }

  switchToLogin() {
    this.props.actions.removeError();
    this.props.navigator.push({name: 'SignIn'});
  }

  componentWillMount() {
    if (this.props.route.cookieData) {
      this.props.actions.updateFormInput(this.props.route.cookieData);
    }

    Utility.resetState(this.props.animating, this.props.error);
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
                ref="email"
                autoFocus={true}
                keyboardType={'email-address'}
                value={this.props.email}
                onEndEditing={(text) => {this.refs.password.focus()}}
                onChangeText={(email) => this.props.actions.updateFormInput(email) }
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
            <Text style={styles.buttonText}>Sign Up</Text>
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
            <View style={styles.skipBlock}>
              <ArrowLink skipTo={() => this.props.navigator.push({name: 'SelectCategory'})} >Skip Registration</ArrowLink>
            </View>
            :
            null
          }
          {
            this.props.route.cookieData ?
            null
            :
            <View style={styles.switchBlock}>
              <ArrowLink skipTo={()=> this.switchToLogin()}>Login Instead</ArrowLink>
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
    margin: 10,
    marginTop: 22,
    width: 55,
  },
  textInput: {
    height: 55,
    padding: 2,
    marginTop: 4,
    marginBottom: 8,
    borderColor: StylingGlobals.colors.textInputBorder,
    borderWidth: 1,
    width: 260,
    backgroundColor: '#fff'
  },
  button: {
  	padding: 10,
  	backgroundColor: StylingGlobals.colors.mainColor,
    marginTop: 14,
    width: 260,
    marginLeft: 75,
    height: 55,
  },
  buttonText: {
    textAlign: 'center',
    color: StylingGlobals.colors.textColorOne,
    marginTop: 6,
    fontSize: 16,
  },
  errorContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  errorText: {
    flex: 1,
    marginTop: 12,
    textAlign: 'center',
    color: StylingGlobals.colors.mainColor,
  },
  skipBlock: {
    marginTop: 12,
    width: 415,
  },
  switchBlock: {
    marginTop: 5,
    width: 415,
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    email: state.emailAddress,
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
