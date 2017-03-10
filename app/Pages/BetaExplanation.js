'use strict';

import React, { Component } from 'react';
import GetSecrets from '../Globals/GetSecrets.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import ArrowLink from '../Components/ArrowLink';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight
} from 'react-native';

import { connect } from 'react-redux';

class BetaExplanation extends React.Component {
  constructor(props) {
    super(props);
    this.invitationEmails = this.props.db.child('indexes').child('invitationEmails');
    this.state = {
      moreExplanation: false,
    }
  }

  submitEmail() {
    if (this.props.email && this.props.email !== '') {
      if (Utility.validateEmail(this.props.email)) {
        this.invitationEmails.push(this.props.email);
        this.props.actions.setError("Success! You're signed up to receive a secret code from ShowMe");
      } else {
        this.props.actions.setError("Please enter a valid email");
      }
    } else {
      this.props.actions.setError("Please enter your email address");
    }
  }

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error, this.props.email);
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Image style={styles.heroImage} source={require("../img/show-me-skirt.png")} />
          <Text style={styles.mainHeader}>
            Please enter your email
          </Text>
          <Text style={styles.header}>
            Youll receive an invitation when were ready to accept more users
          </Text>
          <TextInput
            style={StylingGlobals.textInput}
            autoFocus={true}
            onChangeText={(email) => this.props.actions.updateFormInput(email)}
            value={this.props.email}
            placeholder="Your email"
            ref="emailAddress"
            autoCapitalize="none"
            keyboardType={'email-address'} />
          <BigButton do={() => this.submitEmail()}>
            Submit
          </BigButton>
          {
            this.props.error ? <Text style={styles.error}>{this.props.error}</Text> : null
          }
          <ActivityIndicator animationControl={this.props.animating} />
          <ArrowLink skipTo={() => this.setState({moreExplanation: !this.state.moreExplanation}) }>Why does ShowMe require an invitation?</ArrowLink>
          {
            this.state.moreExplanation ?
            <Text style={styles.moreExplanation}>ShowMe is brand new and currently in Beta. We want to keep our userbase limited while we test new features.</Text> :
            null
          }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    error: state.error,
    email: state.emailAddress,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

var styles = StyleSheet.create({
  heroImage: {
    width: 205,
    height: 205,
    alignSelf: 'center',
    marginTop: -15,
    marginBottom: -15,
  },
  mainHeader: {
    marginLeft: 30,
    marginRight: 30,
    fontSize: 18,
    marginBottom: 7,
    textAlign: 'center',
    color: StylingGlobals.colors.mainColor,
    fontWeight: 'bold',
  },
  header: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 7,
    fontSize: 15,
  },
  error: {
    marginLeft: 30,
    fontSize: 16,
    marginRight: 30,
    textAlign: 'center',
  },
  moreExplanation: {
    marginLeft: 30,
    marginRight: 30,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BetaExplanation)
