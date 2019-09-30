const Web3 = require('../../../node_modules/web3'); // import web3 v1.0 constructor
const keythereum = require('../../../node_modules/keythereum');
const EthCrypto = require('../../../node_modules/eth-crypto');
//var Wallet = require('../../../node_modules/ethereumjs-wallet');

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
    /*console.log('importKeystoreFile');
    try {*/
        const keyObject = JSON.parse(keystore);
        console.log(password, 'password');
        console.log(keyObject, 'keyObject');
        keythereum.recover(password, keyObject, function(private_key) {
            console.log(private_key, 'private_key');
            console.log(private_key.toString('hex'), 'private_key.toString(\'hex\')');
            /*const public_key = EthCrypto.publicKeyByPrivateKey(private_key.toString('hex'));
            console.log(public_key, 'public_key');
            return {
                success: keyObject,
                public_key: public_key,
                address: JSON.parse(keystore).address
            }*/
        });
    /*} catch (e) {
        return {
            error: true,
            message: 'Wrong secret password.'
        }
    }*/
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

function generateKeystoreFromPrivateKey(private_key, password, callback) {
    try {
        var dk = keythereum.create({keyBytes: 32, ivBytes: 16});
        keythereum.dump(password, private_key, dk.salt, dk.iv, {
            cipher: 'aes-128-ctr',
            kdfparams: {
                c: 262144,
                dklen: 32,
                prf: 'hmac-sha256'
            }
        }, function(keystore) {
            const public_key = EthCrypto.publicKeyByPrivateKey(private_key);
            const address = EthCrypto.publicKey.toAddress(public_key);

            callback(true, address, JSON.stringify(keystore));
        });
    } catch (e) {
        callback(false);
    }
}

module.exports = {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore, validatePrivateKey, generateKeystoreFromPrivateKey};

