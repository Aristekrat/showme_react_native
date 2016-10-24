'use strict';

import { combineReducers } from 'redux';

import animationReducer from './AnimationReducer';
import errorReducer from './ErrorReducer';
import formInputReducer from './FormInputReducer';
import phoneNumberReducer from './PhoneNumberReducer';
import introReducer from './IntroReducer';
import modalTextReducer from './ModalTextReducer';
import secretKeyReducer from './SecretKeyReducer';
import nameReducer from './NameReducer';
import userIdReducer from './UserIdReducer';

const reducers = combineReducers({
  isAnimating: animationReducer,
  error: errorReducer,
  formInput: formInputReducer,
  firstName: nameReducer, 
  emailAddress: formInputReducer,
  phoneNumber: phoneNumberReducer,
  secretKey: secretKeyReducer,
  selectCategoryIntro: introReducer,
  modalText: modalTextReducer,
  userId: userIdReducer,
});

export default reducers;