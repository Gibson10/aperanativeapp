const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const NO_USER = 'NO_USER';
const REGISTER = 'REGISTER';
const RETRIEVE_TOKEN = 'RETRIEVE_TOKEN';

const setLogin = (username, token) => {
  return {
    type: LOGIN,
    username,
    token,
  };
};

const retrieveToken = (token) => {
  return {
    type: RETRIEVE_TOKEN,
    token,
  };
};

const setNoUser = () => {
  return {
    type: NO_USER,
  };
};

const logout = () => {
  return {
    type: LOGOUT,
  };
};

export {
  LOGIN,
  LOGOUT,
  NO_USER,
  REGISTER,
  RETRIEVE_TOKEN,
  logout,
  setLogin,
  setNoUser,
  retrieveToken,
};
