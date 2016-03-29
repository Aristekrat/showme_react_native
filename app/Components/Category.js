'use strict';

var React = require('react-native');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

class Category extends React.Component {
  render () {
    return (
      <TouchableHighlight onPress={this.props.elsewhere} underlayColor={StylingGlobals.colors.accentPressDown}>
      	<View style={styles.category}>
	        <Image 
	          source={this.props.imgSource}
	          style={styles.icon} />
	        <Text style={styles.text}>
	          {this.props.categoryName}
	        </Text>
          <Image 
            source={require("../../img/right-arrow.png")}
            style={StylingGlobals.rightArrow} />
        </View>
      </TouchableHighlight>
    )
  }
}

var styles = StyleSheet.create({
  category: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
  },
  text: {
    fontSize: 20,
    marginLeft: 10,
    textAlign: 'center',
    width: 240,
  },
  icon: {
    marginLeft: 10,
    width: 45,
    height: 45,
  }
});

module.exports = Category;