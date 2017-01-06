'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../Globals/StylingGlobals';
import actions from '../State/Actions/Actions';
import Utility from '../Globals/UtilityFunctions';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
//const FBLoginManager = require('NativeModules').FBLoginManager;
const {
  LoginManager,
  LoginButton,
  AccessToken
} = FBSDK;

class FButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.fbContainer}>
        <LoginButton
            style={[styles.fbutton, this.props.width]}
            readPermissions={["public_profile", "email"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  this.props.actions.setError("Sorry, there was an error. Either try email registration or skip for now.");
                } else {
                  if (!result.isCancelled) {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        this.props.db.authWithOAuthToken('facebook', data.accessToken.toString(), (error, authData) => {
                          if (error) {
                            this.props.actions.setError("Sorry, there was an error. Either try email registration or skip for now.");
                          } else {
                            this.props.successCB(authData, this.props);
                            Utility.setLocalAuth(true);
                          }
                        })
                      }
                    )
                  }
                }
              }
            }
            onLogoutFinished={() => console.log("logout.")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fbContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  fbutton: {
    width: 295,
    flex: 1,
    height: 55,
  },
});

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return { actions : actions }
}

export default connect(mapStateToProps, mapDispatchToProps)(FButton)
