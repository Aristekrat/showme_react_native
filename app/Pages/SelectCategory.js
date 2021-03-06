'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Category from '../Components/Category.js';
import SModal from '../Components/SModal.js';
import CreateYourOwn from './CreateYourOwn.js';
import SelectSecret from './SelectSecret.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
import GetSecrets from '../Globals/GetSecrets.js';
import Contacts from 'react-native-contacts';

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
      'title': 'Past'
    }];
  }
  
  selectCategory (categoryName) {
    this.props.navigator.push({
      name: 'SelectSecret',
      category: categoryName,
      contacts: this.contacts,
    });
  }

  sawIntro() {
    AsyncStorage.setItem('hasBeenIntroduced', 'true');
  }

  // Largely duplicated in index, need to figure out how to split this guy off while retaining the setTimeout core
  checkIfRemoteSecretsReceived() {
    this.setTimeout (
      () => {
        if (GetSecrets.remoteSecrets.length === GetSecrets.totalResults) {
          GetSecrets.pushSecretsToAsyncStore();
        } else {
          this.checkIfRemoteSecretsReceived();
        }
      },
      1000
    )
  }

  componentWillMount() {
    AsyncStorage.getItem('hasBeenIntroduced').then((hasBeenIntroducedString) => {
      if (!hasBeenIntroducedString) {
        this.setState({hasBeenIntroduced: false});
      }
    });

    if (this.props.route.refresh) {
      this.checkIfRemoteSecretsReceived();
    }
  }

  componentDidMount() {
    if (this.props.route.modalText) {
      this.refs.smodal.setModalVisible(true);
      this.setState({modalText: this.props.route.modalText});
    }
    // Check if this is in AsyncStorage. If not, make a call. If so, don't bother.
    Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
        this.contacts = 'PermissionDenied'
        AsyncStorage.setItem('contacts', JSON.stringify(this.contacts));
      } else {
        this.contacts = contacts;
        AsyncStorage.setItem('contacts', JSON.stringify(contacts));
      }
    });
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
            elsewhere={() =>  this.selectCategory(this.categories[1].title) } />
          <Category 
            categoryName={this.categories[2].title} 
            imgSource={require("../img/caticon-sex.png")} // 'femenine1'
            elsewhere={() =>  this.selectCategory(this.categories[2].title) } />
          <Category 
            categoryName={this.categories[3].title} 
            imgSource={require("../img/caticon-social.png")} // group12
            elsewhere={() =>  this.selectCategory(this.categories[3].title) } />
          <Category 
            categoryName={this.categories[4].title} 
            imgSource={require("../img/caticon-funny.png")} // laughing
            elsewhere={() =>  this.selectCategory(this.categories[4].title) } />
          <Category 
            categoryName={this.categories[5].title} 
            imgSource={require("../img/caticon-embarassing.png")} // wound4
            elsewhere={() =>  this.selectCategory(this.categories[5].title) } />
          <Category 
            categoryName={this.categories[6].title} 
            imgSource={require("../img/caticon-past.png")} // music-player17
            elsewhere={() =>  this.selectCategory(this.categories[6].title) } />
        </ScrollView>
        <SModal modalText={this.state.modalText} ref="smodal" />
        <TabBar 
          navigator={this.props.navigator} 
          route={this.props.route} 
          db={this.props.db}
          introBadge={this.state.hasBeenIntroduced ? 0 : 1 }
          ref="tabbar"
          introPopup={this.state.hasBeenIntroduced ? null : () => { 
              this.refs.smodal.setModalVisible(true); 
              this.setState({hasBeenIntroduced: true, modalText: 'Use this menu to create a new secret or select a premade secret'}); 
              this.sawIntro();
            } 
          }
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({

});

ReactMixin(SelectCategory.prototype, ReactTimer);

module.exports = SelectCategory;
