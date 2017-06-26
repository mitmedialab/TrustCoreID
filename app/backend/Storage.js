const merkle = require('merkle')
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
        }).on('error', function (err) {
            console.log('Error on sync', err)
        });

        this.localFeed.changes({
                live: true,
                since: 'now',
                include_docs: true
            })
            .on('change', (update) => {
                let {doc}= update.doc;
                if (doc) {
                    this.store.get(doc._id).then(data => {
                        let updated = Object.assign(data, doc);
                        console.log('\nUpdating ', doc._id);
                        this.store.put(updated).then(data => {
                            if (this.callback) {
                                this.callback();
                            }
                        }).catch(err=> {
                            console.log('Err [update]', err)
                        })
                    }).catch(err => {
                        console.log('Creating ', doc._id);
                        this.store.put(doc).then(data => {
                            console.log(this.callback)
                            if (this.callback) {
                                this.callback();
                            }
                        }).catch(err=> {
                            console.log('Err [create]', err)
                        })
                    });
                }
            }).on('error', function (err) {
            console.log('Local Feed changes err:', err)
        });

    }

    get localStorage() {
        return this.store;
    }

    put(doc, storeToFeed, attachments) {
        if (storeToFeed) {
            return this.putToFeed(doc);
        } else {
            if (attachments) {
                let files = []

                doc._attachments = {};
                attachments.forEach(attachment => {

                    let filename = attachment.fileName.substr(attachment.fileName.lastIndexOf('/') + 1)
                    files.push(attachment.fileName)

                    doc._attachments[filename] = {
                        content_type: attachment.content_type,
                        data: attachment.data
                    }
                })

                let tree = merkle('sha256').sync(files)
                doc.payload.merkleRoot = tree.root()
            }
            return this.store.put(doc)
        }
    }

    getAttachment(document, attachment) {
        return this.store.getAttachment(document, attachment)
    }

    putToFeed(doc) {
        delete doc._rev;
        let updateList = doc.to.concat([doc.from]);
        let promiseArray = [];
        updateList.forEach(to=> {
            let promise = this.localFeed.post({to, from: doc.from, doc});
            promise.catch(err => {
                console.log("Error while posting to feed. ", err)
            });
            promiseArray.push(promise);
        });
        let collection = Promise.all(promiseArray);

        collection.catch(err=> {
            console.log('Promise(All) error:', err);
        });

        return collection;
    }

    getFeedItems(skip = 0, limit = 5) {
        return this.localFeed.allDocs({
            skip, limit,
            include_docs: true,
            descending: true
        })
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
