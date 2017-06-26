import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import user from './user';
import items from './items';
import newdoc from './newDocument';
import activity from './activity';

const rootReducer = combineReducers({
    user,
    activity,
    items,
    router,
    newdoc
});

export default rootReducer;
