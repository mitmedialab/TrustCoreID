/**
 * Dependencies
 */
require('dotenv').config()
const debug = require('debug')('trust:server')
const express = require('express')
const PouchDB = require('pouchdb')
const bodyParser = require('body-parser')
const crypto = require('@trust/webcrypto')
const KeyChain = require('@trust/keychain')
const { JWT } = require('@trust/jose')
const { BaseRequest, HTTPService } = require('@trust/http-service')
const AccountService = require('./AccountService')
const MessageBroker = require('./MessageBroker')

/**
 * Disclaimer
 */
let disclaimer = `


  💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀         WARNING          💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀

  This API is experimental and makes dangerous use of cryptography to illustrate
  certain high level ideas. In particular, ECDSA secp256k1 is not considered to
  be safe against quantum computing.

  Under no circumstances should non-experts adopt any techniques witnessed here
  without expert guidance.

  💀 💀 💀 💀 💀 💀 💀 💀 💀 💀   YOU HAVE BEEN WARNED. CARRY ON.  💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀


`

/**
 * CouchDB
 */
const couch = {
  auth: {
    username: process.env.COUCH_USERNAME,
    password: process.env.COUCH_PASSWORD
  }
}


/**
 * Create Server
 */
let server = express()

/**
 * Mount Middleware
 */
server.use(bodyParser.json())

/**
 * Signing Keys
 */
let keys = new KeyChain({
  certs: { alg: 'KS256' }
})

keys.rotate().then(() => debug('rotated keys'))

/**
 * CouchDb Client
 */
let users = new PouchDB(`${ process.env.COUCH_URL }/users`, couch)
let emailIndex = new PouchDB(`${ process.env.COUCH_URL }/emails`, couch)

/**
 * MessageBroker
 */
let broker = new MessageBroker({
  users,
  lookup: emailIndex,
  couch
})

broker.bootstrap().then(() => debug('booted message broker'))

/**
 * Instantiate Services
 */
let accounts = AccountService.create({}, {
  server, express, users, emailIndex, broker, keys
})

/**
 * Mount Services
 */
server.use(accounts.router)

/**
 * Disclaimer
 */
server.get('/', (req, res) => {
  res.send(disclaimer)
})

/**
 * Start Server
 */
server.listen(process.env.PORT || 5150, () => debug(`started`))
