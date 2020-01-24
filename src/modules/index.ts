import { combineReducers } from 'redux';
import drawer from './drawer';
import login from './login';
import meal from './meal';

const rootReducer = combineReducers({
  drawer,
  login,
  meal,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
