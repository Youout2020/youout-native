import { combineReducers } from 'redux';

import user from './user';
import game from './game';
import camera from './camera';

export default combineReducers({
  user,
  game,
  camera,
});
