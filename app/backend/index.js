const Storage = require('./Storage');
const Wallet = require('./Wallet');


/**
 * This is for the demo purpose - subject to change
 */
let _documentStore;

const initializeStore = (id) => {
    _documentStore = new Storage(id)
    return _documentStore;
};

const documentStore = () => {
    return _documentStore;
};





module.exports = {Storage, initializeStore, documentStore, Wallet};