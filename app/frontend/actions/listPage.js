const {Storage, Wallet} = require('electron').remote.require('./backend');
import {refreshDocumentList} from './anon';


export function send(item, email) {

    return (dispatch) => {
        Storage.open().then(store => {
            let update = Object.assign({}, item, {from: email});
            store.put(update, true).then(data => {
                refreshDocumentList(dispatch);
            }).catch(err=> {
                console.log('error while storing', err);
            })
        });
    }
}

export function sign(item) {

    return (dispatch) => {
        Promise.resolve()
            .then(() => Wallet.open())
            .then(wallet => wallet.signDocument(item))
            .then(updated => {
                let up = JSON.parse(updated);
                let signaturesList = item.signatures ? item.signatures : [];
                item.signatures = signaturesList.concat(up.signatures);
                Storage.open().then(store => {
                    store.put(JSON.parse(JSON.stringify(item)), true).then(doc => {
                            refreshDocumentList(dispatch);
                        })
                        .catch(err => {
                            refreshDocumentList(dispatch);
                        })
                });
            })

    }
}

export function remove(item) {

    return (dispatch) => {
        Storage.open().then(documentStore => documentStore.remove(item).then(()=> {
            refreshDocumentList(dispatch);
        }))

    }
}