import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

class ArrowLink extends React.Component {
  render() {
    return (
      <TouchableHighlight
          style={[styles.skipButton, this.props.extraStyling]} 
          underlayColor={StylingGlobals.colors.accentPressDown}
          onPress={this.props.skipTo} >
        <View style={styles.skipContainer}>
          <Text style={styles.skipText}>{this.props.children}</Text>
          <Image style={styles.skipRightArrow} source={require("../img/arrow-right.png")} />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  skipButton: {
    alignSelf: 'center',
    padding: 15,
  },
  skipContainer: {
    flexDirection: 'row',
  },
  skipText: {
    color: StylingGlobals.colors.mainColor,
  },
  skipRightArrow: {
    tintColor: StylingGlobals.colors.mainColor,
    width: 11,
    height: 11,
    marginTop: 3,
    marginLeft: 2,
  },
});

module.exports = ArrowLink;
