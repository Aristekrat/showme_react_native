import {
  Text
} from 'react-native';
import React from 'react';
import MySecrets from '../app/Pages/MySecrets';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
//const AsyncStorage = require.requireActual('AsyncStorage')
// Note: test renderer must be required after react-native.
//import renderer from 'react-test-renderer';

const mockStore = configureStore()
const initialState = {}
const store = mockStore(initialState)
const routeMock = {}
routeMock.refresh = ""
//jest.mock('AsyncStorage', () => 'AsyncStorage');


describe('MySecretsTest', () => {
  const wrapper = shallow(
    <MySecrets store={store} route={routeMock} />
  );

  it('renders correctly', () => {
    expect(wrapper).not.toBe(undefined);
  });

  it('can see props', () => {
    expect(wrapper.props().actions).not.toBe(undefined);
  })

  /*
  it('can see elements in the view', () => {
    //expect(wrapper.length).toBe(1);
    expect(wrapper.children().length).toBe(1);
  })
  */

  it('can call element functions', () => {
    var mySecrets = new MySecrets();
    var bar = mySecrets.foo();
    expect(bar).toEqual('bar');
  })

});
