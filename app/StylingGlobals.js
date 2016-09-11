'use strict';

var React = require('react-native');

var globalStyling = {
	colors: {
		'mainColor': '#de5757',
		'pressDown': '#D03939',//'#DE3F3F',//'#C74848',
		'accentColor': '#fff8f8',
		'accentPressDown': '#FFEDED',
		'navColor': '#E67A7A',
		'textColorOne': '#ffffff',
		'textColorTwo': '#555555',	
		'border': '#ccc'	
	},
	container: {    
    	flex: 1,
    	marginTop: 65,
    	backgroundColor: '#fff8f8',
  	},
	rightArrow: {
	    marginLeft: 20,
	    width: 25,
	    height: 25,
	    opacity: 0.5,
	},
	horizontalCenter: {
	    flex: 1, 
	    flexDirection: 'row', 
	    justifyContent: 'center', 
	    alignItems: 'center'		
	}
}

module.exports = globalStyling;