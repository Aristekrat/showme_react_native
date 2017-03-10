'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
import BigButton from '../Components/BigButton.js';
import StylingGlobals from '../Globals/StylingGlobals.js';
import Utility from '../Globals/UtilityFunctions';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import ReactMixin from 'react-mixin';
import ReactTimer from 'react-timer-mixin';
import { connect } from 'react-redux';
import actions from '../State/Actions/Actions';

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
  LoginManager,
} = FBSDK;

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  AsyncStorage,
  Switch,
  Modal,
} from 'react-native';

class MyAccount extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      eraseVisible: false,
      switchVisible: false,
      secretsErased: false,
    }
    this.users = this.props.db.child('users');
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.answers = this.props.db.child('answers');
    this.secretCodes = this.props.db.child('indexes').child('verificationCodes');
  }

  eraseSecrets(uid) {
    if (uid) {
      AsyncStorage.getItem('userData').then((user_data_string) => {
        let userData = JSON.parse(user_data_string);
        userData.secrets = {};
        AsyncStorage.setItem('userData', JSON.stringify(userData));
      });

      this.users.child(uid).child('secrets').once('value', (snapshot) => {
        let secretKeys = Object.keys(snapshot.val());
        secretKeys.forEach((currentKey, index, arr) => {
          this.privateSecrets.child(currentKey).once('value', (snapshot) => {
            let privateSecret = snapshot.val();
            let otherPerson;
            if (privateSecret && privateSecret.askerID) {
              otherPerson = uid === privateSecret.askerID ? privateSecret.responderID : privateSecret.askerID;
            }

            if (otherPerson) {
              this.users.child(otherPerson).child('secrets').child(currentKey).remove();
            }
            this.answers.child(currentKey).remove();
            this.privateSecrets.child(currentKey).remove();
            this.secretCodes.child(currentKey).remove();
          })
        });
        this.setTimeout (
          () => {
            this.users.child(uid).child('secrets').remove();
            this.setState({secretsErased: true});
            this.props.actions.toggleAnimation();
            AsyncStorage.removeItem('secrets');
          },
          5000
        )
      });
    } else {
      this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to Sign In first'});
    }
  }

  componentWillMount() {
    Utility.checkAllAuth();

    if (!Utility.authStatus) {
      this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to Sign In first'});
    }

    if (!this.props.userId) {
      AsyncStorage.getItem('userData').then((user_data_string) => {
        if (user_data_string) {
          let userData = JSON.parse(user_data_string);
          this.props.actions.updateUserId(userData.uid);
        } else {
          this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to Sign In first'});
        }
      });
    }
  }

  componentDidMount() {
    this.setTimeout (
      () => {
        Utility.firebaseApp.auth().onAuthStateChanged((user) => {
          if (!user) {
            this.props.navigator.push({name: 'SignIn', message: 'Sorry, you need to Sign In first'});
          }
        });
      }, 0
    )
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <ActivityIndicator animationControl={this.props.animating} />

          <TouchableHighlight
            style={styles.accountLinkContainer}
            underlayColor={'transparent'}
            onPress={() => this.props.navigator.push({'name': 'ChangeUserName'})} >
            <Text style={styles.accountLink}>Change User Name</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.accountLinkContainer}
            underlayColor={'transparent'}
            onPress={() => {
              this.setState({eraseVisible: true})
            }} >
            <Text style={styles.accountLink}>Erase Secrets</Text>
          </TouchableHighlight>

          {this.state.secretsErased ? <Text style={styles.notificationText}>Your secrets have been erased</Text> : null }

          <Modal
            animationType={'slide'}
            visible={this.state.eraseVisible} >
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Are you sure you want to erase your secrets?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableHighlight style={styles.modalButton}
                  underlayColor={StylingGlobals.colors.pressDown}
                  onPress={() => {
                    this.props.actions.toggleAnimation();
                    this.setState({eraseVisible: false});
                    this.eraseSecrets(this.props.userId);
                  }}>
                  <Text style={styles.modalButtonText}>
                    Yes
                  </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.modalButton}
                    underlayColor={StylingGlobals.colors.pressDown}
                    onPress={() => this.setState({eraseVisible: false}) }>
                  <Text style={styles.modalButtonText}>
                    No
                  </Text>
                </TouchableHighlight>
              </View>
              <Text style={styles.modalText}>This will permenantly erase your secrets from your records and anyone you have shared with. It cannot be undone.</Text>
            </View>
          </Modal>

          <TouchableHighlight
            style={styles.accountLinkContainer}
            underlayColor={'transparent'}
            onPress={() => this.props.navigator.push({name: 'PrivacyPolicy'})} >
            <Text style={styles.accountLink}>Privacy Policy</Text>
          </TouchableHighlight>

        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

/* Maybe someday. Add this.
<TouchableHighlight
  style={styles.accountLinkContainer}
  underlayColor={'transparent'}
  onPress={() => console.log('foo')} >
  <Text style={styles.accountLink}>Delete User</Text>
</TouchableHighlight>
<TouchableHighlight
  style={styles.accountLinkContainer}
  underlayColor={'transparent'}
  onPress={() => console.log('foo')} >
  <Text style={styles.accountLink}>Contact Us</Text>
</TouchableHighlight>
*/

ReactMixin(MyAccount.prototype, ReactTimer);

const styles = StyleSheet.create({
  accountLinkContainer: {
    margin: 15,
    padding: 25,
  },
  accountLink: {
    color: StylingGlobals.colors.pressDown,
    fontSize: 17,
  },
  switchContainer: {
    marginLeft: 40,
    marginRight: 20,
    marginTop: -30,
  },
  switchText: {
    marginTop: 5,
    marginBottom: 5,
  },
  modalContainer: {
    alignSelf: 'center',
    marginTop: 150,
    padding: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    width: 110,
    paddingTop: 15,
    paddingBottom: 15,
    margin: 35,
    backgroundColor: StylingGlobals.colors.mainColor,
  },
  modalText: {
    color: '#333',
    fontSize: 16,
    marginTop: 5,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  notificationText: {
    marginLeft: 40,
    marginTop: -25,
    fontSize: 14,
  }
});

const mapStateToProps = (state) => {
  return {
    animating: state.isAnimating,
    userId: state.userId,
  };
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    actions: actions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
