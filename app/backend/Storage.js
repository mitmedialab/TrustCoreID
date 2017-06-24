const PouchDB = require('pouchdb');

class Storage {

    constructor(id) {
        this.store = new PouchDB(`documents-${id}`);
        this.store.info().then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        })
    }

    put(doc) {
        return this.store.put(doc);
    }

    get(id) {
        return this.store.get(id);
    }

    list() {
        return this.store.allDocs({
            include_docs: true,
            attachments: true
        })
    }

    remove(doc) {
        return this.store.remove(doc);
    }

}
module.exports = Storage;