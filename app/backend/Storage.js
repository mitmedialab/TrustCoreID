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

    static open(id, callback) {
        if (!cache) {
            if (!id) {
                throw new Error('Storage was not initialized with any id');
            }
            cache = new Storage(id);
            cache.callback = callback;
        }

        return Promise.resolve(cache);
    }

    constructor(id) {
        this.store = new PouchDB(`documents-${id}`);
        this.localFeed = new PouchDB(`users-${id}`);

        this.remoteFeed = new PouchDB(`http://138.197.8.148:5984/users-${id}`, couch);

        this.localFeed.sync(this.remoteFeed, {
            live: true
        });

        this.remoteFeed.changes({
                live: true,
                include_docs: true
            })
            .on('change', (update) => {
                let {doc}= update.doc;

                if (doc) {

                    delete doc['_rev'];
                    this.store.get(doc._id).then(data => {
                        console.log('found', data);
                        let updated = Object.assign(data, doc);
                        this.store.put(updated).then(data => {
                            if (this.callback) {
                                this.callback();
                            }
                        }).catch(err=> {
                            console.log('err', err)
                        })
                    }).catch(err => {
                        console.log('err', err);
                        delete doc['_rev'];
                        this.store.put(doc).then(data => {
                            console.log(this.callback)
                            if (this.callback) {
                                this.callback();
                            }
                        }).catch(err=> {
                            console.log('err', err)
                        })
                    });
                }
            });

    }

    get localStorage() {
        return this.store;
    }

    put(doc, storeToFeed) {
        if (storeToFeed) {
            return this.putToFeed(doc);
        } else {
            return this.store.put(doc)
        }
    }

    putToFeed(doc) {
        delete doc._rev;
        let updateList = doc.to.concat([doc.from]);
        let promiseArray = [];
        updateList.forEach(to=> {
            promiseArray.push(this.localFeed.post({to, from: doc.from, doc}));
        });
        return Promise.all(promiseArray);
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