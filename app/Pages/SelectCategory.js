'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Category from '../Components/Category.js';
import SModal from '../Components/SModal.js';
import CreateYourOwn from './CreateYourOwn.js';
import SelectSecret from './SelectSecret.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  AsyncStorage,
  TouchableHighlight, 
} from 'react-native';

class SelectCategory extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hasBeenIntroduced: true,
    };
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
  }

  sawIntro() {
    AsyncStorage.setItem('hasBeenIntroduced', 'true');
  }

  componentWillMount() {
    AsyncStorage.getItem('hasBeenIntroduced').then((hasBeenIntroducedString) => {
      if (!hasBeenIntroducedString) {
        this.setState({hasBeenIntroduced: false});
      }
    })
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.content}>
          <Category 
            categoryName={this.categories[0].title} 
            imgSource={require("../img/caticon-create-your-own.png")} // 'emails9'
            elsewhere={() => {this.props.navigator.push({name: 'CreateSecret'})}} />
          <Category 
            categoryName={this.categories[1].title} 
            imgSource={require("../img/caticon-love.png")} // 'heart296'
            elsewhere={this.selectThisCategory.bind(this, this.categories[1].title, SelectSecret, this.props.navigator)} />
          <Category 
            categoryName={this.categories[2].title} 
            imgSource={require("../img/caticon-sex.png")} // 'femenine1'
            elsewhere={this.selectThisCategory.bind(this, this.categories[2].title, SelectSecret)} />
          <Category 
            categoryName={this.categories[3].title} 
            imgSource={require("../img/caticon-social.png")} // group12
            elsewhere={this.selectThisCategory.bind(this, this.categories[3].title, SelectSecret)} />
          <Category 
            categoryName={this.categories[4].title} 
            imgSource={require("../img/caticon-funny.png")} // laughing
            elsewhere={this.selectThisCategory.bind(this, this.categories[4].title, SelectSecret)} />
          <Category 
            categoryName={this.categories[5].title} 
            imgSource={require("../img/caticon-embarassing.png")} // wound4
            elsewhere={this.selectThisCategory.bind(this, this.categories[5].title, SelectSecret)} />
          <Category 
            categoryName={this.categories[6].title} 
            imgSource={require("../img/caticon-past.png")} // music-player17
            elsewhere={this.selectThisCategory.bind(this, this.categories[6].title, SelectSecret)} />
        </ScrollView>
        <SModal modalText={"Use this menu to create a new secret or select a premade secret"} ref="smodal" />
        <TabBar 
          navigator={this.props.navigator} 
          route={this.props.route} 
          db={this.props.db}
          introBadge={this.state.hasBeenIntroduced ? 0 : 1 }
          ref="tabbar"
          introPopup={this.state.hasBeenIntroduced ? null : () => { 
              this.refs.smodal.setModalVisible(true); 
              this.setState({hasBeenIntroduced: true}); 
              this.sawIntro();
            } 
          }
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  content: {
    
  },
});

module.exports = SelectCategory;
