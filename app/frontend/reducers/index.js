import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import items from './items';
import newdoc from './newDocument';

const rootReducer = combineReducers({
    items,
    router,
    newdoc
});

export default rootReducer;
