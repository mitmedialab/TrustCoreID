/**
 * Dependencies
 */
const { JWT, JWD } = require('@trust/jose')
const crypto = require('@trust/webcrypto')
const CryptoJS = require('crypto-js')
const fs = require('fs')
const keyto = require('@trust/keyto')
const solc = require('solc')
const TestRPC = require('ethereumjs-testrpc')
const Tx = require('ethereumjs-tx')
const Web3 = require('web3')

/**
 * Constants
 */
const SMART_CONTRACT_FILE = 'SimpleStorage.sol'


class EthereumClient {

  constructor(privateKey) {
    this.secretKey = keyto.from(privateKey.handle, 'pem').toString('blk', 'private')
    this.web3 = new Web3(TestRPC.provider({
      accounts: [{
          secretKey: '0x' + this.secretKey,
          balance: '0x100000000000000000'  // fund newly generated account
        }]
    }))
  }

  /**
   * putItOnTheBlockchain
   */
  putItOnTheBlockchain(dataHash) {
    let address = this.computeEthereumAddressFromPrivateKey()
    let compiledContract = this.compile(SMART_CONTRACT_FILE)
    let Key = new Buffer(this.secretKey, 'hex')

    return Promise.resolve() 
    
      .then(() => {
        return this.createRawTransaction(compiledContract.bytecode, address, '0x0')
      })

      .then(tx => {
        tx.sign(Key)
        return tx.serialize()
      })

      .then(serializedTx => {
        return this.sendRawTransaction(serializedTx.toString('hex'))
      })

      .then(txHash => {
        return this.getAsyncTransactionReceipt(txHash)
      })

      .catch(console.log)
  }

  /**
   * getAsyncTransactionReceipt
   */
  getAsyncTransactionReceipt(txHash) {
    let blockFilter = this.web3.eth.filter('latest')
    return new Promise((resolve, reject) => {
      blockFilter.watch( () => {
        this.web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
          if (err) {
            reject(err)
          } else {
            blockFilter.stopWatching(() => {
              resolve(receipt)
            })
          }
        })
      })
    })
  }

  /**
   * createRawTransaction
   */
  createRawTransaction(bytecode, from) {
    let gasLimit = this.web3.toHex(3000000)
    let gasPrice

    return Promise.resolve() 

      .then(() => {
        return this.getGasPrice()
      })

      .then(price => {
        gasPrice = price
        return this.getTransactionCount(from)
      })

      .then(txCount => {
        let _rawTx = {
          nonce: this.web3.toHex(txCount),
          gasPrice: this.web3.toHex(gasPrice),
          gasLimit: gasLimit,
          data: '0x' + bytecode,
          from: from
        }

        return new Tx(_rawTx)
      })
    
      .catch(console.log)
  }

  /**
   * getGasPrice
   */
  getGasPrice() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getGasPrice((err, gasPrice) => {
        if (err) {
          reject(error)
        } else {
          resolve(gasPrice)
        }
      })
    })
  }

  /**
   * getTransactionCount
   */
  getTransactionCount(address) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionCount(address, (err, txCount) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(txCount)
          }
      })
    })
  }

  /**
   * sendRawTransaction
   */
  sendRawTransaction(tx) {
    return new Promise((resolve, reject) => {
      this.web3.eth.sendRawTransaction(tx, (err, txHash) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(txHash)
          }
      })
    })
  }

  /**
   * compile
   */
  compile(filename) {
    let source = fs.readFileSync(filename, 'utf8')
    let output = solc.compile(source, 1)

    return output.contracts[':' + SMART_CONTRACT_FILE.split('.sol')[0]]
  };

  /**
   * computeEthereumAddressFromPrivateKey
   */
  computeEthereumAddressFromPrivateKey() {
    let publicKey = keyto.from(this.secretKey, 'blk').toString('blk', 'public').slice(2)
    let pubKeyWordArray = CryptoJS.enc.Hex.parse(publicKey)
    let hash = CryptoJS.SHA3(pubKeyWordArray, {
        outputLength: 256
    })

    return hash.toString(CryptoJS.enc.Hex).slice(24)
  };

}

module.exports = EthereumClient
