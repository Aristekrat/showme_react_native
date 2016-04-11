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
    this.state = {
      source: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
    this.secrets = []
  }
  componentDidMount() {
    this.props.db.child('publicSecrets').orderByChild('category').equalTo(this.props.route.category).on("child_added", (snapshot) => {
      this.secrets.push(snapshot.val())
      this.setState({
        source: this.state.source.cloneWithRows(this.secrets)
      })
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })
    /*this.props.db.child('publicSecrets').orderByChild('category').equalTo(this.props.route.category).on("child_added", (snapshot) => {
      secrets.push(snapshot.val())
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    })*/ 
  }
  render(){
    return (
      <View style={StylingGlobals.container}>
        <ListView
          dataSource= {
            this.state.source
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
