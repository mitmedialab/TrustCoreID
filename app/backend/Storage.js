const PouchDB = require('pouchdb');
/**
 * CouchDB
 */
const couch = {
    auth: {
        username: 'coreid',
        password: 'coreidforevar'
    }
}

console.log(couch);
let cache;

class Storage {

    static open(id) {
        if (!cache) {
            if (!id) {
                throw new Error('Storage was not initialized with any id');
            }
            cache = new Storage(id);
        }

        return Promise.resolve(cache);
    }

    constructor(id) {
        this.store = new PouchDB(`documents-${id}`);
        this.localFeed = new PouchDB(`users-${id}`);
        this.remoteFeed = new PouchDB(`http://138.197.8.148:5984/users-${id}`, couch);

        this.localFeed.sync(this.remoteFeed, {
            live: true
        }).on('change', function (change) {
            console.log(change)
        }).on('error', function (err) {
            console.log(err);
        });
        this.localFeed.allDocs({
            include_docs: true,
            attachments: true
        }).then(data => {
            console.log(data.rows);
        })


    }

    put(doc) {
        return this.store.put(doc);
    }

    putToFeed(doc) {
        delete doc._rev;
        return this.localFeed.put(doc);
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
        return this.store.remove(doc).catch(err => console.log);
    }

}
module.exports = Storage;