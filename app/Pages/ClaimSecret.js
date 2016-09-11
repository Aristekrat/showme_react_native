'use strict';

import React, { Component } from 'react';
import TabBar from '../Components/TabBar.js';
//import generator from '../Components/CodeGenerator/CodeGenerator.js';
import StylingGlobals from '../StylingGlobals.js';
import BigButton from '../Components/BigButton.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

class ClaimSecret extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    }
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView>
          <Text style={styles.header}>
            Enter your code
          </Text>
          <TextInput
            style={styles.codeInput}  
            autoFocus={true}
            onChangeText={(text) => this.setState({code})}
            value={this.state.code} />
          <BigButton do={() => console.log("Hay there!")}>
            Submit
          </BigButton>        
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  header: {
    marginLeft: 30,
    marginTop: 20,
    fontSize: 16,
    marginBottom: 5,
  },
  codeInput: {
    backgroundColor: '#fff',
    height: 45,
    borderWidth: 1,
    borderColor: '#eee',
    paddingLeft: 5,
    marginLeft: 30,
    marginRight: 30,
  },
});


module.exports = ClaimSecret;
