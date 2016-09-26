'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import {
  StyleSheet,
  ActivityIndicatorIOS,
} from 'react-native';

class ActivityIndicator extends React.Component {
  render(){
    return (
        <ActivityIndicatorIOS
            animating={this.props.animationControl}
            style={this.props.animationControl ? [styles.centering, styles.withHeight] : [styles.centering, styles.withoutHeight]}
            size="large"
            color="#000"
        />
    );
  }
}

var styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  withHeight: {
    height: 50,
  },
  withoutHeight: {
    height: 0,
  }
});

module.exports = ActivityIndicator;
