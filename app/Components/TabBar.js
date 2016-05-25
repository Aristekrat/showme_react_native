'use strict';

/*
var React = require('react-native');
var StylingGlobals = require('../StylingGlobals');

var {
  StyleSheet,
  Text,
  View,
  TabBarIOS
} = React; */

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  TabBarIOS
} from 'react-native';

class TabBar extends React.Component {
  constructor(props){
    super(props);
    switch(this.props.route.name) {
      case "MySecrets":
        this.state = {
          selectedTab: 'tabOne'
        }
        break;
      case "SelectCategory":
      case "CreateSecret":
      case "SelectSecret":
      case "ShareSecret":
        this.state = {
          selectedTab: 'tabTwo'
        }
        break;
      case "MyAccount":
      case "SignIn":
      case "Registration":
        this.state = {
          selectedTab: 'tabThree'
        }
        break; 
      default: 
        this.state = {};
        break;
    }
  }
  setTab(tabId, navigate){
    this.setState({selectedTab: tabId});
    if (tabId === "tabOne" && this.props.route.name !== 'MySecrets') {
      this.props.navigator.push({
        name: 'MySecrets'
      })
    } else if (tabId === "tabTwo" && this.props.route.name !== 'SelectCategory') {
      this.props.navigator.push({
        name: 'SelectCategory'
      })
    } else if (tabId === "tabThree") {
      this.props.navigator.push({
        name: true ? 'SignIn' : 'MyAccount'
      })
    }
  }
  _renderContent(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
  }
  render(){
    return (
      <View style={styles.tabContainer}>
        <TabBarIOS  
          tintColor="#fff"
          barTintColor={StylingGlobals.colors.mainColor}>
            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabOne'}
              onPress={() => this.setTab('tabOne', this.props.tabOne)}
              title={"My Secrets"}
              icon={require('../img/envelope76.png')}
              style={styles.tabItem}
              badge='3' >
                <View></View>
            </TabBarIOS.Item>
            
            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabTwo'}
              onPress={() => this.setTab('tabTwo', this.props.tabTwo)}
              title={"New"}
              icon={require('../img/romantic41.png')}
              style={styles.tabItem}>
                <View></View>
            </TabBarIOS.Item>

            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabThree'}
              onPress={() => this.setTab('tabThree', this.props.tabThree)}
              title={true ? "Sign In" : "My Account"}
              icon={require('../img/business64.png')}
              style={styles.tabItem}>
                <View></View>
            </TabBarIOS.Item>
          </TabBarIOS>
        </View>
    );
  }
}


var styles = StyleSheet.create({
  tabContainer: {
    height: 70, // Not possible to click on the nav bar items without this. 
    marginTop: 20,
  },
  tabItem: {
    height: 70,
  },
  viewItem: {
    backgroundColor: '#fff'
  },
  tabText: {
    color: '#fff',
  },

});

module.exports = TabBar;
