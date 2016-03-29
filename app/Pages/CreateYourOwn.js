'use strict';

var React = require('react-native');
var ActivityIndicator = require('../Components/ActivityIndicator.js');
var TabBar = require('../Components/TabBar.js');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Image,
  TextInput,
  TouchableHighlight,
  PickerIOS
} = React;

var PickerItemIOS = PickerIOS.Item;

var CATEGORIES = ["Love", "Sex", "Social", "Funny", "Embarassing", "Past"]

class CategoryPicker extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      category: 'Social',
      index: 3,
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
    }
    this.publicSecrets = this.props.db.child('publicSecrets');
    this.askedSecrets = this.props.db.child('askedSecrets');
  }
  submitSecret() {
    var self = this;
    if (this.state.text !== '') {
      self.setState({animating: !self.state.animating});
      if (!this.state.public) {
        this.askedSecrets.push({text: this.state.text}, function (err) {
          if (err) {
            console.log(err);
            // Output appropriate error
          } else {
            self.setState({animating: !self.state.animating, submitSuccess: true, text: ''});
          }
        })
      } else {
        // add to publicSecrets
        this.publicSecrets.push({text: this.state.text, category: this.refs.catPicker.state.category}, function (err) {
          if (err) {
            // Output appropriate error
          } else {
            self.setState({animating: !self.state.animating, submitSuccess: true, text: ''});
          }
        })
      }

    } else {
      console.log("Reached the error block");
      // Pop error message
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
              {/* The beginnings of error handling.
                !this.state.text && this.state.error ? <Text>Please enter your secret</Text> : null
              */}
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
                  onPress={() => console.log("Need non-dummy")}>
                  <View style={StylingGlobals.horizontalCenter}>
                    <Image 
                      source={require("../../img/game67.png")} style={styles.icon} />
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

          <ActivityIndicator animationControl={this.state.animating} />
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