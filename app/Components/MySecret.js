var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
} = React;

class MySecret extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <View style={styles.secretContainer}>
        <Text style={styles.author}>from {this.props.author}</Text>
        <Text style={styles.question}>Q: {this.props.question}</Text>
        <Text style={styles.answer}>A: {this.props.answer}</Text>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  secretContainer: {
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    padding: 5,
    flex: 1,
  },
  author: {
    color: '#999',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginRight: 5,
  },
  question: {
    margin: 5,
  },
  answer: {
    margin: 5,
  },
});

module.exports = MySecret;