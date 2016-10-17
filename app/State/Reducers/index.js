'use strict';

import { combineReducers } from 'redux';

import animationReducer from './AnimationReducer';
import errorReducer from './ErrorReducer';
import formInputReducer from './FormInputReducer';
import introReducer from './IntroReducer';
import modalTextReducer from './ModalTextReducer';

const reducers = combineReducers({
  isAnimating: animationReducer,
  error: errorReducer,
  formInput: formInputReducer,
  emailAddress: formInputReducer,
  selectCategoryIntro: introReducer,
  modalText: modalTextReducer,
});

export default reducers;