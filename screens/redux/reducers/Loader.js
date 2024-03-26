import { SET_TRUE, SET_FALSE } from '../actions/Loader';

const loader = (state = false, action) => {
  switch (action.type) {
    case SET_TRUE:
      //console.log('MAAAN');
      return true;
    case SET_FALSE:
      return false;
    default:
      return false;
  }
};

export default loader;
