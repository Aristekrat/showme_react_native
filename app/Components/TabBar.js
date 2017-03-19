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
      case "SelectSecret":
      case "ShareSecret":
      case "SecretCode":
        this.state.selectedTab = 'tabTwo';
        break;
      case "CreateYourOwn":
        this.state.selectedTab = 'tabThree';
        break;
      case "ClaimSecret":
        this.state.selectedTab = 'tabFour';
        break;
      case "MyAccount":
      case "SignIn":
      case "Register":
      case "Gateway":
      case "RegistrationInterim":
      case "PrivacyPolicy":
      case "ChangeUserName":
        this.state.selectedTab = 'tabFive';
        break;
    }
  }

  tabFiveRoute() {
    if (Utility.authStatus && Utility.isAnonymous) {
      return "Register";
    } else if (Utility.authStatus && !Utility.isAnonymous) {
      return "MyAccount";
    } else {
      return "SignIn"
    }
  }

  tabFiveName() {
    if (Utility.authStatus && Utility.isAnonymous) {
      return "Register";
    } else if (Utility.authStatus && !Utility.isAnonymous) {
      return "My Account";
    } else {
      return "Sign In"
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
        name: 'CreateYourOwn'
      })
    } else if (tabId === "tabFour") {
      this.props.navigator.push({
        name: 'ClaimSecret'
      })
    } else if (tabId === "tabFive") {
      this.props.navigator.push({
        name: this.tabFiveRoute()
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
          barTintColor={'#fffdfd'}>
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
              title={"Select New"}
              icon={require('../img/tabicon-new.png')}
              style={styles.tabItem}
              badge={this.props.introBadge ? this.props.introBadge : null}>
                <View></View>
            </TabBarIOS.Item>

            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabThree'}
              onPress={() => this.setTab('tabThree')}
              title={""}
              icon={require('../img/tabicon-create.png')}
              style={styles.tabItem}>
                <View></View>
            </TabBarIOS.Item>

            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabFour'}
              onPress={() => this.setTab('tabFour')}
              title={"Claim"}
              icon={require('../img/tabicon-claim.png')}
              style={styles.tabItem}>
                <View></View>
            </TabBarIOS.Item>

            <TabBarIOS.Item
              selected={this.state.selectedTab === 'tabFive'}
              onPress={() => this.setTab('tabFive')}
              title={this.tabFiveName()}
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
  tabItem: {

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
