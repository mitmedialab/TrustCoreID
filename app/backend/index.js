const Storage = require('./Storage');
const Wallet = require('./Wallet');

let documentStore = new Storage();

module.exports = {documentStore, Wallet};