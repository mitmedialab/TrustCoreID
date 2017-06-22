/**
 * Dependencies
 */
const { HTTPService } = require('@trust/http-service')
const JWKSetRequest = require('./handlers/JWKSetRequest')
const RegistrationRequest = require('./handlers/RegistrationRequest')

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
 * Export
 */
module.exports = AccountService
