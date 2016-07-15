'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import Utility from '../Globals/UtilityFunctions.js';
import {
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  AsyncStorage
} from 'react-native';

class TabBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notifications: 0,
    }
    this.setActiveTab();
  }

  setActiveTab() {
    switch(this.props.route.name) {
      case "MySecrets":
        this.state.selectedTab = 'tabOne';
        break;
      case "SelectCategory":
      case "CreateSecret":
      case "SelectSecret":
      case "ShareSecret":
        this.state.selectedTab = 'tabTwo';
        break;
      case "MyAccount":
      case "SignIn":
      case "Registration":
        this.state.selectedTab = 'tabThree';
        break; 
    }
  }

  setTab(tabId, navigate) {
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

  componentWillMount() {
    this.setActiveTab();
  }

  componentDidMount() {
    AsyncStorage.getItem('notificationCount').then((notificationCount) => {
      this.setState({notifications: notificationCount});
    });
  }

  render(){
    return (
      <View style={styles.tabContainer}>
        <TabBarIOS  
          tintColor={StylingGlobals.colors.mainColor}
          barTintColor={StylingGlobals.colors.accentPressDown}>
            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabOne'}
              onPress={() => this.setTab('tabOne', this.props.tabOne)}
              title={"My Secrets"}
              icon={require('../img/envelope76.png')}
              style={styles.tabItem}
              badge={this.state.notifications !== '0' ? this.state.notifications : null} >
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
              title={Utility.authStatus ? "My Account" : "Sign In" }
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
    borderTopColor: StylingGlobals.colors.navColor,
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
