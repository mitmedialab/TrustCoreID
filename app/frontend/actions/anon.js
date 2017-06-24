import { push } from 'react-router-redux';
import { userStateType } from '../reducers/user';
const {initializeStore, documentStore} = require('electron').remote.require('./backend');

/**
 * Demo purpose only
 */
export const ids = {
    'alice@email.com': '123',
    'bob@email.com': '321'
};


let fake = 'bob@email.com';

export const USER_DATA = 'USER_DATA';

export function refreshDocumentList(dispatch, to) {
    documentStore().list().then(data => {
        dispatch({type: 'DOCUMENTS', payload: data});
        if (to !== undefined) {
            dispatch(push(`/runtime/documents/${to}`))
        }
    })
}

export function login(email, to) {
    return (dispatch) => {
        initializeStore(ids[email] || '456');
        dispatch({type: USER_DATA, payload: email});
        refreshDocumentList(dispatch, to);
    }
}

export function fakeLogin(dispatch) {

    initializeStore(ids[fake]);
    dispatch({type: USER_DATA, payload: fake});
    refreshDocumentList(dispatch, 0);
}