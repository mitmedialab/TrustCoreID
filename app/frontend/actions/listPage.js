const {Storage, Wallet} = require('electron').remote.require('./backend');
import {refreshDocumentList,ids} from './anon';


export function send(item) {
   return (dispatch) => {
       Storage.open().then(store => {
          store.putToFeed(item).then(item => {
              //dispatch
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
                if (item.signatures) {
                    up.signatures.push(up.signatures[up.signatures.length - 1]);
                }
                let it = Object.assign(item, up);
                return documentStore().put(JSON.parse(JSON.stringify(it)));
            })
            .then(update => {
                return documentStore().get(update.id);
            })
            .then(doc => {
                let promises = [];
                doc.to.forEach(to=> {
                    let newItem = JSON.parse(JSON.stringify(doc));
                    newItem._rev = undefined;
                    let store = new Storage(ids[to]);
                    promises.push(store.put(newItem))
                });

                return Promise.all(promises);
            })
            .then(doc => {
                refreshDocumentList(dispatch, 2);
            })
            .catch(err => {
                refreshDocumentList(dispatch, 2);
            })
    }
}

export function remove(item) {

    return (dispatch) => {
        Storage.open().then(documentStore => documentStore.remove(item).then(()=> {
            refreshDocumentList(dispatch, 1);
        }))

    }
}