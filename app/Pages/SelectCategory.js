'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Category from '../Components/Category.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import SModal from '../Components/SModal.js';
import CreateYourOwn from './CreateYourOwn.js';
import SelectSecret from './SelectSecret.js';
import GetSecrets from '../Globals/GetSecrets.js';
import actions from '../State/Actions/Actions';
import { connect } from 'react-redux';
import Contacts from 'react-native-contacts';
import Utility from '../Globals/UtilityFunctions';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native';

class SelectCategory extends React.PureComponent {
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

  componentWillMount() {
    Utility.resetState(this.props.animating, this.props.error);

    if (this.props.route.refresh) {
      GetSecrets.checkIfRemoteSecretsReceived(GetSecrets.writeRemoteSecretsToAsyncStore);
    }
  }

  componentDidMount() {
    if (this.props.route.modalText) {
      this.refs.smodal.setModalVisible(true);
    }

    // Check if this is in AsyncStorage. If not, make a call. If so, don't bother.
    Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
        this.contacts = 'PermissionDenied'
        AsyncStorage.setItem('smContacts', JSON.stringify(this.contacts));
      } else {
        this.contacts = contacts;
        AsyncStorage.setItem('smContacts', JSON.stringify(contacts));
      }
    });

  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ActivityIndicator animationControl={this.props.animating}/>
        {
          this.props.error ?
          <Text style={styles.error}>{this.props.error}</Text> :
          null
        }
        <ScrollView style={styles.content}>
          <Category
            categoryName={this.categories[0].title}
            imgSource={require("../img/caticon-create-your-own.png")} // 'emails9'
            elsewhere={() => {this.props.navigator.push({name: 'CreateYourOwn'})}} />
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
        <SModal modalTitle={this.props.route.modalTitle} modalText={this.props.route.modalText} secondaryText={this.props.route.modalSecondaryText} ref="smodal" />
        <TabBar
          navigator={this.props.navigator}
          route={this.props.route}
          db={this.props.db}
          ref="tabbar"
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  error: {
    color: StylingGlobals.colors.mainColor,
    fontSize: 16,
    marginTop: 5,
    marginLeft: 15,
    marginBottom: 0,
  }
});

const mapStateToProps = (state) => {
  return {
    hasBeenIntroduced: state.selectCategoryIntro,
    modalText: state.modalText,
    animating: state.isAnimating,
    error: state.error,
    isConnected: state.isConnected,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCategory);
