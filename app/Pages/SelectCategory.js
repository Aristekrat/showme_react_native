'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import Category from '../Components/Category.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import SModal from '../Components/SModal.js';
import CreateYourOwn from './CreateYourOwn.js';
import SelectSecret from './SelectSecret.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
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
  NetInfo,
} from 'react-native';

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
      'title': 'Past'
    }];
  }

  selectCategory (categoryName) {
    if (this.props.isConnected) {
      this.props.actions.toggleAnimation();
      this.props.navigator.push({
        name: 'SelectSecret',
        category: categoryName,
        contacts: this.contacts,
      });
    } else {
      this.props.actions.setError("Sorry, you are not connected to the internet.")
    }
  }

  sawIntro() {
    AsyncStorage.setItem('selectCategoryIntro', 'true');
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
    Utility.resetState(this.props.animating, this.props.error);

    if (this.props.route.modalText) {
      this.props.actions.setModalText(this.props.route.modalText);
    } else {
      AsyncStorage.getItem('selectCategoryIntro').then((hasBeenIntroducedString) => {
        if (!hasBeenIntroducedString) {
          this.props.actions.intro(false);
          this.props.actions.setModalText('Use this menu to create a new secret or select a premade secret')
        }
      });
    }

    if (this.props.route.refresh) {
      this.checkIfRemoteSecretsReceived();
    }

    const dispatchConnected = isConnected => this.props.actions.setIsConnected(isConnected);
    NetInfo.isConnected.fetch().then().done(() => {
      NetInfo.isConnected.addEventListener('change', dispatchConnected);
    });
  }

  componentDidMount() {
    if (this.props.route.modalText) {
      this.refs.smodal.setModalVisible(true);
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

    NetInfo.isConnected.fetch().then(isConnected => {
      this.props.actions.setIsConnected(isConnected);
    });
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ActivityIndicator animationControl={this.props.animating}/>
        {
          this.props.errorMessage ?
          <Text style={styles.error}>{this.props.errorMessage}</Text> :
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
        <SModal modalText={this.props.modalText} ref="smodal" />
        <TabBar
          navigator={this.props.navigator}
          route={this.props.route}
          db={this.props.db}
          introBadge={this.props.hasBeenIntroduced ? 0 : 1 }
          ref="tabbar"
          introPopup={this.props.hasBeenIntroduced ? null : () => {
              this.refs.smodal.setModalVisible(true);
              this.props.actions.intro(true);
              this.sawIntro();
            }
          }
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

ReactMixin(SelectCategory.prototype, ReactTimer);

const mapStateToProps = (state) => {
  return {
    hasBeenIntroduced: state.selectCategoryIntro,
    modalText: state.modalText,
    animating: state.isAnimating,
    errorMessage: state.error,
    isConnected: state.isConnected,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCategory);
