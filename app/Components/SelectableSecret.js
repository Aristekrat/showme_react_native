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
              source={require("../img/right-arrow.png")}
              style={[StylingGlobals.rightArrow, styles.secretArrow]} />      
          </View>
        </TouchableHighlight>
        <View style={styles.voteContainer}>
          <TouchableHighlight style={styles.upVote} onPress={this.props.upvote} underlayColor={StylingGlobals.colors.accentPressDown}>
            <Image 
              source={require("../img/up.png")}
              style={[styles.voteImg, styles.upvoteImg]} />   
          </TouchableHighlight>
          <TouchableHighlight style={styles.downVote} onPress={this.props.downvote} underlayColor={StylingGlobals.colors.accentPressDown}>
            <Image 
              source={require("../img/down.png")}
              style={[styles.voteImg, styles.upvoteImg]} />   
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
      padding: 10,
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
      opacity: 0.7,
    },
    upVote: {
      //flex: 1,
      width: 70,
      //paddingLeft: 10,
    },
    upvoteImg: {
      alignSelf: 'center'
    },
    downVote: {
      //flex: 1,
      width: 70,
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