/**
 * Dependencies
 */
const fs = require('fs')
const fetch = require('node-fetch')
const keyto = require('@trust/keyto')
const crypto = require('@trust/webcrypto')
const { JWD } = require('@trust/jose')

/**
 * Constants
 */
const WALLET_FILE = 'unsafe-wallet.json'


/**
 * UnsafeWallet
 *
 * @class
 * This class demonstrates use of an ECDSA keypair with
 * secp256k1 curve for both blockchain transactions and
 * JSON Object Signing and Encryption (JOSE).
 *
 * This code should be considered experimental and not
 * used in production.
 */
class UnsafeWallet {

  constructor (data = {}) {
    Object.assign(this, data)
  }

  /**
   * open
   *
   * @description
   * Create an UnsafeWallet instance, importing a stored keypair
   * or generating and storing new public and private keys.
   *
   * @todo
   * store keys using a standard wallet format with encrypted
   * serialization and password/phrase. This is ONLY for demo.
   *
   * @returns {UnsafeWallet}
   */
  static open () {
    let data

    try {
      data = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf8'))
    } catch (err) {
      if (!err.code === 'ENOENT') { throw err }
    }

    let wallet = new UnsafeWallet(data)

    if (data) {
      return wallet.importKeypair(data)
    } else {
      return wallet.generateKeypair().then(() => wallet.save())
    }

    // TODO
    // instantiate web3
    // import providers keys
  }

  /**
   * save
   *
   * @description
   * Serialize the wallet and save it in a file
   *
   * @returns {UnsafeWallet}
   */
  save () {
    return this.exportKeypair().then(data => {
      let serialized = JSON.stringify(Object.assign({}, this, data), null, 2)
      fs.writeFileSync(WALLET_FILE, serialized)
      return this
    })
  }

  /**
   * generateKeypair
   *
   * @description
   * Create a new ESDSA keypair for secp256k1 signing.
   *
   * @returns {UnsafeWallet}
   */
  generateKeypair () {
    let wallet = this

    return crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'K-256',
        hash: { name: 'SHA-256' }
      },
      true,
      [
        'sign',
        'verify'
      ]
    )
    .then(keypair => {
      Object.defineProperties(wallet, {
        publicCryptoKey: {
          enumerable: false,
          value: keypair.publicKey
        },
        privateCryptoKey: {
          enumerable: false,
          value: keypair.privateKey
        }
      })

      return keypair
    })
    .then(keypair => {
      return crypto.subtle.exportKey('jwk', this.publicCryptoKey).then(jwk => {
        this.publicJwk = jwk
        return this
      })
    })
  }

  /**
   * importKeypair
   *
   * @description
   * Import JWK representations of a key pair to the wallet.
   *
   * @param {Object} data – Parsed JWK objects
   * @returns {UnsafeWallet}
   */
  importKeypair (data) {
    let {publicJwk,privateJwk} = data
    let algorithm = { name: 'ECDSA', namedCurve: 'K-256', hash: { name: 'SHA-256' } }

    return Promise.all([
      crypto.subtle.importKey('jwk', publicJwk, algorithm, true, ['verify']),
      crypto.subtle.importKey('jwk', privateJwk, algorithm, true, ['sign'])
    ])
    .then(keys => {
      let [publicKey,privateKey] = keys

      Object.defineProperties(this, {
        publicCryptoKey: {
          enumerable: false,
          value: publicKey
        },
        privateCryptoKey: {
          enumerable: false,
          value: privateKey
        }
      })

      this.publicJwk = publicJwk
      //this.publicHex = keyto.from(publicJwk, 'jwk').toString('blk', 'public')
      //this.publicPem = keyto.from(publicJwk, 'jwk').toString('pem', 'public')

      return this
    })
  }

  /**
   * exportKeypair
   *
   * @description
   * Export keys from the wallet as JWKs.
   *
   * @returns {Object}
   */
  exportKeypair () {
    return Promise.all([
      crypto.subtle.exportKey('jwk', this.publicCryptoKey),
      crypto.subtle.exportKey('jwk', this.privateCryptoKey)
    ])
    .then(keys => {
      let [publicJwk, privateJwk] = keys
      return {publicJwk,privateJwk}
    })
  }

  /**
   * registerPublicKey
   *
   * @description
   * Register a public key with a provider to object a certificated key.
   */
  registerPublicKey (options) {
    let { provider, registration } = options

    return fetch(`${provider}/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.assign({}, registration, { jwk: this.publicJwk }))
    })
    .then(res => res.json())
    .then(user => {
      Object.assign(this, user)
    })
    .then(() => this.save())

  }

  /**
   * registerProvider
   */
  registerProvider () {}

  /**
   * resolveKeys () {}
   *
   * @description
   * Given a JWT or JWD, extract or fetch signing keys,
   * verify certificates, and resolve a promise with
   * keys for signature verification.
   */
  resolveKeys () {
    // uhm... yeah
  }

  /**
   * verifyCertificate
   */
  verifyCertificate () {}

  /**
   * verifyDocument
   */
  verifyDocument (doc) {
    let jwd = JWD.decode(doc)
    return Promise.resolve()
      .then(() => jwd.resolveKeys())
      .then(cryptoKeys => jwd.verify({ cryptoKeys }))
  }

  /**
   * signDocument
   *
   * @description
   *
   * @param {(JWT|JWD|Object|string)} doc
   */
  signDocument (doc) {
    return JWD.sign(doc, {
      signatures: [
        {
          'protected': this.protectedHeader(),
          cryptoKey: this.privateCryptoKey
        }
      ]
    })
  }

  /**
   * protectedHeader
   */
  protectedHeader () {
    return {
      alg: 'KS256',
      jwk: this.publicJwk   // TODO replace this with key certificated by a provider
    }
  }

  /**
   * hashAndPutItOnTheBlockchain
   */
  hashAndPutItOnTheBlockchain () {
    // because hashAndPutItOnTheBlockchain
  }

}

/**
 * Export
 */
module.exports = UnsafeWallet

//Promise.resolve()
//  .then(() => UnsafeWallet.open())
//  .then(wallet => wallet.registerPublicKey({
//    provider: 'http://localhost:5150',
//    registration: {
//      name: '1337 H4x0r',
//      email: 'p0wn3d@yomama.io'
//    }
//  }))
//  //.then(wallet => wallet.signDocument({ payload: { hello: 'world' } }))
//  //.then(wallet => console.log(wallet.privateJwk))
//  .then(console.log)
//  .catch(console.error)
