export const SELECT_DOCUMENT = 'SELECT_DOCUMENT';
export const SIGN_DOCUMENT = 'SIGN_DOCUMENT';

const UnsafeWallet = require('electron').remote.require('./backend/Wallet')


export function select(item) {
    return {
        type: SELECT_DOCUMENT,
        payload: item
    };
}


export function sign(item) {

    Promise.resolve()
        .then(() => UnsafeWallet.open())
        .then(wallet => wallet.signDocument({payload: item}))
        .then(console.log)
        .catch(console.error)

    return (dispatch) => {

    }


}