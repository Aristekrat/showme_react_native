'use strict';

import store from '../Store';

const Actions = {
  dispatch: store.dispatch,
  displaySkip: function (bool) {
    this.dispatch({type: 'displaySkip', value: bool});
  },
  setIsConnected: function(bool) {
    this.dispatch({type: 'isConnected', value: bool});
  },
	toggleAnimation: function() {
	  this.dispatch({type: 'toggleAnimating'});
	},
  togglePublicSecret: function() {
    this.dispatch({type: 'togglePublicSecret'});
  },
  setAnimation: function(value) {
    this.dispatch({type: 'setAnimating', value: value});
  },
	setError: function(errorText) {
	  this.dispatch({type: 'addError', text: errorText});
	},
	removeError: function () {
	  this.dispatch({type: 'removeError'});
	},
	updateFormInput: function (value) {
	  this.dispatch({type: 'formInput', text: value});
	},
  updatePhoneNumber: function (value) {
    this.dispatch({type: 'phoneNumber', phoneNumber: value});
  },
  updateSecretKey: function (value) {
    this.dispatch({type: 'secretKey', key: value});
  },
  updateFirstName: function (value) {
    this.dispatch({type: 'firstName', text: value});
  },
  updateUserId: function (value) {
    this.dispatch({type: 'userId', uid: value});
  },
  updateSecretCode: function (value) {
    this.dispatch({type: 'secretCode', value: value});
  },
  updatePassword: function (value) {
    this.dispatch({type: 'password', value: value});
  },
  setMSDisplayType: function (value) {
    this.dispatch({type: 'mst', value: value});
  },
	intro: function (value) {
		this.dispatch({type: 'intro', value: value});
	},
  setModalText: function (text) {
    this.dispatch({type: 'modalText', text: text});
  },
  resetState: function () {
    this.dispatch({type: 'removeError'});
    this.dispatch({type: 'setAnimating', value: false});
  },
  submitSuccess: function (value) {
    this.dispatch({type: 'submitSuccess', value: value});
  },
  submittedSecret: function (value) {
    this.dispatch({type: 'submittedSecret', value: value});
  },
  pushUpdatedSecret: function (secretKey) {
    this.dispatch({type: 'addUpdatedSecret', value: secretKey});
  },
  pushMultipleUpdatedSecrets: function (updatedSecretsHash) {
    this.dispatch({type: 'multipleUpdatedSecrets', value: updatedSecretsHash});
  },
  removeUpdatedSecret: function (secretKey) {
    this.dispatch({type: 'removeUpdatedSecret', value: secretKey});
  },
  incrementNotifications: function (incAmt) {
    this.dispatch({type: 'incrementNotifications', value: incAmt});
  },
  decrementNotifications: function (decAmt) {
    this.dispatch({type: 'decrementNotifications', value: decAmt});
  },
  removeNotifications: function () {
    this.dispatch({type: 'removeNotifications'});
  },
  setNotifications: function (setAmt) {
    this.dispatch({type: 'setNotifications', value: setAmt});
  },
  updateContactsPermission: function (bool) {
    this.dispatch({type: 'updateContactsPermission', value: bool});
  }
}

export default Actions;
