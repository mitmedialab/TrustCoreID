// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import items from './items';

const rootReducer = combineReducers({
  items,
  router
});

export default rootReducer;
