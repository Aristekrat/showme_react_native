'use strict';

var React = require('react-native');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  ActivityIndicatorIOS,
} = React;

class ActivityIndicator extends React.Component {
  /*constructor(props){
    super(props);
    this.state = {
      animating: true,
    }
  }

  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }*/

  render(){
    return (
        <ActivityIndicatorIOS
            animating={this.props.animationControl}
            style={[styles.centering]}
            size="large"
            color="#000"
        />
    );
  }
}

var styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    left: 0,
    right: 0,
    top: 0,
    height: 50,
    backgroundColor: 'transparent',
  },
});

module.exports = ActivityIndicator;
