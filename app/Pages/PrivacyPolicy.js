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

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.ppContainer}>
          <Text style={styles.ppParagraph}>We will keep your personal data safe, yo</Text>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ppContainer: {
    padding: 8,
  },
  ppParagraph: {
    fontSize: 14,
  }
});

module.exports = PrivacyPolicy;
