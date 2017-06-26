const PouchDB = require('pouchdb-browser')
const couch = {
    auth: {
        username: process.env.COUCH_USERNAME,
        password: process.env.COUCH_PASSWORD
    }
};

class Storage {

    constructor(id) {
        this.local = new PouchDB(`user-${id}`);
        this.remote = new PouchDB(`http://138.197.8.148:5984/user-${id}`, couch);

    }

    replicate() {
        return this.local.replicate.from(this.remote);
        /*
         .on('complete', () => {

         this.local.get('1234').then(doc => {
         return this.local.put({
         _id: '1234',
         _rev: doc._rev,
         title: 'Updated'
         })
         }).then(()=> {
         this.local.replicate.to(remote).on('complete', () => {
         console.log('remote replicated');
         })
         })


         })
         */
    }

    static login(email, password) {
        var db = new PouchDB(`http://138.197.8.148:5984/emails`, couch);
        let promise = db.get(email);
        return promise;
    }


    static initialize(id) {
        return new Storage(id);
    }

}

module.exports = Storage;