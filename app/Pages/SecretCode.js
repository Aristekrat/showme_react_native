'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import generator from '../Components/CodeGenerator/CodeGenerator.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import SendSecret from '../Globals/SendSecret.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import { connect } from 'react-redux';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions';
import Perf from 'react-addons-perf';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight,
  InteractionManager
} from 'react-native';

class SecretCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    }
    this.verificationIndex = this.props.db.child('indexes').child('verificationCodes');
    this.secretCodesIndex = this.props.db.child('indexes').child('pureInvitation');
  }

  generate() {
    let secretCode = generator(1,1,9);
    this.props.actions.updateSecretCode(secretCode.join(''));
  }

  checkLength(text) {
    if (text.length <= 9) {
      this.props.actions.setError("Secret codes must be longer than nine characters");
    } else {
      if (this.props.error) {
        this.props.actions.removeError();
      }
    }
  }

  createCode() {
    let psKey = this.props.route.key;
    if (this.props.code && this.props.code.length >= 9) {
      this.props.actions.setAnimation(true);
      this.secretCodesIndex.once('value', (snapshot) => {
        if (!snapshot.hasChild(this.props.code)) {
          this.verificationIndex.child(psKey).set(this.props.code);
          this.secretCodesIndex.child(this.props.code).set(true);
          SendSecret.router(this.props.code);
        } else {
          this.props.actions.setError("Please enter a different code");
          this.props.actions.setAnimation(false);
        }
      });
    } else {
      this.props.actions.setError("Please enter a valid secret code");
    }
  }

  componentWillMount() {
    this.generate();
    Utility.resetState(this.props.animating, this.props.error);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: true});
    });
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
        {
          !this.state.isReady ? <ActivityIndicator animationControl={true} /> :
          <View>
          <Text style={StylingGlobals.header}>
            Create a secret pass code
          </Text>
          <TextInput
            style={styles.codeInput}
            autoFocus={true}
            onChangeText={(text) => {this.props.actions.updateSecretCode(text); this.checkLength(text)} }
            value={this.props.code} />
          <Text style={styles.paragraph}>We will use this to securely identify your friend</Text>
          <BigButton do={() => this.createCode()}>
            Submit
          </BigButton>
          </View>
        }
        {
          this.props.error ?
          <Text style={styles.error}>{this.props.error}</Text> :
          null
        }
           <ActivityIndicator animationControl={this.props.animating} />
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  header: {
    marginLeft: 30,
    marginTop: 20,
    fontSize: 16,
    marginBottom: 5,
  },
  codeInput: {
    backgroundColor: '#fff',
    height: 45,
    borderWidth: 1,
    borderColor: '#eee',
    paddingLeft: 5,
    marginLeft: 30,
    marginRight: 30,
  },
  error: {
    marginLeft: 30,
    fontSize: 16,
    color: StylingGlobals.colors.pressDown,
    marginRight: 30,
  },
  paragraph: {
    marginTop: 5,
    marginLeft: 30,
    fontSize: 12,
  },
  or: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    code: state.secretCode,
    error: state.error,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecretCode);
