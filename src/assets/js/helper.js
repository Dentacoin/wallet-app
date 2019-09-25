const Web3 = require('../../../node_modules/web3'); // import web3 v1.0 constructor
const keythereum = require('../../../node_modules/keythereum');
const EthCrypto = require('../../../node_modules/eth-crypto');
var Wallet = require('../../../node_modules/ethereumjs-wallet');

// use globally injected web3 to find the currentProvider and wrap with web3 v1.0
const getWeb3 = (provider) => {
    if(provider === undefined)  {
        provider = null;
    }
    const myWeb3 = new Web3(provider);
    return myWeb3;
};

// assumes passed-in web3 is v1.0 and creates a function to receive contract name
const getContractInstance = (web3) => (contractName, address) => {
    const instance = new web3.eth.Contract(contractName.abi, address);
    return instance;
};

function generateKeystoreFile(password, callback) {
    var dk = keythereum.create({keyBytes: 32, ivBytes: 16});
    keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, {
        cipher: 'aes-128-ctr',
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: 'hmac-sha256'
        }
    }, function(result) {
        const public_key = EthCrypto.publicKeyByPrivateKey(dk.privateKey.toString('hex'));

        callback(public_key, result);
    });
}

function importKeystoreFile(keystore, password) {
    try {
        const keyObject = JSON.parse(keystore);
        const private_key = keythereum.recover(password, keyObject);
        const public_key = EthCrypto.publicKeyByPrivateKey(private_key.toString('hex'));
        return {
            success: keyObject,
            public_key: public_key,
            address: JSON.parse(keystore).address
        }
    } catch (e) {
        return {
            error: true,
            message: 'Wrong secret password.'
        }
    }
}

function decryptKeystore(keystore, password) {
    try {
        return {
            success: keythereum.recover(password, JSON.parse(keystore)), to_string: keythereum.recover(password, JSON.parse(keystore)).toString('hex')
        }
    } catch (e) {
        return {
            error: true,
            message: 'Wrong secret password.'
        }
    }
}

function validatePrivateKey(private_key) {
    try {
        const public_key = EthCrypto.publicKeyByPrivateKey(private_key);
        const address = EthCrypto.publicKey.toAddress(public_key);

        return {
            success: {
                public_key: public_key,
                address: address
            }
        };
    } catch (e) {
        return {
            error: true,
            message: 'Wrong secret private key.'
        }
    }
}

function generateKeystoreFromPrivateKey(private_key, password) {
    try {
        const public_key = EthCrypto.publicKeyByPrivateKey(private_key);
        const address = EthCrypto.publicKey.toAddress(public_key);
        const wallet = Wallet.fromPrivateKey(Buffer.from(private_key, 'hex'));
        const keystore_file = wallet.toV3String(password);

        return {
            success: {
                keystore_file: keystore_file,
                public_key: public_key,
                address: address
            }
        };
    } catch (e) {
        return {
            error: true,
            message: 'Wrong secret private key.'
        }
    }
}

module.exports = {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore, validatePrivateKey, generateKeystoreFromPrivateKey};

