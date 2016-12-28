'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals.js';
import Utility from '../Globals/UtilityFunctions.js';
import actions from '../State/Actions/Actions';
import { connect } from 'react-redux';
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
    this.state = {} // selectedTab
  }

  setActiveTab() {
    switch(this.props.route.name) {
      case "MySecrets":
      case "YourAnswer":
        this.state.selectedTab = 'tabOne';
        break;
      case "SelectCategory":
      case "CreateYourOwn":
      case "SelectSecret":
      case "ShareSecret":
        this.state.selectedTab = 'tabTwo';
        break;
      case "ClaimSecret":
        this.state.selectedTab = 'tabThree';
        break;
      case "MyAccount":
      case "SignIn":
      case "Registration":
      case "Gateway":
        this.state.selectedTab = 'tabFour';
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
        name: 'ClaimSecret'
      })
    } else if (tabId === "tabFour") {
      this.props.navigator.push({
        name: Utility.authStatus ? 'MyAccount' : 'SignIn'
      })
    }
  }

  componentWillMount() {
    this.setActiveTab();
  }

  render() {
    return (
      <View style={styles.tabContainer}>
        <TabBarIOS
          tintColor={StylingGlobals.colors.mainColor}
          barTintColor={StylingGlobals.colors.accentPressDown}>
            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabOne'}
              onPress={() => this.setTab('tabOne')}
              title={"My Secrets"}
              icon={require('../img/tabicon-mysecret.png')}
              style={styles.tabItem}
              badge={this.props.notifications !== 0 ? this.props.notifications : null} >
                <View></View>
            </TabBarIOS.Item>

            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabTwo'}
              onPress={() => this.props.introPopup ? this.props.introPopup() : this.setTab('tabTwo')}
              title={"New Secret"}
              icon={require('../img/tabicon-new.png')}
              style={styles.tabItem}
              badge={this.props.introBadge ? this.props.introBadge : null}>
                <View></View>
            </TabBarIOS.Item>

            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabThree'}
              onPress={() => this.setTab('tabThree')}
              title={"Claim"}
              icon={require('../img/tabicon-claim.png')}
              style={styles.tabItem}>
                <View></View>
            </TabBarIOS.Item>

            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabFour'}
              onPress={() => this.setTab('tabFour')}
              title={Utility.authStatus ? "My Account" : "Sign In" }
              icon={require('../img/tabicon-signin.png')} // business64
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
    height: 50, // Not possible to click on the nav bar items without this.
    marginTop: 0,
    borderTopColor: StylingGlobals.colors.navColor,
  },
  viewItem: {
    backgroundColor: '#fff'
  },
  tabText: {
    color: '#fff',
  },
});

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
