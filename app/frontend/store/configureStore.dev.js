import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import * as anonActions from '../actions/anon';
import * as listPageActions from '../actions/listPage';
import * as newDocumentActions from '../actions/newDocument';



const {Storage, Wallet} = require('electron').remote.require('./backend');

const history = createHashHistory();

const configureStore = (initialState) => {
    // Redux Configuration
    const middleware = [];
    const enhancers = [];

    // Thunk Middleware
    middleware.push(thunk);

    // Logging Middleware
    const logger = createLogger({
        level: 'info',
        collapsed: true
    });
    middleware.push(logger);

    // Router Middleware
    const router = routerMiddleware(history);
    middleware.push(router);

    // Redux DevTools Configuration
    const actionCreators = {
        ...anonActions,
        ...listPageActions,
        ...newDocumentActions,
        ...routerActions
    };
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators,
    })
        : compose;
    /* eslint-enable no-underscore-dangle */

    // Apply Middleware & Compose Enhancers
    enhancers.push(applyMiddleware(...middleware));
    const enhancer = composeEnhancers(...enhancers);

    // Create Store
    const store = createStore(rootReducer, initialState, enhancer);

    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
        );
    }

    Promise.resolve()
        .then(() => Wallet.open())
        .then(wallet => {
            store.dispatch({type: 'USER_DATA', payload: {email: wallet.email, id: wallet._id}});
            Storage.open(wallet._id, ()=>{
                console.log('should update');
                anonActions.refreshDocumentList(store.dispatch, 0);
            }).then(storage => {
                storage.list().then(data => {
                    store.dispatch({type: 'DOCUMENTS', payload: data});
                })
            })
        });

    return store;
};

export default {configureStore, history};
