/**
 * Dependencies
 */
const debug = require('debug')('trust:broker')
const PouchDB = require('pouchdb')

/**
 * MessageBroker
 */
class MessageBroker {

  /**
   * constructor
   *
   * @param {Object} options
   * @param {PouchDB} options.users – Users database
   * @param {PouchDB} options.lookup – User email index
   * @param {Object} options.couch – CouchDB client configuration options
   */
  constructor (options) {
    this.feeds = {}
    this.users = options.users
    this.lookup = options.lookup
    this.couch = options.couch
  }

  /**
   * bootstrap
   *
   * @description
   * Create a feed for each user and listen for changes
   *
   * @returns {Promise}
   */
  bootstrap () {
    let { users, couch } = this

    debug('bootstrapping')

    // fetch all the users
    return users.allDocs()

      // initialize a db client for each user
      .then(({rows}) => {
        rows.forEach(user => this.openFeed(user))
      })
  }

  /**
   * openFeed
   *
   * @param {Object} user
   * @returns {PouchDB}
   */
  openFeed (user) {
    let { users, couch } = this
    let id = user.id || user._id
    let db = `${ users.name }-${ id }`
    let feed = new PouchDB(db, couch)

    // listen for changes
    feed.changes({
      live: true,
      include_docs: true
    })
    .on('change', (event) => {
      this.dispatch(feed, event)
    })

    // keep a reference in memory
    this.feeds[id] = feed
    debug('opened feed %s', id)
    return Promise.resolve(feed)
  }

  /**
   * dispatch
   *
   * @description
   * Send a message to each recipient listed in a new document
   *
   * @param {PouchDB} sender
   * @param {Object} change
   *
   * @returns {Promise}
   */
  dispatch (sender, {doc}) {

    // new message
    if (doc.to && !doc.sent) {
      let recipients = this.normalizeRecipients(doc.to)

      debug('dispatching %s to %O', doc._id, recipients)

      // mark as sent
      doc.sent = new Date()

      // push to recipients
      return Promise.all(
        recipients.map(recipient => {
          this.push(recipient, doc)
        })
      )

      // update sender's feed
      .then(() => sender.put(doc))
      .catch(err => {
        // do something, but for now...
        console.log(err)
      })
    }

    // TODO
    // handle other events
  }

  /**
   * push
   *
   * @description
   * Lookup a user by email and add a doc to their feed.
   *
   * @param {string} recipient – email address of recipient
   * @param {Object} doc – document to send
   *
   * @returns {Promise}
   */
  push (recipient, doc) {
    let { feeds, lookup } = this

    return lookup.get(recipient)
      .then(({id}) => feeds[id].post(doc))
  }

  /**
   * normalizeRecipients
   *
   * @description
   * Ensure the value is an array of valid email addresses
   *
   * @param {(string|Array)} recipients
   * @returns {Array}
   */
  normalizeRecipients (recipients) {
    if (typeof recipients === 'string') {
      recipients = recipients.split(',')
    }

    recipients.forEach(email => {
      // TODO
      // trim whitespace
      // validate emailness
    })

    return recipients
  }

}

/**
 * Export
 */
module.exports = MessageBroker
