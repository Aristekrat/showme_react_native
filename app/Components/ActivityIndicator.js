'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import {
  StyleSheet,
  ActivityIndicator,
  Text
} from 'react-native';

class ActivityIndicatorSM extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
        <ActivityIndicator
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

module.exports = ActivityIndicatorSM;
