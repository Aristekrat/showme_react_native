import React, { Component } from 'react';
import StylingGlobals from '../StylingGlobals.js';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
} from 'react-native';

class SModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible(boolArg) {
    this.setState({modalVisible: boolArg});
  }

  render() {
    return (
      <Modal 
        animationType={'slide'}
        transparent={true}
        visible={this.state.modalVisible}>
        <TouchableHighlight onPress={() => {
          this.setModalVisible(false);
        }}
          style={styles.modalContainer}
          underlayColor={StylingGlobals.colors.pressDown} >
          <View>
            <Text style={styles.modalText}>{this.props.modalText}</Text>
            <Text style={styles.tapToClose}>Tap to close</Text>
          </View>
        </TouchableHighlight>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    alignSelf: 'center',
    marginTop: 50,
    backgroundColor: StylingGlobals.colors.mainColor,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: StylingGlobals.colors.pressDown,
    borderWidth: 1,
    width: 320,
  },
  modalText: {
    color: '#fff',
    marginBottom: 30,
  },
  tapToClose: {
    fontSize: 10,
    color: '#fff',
    marginBottom: -30,
    textAlign: 'center',
  }
});

module.exports = SModal;