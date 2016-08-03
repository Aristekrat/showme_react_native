'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

class Secret extends React.Component {
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
          <TouchableHighlight style={styles.upVote} onPress={this.props.upvote} underlayColor={StylingGlobals.colors.accentPressDown}>
            <Image 
              source={require("../img/arrow-up.png")}
              style={[styles.voteImg, styles.upvoteImg, this.props.vote === 'upvote' ? styles.active : null]} />   
          </TouchableHighlight>
          <TouchableHighlight style={styles.downVote} onPress={this.props.downvote} underlayColor={StylingGlobals.colors.accentPressDown}>
            <Image 
              source={require("../img/arrow-down.png")}
              style={[styles.voteImg, styles.upvoteImg, this.props.vote === 'downvote' ? styles.active : null]} />   
          </TouchableHighlight>
          <Text style={styles.count}>{this.props.count}</Text>
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
      paddingTop: 15,
      padding: 10,
      height: 50,
    },
    secretText: {
      fontSize: 12,
      color: '#444',
      paddingTop: 5,
      flex: 4,
    },
    secretArrow: {
    
    },
    voteContainer: {
      flexDirection: 'row',
      paddingBottom: 15,
      paddingTop: 5,
    },
    voteImg: {
      width: 20,
      height: 20,
      tintColor: StylingGlobals.colors.navColor,
      opacity: 0.5,
    },
    upVote: {
      width: 70,
    },
    upvoteImg: {
      alignSelf: 'center'
    },
    downVote: {
      width: 70,
    },
    active: {
      opacity: 1.0,
    },
    downvoteImg: {
      alignSelf: 'center'
    },
    count: {
      //paddingRight: 20,
      marginTop: 2,
      marginLeft: 15,
      fontSize: 12,
    },
});

module.exports = Secret;