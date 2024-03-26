// import {showLoading, hideLoading} from 'react-redux-loading';

const RESET_PASSWORD_ID = 'RESET_PASSWORD_ID';

const setResetPasswordID = (resetpassword) => {
  return {
    type: RESET_PASSWORD_ID,
    resetpassword,
  };
};

const handleResetPasswordId = (id) => {
  return (dispatch) => {
    // dispatch(showLoading());
    dispatch(setResetPasswordID(id));
    // dispatch(hideLoading());
  };
};

export {RESET_PASSWORD_ID, handleResetPasswordId};
