const Web3 = require('../../../node_modules/web3'); // import web3 v1.0 constructor
const keythereum = require('../../../node_modules/keythereum');
const EthCrypto = require('../../../node_modules/eth-crypto');

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

function generateKeystoreFile(password) {
    var dk = keythereum.create({keyBytes: 32, ivBytes: 16});
    var keyObjectExported = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, {
        cipher: 'aes-128-ctr',
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: 'hmac-sha256'
        }
    });

    const public_key = EthCrypto.publicKeyByPrivateKey(dk.privateKey.toString('hex'));

    return {
        success: {
            public_key: public_key,
            keystore: keyObjectExported
        }
    };
}

function importKeystoreFile(keystore, password) {
    try {
        var keyObject = JSON.parse(keystore);
        var private_key = keythereum.recover(password, keyObject);
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

module.exports = {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore};

