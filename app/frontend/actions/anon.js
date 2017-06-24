import { push } from 'react-router-redux';
import { userStateType } from '../reducers/user';

const {Storage, Wallet} = require('electron').remote.require('./backend');

let walletInstance;

export const USER_DATA = 'USER_DATA';


export function refreshDocumentList(dispatch, to) {
    Storage.open().then(store => {
        store.list().then(data => {
            dispatch({type: 'DOCUMENTS', payload: data});
            if (to !== undefined) {
                dispatch(push(`/runtime/documents/${to}`))
            }
        })
    })
}

export function register(email, name) {

    return (dispatch, getState) => {
        Promise.resolve()
            .then(() => Wallet.open())
            .then(wallet => {
                walletInstance = wallet;
                wallet.registerPublicKey({
                    provider: 'http://localhost:5150',
                    registration: {name, email}
                })
            })
            .then((data) => {
                Storage.open(walletInstance._id).then((data)=> {
                    dispatch({type: USER_DATA, payload: email});
                    //refreshDocumentList(dispatch, 0);
                });

            })


    };
}

export function login(email, to) {

    return (dispatch) => {

        Promise.resolve()
            .then(() => Wallet.open())
            .then(wallet => {
                walletInstance = wallet;
                let id = wallet._id;
                Storage.open(walletInstance._id).then((data)=> {
                    dispatch({type: USER_DATA, payload: {email: walletInstance.email, id: walletInstance._id}});
                    refreshDocumentList(dispatch, 0);
                });
            });


    }
}
