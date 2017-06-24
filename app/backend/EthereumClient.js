/**
 * Dependencies
 */
const { JWT, JWD } = require('@trust/jose')
const crypto = require('@trust/webcrypto')
const CryptoJS = require('crypto-js')
const fs = require('fs')
const keyto = require('@trust/keyto')
const solc = require('solc')
//const TestRPC = require('ethereumjs-testrpc')
const Tx = require('ethereumjs-tx')
const Web3 = require('web3')

/**
 * Constants
 */
const SMART_CONTRACT_FILE = 'SimpleStorage.sol'


class EthereumClient {

  constructor(privateKey) {
    this.secretKey = keyto.from(privateKey.handle, 'pem').toString('blk', 'private')
    //this.web3 = new Web3(TestRPC.provider({
      //accounts: [{
          //secretKey: '0x' + secretKey,
          //balance: '0x100000000000000000'  // fund newly generated account
        //}]
    //}))
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  /**
   * putItOnTheBlockchain
   */
  putItOnTheBlockchain(dataHash) {
    let address = this.computeEthereumAddressFromPrivateKey()
    let compiledContract = this.compile(SMART_CONTRACT_FILE)
    let tx = this.createRawTransaction(compiledContract.bytecode, address, '0x0')
    let Key = new Buffer(this.secretKey, 'hex')
    tx.sign(Key)
    let serializedTx = tx.serialize()

    return new Promise((resolve, reject) => {
        return this.web3.eth.sendRawTransaction(serializedTx.toString('hex'), (err, txHash) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(txHash)
          }
        })
      })

      .then(txHash => {
        let blockFilter = this.web3.eth.filter('latest');
        return new Promise((resolve, reject) => {
          blockFilter.watch( () => {
            this.web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
              if (err) {
                reject(err)
              }
              if (receipt) {
                blockFilter.stopWatching()
                resolve(receipt)
              }
            })
          })
        })
      })

      .catch(console.log)
  }

  /**
   * getAsyncTransactionReceipt
   */
  getAsyncTransactionReceipt(txHash) {
    let blockFilter = this.web3.eth.filter('latest')
    let promise = new Promise((resolve, reject) => {
      blockFilter.watch( () => {
        this.web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
          if (err) {
            console.error(err)
            reject(err)
          }
          if (receipt) {
            blockFilter.stopWatching()
            resolve(receipt)
          }
        })
      })
    })
    return promise
  }

  /**
   * createRawTransaction
   */
  createRawTransaction(bytecode, from) {
    let _nonce = this.web3.toHex(this.web3.eth.getTransactionCount(from))
    let _gasPrice = this.web3.toHex(this.web3.eth.gasPrice)
    let _gasLimit = this.web3.toHex(3000000)

    let _rawTx = {
      nonce: _nonce,
      gasPrice: _gasPrice,
      gasLimit: _gasLimit,
      data: '0x' + bytecode,
      from: from
    }

    return new Tx(_rawTx)
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
