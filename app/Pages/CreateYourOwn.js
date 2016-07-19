'use strict';

import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import TabBar from '../Components/TabBar.js';
import ActivityIndicator from '../Components/ActivityIndicator.js';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Image,
  TextInput,
  TouchableHighlight,
  PickerIOS,
  AsyncStorage
} from 'react-native';

var PickerItemIOS = PickerIOS.Item;

var CATEGORIES = ["Love", "Sex", "Social", "Funny", "Embarassing", "Past"]

class CategoryPicker extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      category: 'Social',
      index: 3,
      loaded: false
    } 
  }

  render () {
    return (
      <View style={styles.categoryPicker}>
        <PickerIOS
          selectedValue={this.state.category}
          onValueChange={(category) => this.setState({category, index: 0})}>
          {CATEGORIES.map((category) => (
            <PickerItemIOS
              key={category}
              value={category}
              label={category} />
          ))}
        </PickerIOS>
      </View>
    );
  }
};

class CreateYourOwn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      public: false,
      animating: false,
      text: '',
      submitSuccess: false,
      uid: '',
      submittedSecret: '',
      errorMessage: ''
    }
    this.publicSecrets = this.props.db.child('publicSecrets');
    this.privateSecrets = this.props.db.child('privateSecrets');
    this.users = this.props.db.child('users');
  }

  componentWillMount(){
    let self = this;
    AsyncStorage.getItem('userData').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json); 
      self.setState({uid: user_data.uid});
    });
  }

  submitSecret() {
    var self = this;
    if (this.state.text !== '') {
      self.setState({animating: !self.state.animating});
      if (!this.state.public) {
        // add to privateSecrets TODO Public and Private should be split into the same, seperate function
        var secretData = {question: self.state.text, state: 'CR', askerID: self.state.uid, askerName: '', askerAnswer: '', responderID: '', responderName: '', responderAnswer: '',};
        var privateSecret = this.privateSecrets.push(secretData, function (err, snapshot) {
          if (err) {
            this.setState({errorMessage: "We're sorry, there was an error connecting to the server"})
          } else {
              secretData.key = privateSecret.key();
              secretData.public = false;
              self.users.child(self.state.uid).child('secrets').child(privateSecret.key()).set('CR');
              self.setState({
                animating: !self.state.animating, 
                submitSuccess: true, 
                text: '', 
                submittedSecret: secretData,
                errorMessage: '',
              });
          }
        })
      } else {
        // add to publicSecrets
        var voteData = {}
        voteData[this.state.uid] = 'upvote';
        var secretData = {text: this.state.text, category: this.refs.catPicker.state.category, score: 1, votes: voteData, '.priority': -1};
        var publicSecret = this.publicSecrets.child(this.refs.catPicker.state.category).push(secretData, function (err) {
          if (err) {
            this.setState({errorMessage: "We're sorry, there was an error connecting to the server"})
          } else {
            secretData.public = true;
            secretData.key = publicSecret.key();
            self.setState({
              animating: !self.state.animating, 
              submitSuccess: true, 
              text: '', 
              submittedSecret: secretData, 
              errorMessage: '',
            });
          }
        })
      }
    } else {
      this.setState({errorMessage: 'Please enter your question'})
    }
  }

  clearErrorMessage() {
    if (this.state.errorMessage) {
      this.setState({errorMessage: ''})
    }
  }

  render(){
    return (
      <View style={StylingGlobals.container}>
        <ScrollView style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>Secret Text</Text>
            <TextInput
                style={styles.textInput}  
                autoFocus={true}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
              />
              { this.state.errorMessage ? <Text style={styles.errorText}>{this.state.errorMessage}</Text> : null }
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Make Public</Text>
            <Switch 
              onValueChange={() => this.setState({public: !this.state.public})} 
              onTintColor={StylingGlobals.colors.pressDown}
              value={this.state.public}>
            </Switch>
          </View>
          { this.state.public ? // category picker for public secrets or nothing
            <View>
              <Text style={styles.label}>Category you would like to submit this secret to...</Text>
              <CategoryPicker ref="catPicker" />
            </View> 
            : 
            null 
          }
          { // Success notification block or submit block
            this.state.submitSuccess ? 
            <View>
              <Text style={styles.positiveNotification}>Success!</Text>
              <TouchableHighlight 
                  style={styles.button} 
                  underlayColor={StylingGlobals.colors.pressDown} 
                  onPress={() => {this.props.navigator.push({name: 'ShareSecret', cookieData: this.state.submittedSecret})}}>
                  <View style={StylingGlobals.horizontalCenter}>
                    <Image 
                      source={require("../img/game67.png")} style={styles.icon} />
                    <Text style={styles.buttonText}>Send Secret</Text>
                  </View>
              </TouchableHighlight>
              <Text style={styles.smallText}>- or -</Text>
              <TouchableHighlight 
                  onPress={() => this.setState({submitSuccess: false})}
                  underlayColor={StylingGlobals.colors.accentPressDown}> 
                 <Text style={styles.linkStyling}>Make Another</Text>
              </TouchableHighlight>
            </View>
            :
            <TouchableHighlight 
              style={[styles.button, StylingGlobals.horizontalCenter]} 
              underlayColor={StylingGlobals.colors.pressDown} 
              onPress={() => this.submitSecret()}>
             <Text style={styles.buttonText}>Create Your Secret</Text>
          </TouchableHighlight>
          }
          <ActivityIndicator animationControl={this.state.animating} extraStyling={{height:0}}/>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  pageContainer: StylingGlobals.container,
  form: {
    padding: 20,
  },
  row: {
    marginBottom: 20
  },
  textInput: {
    backgroundColor: '#fff',
    height: 40,
    borderWidth: 1,
    borderColor: '#eee',
    paddingLeft: 5,
  },
  label: {
    marginBottom: 3
  },
  button: {
    backgroundColor: StylingGlobals.colors.mainColor,
    height: 45,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    tintColor: '#fff',
    width: 22,
    height: 22,
    marginRight: 8,
  },
  errorText: {
    color: StylingGlobals.colors.mainColor,
  },
  positiveNotification: {
    textAlign: 'center',
    margin: 5,
    color: StylingGlobals.colors.pressDown,
    fontSize: 20,
  }, 
  smallText: {
    color: StylingGlobals.colors.textColorTwo,
    textAlign: 'center',
    margin: 10,
    fontSize: 10,
  },
  linkStyling: {
    color: StylingGlobals.colors.pressDown,
    textAlign: 'center',
  }
});

module.exports = CreateYourOwn;