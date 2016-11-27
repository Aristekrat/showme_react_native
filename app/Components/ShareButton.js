'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image
} from 'react-native';

class ShareButton extends React.Component {
  render(){
    return (
      <TouchableHighlight style={styles.shareButton} underlayColor={StylingGlobals.colors.pressDown}>
        <View style={styles.shareCategory}>
          <Image 
            source={this.props.imgSource}
            style={styles.shareButtonIcon} />
          <Text style={styles.shareButtonText}>
            {this.props.shareType}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  shareButton: {
    backgroundColor: StylingGlobals.colors.mainColor,
    width: 320,
    margin: 30,
    padding: 10,
  },
  shareCategory: {
    flex: 1,
    flexDirection: 'row',
  },
  shareButtonIcon: {
    width: 35,
    height: 35,
    margin: 5,
    tintColor: '#fff',
  }, 
  shareButtonText: {
    color: '#fff',
    fontSize: 35,
    textAlign: 'center',
    marginLeft: 25,
    marginTop: 1,
  }
});

module.exports = ShareButton;