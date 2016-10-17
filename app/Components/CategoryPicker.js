'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import {
  StyleSheet,
  View,
  PickerIOS,
} from 'react-native';

var PickerItemIOS = PickerIOS.Item;

const CATEGORIES = ["Love", "Sex", "Social", "Funny", "Embarassing", "Past"]

class CategoryPicker extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      category: 'Social'
    } 
  }
  render () {
    return (
      <View style={styles.categoryPicker}>
        <PickerIOS
          selectedValue={this.state.category}
          onValueChange={(category) => this.setState({category})}>
          {CATEGORIES.map((category) => (
            <PickerItemIOS
              key={category}
              value={category}
              label={category} />
          ))}
        </PickerIOS>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  categoryPicker: {

  },
});

module.exports = CategoryPicker;