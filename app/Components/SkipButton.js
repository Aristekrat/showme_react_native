import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

class SkipButton extends React.Component {
  render() {
    return (
      <TouchableHighlight 
          style={styles.skipButton} 
          underlayColor={StylingGlobals.colors.accentPressDown} 
          onPress={this.props.skipTo} >
        <View style={styles.skipContainer}>
          <Text style={styles.skipText}>Skip for Now</Text>
          <Image style={styles.skipRightArrow} source={require("../img/right-arrow.png")} />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  skipButton: {
    alignSelf: 'center',
    marginTop: 10,
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

module.exports = SkipButton;