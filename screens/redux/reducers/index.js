import { combineReducers } from 'redux';

import loader from './Loader';

import login from './LoginReducer';
import currentUser from './SetUser';
import resetPasswordId from './SetResetPasswordId';
// import { loadingBarReducer } from 'react-redux-loading';

export default combineReducers({
  login,
  loader,
  currentUser,
  resetPasswordId,
  // loadingBar: loadingBarReducer,
});
