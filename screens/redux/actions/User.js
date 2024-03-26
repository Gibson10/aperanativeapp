const LOGOUT = 'LOGOUT';
const NO_USER = 'NO_USER';
const SET_USER = 'SET_USER';
const CHANGE_VAL = 'CHANGE_VAL';
const CHANGE_STATUS = 'CHANGE_STATUS';
const ADD_PRODUCT = 'ADD_PRODUCT';
const RETRIEVE_TOKEN = 'RETRIEVE_TOKEN';

const setUser = (user, userToken) => {
  return {
    type: SET_USER,
    user,
    userToken,
  };
};

const retrieveToken = (userToken) => {
  return {
    type: RETRIEVE_TOKEN,
    userToken,
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


const changeStatus = (status) => {
  return {
    type: CHANGE_STATUS,
    status: status,
  };
};


export {
  NO_USER,
  SET_USER,
  CHANGE_VAL,
  ADD_PRODUCT,
  CHANGE_STATUS,
  logout,
  setUser,
  setNoUser,
  retrieveToken,
  changeStatus,
};
