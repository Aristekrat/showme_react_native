'use strict';

const Actions = {
	toggleAnimation: function() {
	  this.dispatch({type: 'toggleAnimating'});
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
	intro: function (value) {
		this.dispatch({type: 'intro', value: value});
	},
  setModalText: function (text) {
    this.dispatch({type: 'modalText', text: text});
  },
}

export default Actions;