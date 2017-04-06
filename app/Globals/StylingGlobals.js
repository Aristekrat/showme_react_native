'use strict';

var React = require('react-native');

var globalStyling = {
	colors: {
		'mainColor': '#de5757',
		'pressDown': '#D03939',//'#DE3F3F',//'#C74848',
		'accentColor': '#fff8f8',
		'darkerAccent': '#FFEDED',
		'accentPressDown': '#ffcccc',
		'navColor': '#E67A7A',
		'textColorOne': '#ffffff',
		'textColorTwo': '#555555',
		'border': '#ccc',
		'textInputBorder': '#ccc',
	},
	container: {
    	flex: 1,
    	marginTop: 65,
    	backgroundColor: '#fff8f8',
  },
	rightArrow: {
	    marginLeft: 10,
	    width: 35,
	    height: 35,
	    opacity: 0.5,
	},
	textInput: {
	    backgroundColor: '#fff',
	    height: 55,
	    borderWidth: 1,
	    borderColor: '#cdcdcd',
	    paddingLeft: 5,
	    marginLeft: 30,
	    marginRight: 30,
	},
	header: {
	    marginLeft: 30,
	    marginTop: 20,
	    fontSize: 16,
	    marginBottom: 5,
	},
	paragraph: {
	    marginLeft: 30,
	    color: '#333',
	    marginTop: 5,
	},
	horizontalCenter: {
	    flex: 1,
	    flexDirection: 'row',
	    justifyContent: 'center',
	    alignItems: 'center'
	}
}

module.exports = globalStyling;
