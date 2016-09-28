'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import BigButton from '../Components/BigButton.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
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
          <Image style={styles.heroImage} source={require("../img/show-me-skirt.png")} />
          <Text style={styles.header}>
            Show Me is Invitation Only
          </Text>
          <View>
            <BigButton do={() => this.props.navigator.push({name: 'SelectCategory'}) }>
              Enter Invitation
            </BigButton>
            <Text style={styles.paragraph}>Choose this if you already have your invitation code</Text>
          </View>
          <View style={styles.secondBlock}>
            <Text style={styles.paragraph}>
              You can also ask for an invitation
            </Text>
            <BigButton do={() => this.props.navigator.push({name: 'SelectCategory'}) }>
              Request Invitation
            </BigButton>
          </View>
        </ScrollView>
        
      </View>
    );
  }
}

/*
          <View style={styles.buttonContainer}>
            <TouchableHighlight 
                style={styles.button} 
                underlayColor={StylingGlobals.colors.accentColor} 
                onPress={() => this.props.navigator.push({name: 'ClaimSecret'}) } >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style={styles.button} 
                underlayColor={StylingGlobals.colors.accentColor}
                onPress={() => this.props.navigator.push({name: 'SelectCategory'}) }>
              <Text style={styles.buttonText}>No</Text>
            </TouchableHighlight>
          </View>

          <TabBar navigator={this.props.navigator} route={this.props.route} />
*/

const styles = StyleSheet.create({
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
    marginTop: 60,
  }
});

/*
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    margin: 15,
    padding: 15,
    width: 120,
    backgroundColor: StylingGlobals.colors.mainColor,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  bottomText: {
    marginLeft: 20,
    fontSize: 12,
  }
*/

module.exports = RegistrationInterim;
