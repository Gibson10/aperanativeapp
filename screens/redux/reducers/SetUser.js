import {SET_USER, NO_USER, CHANGE_STATUS} from '../actions/User';

const initialState = {
  isLoading: true,
  user: null,
  userToken: null,
  status: 'offline',
};

const currentUser = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.user,
        ...action.userToken,
        isLoading: false,
      };
    case NO_USER:
      return {
        ...state,
        isLoading: false,
        // user: null,
        // userToken: null,
      };
    case CHANGE_STATUS:
      return {
        ...state,
        status: action.status,
      };
    default:
      return initialState;
  }
};

export default currentUser;
