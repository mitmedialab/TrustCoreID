const PouchDB = require('pouchdb');

class Storage {

    constructor(id) {
        this.store = new PouchDB('documents');
        this.store.info().then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        })
    }


    pushDraft(doc) {
        this.store.put(doc);
    }
}
module.exports = Storage;