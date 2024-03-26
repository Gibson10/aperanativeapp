import {
  LOGIN,
  LOGOUT,
  NO_USER,
  REGISTER,
  RETRIEVE_TOKEN,
} from '../actions/LoginActions';

const initialState = {
  isLoading: false,
  userName: null,
  userToken: null,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userName: action.username,
        userToken: action.token,
        isLoading: false,
      };
    case LOGOUT:
      return {
        ...state,
        userName: null,
        userToken: null,
        isLoading: false,
      };
    case NO_USER:
      return {
        ...state,
        isLoading: false,
      };
    case REGISTER:
      return {
        ...state,
        userName: action.username,
        userToken: action.token,
        isLoading: false,
      };
    case RETRIEVE_TOKEN:
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    default:
      return {
        isLoading: true,
        userName: null,
        userToken: null,
      };
  }
};

export default login;
