'use strict';

var React = require('react-native');
var TabBar = require('../Components/TabBar.js');
var SelectSecret = require('./SelectSecret.js');
var ShareSecret = require('./ShareSecret.js');
var MySecrets = require('./MySecrets.js');
var MyAccount = require('./MyAccount.js');
var StylingGlobals = require('../StylingGlobals.js');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  TextInput,
  ActivityIndicatorIOS,
} = React;

class SignIn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      animating: false,
    }
  }

  setToggleTimeout() {
    /*setTimeout(
      () => {
        this.setState({animating: !this.state.animating});
        this.setToggleTimeout();
      }, 
      1200
    );*/
  }

  toggleActivityIndicator() {
    this.setState({animating: !this.state.animating});
  }

  componentDidMount () {
    this.setToggleTimeout();
  }

   render(){
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS
            animating={this.state.animating}
            style={[styles.centering, {height: 80}]}
            size="large"
        />
        <ScrollView style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>Username</Text>
            <TextInput 
              style={styles.textInput} 
                ref="username"
                autoFocus={true}
                onEndEditing={(text) => {this.refs.password.focus()}}
                selectionColor={StylingGlobals.colors.mainColor} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Password </Text>
            <TextInput 
              style={styles.textInput}
              ref="password"
              secureTextEntry={true}
              selectionColor={StylingGlobals.colors.navColor} />
          </View>
          <TouchableHighlight style={styles.button} underlayColor={StylingGlobals.colors.pressDown} onPress={() => this.toggleActivityIndicator()}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableHighlight>
        </ScrollView>
        <TabBar navigator={this.props.navigator} route={this.props.route} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: StylingGlobals.container,
  form: {
    marginTop: 50
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 7
  },
  label: {
    fontSize: 12,
    textAlign: 'left',
    margin: 15,
    width: 60,
  },
  textInput: {
    height: 40,
    padding: 2,
    marginTop: 4,
    marginBottom: 8,
    borderColor: '#eee',
    borderWidth: 1,
    width: 250,
    backgroundColor: '#fff'
  },
  button: {
  	padding: 10,
  	backgroundColor: StylingGlobals.colors.mainColor,
    marginTop: 14,
    width: 250,
    marginLeft: 90,
  },
  buttonText: {
    textAlign: 'center',
    color: StylingGlobals.colors.textColorOne,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -7,
  },
});


module.exports = SignIn;
