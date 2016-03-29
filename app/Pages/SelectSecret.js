'use strict';

var React = require('react-native');
var TabBar = require('../Components/TabBar.js');
var Secret = require('../Components/SelectableSecret.js');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  ListView,
} = React;

// https://www.firebase.com/blog/2016-01-20-tutorial-firebase-react-native.html - Scroll down to 'Firebase listener'

class SelectSecret extends React.Component {
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.secrets = [{
      'text': 'Create Your Own Create Your Own Create Your Own Create Your Own Create Your Own Create Your Own Create Your Own Create Your Own Create Your Own Create Your Own Create Your Own Create Your Own'
    }, {
      'text': 'Love'
    }, {
      'text': 'Sex'
    }, {
      'text': 'Social'
    }, {
      'text': 'Funny'
    }, {
      'text': 'Embarassing'
    }, {
      'text': 'From Your Past'
    }]
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ListView
          dataSource={
            this.ds.cloneWithRows(this.secrets)
          }
          renderRow={(rowData) => {
            return (
              <Secret 
                secretText={rowData.text} />
            )
          }} />
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  secretContainer: {
    height: 50,
    marginBottom: 50,
  }
});


module.exports = SelectSecret;
