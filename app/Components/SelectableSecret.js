'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

class Secret extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.count
    };
  }

  updateCount(newNumber, action) {
    let key = this.props.id;
    if (!this.state[key] || this.state[key] !== action) {
      this.setState({count: newNumber, [key]: action});
    }
  }

  render() {
    return (
      <View style={styles.secretContainer}>
        <TouchableHighlight
          underlayColor={StylingGlobals.colors.accentPressDown} onPress={this.props.selectSecret}>
          <View style={styles.contentContainer}>
            <Text style={styles.secretText}>{this.props.secretText}</Text>
            <Image
              source={require("../img/arrow-right.png")}
              style={[StylingGlobals.rightArrow, styles.secretArrow]} />
          </View>
        </TouchableHighlight>
        <View style={styles.voteContainer}>
          <TouchableHighlight style={styles.upVote} onPress={() => { this.props.upvote(); this.updateCount(this.state.count + 1, 'upvote') } } underlayColor={StylingGlobals.colors.accentPressDown}>
            <Image
              source={require("../img/arrow-up.png")}
              style={[styles.voteImg, styles.upvoteImg, this.props.vote === 'upvote' ? styles.active : null]} />
          </TouchableHighlight>
          <TouchableHighlight style={styles.downVote} onPress={() => { this.props.downvote(); this.updateCount(this.state.count - 1, 'downvote') } } underlayColor={StylingGlobals.colors.accentPressDown}>
            <Image
              source={require("../img/arrow-down.png")}
              style={[styles.voteImg, styles.upvoteImg, this.props.vote === 'downvote' ? styles.active : null]} />
          </TouchableHighlight>
          <Text style={styles.count}>{this.state.count}</Text>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
    secretContainer: {
      borderBottomColor: '#FDDCDC',
      borderBottomWidth: 1,
      flexDirection: 'column'
    },
    contentContainer: {
      flexDirection: 'row',
      padding: 10,
      paddingTop: 25,
      paddingBottom: 25,
    },
    secretText: {
      fontSize: 15,
      color: '#444',
      paddingTop: 5,
      flex: 5,
    },
    secretArrow: {
      marginTop: 8,
      //tintColor: StylingGlobals.colors.navColor,
    },
    voteContainer: {
      flexDirection: 'row',
      paddingBottom: 10,
      paddingTop: 5,
    },
    voteImg: {
      width: 32,
      height: 32,
      tintColor: StylingGlobals.colors.navColor,
      opacity: 0.5,
    },
    upVote: {
      width: 70,
      height: 40,
    },
    upvoteImg: {
      alignSelf: 'center'
    },
    downVote: {
      width: 70,
      height: 40,
    },
    active: {
      opacity: 1.0,
    },
    downvoteImg: {
      alignSelf: 'center'
    },
    count: {
      //paddingRight: 20,
      marginTop: 8,
      marginLeft: 15,
      fontSize: 13,
    },
});

module.exports = Secret;
