const keythereum = require('../../../node_modules/keythereum');
const EthCrypto = require('../../../node_modules/eth-crypto');

// assumes passed-in web3 is v1.0 and creates a function to receive contract name
const getContractInstance = (web3) => (ABI, address) => {
    const instance = new web3.eth.Contract(ABI, address);
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

        callback(public_key, result, dk.privateKey.toString('hex'));
    });
}

function importKeystoreFile(keystore, password, callback) {
    const keyObject = JSON.parse(keystore);
    keythereum.recover(password, keyObject, function(private_key) {
        try {
            const public_key = EthCrypto.publicKeyByPrivateKey(private_key.toString('hex'));
            callback(keyObject, public_key, JSON.parse(keystore).address);
        } catch (e) {
            console.log(e, 'e');
            callback(null, null, null, true, 'Wrong secret password.');
        }
    });
}

function decryptKeystore(keystore, password, callback) {
    keythereum.recover(password, JSON.parse(keystore), function(private_key) {
        if (private_key instanceof Error) {
            callback(null, null, true, 'Wrong secret password.');
        } else {
            callback(private_key, private_key.toString('hex'));
        }
    });
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

module.exports = {getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore, validatePrivateKey, generateKeystoreFromPrivateKey};

