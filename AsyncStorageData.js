import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import assert from 'assert';

class AsyncStorageData extends React.Component {
  constructor(props) {
    super(props);
  }

  foo() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        this.stores = stores;
      });
    });
  }

  componentWillMount() {
    this.foo();

  }

  componentDidMount() {
    AsyncStorage.getItem('easyPeasy').then((easyPeasyString) => {
      assert.deepEqual(easyPeasyString, 'japanasdfasdfeasy');
    });
  }

  render() {
    return (
      <View></View>
    )
  }

}

export default AsyncStorageData;
