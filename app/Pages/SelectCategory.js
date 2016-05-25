'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Category from '../Components/Category.js';
import CreateYourOwn from './CreateYourOwn.js';
import SelectSecret from './SelectSecret.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight
} from 'react-native';

/*
var React = require('react-native');
var Category = require('../Components/Category.js');
var CreateYourOwn = require('./CreateYourOwn.js');
var SelectSecret = require('./SelectSecret.js');
var TabBar = require('../Components/TabBar.js');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight
} = React;
*/

class SelectCategory extends React.Component {
  constructor(props){
    super(props);
    this.categories = [{
      'title': 'Create Your Own'
    }, {
      'title': 'Love'
    }, {
      'title': 'Sex'
    }, {
      'title': 'Social'
    }, {
      'title': 'Funny'
    }, {
      'title': 'Embarassing'
    }, {
      'title': 'From Your Past'
    }];
  }
  selectThisCategory (categoryName, viewName) {
    this.props.navigator.push({
      name: 'SelectSecret',
      category: categoryName
    })
    /*this.props.navigator.push({
      component: viewName,
      title: categoryName
    })*/
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.content}>
          <Category 
            categoryName={this.categories[0].title} 
            imgSource={require("../img/emails9.png")} 
            elsewhere={() => {this.props.navigator.push({name: 'CreateSecret'})}} />
          <Category 
            categoryName={this.categories[1].title} 
            imgSource={require("../img/heart296.png")} 
            elsewhere={this.selectThisCategory.bind(this, this.categories[1].title, SelectSecret, this.props.navigator)} />
          <Category 
            categoryName={this.categories[2].title} 
            imgSource={require("../img/femenine1.png")}
            elsewhere={this.selectThisCategory.bind(this, this.categories[2].title, SelectSecret)} />
          <Category 
            categoryName={this.categories[3].title} 
            imgSource={require("../img/group12.png")} 
            elsewhere={this.selectThisCategory.bind(this, this.categories[3].title, SelectSecret)} />
          <Category 
            categoryName={this.categories[4].title} 
            imgSource={require("../img/laughing.png")}
            elsewhere={this.selectThisCategory.bind(this, this.categories[4].title, SelectSecret)} />
          <Category 
            categoryName={this.categories[5].title} 
            imgSource={require("../img/wound4.png")}
            elsewhere={this.selectThisCategory.bind(this, this.categories[5].title, SelectSecret)} />
          <Category 
            categoryName={this.categories[6].title} 
            imgSource={require("../img/music-player17.png")}
            elsewhere={this.selectThisCategory.bind(this, this.categories[6].title, SelectSecret)} />
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  content: {
    
  }
});

module.exports = SelectCategory;
