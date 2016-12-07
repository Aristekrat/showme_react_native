import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import MyAccount from '../app/Pages/MyAccount';

describe('AsyncStorageTest', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <MyAccount />
    ).toJSON();
    expect(tree).not.toBe(undefined);
  });
});
