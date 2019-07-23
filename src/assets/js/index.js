var {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore} = require('./helper');

$(document).ready(function() {
    loadMobileBottomFixedNav();
});

$(window).on('beforeunload', function() {

});

$(window).on("load", function()   {

});

$(window).on('resize', function(){

});

$(window).on('scroll', function()  {

});

window.addEventListener('load', function() {

});

document.addEventListener('deviceready', function() {
    uploadStorageFile();
}, false);

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

var meta_mask_installed = false;
var meta_mask_logged = false;
var temporally_timestamp = 0;
var global_state = {};
var getInstance;
var DCNContract;
var dApp = {
    loaded: false,
    contract_address: "0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6",
    web3Provider: null,
    web3_0_2: null,
    web3_1_0: null,
    init: async function () {
        dApp.loaded = true;
        return await dApp.initWeb3();
    },
    initWeb3: async function () {
        if(typeof(web3) !== 'undefined' && web3.currentProvider.isMetaMask === true) {

        } else if(typeof(web3) !== 'undefined') {
            console.log('METAMASK INSTALLED');
            //METAMASK INSTALLED
            global_state.account = web3.eth.defaultAccount;

            //overwrite web3 0.2 with web 1.0
            web3 = getWeb3(web3.currentProvider);
            dApp.web3_1_0 = web3;
        } else {
            console.log('NO METAMASK INSTALLED');
            //NO METAMASK INSTALLED
            if (localStorage.getItem('current-account') != null && typeof(web3) === 'undefined') {
                global_state.account = JSON.parse(localStorage.getItem('current-account')).address;
            } else {
                global_state.account = '0x80e071ad6719cc39dff3ba1612f23b586a2375d1';
            }

            dApp.web3_1_0 = getWeb3(new Web3.providers.HttpProvider('https://mainnet.infura.io/c6ab28412b494716bc5315550c0d4071'));
        }

        if(typeof(global_state.account) != 'undefined') {
            return await dApp.initContract();
        } else {
            //NO IMPORTED ACCOUNT
        }
    },
    initContract: async function () {
        await $.getJSON('assets/jsons/DentacoinToken.json', async function (DCNArtifact) {
            // get the contract artifact file and use it to instantiate a truffle contract abstraction
            getInstance = getContractInstance(dApp.web3_1_0);
            DCNContract = getInstance(DCNArtifact, dApp.contract_address);

            await dApp.buildTransactionHistory();
        });
    },
    buildTransactionHistory: async function() {
        var from_events = await dApp.getTransferFromEvents();
        var to_events = await dApp.getTransferToEvents();

        var merged_events_arr = from_events.concat(to_events);
        if(merged_events_arr.length > 0) {
            sortByKey(merged_events_arr, 'blockNumber');
            merged_events_arr = merged_events_arr.reverse();

            $('.camping-transaction-history').html('<h2 class="lato-bold fs-25 text-center white-crossed-label color-white"><span>Transaction history</span></h2><div class="transaction-history container"><div class="row"><div class="col-xs-12 no-gutter-xs col-md-10 col-md-offset-1 padding-top-20"><table class="color-white"><tbody></tbody></table></div></div><div class="row camping-show-more"></div></div>');

            $(document).on('click', '.camping-transaction-history .show-more', function() {
                $(this).fadeOut();
                $(this).attr('show-all-transactions', 'true');
                $('.camping-transaction-history table tr').addClass('show-this');
            });

            var transaction_history_html = '';
            var dentacoin_data = await getDentacoinDataByCoingecko();

            for(var i = 0, len = 5; i < len; i+=1) {
                merged_events_arr[i].timestamp = await dApp.helper.addBlockTimestampToTransaction(merged_events_arr[i].blockNumber);

                var other_address = '';
                var class_name = '';
                var label = '';
                var dcn_amount_symbol;
                var usd_amount = (parseInt(merged_events_arr[i].returnValues._value) * dentacoin_data.market_data.current_price.usd).toFixed(2);
                if(checksumAddress(merged_events_arr[i].returnValues._to) == checksumAddress(global_state.account))    {
                    //IF THE CURRENT ACCOUNT IS RECEIVER
                    other_address = merged_events_arr[i].returnValues._from;
                    label = 'Received from';
                    class_name = 'received_from';
                    dcn_amount_symbol = '+';
                }else if(checksumAddress(merged_events_arr[i].returnValues._from) == checksumAddress(global_state.account)) {
                    //IF THE CURRENT ACCOUNT IS SENDER
                    other_address = merged_events_arr[i].returnValues._to;
                    label = 'Sent to';
                    class_name = 'sent_to';
                    dcn_amount_symbol = '-';
                }

                var dcn_amount = dcn_amount_symbol+merged_events_arr[i].returnValues._value+' DCN';
                var timestamp_javascript = merged_events_arr[i].timestamp*1000;
                var date_obj = new Date(timestamp_javascript);
                var minutes;
                var hours;

                if(new Date(timestamp_javascript).getMinutes() < 10) {
                    minutes = '0'+new Date(timestamp_javascript).getMinutes();
                }else {
                    minutes = new Date(timestamp_javascript).getMinutes();
                }

                if(new Date(timestamp_javascript).getHours() < 10) {
                    hours = '0'+new Date(timestamp_javascript).getHours();
                }else {
                    hours = new Date(timestamp_javascript).getHours();
                }

                if(basic.isMobile()) {
                    other_address = substr_replace(other_address, '...', -25);
                }

                transaction_history_html+='<tr class="'+class_name+' single-transaction" onclick="window.open(\'https://etherscan.io/tx/'+merged_events_arr[i].transactionHash+'\');"><td class="icon"></td><td><ul><li>'+(date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() +'</li><li>'+hours+':'+minutes+'</li></ul></td><td><ul><li><span><strong>'+label+': </strong>'+other_address+'</span></li><li><a href="https://etherscan.io/tx/'+merged_events_arr[i].transactionHash+'" target="_blank" class="lato-bold color-white">Transaction ID</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5"><ul><li class="lato-bold dcn-amount">'+dcn_amount+'</li><li>'+usd_amount+' USD</li></ul></td></tr>';
            }

            transaction_history_html+='<tr class="loading-tr"><td class="text-center" colspan="5"><figure class="inline-block rotate-animation"><img src="assets/images/exchange.png" alt="Exchange icon"/></figure></td></tr>';

            $('.camping-transaction-history table tbody').html(transaction_history_html);
            $('.camping-transaction-history .camping-show-more').html('<div class="col-xs-12 text-center padding-top-30"><a href="javascript:void(0)" class="white-light-blue-btn show-more">Show more</a></div>');

            var next_transaction_history_html = '';
            for(var i = 5, len = merged_events_arr.length; i < len; i+=1) {
                merged_events_arr[i].timestamp = await dApp.helper.addBlockTimestampToTransaction(merged_events_arr[i].blockNumber);

                var other_address = '';
                var class_name = '';
                var label = '';
                var dcn_amount_symbol;
                var usd_amount = (parseInt(merged_events_arr[i].returnValues._value) * dentacoin_data.market_data.current_price.usd).toFixed(2);
                if(checksumAddress(merged_events_arr[i].returnValues._to) == checksumAddress(global_state.account))    {
                    //IF THE CURRENT ACCOUNT IS RECEIVER
                    other_address = merged_events_arr[i].returnValues._from;
                    label = 'Received from';
                    class_name = 'received_from';
                    dcn_amount_symbol = '+';
                }else if(checksumAddress(merged_events_arr[i].returnValues._from) == checksumAddress(global_state.account)) {
                    //IF THE CURRENT ACCOUNT IS SENDER
                    other_address = merged_events_arr[i].returnValues._to;
                    label = 'Sent to';
                    class_name = 'sent_to';
                    dcn_amount_symbol = '-';
                }

                var dcn_amount = dcn_amount_symbol+merged_events_arr[i].returnValues._value+' DCN';
                var timestamp_javascript = merged_events_arr[i].timestamp*1000;
                var date_obj = new Date(timestamp_javascript);
                var minutes;
                var hours;

                if(new Date(timestamp_javascript).getMinutes() < 10) {
                    minutes = '0'+new Date(timestamp_javascript).getMinutes();
                }else {
                    minutes = new Date(timestamp_javascript).getMinutes();
                }

                if(new Date(timestamp_javascript).getHours() < 10) {
                    hours = '0'+new Date(timestamp_javascript).getHours();
                }else {
                    hours = new Date(timestamp_javascript).getHours();
                }

                if(basic.isMobile()) {
                    other_address = substr_replace(other_address, '...', -25);
                }

                next_transaction_history_html+='<tr class="'+class_name+' single-transaction" onclick="window.open(\'https://etherscan.io/tx/'+merged_events_arr[i].transactionHash+'\');"><td class="icon"></td><td><ul><li>'+(date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() +'</li><li>'+hours+':'+minutes+'</li></ul></td><td><ul><li><span><strong>'+label+': </strong>'+other_address+'</span></li><li><a href="https://etherscan.io/tx/'+merged_events_arr[i].transactionHash+'" target="_blank" class="lato-bold color-white">Transaction ID</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5"><ul><li class="lato-bold dcn-amount">'+dcn_amount+'</li><li>'+usd_amount+' USD</li></ul></td></tr>';
            }
            $('.camping-transaction-history table tbody tr.loading-tr').remove();
            $('.camping-transaction-history table tbody').append(next_transaction_history_html);
            if($('.camping-transaction-history .show-more').attr('show-all-transactions') == 'true') {
                $('.camping-transaction-history table tr').addClass('show-this');
            }
        } else {
            $('.camping-transaction-history').html('<h2 class="lato-bold fs-25 text-center white-crossed-label color-white"><span>No current Transaction history</span></h2>');
        }
    },
    getTransferFromEvents: function () {
        return new Promise(function(resolve, reject) {
            DCNContract.getPastEvents('Transfer', {
                filter: {_from: global_state.account},
                fromBlock: 0,
                toBlock: 'latest'
            }, function(error, event){
                if(!error) {
                    resolve(event);
                } else {
                    resolve(error);
                }
            });
        });
    },
    getTransferToEvents: function () {
        return new Promise(function(resolve, reject) {
            DCNContract.getPastEvents('Transfer', {
                filter: {_to: global_state.account},
                fromBlock: 0,
                toBlock: 'latest'
            }, function(error, event){
                if(!error) {
                    resolve(event);
                } else {
                    resolve(error);
                }
            });
        });
    },
    methods: {
        getDCNBalance: function(homepage)  {
            return DCNContract.methods.balanceOf(global_state.account).call({from: global_state.account});
        }
    },
    helper: {
        addBlockTimestampToTransaction: function(blockNumber)    {
            return new Promise(function(resolve, reject) {
                dApp.web3_1_0.eth.getBlock(blockNumber, function(error, result) {
                    if (error !== null) {
                        reject(error);
                    }
                    temporally_timestamp = result.timestamp;
                    resolve(temporally_timestamp);
                });
            });
        },
        getAddressETHBalance: function(address)    {
            return new Promise(function(resolve, reject) {
                resolve(dApp.web3_1_0.eth.getBalance(address));
            });
        }
    }
};

var pages_data = {
    homepage: async function() {
        //show user ethereum address
        $('.eth-address-container .address-value').val(global_state.account);

        //update dentacoin amount
        var dcn_balance = parseInt(await dApp.methods.getDCNBalance());
        $('.dcn-amount').html(dcn_balance);

        //update usd amount (dentacoins in usd)
        var dentacoin_data = await getDentacoinDataByCoingecko();
        $('.usd-amount').html((dcn_balance * dentacoin_data.market_data.current_price.usd).toFixed(2));

        //update ether amount
        $('.eth-amount').html(parseFloat(dApp.web3_1_0.utils.fromWei(await dApp.helper.getAddressETHBalance(global_state.account))).toFixed(6));

        $('.fade-in-element').fadeIn(500);

        //show qr code generated by the user ethereum address
        if($('#qrcode').length) {
            var qrcode = new QRCode(document.getElementById('qrcode'), {
                width : 180,
                height : 180
            });

            qrcode.makeCode(global_state.account);
        }

        //init copy button event
        var clipboard = new ClipboardJS('.copy-btn');
        clipboard.on('success', function(e) {
            $('.copy-address').tooltip('show');
            setTimeout(function()   {
                $('.copy-address').tooltip('hide');
            }, 1000);
        });

        $('.copy-address').tooltip({
            trigger: 'click'
        });

        $('.more-info').popover({
            trigger: 'click',
            html: true
        });
    },
    buy_page: async function() {
        //dividing with 100, because with indacoin api you cannot get prices for 1 crypto
        var dcn_for_one_usd = parseFloat(await getCryptoDataByIndacoin('DCN')) / 100;
        var eth_for_one_usd = parseFloat(await getCryptoDataByIndacoin('ETH')) / 100;
        $('section.ready-to-purchase-with-external-api #crypto-amount').val(Math.floor(dcn_for_one_usd * parseFloat($('section.ready-to-purchase-with-external-api #usd-value').val().trim())));

        $('section.ready-to-purchase-with-external-api #usd-value').on('input', function() {
            if($(this).val().trim() < 30)   {
                $(this).parent().addClass('error-field');
            }else {
                $(this).parent().removeClass('error-field');
            }

            if(parseFloat($(this).val().trim()) < 0)    {
                $(this).val(30);
            }else if(parseFloat($(this).val().trim()) > 6000)    {
                $(this).val(6000);
            }

            if($('section.ready-to-purchase-with-external-api #active-crypto').val() == 'dcn') {
                $('section.ready-to-purchase-with-external-api #crypto-amount').val(Math.floor(dcn_for_one_usd * parseFloat($(this).val().trim())));
            } else if($('section.ready-to-purchase-with-external-api #active-crypto').val() == 'eth') {
                $('section.ready-to-purchase-with-external-api #crypto-amount').val(eth_for_one_usd * parseFloat($(this).val().trim()));
            }
        });

        $('section.ready-to-purchase-with-external-api #active-crypto').on('change', function() {
            $('section.ready-to-purchase-with-external-api #usd-value').val(30);
            $('section.ready-to-purchase-with-external-api #usd-value').parent().removeClass('error-field');

            if($(this).val() == 'dcn') {
                $('section.ready-to-purchase-with-external-api #crypto-amount').val(Math.floor(dcn_for_one_usd * 30));
            } else if($(this).val() == 'eth') {
                $('section.ready-to-purchase-with-external-api #crypto-amount').val(eth_for_one_usd * 30);
            }
        });

        $('section.ready-to-purchase-with-external-api #crypto-amount').on('input', function() {
            if($(this).val().trim() <= 0) {
                $('section.ready-to-purchase-with-external-api #usd-value').val(30);
                if($('section.ready-to-purchase-with-external-api #active-crypto').val() == 'dcn') {
                    $(this).val(Math.floor(dcn_for_one_usd * parseFloat($('section.ready-to-purchase-with-external-api #usd-value').val().trim())));
                } else if($('section.ready-to-purchase-with-external-api #active-crypto').val() == 'eth') {
                    $(this).val(eth_for_one_usd * parseFloat($('section.ready-to-purchase-with-external-api #usd-value').val().trim()));
                }
            } else {
                var divisor;
                if($('section.ready-to-purchase-with-external-api #active-crypto').val() == 'dcn') {
                    divisor = dcn_for_one_usd;
                } else if($('section.ready-to-purchase-with-external-api #active-crypto').val() == 'eth') {
                    divisor = eth_for_one_usd;
                }

                if(parseFloat($(this).val().trim()) / divisor > 6000)   {
                    $(this).val(divisor * 6000);
                }
                $('section.ready-to-purchase-with-external-api #usd-value').val(parseFloat($(this).val().trim()) / divisor);

                if(parseInt($('section.ready-to-purchase-with-external-api #usd-value').val()) < 30) {
                    $('section.ready-to-purchase-with-external-api #usd-value').parent().addClass('error-field');
                } else {
                    $('section.ready-to-purchase-with-external-api #usd-value').parent().removeClass('error-field');
                }
            }
        });

        $('.buy-crypto-btn').click(function() {
            var currency = $('section.ready-to-purchase-with-external-api #active-crypto').val();
            var currency_amount_for_one_usd;
            if(currency == 'dcn') {
                console.log(1);
                currency_amount_for_one_usd = dcn_for_one_usd;
            } else if(currency == 'eth') {
                console.log(2);
                currency_amount_for_one_usd = eth_for_one_usd;
            }

            console.log(currency_amount_for_one_usd, 'currency_amount_for_one_usd');

            if(parseFloat($('section.ready-to-purchase-with-external-api #usd-value').val().trim()) < 30)  {
                basic.showAlert('The minimum transaction limit is 30 USD.', '', true);
            }else if(parseFloat($('section.ready-to-purchase-with-external-api #usd-value').val().trim()) > 6000)  {
                basic.showAlert('The maximum transaction limit is 6000 USD.', '', true);
            }else if(parseFloat($('section.ready-to-purchase-with-external-api #crypto-amount').val().trim()) < Math.floor(currency_amount_for_one_usd * 30))  {
                basic.showAlert('The minimum transaction limit is 30 USD in '+currency.toUpperCase()+'.', '', true);
            }else if(parseFloat($('section.ready-to-purchase-with-external-api #crypto-amount').val().trim()) > currency_amount_for_one_usd * 6000)  {
                basic.showAlert('The maximum transaction limit is 6000 USD in '+currency.toUpperCase()+'.', '', true);
            }else if(!innerAddressCheck($('section.ready-to-purchase-with-external-api input#dcn_address').val().trim())) {
                basic.showAlert('Please enter a valid wallet address. It should start with "0x" and be followed by 40 characters (numbers and letters).', '', true);
            }else if(!basic.validateEmail($('section.ready-to-purchase-with-external-api input#email').val().trim()))  {
                basic.showAlert('Please enter a valid email.', '', true);
            }else if(!$('section.ready-to-purchase-with-external-api #privacy-policy-agree').is(':checked')) {
                basic.showAlert('Please agree with our Privacy Policy.', '', true);
            }else {
                window.open('https://indacoin.com/gw/payment_form?partner=dentacoin&cur_from=USD&cur_to='+currency.toUpperCase()+'&amount='+$('section.ready-to-purchase-with-external-api #usd-value').val().trim()+'&address='+$('section.ready-to-purchase-with-external-api input#dcn_address').val().trim()+'&user_id='+$('section.ready-to-purchase-with-external-api input#email').val().trim(), '_blank');
            }
        });
    }
};

window.getHomepageData = async function(){
    if(!dApp.loaded) {
        await dApp.init();
    }
    if($.isReady) {
        //called on route change
        pages_data.homepage();
    } else {
        //called on page init
        $(document).ready(async function() {
            pages_data.homepage();
        });
    }
};

window.getBuyPageData = async function(){
    if(!dApp.loaded) {
        await dApp.init();
    }
    if($.isReady) {
        //called on route change
        pages_data.buy_page();
    } else {
        //called on page init
        $(document).ready(async function() {
            pages_data.buy_page();
        });
    }
};

//checking if passed address is valid
function innerAddressCheck(address)    {
    return dApp.web3_1_0.utils.isAddress(address);
}

//converting address to checksum
function checksumAddress(address)    {
    return dApp.web3_1_0.utils.toChecksumAddress(address);
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string") {
            x = (""+x).toLowerCase();
        }
        if (typeof y == "string") {
            y = (""+y).toLowerCase();
        }
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

async function getDentacoinDataByCoingecko() {
    return await $.ajax({
        type: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
        dataType: 'json'
    });
}

async function getCryptoDataByIndacoin(cryptocurrency_symbol) {
    return await $.ajax({
        type: 'GET',
        url: 'https://indacoin.com/api/GetCoinConvertAmount/USD/'+cryptocurrency_symbol+'/100/dentacoin',
        dataType: 'json'
    });
}

function substr_replace(str, replace, start, length) {
    if (start < 0) {
        // start position in str
        start = start + str.length
    }
    length = length !== undefined ? length : str.length
    if (length < 0) {
        length = length + str.length - start
    }
    return [
        str.slice(0, start),
        replace.substr(0, length),
        replace.slice(length),
        str.slice(start + length)
    ].join('')
}

function loadMobileBottomFixedNav() {
    $('body').addClass('overflow-hidden');
    var window_width = $(window).width();
    $('body').removeClass('overflow-hidden');
    if(window_width < 768) {
        $('.camp-for-fixed-mobile-nav').fadeIn(1000);
    }
}

function bindGoogleAlikeButtonsEvents() {
    //google alike style for label/placeholders
    $('body').on('click', '.custom-google-label-style label', function() {
        $(this).addClass('active-label');
        if($('.custom-google-label-style').attr('data-input-blue-green-border') == 'true') {
            $(this).parent().find('input').addClass('blue-green-border');
        }
    });

    $('body').on('keyup change focusout', '.custom-google-label-style input', function() {
        var value = $(this).val().trim();
        if (value.length) {
            $(this).closest('.custom-google-label-style').find('label').addClass('active-label');
            if($(this).closest('.custom-google-label-style').attr('data-input-blue-green-border') == 'true') {
                $(this).addClass('blue-green-border');
            }
        } else {
            $(this).closest('.custom-google-label-style').find('label').removeClass('active-label');
            if($(this).closest('.custom-google-label-style').attr('data-input-blue-green-border') == 'true') {
                $(this).removeClass('blue-green-border');
            }
        }
    });
}
bindGoogleAlikeButtonsEvents();

function uploadPersistentFile() {
    if(basic.getMobileOperatingSystem() == 'Android') {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            fs.root.getFile('cordova-log.txt', { create: true, exclusive: false }, function (fileEntry) {
                writeFile(fileEntry, null);
            }, function(err) {
                console.log(err, 'error uploadPersistentFile fs.root.getFile');
            });
        }, function(err) {
            console.log(err, 'error uploadPersistentFile window.requestFileSystem(LocalFileSystem.PERSISTENT');
        });
    }
}
//uploadPersistentFile();

function readPersistentFile() {
    if(basic.getMobileOperatingSystem() == 'Android') {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            fs.root.getFile('cordova-log.txt', { create: false, exclusive: false }, function (fileEntry) {
                readFile(fileEntry);
            }, function(err) {
                console.log(err, 'error readPersistentFile fs.root.getFile');
            });
        }, function(err) {
            console.log(err, 'error readPersistentFile window.requestFileSystem(LocalFileSystem.PERSISTENT');
        });
    }
}
//readPersistentFile();

function uploadStorageFile() {
    console.log('uploadStorageFile');
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
        dirEntry.getFile('storage-log.txt', { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    console.log('Write completed.');
                };

                fileWriter.onerror = function (e) {
                    console.log('Write failed: ' + e.toString());
                };

                // Create a new Blob and write it to log.txt.
                var blob = new Blob(['Lorem Ipsum'], { type: 'text/plain' });

                fileWriter.write(blob);
            }, errorHandler);
        });
    });
}

function writeFile(fileEntry, dataObj) {
    fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            //readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        if (!dataObj) {
            dataObj = new Blob(['Ain\'t no sunshine when she\'s gone\n' +
            'It\'s not warm when she\'s away\n' +
            'Ain\'t no sunshine when she\'s gone\n' +
            'And she\'s always gone too long\n' +
            'Anytime she goes away'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}

function readFile(fileEntry) {
    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
            console.log(this.result);
            console.log(fileEntry.fullPath + ": " + this.result, 'fileEntry.fullPath + ": " + this.result');
        };

        reader.readAsText(file);
    }, function(err) {
        console.log(err, 'errr readFile fileEntry.file');
    });
}