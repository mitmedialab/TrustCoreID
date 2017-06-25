/**
 * Dependencies
 */
const debug = require('debug')('trust:http:register')
const crypto = require('crypto')
const { JWT } = require('@trust/jose')
const { BaseRequest } = require('@trust/http-service')

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
      .then(() => request.indexEmailHash())
      .then(() => request.respond())
      .catch(err => request.error(err))
  }

  /**
   * validate
   */
  validate () {
    let { req: { body } } = this
    debug('validating')

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
    let { body: { jwk, email } } = req
    let { keys: { certs } } = service
    let cryptoKey = certs.privateKey
    let kid = certs.publicJwk.kid // "CA"'s pub key id
    let issuer = `http://${ process.env.HOST }:${ process.env.PORT || 5150 }`
    debug('certificating public key')

    return JWT.sign({
      header: {
        alg: 'KS256',             // Signing algorithm
        kid: kid,                 // CU's public key identifier
        jku: `${issuer}/jwks`     // location of CU's published public keys
      },
      payload: {
        jti: jwk.jti || crypto.randomBytes(10).toString('hex'),   // Certicate identifier
        kid: jwk.kid || crypto.randomBytes(10).toString('hex'),   // Subject's public key identifier
        iss: issuer,                                              // URI of CU
        sub: email, // hash this                                  // Owner of certificated public key
        kty: jwk.kty,                                             // Algorithm family of key (i.e., RSA, EC, oct)
        crv: jwk.crv,                                             // Curve identifier
        x: jwk.x,                                                 // Key material
        y: jwk.y,                                                 // Key material
        key_ops: jwk.key_ops,                                     // Operations permitted with this key
        ext: jwk.ext,
        iat: Math.floor(Date.now() / 1000),                       // Time of certification
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) // Time of certificate expiration
      },
      serialization: 'compact',
      cryptoKey
    })
    .then(cert => {
      this.cert = cert
      this.user.cert = cert
      debug('certificated public key')
    })
  }

  /**
   * register a user
   */
  register () {
    let { req, service, user, cert } = this
    let { couch, users } = service
    debug('registering user')

    return users.post(user).then(result => {
      let { id: _id, rev: _rev } = result

      this.user = Object.assign({ _id, _rev }, user, { cert })
      debug('created user %o', this.user)
    })
  }

  /**
   * createActivityFeed
   */
  createActivityFeed () {
    let { service: { broker }, user } = this
    debug('creating feed')

    return broker.openFeed(user).then(feed => {
      feed.post({
        msg: 'Welcome to your new cryptographic life',
        created: Date.now()
      })
    })
  }

  /**
   * indexEmailHash
   */
  indexEmailHash () {
    let { service: { emailIndex }, user } = this
    debug('indexing user %s by email %s', user._id, user.email)

    return emailIndex.put({
      _id: user.email,
      user_id: user._id
    })
    .catch(err => debug('uh oh, indexing by email failed %o', err))
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
 * Export
 */
module.exports = RegistrationRequest
