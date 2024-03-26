import { RESET_PASSWORD_ID } from '../actions/ResetPassword';

const resetPasswordId = (state = {}, action) => {
  switch (action.type) {
    case RESET_PASSWORD_ID:
      return {
        ...state,
        ...action.resetpassword,
      };
    default:
      return state;
  }
};

export default resetPasswordId;
