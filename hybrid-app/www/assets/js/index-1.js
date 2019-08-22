var {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore, validatePrivateKey, generateKeystoreFromPrivateKey} = require('./helper');

console.log("( ͡° ͜ʖ ͡°) I see you.");

$(document).ready(function() {
    console.log('document ready');
});

document.addEventListener('deviceready', function() {
    console.log('================= deviceready ===================');
    document.addEventListener('offline', function(e){
        console.log('===== we are offline =====');
    }, false);

    document.addEventListener('online', function(e){
        console.log('===== we are online =====');
    }, false);


    console.log('Device Name: '+ device.name);
    console.log('Device Cordova: '  + device.cordova);
    console.log('Device Platform: ' + device.platform);
    console.log('Device UUID: '     + device.uuid);
    console.log('Device Version: '  + device.version);

    if(device.platform == 'Android' && device.version == '6.0') {
        //fix
    }
}, false);

function readClinics() {
    console.log('readClinics');
    return spawn(function*() {
        console.log('before clinics');
        var clinics = yield $.ajax({
            type: 'POST',
            url: 'https://api.dentacoin.com/api/users/',
            dataType: 'json',
            data: {
                status: 'approved',
                type: 'all-dentists',
                items_per_page: 10000
            }
        });
        console.log('after clinics');
        return clinics;
    });
}
readClinics();


function spawn(genFunc, self) {
    return new Promise(function(resolve, reject) {
        // start iterating the original function and set correct this pointer
        var iterator = genFunc.call(self);
        function step(nextFunc) {
            var next;
            try {
                next = nextFunc();
            } catch(e) {
                // finished with failure, reject the promise
                reject(e);
                return;
            }
            if(next.done) {
                // finished with success, resolve the promise
                resolve(next.value);
                return;
            }
            // not finished, chain off the yielded promise and `step` again
            Promise.resolve(next.value).then(function(v) {
                // keep stepping until next yield (original await) passing new value to yield
                step(function() { return iterator.next(v); });
            }, function(e) {
                step(function() { return iterator.throw(e); });
            });
        }
        // keep stepping until next yield (original await)
        step(function() { return iterator.next(); });
    });
}