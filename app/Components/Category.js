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

class Category extends React.Component {
  render () {
    return (
      <TouchableHighlight onPress={this.props.elsewhere} underlayColor={StylingGlobals.colors.accentPressDown}>
      	<View style={styles.category}>
	        <Image
	          source={this.props.imgSource}
	          style={styles.icon} />
	        <Text style={styles.text}>
	          {this.props.categoryName}
	        </Text>
          <Image
            source={require("../img/arrow-right.png")}
            style={[StylingGlobals.rightArrow, styles.catArrow]} />
        </View>
      </TouchableHighlight>
    )
  }
}
// [styles.button, StylingGlobals.horizontalCenter]

var styles = StyleSheet.create({
  category: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
  },
  icon: {
    marginLeft: 10,
    width: 45,
    height: 45,
  },
  catArrow: {
    position: 'relative',
    right: 10,
    tintColor: '#333',
  }
});

export default Category;
