/**
 * Dependencies
 */
require('dotenv').config()
const express = require('express')
const PouchDB = require('pouchdb')
const bodyParser = require('body-parser')
const crypto = require('@trust/webcrypto')
const KeyChain = require('@trust/keychain')
const { JWT } = require('@trust/jose')
const { BaseRequest, HTTPService } = require('@trust/http-service')

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
 * RegistrationRequest
 *
 * @example
 *
 * POST /account/register HTTP/1.1
 * Content-Type: application/json
 * Host: localhost:5150
 *
 * {
 *   "name": "John",
 *   "email": "john@example.com",
 *   "jwk": {
 *     "kty":"EC",
 *     "crv":"K-256",
 *     "x": "VidsLuHSQtXJGZUXDaZhdhtHat42TJ__XmQQjO87qKc",
 *     "y": "4hWu3J4xq_KcnyWrJccZaipFSlwzr8shSddgciWIcM4",
 *     "key_ops":["verify"],
 *     "ext":true
 *   }
 * }
 *
 * HTTP/1.1 201 Created
 * Content-Type: application/json; charset=utf-8
 *
 * {
 *   "_id": "45070382449322977e1b2cb7d6020b9e",
 *   "_rev": "1-0f1d198f276531cbbfb85afff8194c5d",
 *   "name": "John",
 *   "email": "john@example.com",
 *   "jwk": {
 *     "kty": "EC",
 *     "crv": "K-256",
 *     "x": "VidsLuHSQtXJGZUXDaZhdhtHat42TJ__XmQQjO87qKc",
 *     "y": "4hWu3J4xq_KcnyWrJccZaipFSlwzr8shSddgciWIcM4",
 *     "key_ops": [
 *       "verify"
 *     ],
 *     "ext": true
 *   },                                          },
 *   "cert": "eyJhbGciOiJLUzI1NiIsImprdSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vandrcyJ9.eyJqd2siOnsia3R5IjoiRUMiLCJjcnYiOiJLLTI1NiIsIngiOiJWaWRzTHVIU1F0WEpHWlVYRGFaaGRodEhhdDQyVEpfX1htUVFqTzg3cUtjIiwieSI6IjRoV3UzSjR4cV9LY255V3JKY2NaYWlwRlNsd3pyOHNoU2RkZ2NpV0ljTTQiLCJrZXlfb3BzIjpbInZlcmlmeSJdLCJleHQiOnRydWV9fQ.MEUCIEGPRDzA7YwR5Z2fAmZFAjTPRQqNIkIx0En0TrlhP5cwAiEAu7mrANw78S7P82dInUcZaaKri-gOvRHVOoeGrBjYbKM"
 * }
 */
class RegistrationRequest extends BaseRequest {

  /**
   * route
   */
  static get route () {
    return {
      path: '/account/register',
      method: 'POST'
    }
  }

  /**
   * handle
   */
  static handle (req, res, service) {
    let request = new RegistrationRequest(req, res, service)

    Promise.resolve()
      .then(() => request.validate())
      .then(() => request.certifyPublicKey())
      .then(() => request.register())
      .then(() => request.createActivityFeed())
      .then(() => request.respond())
      .catch(err => request.error(err))
  }

  /**
   * validate
   */
  validate () {
    let { req: { body } } = this

    if (!body.name) {
      return this.badRequest({
        error: 'invalid_request',
        error_description: 'Missing "name" property'
      })
    }

    if (!body.email) {
      return this.badRequest({
        error: 'invalid_request',
        error_description: 'Missing "email" property'
      })
    }

    if (!body.jwk) {
      return this.badRequest({
        error: 'invalid_request',
        error_description: 'Missing "jwk" property'
      })
    }

    this.user = Object.assign({}, body)
  }

  /**
   * certificatePublicKey
   */
  certifyPublicKey () {
    let { req, service } = this
    let { body: { jwk } } = req
    let { keys: { certs } } = service
    let cryptoKey = certs.privateKey

    return JWT.sign({
      header: {
        alg: 'KS256',
        jku: 'https://example.com/jwks'
      },
      payload: {
        iss: 'Ye auld CA',
        sub: 'hashofemail?',
        jwk: this.req.body.jwk,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365)
      },
      serialization: 'compact',
      cryptoKey
    })
    .then(cert => {
      this.cert = cert
    })
  }

  /**
   * register a user
   */
  register () {
    let { req, service, user, cert } = this
    let { couch, users } = service

    return users.post(user).then(result => {
      let { id: _id, rev: _rev } = result

      this.user = Object.assign({ _id, _rev }, user, { cert })
    })
  }

  /**
   * createActivityFeed
   */
  createActivityFeed () {
    let { service: { users }, user } = this
    let db = `${users.name}-${user._id}`
    let feed = new PouchDB(db, couch)

    return feed.post({ created: Date.now() })
  }

  /**
   * respond
   */
  respond () {
    let { res, user } = this

    res.status(201).json(user)
  }

}

/**
 * JWKSetRequest
 *
 * @example
 *
 * GET /jwks HTTP/1.1
 * Host: localhost:5150
 *
 * HTTP/1.1 200 OK
 * Content-Type: application/json; charset=utf-8
 *
 * {
 *   "keys": [
 *     {
 *       "kid":"VpHHPrrhMoA",
 *       "kty":"EC",
 *       "crv":"K-256",
 *       "x":"SOsRpwAb7cih7qI8QBlmB9E_57rv-p4sZrkYhFdkW_A",
 *       "y":"6d4AdBLeD1Z1v5jEO1Fd_fZ5kCduSyLMXxXVcUX4FGA",
 *       "key_ops":["verify"],
 *       "ext": true
 *     }
 *   ]
 * }
 */
class JWKSetRequest extends BaseRequest {

  static get route () {
    return {
      path: '/jwks',
      method: 'GET'
    }
  }

  static handle (req, res, service) {
    res.type('json')
    res.send(service.keys.jwkSet)
  }

}

/**
 * AccountService
 */
class AccountService extends HTTPService {

  /**
   * handlers
   */
  get handlers () {
    return [
      JWKSetRequest,
      RegistrationRequest
    ]
  }

}

/**
 * Create Server
 */
let server = express()

/**
 * Signing Keys
 */
let keys = new KeyChain({
  certs: { alg: 'KS256' }
})

keys.rotate()

/**
 * CouchDb Client
 */
let users = new PouchDB(process.env.COUCH_USERS, couch)

/**
 * Instantiate Services
 */
let accounts = AccountService.create({}, { server, express, users, keys })
// moar ...

/**
 * Mount Middleware
 */
server.use(bodyParser.json())

/**
 * Mount Services
 */
server.use(accounts.router)
// moar ...


/**
 * Disclaimer
 */
server.get('/', (req, res) => {
  res.send(disclaimer)
})

/**
 * Start Server
 */
server.listen(process.env.PORT || 5150)
