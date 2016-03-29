/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 **/
'use strict';

var React = require('react-native');
var SelectCategory = require('./app/Pages/SelectCategory.js');
var SelectSecret = require('./app/Pages/SelectSecret.js');
var ShareSecret = require('./app/Pages/ShareSecret.js');
var MySecrets = require('./app/Pages/MySecrets.js');
var MyAccount = require('./app/Pages/MyAccount.js');
var CreateYourOwn = require('./app/Pages/CreateYourOwn.js');
var SignIn = require('./app/Pages/SignIn.js');
var SimpleButton = require('./app/Components/SimpleButton');
var StylingGlobals = require('./app/StylingGlobals');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TabBarIOS,
  Image,
  Navigator,
  TouchableHighlight,
  ListView,
} = React;

//const Firebase = require('firebase');
//const FirebaseURL = 'https://glaring-torch-4659.firebaseio.com/';

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    switch (route.name) {
      case 'MySecrets':
      case 'SelectCategory':
      case 'SelectSecret':
      case 'ShareSecret':
      case 'CreateSecret':
      case 'MySecrets':
      case 'MyAccount':
      case 'SignIn':
      case 'Registration':
        return (
          <TouchableHighlight onPress={() => navigator.pop()} underlayColor={'transparent'}>
            <Image 
              source={require("./img/left207.png")}
              style={styles.navBarRightImage} />
          </TouchableHighlight>
        );
      default:
        return null;
    }
  },

  RightButton: function(route, navigator, index, navState) {
    switch (route.name) {
      default:
        return (
          <Text></Text>
          /*<TouchableHighlight style={styles.navBarRightButton} underlayColor={'transparent'}>
            <Image 
              source={require("./img/show8.png")}
              style={styles.navBarRightImage} />
          </TouchableHighlight>*/
        );
    }
  },

  Title: function(route, navigator, index, navState) {
    switch (route.name) {
      case 'MySecrets':
        return (
          <Text style={styles.navBarTitleText}>My Secrets</Text>
        );
      case 'SelectCategory':
        return (
          <Text style={styles.navBarTitleText}>Select Secret Type</Text>
        );
      case 'SelectSecret':
        return (
          <Text style={styles.navBarTitleText}>Select Secret</Text>
        );
      case 'ShareSecret':
        return (
          <Text style={styles.navBarTitleText}>Share Secret</Text>
        );
      case 'CreateSecret':
        return (
          <Text style={styles.navBarTitleText}>Create Secret</Text>
        );     
      case 'MyAccount':
        return (
          <Text style={styles.navBarTitleText}>My Account</Text>
        );      
      case 'SignIn':
        return (
          <Text style={styles.navBarTitleText}>Sign In</Text>
        );      
      case 'Registration':
        return (
          <Text style={styles.navBarTitleText}>Registration</Text>
        );
      default: 
        return (
          <Text style={styles.navBarTitleText}>Select Secret Type</Text>
        );
    }
  }
};

class ShowMe extends React.Component {
  constructor(props) {
    super(props)
    //this.DB = this.getRef()
    //this.itemsRef = this.getRef().child('items') - will nest everything in a parent tree called 'items'
  }
  getRef() {
    //return new Firebase(FirebaseURL)
  }
  renderScene (route, navigator) {
    switch (route.name) {
      case 'SelectCategory':
        return (
          <SelectCategory navigator={navigator} route={route} />
        );
      case 'MySecrets':
        return (
          <MySecrets navigator={navigator} route={route} />
        );
      case 'SelectSecret':
        return (
          <SelectSecret navigator={navigator} route={route} />
        );
      case 'ShareSecret':
        return (
          <ShareSecret navigator={navigator} route={route} />
        );
      case 'CreateSecret':
        return (
          <CreateYourOwn navigator={navigator} route={route} db={this.db}/>
        );     
      case 'MyAccount':
        return (
          <MyAccount navigator={navigator} route={route} />
        );      
      case 'SignIn':
        return (
          <SignIn navigator={navigator} route={route} />
        ); 
      default:
        return (
          <SelectCategory navigator={navigator} route={route} />
        );
      }
  }
  render () {
    return (
      <Navigator
        ref={(navigator) => { this.navigator = navigator}}
        renderScene={this.renderScene}
        db={this.DB}
        navigationBar={
          <Navigator.NavigationBar
              routeMapper={NavigationBarRouteMapper}
              style={styles.navBar} />
        }
        initialRoute={{
          name: 'SignIn'
        }} />
    );
  }
};

var styles = StyleSheet.create({
    navBar: {
      backgroundColor: StylingGlobals.colors.navColor,
      borderBottomColor: StylingGlobals.colors.pressDown,
      borderBottomWidth: 1,
    },
    navBarTitleText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
      marginVertical: 9,
    },
    navBarLeftButton: {
      paddingLeft: 10
    },
    navBarRightButton: {
      paddingRight: 15,
    },
    navBarRightImage: {
      tintColor: '#fff',
      width: 22,
      height: 22,
      marginTop: 8,
      marginRight: 5,
      marginLeft: 5,
    },
    navBarButtonText: {
      color: '#EEE',
      fontSize: 16,
      marginVertical: 10
    },
    test: {
      position: 'absolute',
    }
});

AppRegistry.registerComponent('ShowMe', () => ShowMe);
