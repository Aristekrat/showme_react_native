'use strict';

const Actions = {
	toggleAnimation: function() {
	  this.dispatch({type: 'animating'});
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
	intro: function (value) {
		this.dispatch({type: 'intro', value: value});
	},
  setModalText: function (text) {
    this.dispatch({type: 'modalText', text: text});
  },
}

export default Actions;