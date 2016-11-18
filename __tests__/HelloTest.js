import 'react-native';
import React from 'react';
import MyAccount from '../app/Pages/MyAccount';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <MyAccount />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});