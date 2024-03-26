const SET_TRUE = 'SET_TRUE';
const SET_FALSE = 'SET_FALSE';

const setTrue = () => {
  //console.log('HERERERE');
  return {
    type: SET_TRUE,
  };
};

const setFalse = () => {
  return {
    type: SET_FALSE,
  };
};

export { SET_TRUE, SET_FALSE, setTrue, setFalse };
