'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import BigButton from '../Components/BigButton.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import ArrowLink from '../Components/ArrowLink.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
} from 'react-native';

class RegistrationInterim extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={StylingGlobals.header}>Do you have a secret code?</Text>
          <Text style={StylingGlobals.paragraph}>You would have got this in a text from a friend</Text>
          <View style={styles.buttonContainer}>
            <TouchableHighlight onPress={() => this.props.navigator.push({name: 'ClaimSecret'}) } style={styles.button}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.props.navigator.push({name: 'SelectCategory'}) } style={styles.button}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

/* // Invitation only code, not currently used
          <Image style={styles.heroImage} source={require("../img/show-me-skirt.png")} />
          <Text style={styles.header}>
            Show Me is Invitation Only
          </Text>
          <View>
            <BigButton do={() => this.props.navigator.push({name: 'ClaimSecret'}) }>
              Enter Invitation
            </BigButton>
            <Text style={styles.paragraph}>Choose this if you already have your invitation code</Text>
          </View>
          <View style={styles.secondBlock}>
            <Text style={styles.secondBlockParagraph}>
              You can also ask for an invitation:
            </Text>
            <ArrowLink skipTo={()=> this.switchToRegister()}>Request Invitation</ArrowLink>
          </View>

  heroImage: {
    width: 185,
    height: 185,
    alignSelf: 'center',
    margin: 0,
  },
  header: {
    marginTop: 0,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    marginLeft: 30,
  },
  secondBlock: {
    marginTop: 15,
  },
  secondBlockParagraph: {
    textAlign: 'center',
  }
*/

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: StylingGlobals.colors.mainColor,
    padding: 12,
    width: 110,
    marginRight: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  }
});

module.exports = RegistrationInterim;
