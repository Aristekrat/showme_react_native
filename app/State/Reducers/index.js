'use strict';

import { combineReducers } from 'redux';

import animationReducer from './AnimationReducer';
import errorReducer from './ErrorReducer';
import formInputReducer from './FormInputReducer';
import phoneNumberReducer from './PhoneNumberReducer';
import introReducer from './IntroReducer';
import isConnectedReducer from './IsConnectedReducer';
import modalTextReducer from './ModalTextReducer';
import secretKeyReducer from './SecretKeyReducer';
import nameReducer from './NameReducer';
import userIdReducer from './UserIdReducer';
import mySecretsTypeReducer from './MySecretsTypeReducer';
import secretCodeReducer from './SecretCodeReducer';
import passwordReducer from './PasswordReducer';
import publicSecretReducer from './PublicSecretReducer';
import submitSuccessReducer from './SubmitSuccessReducer';
import submittedSecretReducer from './SubmittedSecretReducer';
import displaySkipReducer from './DisplaySkipReducer';

const reducers = combineReducers({
  displaySkip: displaySkipReducer,
  error: errorReducer,
  emailAddress: formInputReducer,
  formInput: formInputReducer,
  firstName: nameReducer,
  isAnimating: animationReducer,
  isConnected: isConnectedReducer,
  phoneNumber: phoneNumberReducer,
  password: passwordReducer,
  secretCode: secretCodeReducer,
  secretKey: secretKeyReducer,
  selectCategoryIntro: introReducer,
  modalText: modalTextReducer,
  userId: userIdReducer,
  mySecretsType: mySecretsTypeReducer,
  public: publicSecretReducer,
  submitSuccess: submitSuccessReducer,
  submittedSecret: submittedSecretReducer,
});

export default reducers;
