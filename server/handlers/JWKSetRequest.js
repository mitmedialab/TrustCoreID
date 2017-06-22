/**
 * Dependencies
 */
const { BaseRequest } = require('@trust/http-service')

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
 * Export
 */
module.exports = JWKSetRequest
