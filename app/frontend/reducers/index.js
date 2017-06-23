import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import user from './user';
import items from './items';
import newdoc from './newDocument';

const rootReducer = combineReducers({
    user,
    items,
    router,
    newdoc
});

export default rootReducer;
