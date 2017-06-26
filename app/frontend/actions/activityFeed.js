import { push } from 'react-router-redux';
const {Storage, Wallet} = require('electron').remote.require('./backend');

export const ACTIVITY_DATA = 'ACTIVITY_DATA';

export function loadFeed(index = 0, items = 4) {

    return (dispatch) => {
        Storage.open().then(store => {
            store.getFeedItems(index, items).then((list) => {
                dispatch({type: ACTIVITY_DATA, payload: {index, list}})
            })
        });
    }
}