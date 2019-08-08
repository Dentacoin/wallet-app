var {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore, validatePrivateKey, generateKeystoreFromPrivateKey} = require('./helper');

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
    console.log('================= deviceready ===================');
    
}, false);

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

var is_hybrid;
var meta_mask_installed = false;
var meta_mask_logged = false;
var temporally_timestamp = 0;
var global_state = {};
var getInstance;
var DCNContract;
var dApp = {
    loaded: false,
    contract_address: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
    web3Provider: null,
    web3_0_2: null,
    web3_1_0: null,
    init: async function () {
        dApp.loaded = true;
        return await dApp.initWeb3();
    },
    initWeb3: async function () {
        console.log( 'initWeb3');
        if(typeof(web3) !== 'undefined') {
            console.log('METAMASK INSTALLED');
            //METAMASK INSTALLED
            global_state.account = web3.eth.defaultAccount;

            //overwrite web3 0.2 with web 1.0
            web3 = getWeb3(web3.currentProvider);
            dApp.web3_1_0 = web3;
        } else {
            console.log('NO METAMASK INSTALLED');
            //NO METAMASK INSTALLED
            if (window.localStorage.getItem('current_account') != null && typeof(web3) === 'undefined') {
                global_state.account = window.localStorage.getItem('current_account');
            }

            dApp.web3_1_0 = getWeb3(new Web3.providers.HttpProvider('https://mainnet.infura.io/c6ab28412b494716bc5315550c0d4071'));
        }

        if(typeof(global_state.account) != 'undefined' && typeof(web3) == 'undefined') {
            $('.logo-and-settings-row').append('<div class="col-xs-6 inline-block"><figure itemscope="" itemtype="http://schema.org/Organization" class="text-right"><a href="javascript:void(0)" itemprop="url" class="open-settings"><img src="assets/images/settings-icon.svg" class="max-width-30" itemprop="logo" alt="Settings icon"/></a></figure></div>');
        }


        if(typeof(global_state.account) != 'undefined') {
            return await dApp.initContract();
        }
    },
    initContract: async function () {
        console.log('initContract');
        await $.getJSON('assets/jsons/DentacoinToken.json', async function (DCNArtifact) {
            console.log('DentacoinToken');
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
            $('.camping-transaction-history').html('<h2 class="lato-bold fs-25 fs-xs-18 text-center white-crossed-label color-white"><span>No current Transaction history</span></h2>');
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
        getDCNBalance: function(address)  {
            return DCNContract.methods.balanceOf(address).call({from: address});
        },
        transfer: function(send_addr, value)  {
            return DCNContract.methods.transfer(send_addr, value).send({
                from: global_state.account,
                gas: 60000
            }).on('transactionHash', function(hash){
                displayMessageOnDCNTransactionSend('Dentacoin tokens', hash);
            }).catch(function(err) {
                basic.showAlert('Something went wrong. Please try again later or write a message to admin@dentacoin.com with description of the problem.', '', true);
            });
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
        },
        estimateGas: function(address, function_abi)  {
            return new Promise(function(resolve, reject) {
                dApp.web3_1_0.eth.estimateGas({
                    to: address,
                    data: function_abi
                }, function(error, result) {
                    if(!error){
                        resolve(result);
                    }
                });
            });
        }
    }
};

var bidali_lib_loaded = false;
var pages_data = {
    homepage: async function() {
        if(typeof(global_state.account) != 'undefined') {
            //show user ethereum address
            $('.eth-address-container .address-value').val(global_state.account);

            //update dentacoin amount
            var dcn_balance = parseInt(await dApp.methods.getDCNBalance(global_state.account));
            $('.dcn-amount').html(dcn_balance);

            //update usd amount (dentacoins in usd)
            var dentacoin_data = await getDentacoinDataByCoingecko();
            $('.usd-amount').html((dcn_balance * dentacoin_data.market_data.current_price.usd).toFixed(2));

            //update ether amount
            $('.eth-amount').html(parseFloat(dApp.web3_1_0.utils.fromWei(await dApp.helper.getAddressETHBalance(global_state.account))).toFixed(6));

            $('body').addClass('overflow-hidden');
            var window_width = $(window).width();
            $('body').removeClass('overflow-hidden');
            if(window_width > 768) {
                //show qr code generated by the user ethereum address
                if($('#qrcode').length) {
                    $('#qrcode').html('');
                    var qrcode = new QRCode(document.getElementById('qrcode'), {
                        width : 180,
                        height : 180
                    });

                    qrcode.makeCode(global_state.account);
                }

                //init copy button event
                var clipboard = new ClipboardJS('.copy-address');
                clipboard.on('success', function(e) {
                    $('.copy-address').tooltip('show');
                    setTimeout(function()   {
                        $('.copy-address').tooltip('hide');
                    }, 1000);
                });

                $('.copy-address').tooltip({
                    trigger: 'click'
                });
            } else {
                $('.eth-address-container').click(function() {
                    basic.showDialog('<h2 class="fs-18">Your Dentacoin Address</h2><figure itemscope="" itemtype="http://schema.org/ImageObject" id="mobile-qrcode" class="padding-top-20 padding-bottom-20"></figure><a href="javascript:void(0)" class="mobile-copy-address text-center fs-0" data-toggle="tooltip" title="Copied." data-placement="bottom" data-clipboard-target="#mobile-copy-address"><figure class="inline-block mobile-copy-icon" itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/black-copy-icon.svg" class="max-width-20 width-100 margin-right-5" alt="Copy address to clipboard icon" itemprop="contentUrl"/></figure><input type="text" readonly class="address-value inline-block fs-18 fs-xs-10" id="mobile-copy-address"/></a>', 'mobile-dentacoin-address-and-qr', null);

                    $('.mobile-dentacoin-address-and-qr .address-value').val(global_state.account);

                    var qrcode = new QRCode(document.getElementById('mobile-qrcode'), {
                        width : 180,
                        height : 180
                    });

                    qrcode.makeCode(global_state.account);

                    var clipboard = new ClipboardJS('.mobile-copy-address');
                    clipboard.on('success', function(e) {
                        $('.mobile-copy-address').tooltip('show');
                        setTimeout(function()   {
                            $('.mobile-copy-address').tooltip('hide');
                        }, 1000);
                    });
                });
            }
        }

        $('.fade-in-element').fadeIn(500);

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
                currency_amount_for_one_usd = dcn_for_one_usd;
            } else if(currency == 'eth') {
                currency_amount_for_one_usd = eth_for_one_usd;
            }

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
    },
    send_page: async function() {
        showLoader();

        //reading all clinics/ dentists from the CoreDB
        var clinics = await getClinics();
        if(clinics.success) {
            var combobox_html = '';
            for(var i = 0, len = clinics.data.length; i < len; i+=1) {
                if(clinics.data[i].dcn_address != null) {
                    combobox_html += '<option value="'+clinics.data[i].dcn_address+'">'+clinics.data[i].name+'</option>';
                }
            }

            $('.clinics-input').append(combobox_html);

            initComboboxes();

            $('.combobox-container .input-group').addClass('custom-google-label-style module');
            $('.combobox-container input.combobox.clinics-input').attr('id', 'clinics-input');
            $('.combobox-container .input-group').prepend('<label for="clinics-input">Enter receiving address/ clinic name or scan QR</label>');

            jQuery('select.clinics-input').on('change', function() {
                if(innerAddressCheck($(this).val())) {
                    $('input.clinics-input').val($(this).val()).trigger('change');
                }
            });

            $(document).ready(function() {
                $('input.combobox.clinics-input').on('change keyup change focusout', function() {
                    var input_value = $(this).val().trim();
                    if(input_value != '') {
                        if(innerAddressCheck(input_value)) {
                            $('.next-send').removeClass('disabled');
                        } else {
                            $('.next-send').addClass('disabled');
                        }
                    }
                });
            });

            var load_qr_code_lib = true;
            $('.scan-qr-code').click(async function() {
                if(is_hybrid) {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            $('input.clinics-input').val(result.text).trigger('change');
                        },
                        function (error) {
                            alert('Scanning failed. Please go to Settings/ Permissions and allow Camera access to Dentacoin Wallet and try again.');
                        }
                    );
                } else {
                    //BROWSER SCAN
                    if(load_qr_code_lib) {
                        showLoader();
                        load_qr_code_lib = false;
                        await $.getScript('https://rawgit.com/schmich/instascan-builds/master/instascan.min.js');
                        hideLoader();
                    }

                    basic.showDialog('<div class="video-container"><video id="qr-preview"></video></div>', 'popup-scan-qr-code', null, true);

                    var cameras_global;
                    var scanner = new Instascan.Scanner({ video: document.getElementById('qr-preview') });
                    scanner.addListener('scan', function (content) {
                        $('input.clinics-input').val(content).trigger('change');
                        scanner.stop(cameras_global[0]);
                        basic.closeDialog();
                    });

                    Instascan.Camera.getCameras().then(function (cameras) {
                        if (cameras.length > 0) {
                            cameras_global = cameras;
                            scanner.start(cameras[0]);
                        } else {
                            alert('No cameras found.');
                        }
                    }).catch(function (e) {
                        console.error(e);
                    });

                    $('.popup-scan-qr-code .bootbox-close-button').click(function() {
                        if (cameras_global.length > 0) {
                            scanner.stop(cameras_global[0]);
                        }
                    });
                }
            });
        }

        hideLoader();

        $('.section-send .next-send').click(function() {
            if(!$(this).hasClass('disabled')) {
                $('.section-send').hide();
                $('.section-amount-to .address-cell').html($('.section-send input.combobox.clinics-input').val().trim()).attr('data-receiver', $('.section-send input.combobox.clinics-input').val().trim());
                $('.section-amount-to').fadeIn(500);
            }
        });

        $('.section-amount-to .edit-address').click(function() {
            $('.section-amount-to').hide();
            $('.section-send').fadeIn(500);
        });

        var dentacoin_data = await getDentacoinDataByCoingecko();
        var ethereum_data = await getEthereumDataByCoingecko();
        //on input in dcn/ eth input change usd input
        $('.section-amount-to input#crypto-amount').on('input', function()  {
            var to_fixed_num = 2;
            if($('.section-amount-to #active-crypto').val() == 'dcn') {
                if(($(this).val().trim() * dentacoin_data.market_data.current_price.usd) < 0.01) {
                    to_fixed_num = 4;
                }
                $('.section-amount-to input#usd-val').val(($(this).val().trim() * dentacoin_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
            } else if($('.section-amount-to #active-crypto').val() == 'eth') {
                if(($(this).val().trim() * ethereum_data.market_data.current_price.usd) < 0.01) {
                    to_fixed_num = 4;
                }
                $('.section-amount-to input#usd-val').val(($(this).val().trim() * ethereum_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
            }
        });

        //on input in usd input change dcn/ eth input
        $('.section-amount-to input#usd-val').on('input', function()  {
            if($('.section-amount-to #active-crypto').val() == 'dcn') {
                $('.section-amount-to input#crypto-amount').val(Math.floor($(this).val().trim() / dentacoin_data.market_data.current_price.usd)).trigger('change');
            } else if($('.section-amount-to #active-crypto').val() == 'eth') {
                $('.section-amount-to input#crypto-amount').val($(this).val().trim() / ethereum_data.market_data.current_price.usd).trigger('change');
            }
        });

        //on select with cryptocurrencies options change
        $('.section-amount-to #active-crypto').on('change', function() {
            var to_fixed_num = 2;
            if($(this).val() == 'dcn') {
                if(($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data.market_data.current_price.usd) < 0.01) {
                    to_fixed_num = 4;
                }
                $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
            } else if($(this).val() == 'eth') {
                if(($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd) < 0.01) {
                    to_fixed_num = 4;
                }
                $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
            }
        });

        var ethgasstation_data = await getEthgasstationData();
        $('.section-amount-to .open-transaction-recipe').click(async function() {
            console.log(parseInt(await dApp.methods.getDCNBalance(global_state.account)), 'DCN BALANCE');
            console.log(parseFloat(dApp.web3_1_0.utils.fromWei(await dApp.helper.getAddressETHBalance(global_state.account))), 'ETH BALANCE');

            var crypto_val = $('.section-amount-to input#crypto-amount').val().trim();
            var usd_val = $('.section-amount-to input#usd-val').val().trim();
            var sending_to_address = $('.section-amount-to .address-cell').attr('data-receiver');

            if (isNaN(crypto_val) || isNaN(usd_val) || crypto_val == '' || crypto_val == 0 || usd_val == '' || usd_val == 0) {
                //checking if not a number or empty values
                basic.showAlert('Please make sure all values are numbers.', '', true);
                return false;
            } else if (crypto_val < 0 || usd_val < 0) {
                //checking if negative numbers
                basic.showAlert('Please make sure all values are greater than 0.', '', true);
                return false;
            } else if (crypto_val < 10 && $('.section-amount-to #active-crypto').val() == 'dcn') {
                //checking if dcn value is lesser than 10 (contract condition)
                basic.showAlert('Please make sure DCN value is greater than 10. You cannot send less than 10 DCN.', '', true);
                return false;
            } else if (0.0005 > parseFloat(dApp.web3_1_0.utils.fromWei(await dApp.helper.getAddressETHBalance(global_state.account)))) {
                //checking if current balance is lower than the desired value to send
                basic.showAlert('For sending DCN you need at least 0.0005 ETH. Please refill.', '', true);
                return false;
            } else if($('.section-amount-to #active-crypto').val() == 'dcn' && crypto_val > parseInt(await dApp.methods.getDCNBalance(global_state.account))) {
                basic.showAlert('The value you want to send is higher than your balance.', '', true);
                return false;
            } else if($('.section-amount-to #active-crypto').val() == 'eth' && crypto_val > parseFloat(dApp.web3_1_0.utils.fromWei(await dApp.helper.getAddressETHBalance(global_state.account)))) {
                basic.showAlert('The value you want to send is higher than your balance.', '', true);
                return false;
            } else if (!innerAddressCheck(sending_to_address)) {
                //checking again if valid address
                basic.showAlert('Please enter a valid wallet address. It should start with "0x" and be followed by 40 characters (numbers and letters).', '', true);
                return false;
            } else if(!$('.section-amount-to #verified-receiver-address').is(':checked')) {
                //checking again if valid address
                basic.showAlert('Please check the checkbox.', '', true);
                return false;
            }

            if(meta_mask_installed)    {
                if($('.section-amount-to #active-crypto').val() == 'dcn') {
                    dApp.methods.transfer(sending_to_address, crypto_val);
                } else if($('.section-amount-to #active-crypto').val() == 'eth') {
                    dApp.web3_1_0.eth.sendTransaction({
                        from: global_state.account, to: sending_to_address, value: dApp.web3_1_0.utils.toWei(crypto_val, 'ether')
                    }).on('transactionHash', function(hash){
                        displayMessageOnDCNTransactionSend('Ethers', hash);
                    }).catch(function(err) {
                        basic.showAlert('Something went wrong. Please try again later or write a message to admin@dentacoin.com with description of the problem.', '', true);
                    });
                }
            } else {
                showLoader();

                var function_abi;
                var token_symbol;
                if($('.section-amount-to #active-crypto').val() == 'dcn') {
                    token_symbol = 'DCN';
                    function_abi = DCNContract.methods.transfer(sending_to_address, crypto_val).encodeABI();
                } else if($('.section-amount-to #active-crypto').val() == 'eth') {
                    token_symbol = 'ETH';
                }

                //calculating the fee from the gas price and the estimated gas price
                const on_popup_load_gwei = ethgasstation_data.safeLow;
                //adding 10% of the outcome just in case transactions don't take so long
                const on_popup_load_gas_price = on_popup_load_gwei * 100000000 + ((on_popup_load_gwei * 100000000) * 10/100);

                //using ethgasstation gas price and not await dApp.helper.getGasPrice(), because its more accurate
                var eth_fee = dApp.web3_1_0.utils.fromWei((on_popup_load_gas_price * await dApp.helper.estimateGas(sending_to_address, function_abi)).toString(), 'ether');

                var transaction_popup_html = '<div class="title">Send confirmation</div><div class="pictogram-and-dcn-usd-price"><svg version="1.1" class="width-100 max-width-100 margin-bottom-10" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100.1 100" style="enable-background:new 0 0 100.1 100;" xml:space="preserve"><style type="text/css">.st0{fill:#FFFFFF;}.st1{fill:#CA675A;}.st2{fill:none;stroke:#CA675A;stroke-width:2.8346;stroke-linecap:round;stroke-miterlimit:10;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="100" width="105.7" x="-7.2" y="-6.4"></sliceSourceBounds></sfw></metadata><circle class="st0" cx="50" cy="50" r="50"/><g><g><g><path class="st1" d="M50.1,93.7c-18.7,0-36-12.4-41.3-31.3C2.4,39.6,15.8,16,38.5,9.6C48.9,6.7,60,7.8,69.6,12.8c1.2,0.6,1.6,2,1,3.2s-2,1.6-3.2,1c-8.6-4.4-18.4-5.4-27.7-2.8c-20.1,5.6-32,26.7-26.3,46.9s26.7,32.1,46.9,26.4s32.1-26.7,26.4-46.9c-1.1-3.9-2.8-7.6-5-10.9c-0.7-1.1-0.4-2.6,0.7-3.3c1.1-0.7,2.6-0.4,3.3,0.7c2.5,3.8,4.4,7.9,5.6,12.3c6.4,22.8-7,46.5-29.7,52.8C57.8,93.2,53.9,93.7,50.1,93.7z"/></g><g><path class="st1" d="M33.1,78.6c-0.5,0-1-0.2-1.5-0.5c-1-0.8-1.2-2.3-0.4-3.4l40.4-50.5c0.8-1,2.3-1.2,3.4-0.4c1,0.8,1.2,2.3,0.4,3.4L35,77.7C34.5,78.3,33.8,78.6,33.1,78.6z"/></g><g><g><path class="st2" d="M105.7,56.9"/></g></g></g><g><path class="st1" d="M73.7,54.2c-0.1,0-0.2,0-0.2,0c-1.3-0.2-2.3-1.4-2.2-2.7L74,23.9L47.6,39.8c-1.1,0.7-2.6,0.3-3.3-0.8c-0.7-1.1-0.3-2.6,0.8-3.3l34.5-20.8L76.1,52C76,53.2,74.9,54.2,73.7,54.2z"/></g></g></svg><div class="dcn-amount">-'+crypto_val+' '+token_symbol+'</div><div class="usd-amount">=$'+usd_val+'</div></div><div class="confirm-row to"> <div class="label inline-block">To:</div><div class="value inline-block">'+sending_to_address+'</div></div><div class="confirm-row from"> <div class="label inline-block">From:</div><div class="value inline-block">'+global_state.account+'</div></div><div class="confirm-row free"> <div class="label inline-block">Ether fee:</div><div class="value inline-block">'+parseFloat(eth_fee).toFixed(8)+'</div></div>';

                if((is_hybrid && window.localStorage.getItem('keystore_path') != null) || (!is_hybrid && window.localStorage.getItem('keystore_file') != null)) {
                    //cached keystore path on mobile device or cached keystore file on browser
                    transaction_popup_html+='<div class="container-fluid"><div class="row padding-top-25 cached-keystore-file"><div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">Secret password:</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"></div></div><div class="btn-container col-xs-12"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">Confirm</a></div></div></div>';
                    basic.showDialog(transaction_popup_html, 'transaction-confirmation-popup', true);

                    $('.cached-keystore-file .confirm-transaction.keystore-file').click(function() {
                        if($('.cached-keystore-file #your-secret-key-password').val().trim() == '') {
                            basic.showAlert('Please enter valid secret file password.', '', true);
                        } else {
                            showLoader();

                            setTimeout(function() {
                                if(!is_hybrid && window.localStorage.getItem('keystore_file') != null) {
                                    // BROWSER
                                    var decrypting_keystore = decryptKeystore(window.localStorage.getItem('keystore_file'), $('.cached-keystore-file  #your-secret-key-password').val().trim());
                                    if(decrypting_keystore.success) {
                                        submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, on_popup_load_gas_price, decrypting_keystore.success);
                                    } else if(decrypting_keystore.error) {
                                        basic.showAlert(decrypting_keystore.message, '', true);
                                        hideLoader();
                                    }
                                } else if(is_hybrid && window.localStorage.getItem('keystore_path') != null) {
                                    // MOBILE APP
                                    window.resolveLocalFileSystemURL(window.localStorage.getItem('keystore_path'), function (entry) {
                                        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (rootEntry) {
                                            console.log(rootEntry, 'rootEntry');
                                            rootEntry.getFile(entry.fullPath, {create: false}, function (fileEntry) {
                                                console.log(fileEntry, 'fileEntry');
                                                fileEntry.file(function(file) {
                                                    var reader = new FileReader();

                                                    reader.onloadend = function () {
                                                        var keystore_string = this.result;
                                                        console.log(keystore_string, 'keystore_string');

                                                        showLoader();

                                                        setTimeout(function () {
                                                            var decrypting_keystore = decryptKeystore(keystore_string, $('.cached-keystore-file #your-secret-key-password').val().trim());
                                                            console.log(decrypting_keystore, 'decrypting_keystore');
                                                            if (decrypting_keystore.success) {
                                                                submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, on_popup_load_gas_price, decrypting_keystore.success);
                                                            } else if (decrypting_keystore.error) {
                                                                basic.showAlert(decrypting_keystore.message, '', true);
                                                                hideLoader();
                                                            }
                                                        }, 500);
                                                    };

                                                    reader.readAsText(file);
                                                }, function(err) {
                                                    alert('Something went wrong with reading your cached file (Core error 1). Please contact admin@dentacoin.com.');
                                                });
                                            });
                                        });
                                    });
                                }
                            }, 500);
                        }
                    });
                } else {
                    //nothing is cached
                    transaction_popup_html+='<div class="container-fluid proof-of-address padding-top-20 padding-bottom-20"> <div class="row fs-0"> <div class="col-xs-12 col-sm-5 inline-block padding-left-30 padding-left-xs-15"> <a href="javascript:void(0)" class="light-blue-white-btn text-center enter-private-key display-block-important fs-18 line-height-18"><span>Enter your Private Key<div class="fs-16">(not recommended)</div></span></a> </div><div class="col-xs-12 col-sm-2 text-center calibri-bold fs-20 inline-block">or</div><div class="col-xs-12 col-sm-5 inline-block padding-right-30 padding-right-xs-15"> <div class="upload-file-container" data-id="upload-keystore-file" data-label="Upload your Keystore file"> <input type="file" id="upload-keystore-file" class="custom-upload-keystore-file hide-input"/> <div class="btn-wrapper"></div></div></div></div><div class="row on-change-result"></div></div>';
                    basic.showDialog(transaction_popup_html, 'transaction-confirmation-popup', true);

                    //init private key btn logic
                    $(document).on('click', '.enter-private-key', function() {
                        $('.proof-of-address #upload-keystore-file').val('');
                        $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-20"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-private-key">Your Private Key:</label><input type="text" id="your-private-key" maxlength="64" class="full-rounded"/></div></div><div class="btn-container col-xs-12"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction private-key">Confirm</a></div>');

                        $('.confirm-transaction.private-key').click(function() {
                            if($('.proof-of-address #your-private-key').val().trim() == '') {
                                basic.showAlert('Please enter valid private key.', '', true);
                            } else {
                                showLoader();

                                setTimeout(function() {
                                    var validating_private_key = validatePrivateKey($('.proof-of-address #your-private-key').val().trim());
                                    console.log(validating_private_key, 'validating_private_key');
                                    if(validating_private_key.success) {
                                        if(checksumAddress(validating_private_key.success.address) == checksumAddress(global_state.account)) {
                                            submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, on_popup_load_gas_price, new Buffer($('.proof-of-address #your-private-key').val().trim(), 'hex'));
                                        } else {
                                            basic.showAlert('Please enter private key related to your Wallet Address', '', true);
                                            hideLoader();
                                        }
                                    } else if(validating_private_key.error) {
                                        basic.showAlert(validating_private_key.message, '', true);
                                        hideLoader();
                                    }
                                }, 500);
                            }
                        });
                    });

                    //init keystore btn logic
                    styleKeystoreUploadBtnForTx(function_abi, token_symbol, crypto_val, sending_to_address, on_popup_load_gas_price);
                }
                hideLoader();
            }
        });
    },
    faq_page_gift_cards: function() {
        if($('.list .question').length > 0) {
            $('.list .question').click(function()   {
                $(this).closest('li').find('.question-content').toggle(300);
            });
        }
    },
    spend_page_gift_cards: async function() {
        if(!bidali_lib_loaded) {
            showLoader();
            await $.getScript('assets/libs/bidali/bidali-commerce.js');
            bidali_lib_loaded = true;
            hideLoader();
        }

        $('.buy-gift-cards').click(function() {
            bidaliSdk.Commerce.render({
                apiKey: 'pk_n6mvpompwzm83egzrz2vnh',
                paymentCurrencies: ['DCN']
            });
        });
    },
    spend_page_exchanges: async function() {
        showLoader();

        var exchanges = await getExchanges();
        setTimeout(function() {

            var exchanges_html = '';
            for(var i = 0, len = exchanges.length; i < len; i+=1) {
                exchanges_html+='<li><a href="'+exchanges[i].link+'" target="_blank">• '+exchanges[i].title+'</a></li>';
            }

            $('.camping-for-exchanges').html(exchanges_html);

            hideLoader();
        }, 1000);
    }
};

function styleKeystoreUploadBtnForTx(function_abi, token_symbol, crypto_val, sending_to_address, on_popup_load_gas_price) {
    $('.custom-upload-keystore-file').each(function() {
        var this_btn_vanilla = this;
        var this_btn = $(this_btn_vanilla);

        var this_btn_parent = this_btn.closest('.upload-file-container');
        this_btn_parent.find('.btn-wrapper').append("<label for='"+this_btn_parent.attr('data-id')+"'  role='button' class='light-blue-white-btn display-block-important custom-upload-keystore-file-label'><span class='display-block-important fs-18 text-center'>"+this_btn_parent.attr('data-label')+"</span></label>");

        if(is_hybrid) {
            // MOBILE APP
            $('.custom-upload-keystore-file-label').removeAttr('for');

            $('.custom-upload-keystore-file-label').click(function() {
                fileChooser.open(function(file_uri) {
                    console.log(file_uri, 'file_uri');
                    window.resolveLocalFileSystemURL(decodeURIComponent(file_uri), function (entry) {
                        console.log(entry, 'entry');
                        console.log(entry.fullPath, 'entry.fullPath');
                        console.log(decodeURIComponent(entry.fullPath), 'decodeURIComponent(entry.fullPath)');
                        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (rootEntry) {
                            console.log(rootEntry, 'rootEntry');
                            rootEntry.getFile(decodeURIComponent(entry.fullPath), { create: false }, function (fileEntry) {
                                console.log(fileEntry, 'fileEntry');
                                fileEntry.file(function (file) {
                                    var reader = new FileReader();

                                    reader.onloadend = function () {
                                        var keystore_string = this.result;
                                        setTimeout(function () {
                                            if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address')) {
                                                $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="fs-14 light-gray-color text-center padding-bottom-10 padding-top-15 file-name">' + fileEntry.name + '</div><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">Secret password:</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"/></div></div><div class="col-xs-12"><div class="text-center padding-top-10"><input type="checkbox" id="agree-to-cache-tx-sign" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-tx-sign"><span class="padding-left-5 padding-right-5 inline-block">Remember keystore file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block tx-sign-more-info-keystore-remember fs-0" data-content="Remembering your keystore file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div></div><div class="btn-container col-xs-12 padding-top-25"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">Confirm</a></div>');

                                                $('.tx-sign-more-info-keystore-remember').popover({
                                                    trigger: 'click'
                                                });

                                                $('.confirm-transaction.keystore-file').click(function () {
                                                    if ($('.proof-of-address #your-secret-key-password').val().trim() == '') {
                                                        basic.showAlert('Please enter valid secret file password.', '', true);
                                                    } else {
                                                        showLoader();

                                                        setTimeout(function () {
                                                            var decrypting_keystore = decryptKeystore(keystore_string, $('.proof-of-address #your-secret-key-password').val().trim());
                                                            if (decrypting_keystore.success) {
                                                                if ($('.proof-of-address #agree-to-cache-tx-sign').is(':checked')) {
                                                                    //caching (creating) the keystore file in the external data storage folder for this app
                                                                    var keystore_file_name = buildKeystoreFileName(global_state.account);
                                                                    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                                                                        dirEntry.getFile(keystore_file_name, {
                                                                            create: true,
                                                                            exclusive: true
                                                                        }, function (fileEntry) {
                                                                            fileEntry.createWriter(function (fileWriter) {
                                                                                fileWriter.onwriteend = function (e) {
                                                                                    window.localStorage.setItem('keystore_path', cordova.file.externalDataDirectory + keystore_file_name);
                                                                                };

                                                                                fileWriter.onerror = function (e) {
                                                                                    alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                                                                                };

                                                                                // Create a new Blob and write they keystore content inside of it
                                                                                var blob = new Blob([keystore_string], {type: 'text/plain'});
                                                                                fileWriter.write(blob);
                                                                            }, function (err) {
                                                                                alert('Something went wrong with caching your file (Core error 4). Please contact admin@dentacoin.com.');
                                                                            });
                                                                        }, function (err) {
                                                                            alert('Something went wrong with caching your file (Core error 5). Please contact admin@dentacoin.com.');
                                                                        });
                                                                    });
                                                                }

                                                                submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, on_popup_load_gas_price, decrypting_keystore.success);
                                                            } else if (decrypting_keystore.error) {
                                                                basic.showAlert(decrypting_keystore.message, '', true);
                                                                hideLoader();
                                                            }
                                                        }, 500);
                                                    }
                                                });
                                            } else {
                                                basic.showAlert('Please upload valid keystore file.', '', true);
                                            }
                                        }, 500);
                                    };

                                    reader.readAsText(file);
                                }, function (err) {
                                    alert('Something went wrong with reading your cached file (Core error 2). Please contact admin@dentacoin.com.');
                                });
                            });
                        });
                    });
                }, function(err) {
                    alert('File upload failed, please try again with file inside your internal storage.');
                });
            });
        } else {
            // BROWSER
            this_btn_vanilla.addEventListener('change', function(e) {
                var fileName = '';
                if(this.files && this.files.length > 1) {
                    fileName = ( this.getAttribute('data-multiple-caption') || '' ).replace('{count}', this.files.length);
                } else {
                    fileName = e.target.value.split('\\').pop();
                }

                if(this_btn.attr('id') == 'upload-keystore-file') {
                    var uploaded_file = this.files[0];
                    var reader = new FileReader();
                    reader.addEventListener('load', function (e) {
                        if (basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address') && ('0x' + JSON.parse(e.target.result).address) == global_state.account) {
                            var keystore_string = e.target.result;
                            $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="fs-14 light-gray-color text-center padding-bottom-10 padding-top-15 file-name">'+fileName+'</div><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">Secret password:</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"/></div></div><div class="col-xs-12"><div class="text-center padding-top-10"><input type="checkbox" id="agree-to-cache-tx-sign" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-tx-sign"><span class="padding-left-5 padding-right-5 inline-block">Remember keystore file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block tx-sign-more-info-keystore-remember fs-0" data-content="Remembering your keystore file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div></div><div class="btn-container col-xs-12 padding-top-25"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">Confirm</a></div>');

                            $('.tx-sign-more-info-keystore-remember').popover({
                                trigger: 'click'
                            });

                            $('.confirm-transaction.keystore-file').click(function() {
                                if($('.proof-of-address #your-secret-key-password').val().trim() == '') {
                                    basic.showAlert('Please enter valid secret file password.', '', true);
                                } else {
                                    showLoader();

                                    setTimeout(function() {
                                        var decrypting_keystore = decryptKeystore(keystore_string, $('.proof-of-address #your-secret-key-password').val().trim());
                                        if(decrypting_keystore.success) {
                                            if($('.proof-of-address #agree-to-cache-tx-sign').is(':checked')) {
                                                window.localStorage.setItem('keystore_file', keystore_string);
                                            }

                                            submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, on_popup_load_gas_price, decrypting_keystore.success);
                                        } else if(decrypting_keystore.error) {
                                            basic.showAlert(decrypting_keystore.message, '', true);
                                            hideLoader();
                                        }
                                    }, 500);
                                }
                            });
                        } else {
                            $('#upload-keystore-file').val('');
                            basic.showAlert('Please upload valid keystore file which is related to your Wallet Address.', '', true);
                        }
                    });
                    reader.readAsBinaryString(uploaded_file);
                }
            });
            // Firefox bug fix
            this_btn_vanilla.addEventListener('focus', function(){ this_btn.classList.add('has-focus'); });
            this_btn_vanilla.addEventListener('blur', function(){ this_btn.classList.remove('has-focus'); });
        }
    });
}

function submitTransactionToBlockchain(function_abi, symbol, token_val, receiver, on_popup_load_gas_price, key) {
    dApp.web3_1_0.eth.getTransactionCount(global_state.account, function (err, nonce) {
        const EthereumTx = require('ethereumjs-tx');
        var transaction_obj = {
            gasLimit: dApp.web3_1_0.utils.toHex(65000),
            gasPrice: dApp.web3_1_0.utils.toHex(on_popup_load_gas_price),
            from: global_state.account,
            nonce: dApp.web3_1_0.utils.toHex(nonce),
            chainId: 1
        };

        if(function_abi != 'undefined') {
            transaction_obj.data = function_abi;
        }

        var token_label;
        if(symbol == 'DCN') {
            transaction_obj.to = dApp.contract_address;
            token_label = 'Dentacoin tokens';
        } else if(symbol == 'ETH') {
            transaction_obj.to = receiver;
            transaction_obj.value = dApp.web3_1_0.utils.toHex(dApp.web3_1_0.utils.toWei(token_val.toString(), 'ether'));
            token_label = 'Ethers';
        }

        const tx = new EthereumTx(transaction_obj);
        //signing the transaction
        tx.sign(key);
        //sending the transaction
        dApp.web3_1_0.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (err, transactionHash) {
            hideLoader();
            basic.closeDialog();

            displayMessageOnDCNTransactionSend(token_label, transactionHash);
        });
    });
}

function displayMessageOnDCNTransactionSend(token_label, tx_hash)  {
    $('.section-amount-to #crypto-amount').val('').trigger('change');
    $('.section-amount-to #usd-val').val('').trigger('change');
    $('.section-amount-to #verified-receiver-address').prop('checked', false);

    basic.showAlert('<div class="padding-top-15 padding-bottom-10 fs-16">Your '+token_label+' are on their way to the Receiver\'s wallet. Check transaction status <a href="https://etherscan.io/tx/'+tx_hash+'" target="_blank" class="lato-bold color-light-blue">Etherscan</a>.</div>', '', true);
}

async function additionalMethodsAfterAngularViewInit() {
    await dApp.init();
}

window.getHomepageData = async function() {
    initAccountChecker();

    if(!dApp.loaded) {
        await additionalMethodsAfterAngularViewInit();
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
        additionalMethodsAfterAngularViewInit();
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

window.getSendPageData = async function(){
    initAccountChecker();

    if(!dApp.loaded) {
        additionalMethodsAfterAngularViewInit();
    }
    if($.isReady) {
        //called on route change
        pages_data.send_page();
    } else {
        //called on page init
        $(document).ready(async function() {
            pages_data.send_page();
        });
    }
};

window.getFaqPageData = async function(){
    if(!dApp.loaded) {
        additionalMethodsAfterAngularViewInit();
    }
    if($.isReady) {
        //called on route change
        pages_data.faq_page_gift_cards();
    } else {
        //called on page init
        $(document).ready(async function() {
            pages_data.faq_page_gift_cards();
        });
    }
};

window.getSpendPageGiftCards = async function(){
    if(!dApp.loaded) {
        additionalMethodsAfterAngularViewInit();
    }
    if($.isReady) {
        //called on route change
        pages_data.spend_page_gift_cards();
    } else {
        //called on page init
        $(document).ready(async function() {
            pages_data.spend_page_gift_cards();
        });
    }
};

window.getSpendPageExchanges = async function(){
    if(!dApp.loaded) {
        additionalMethodsAfterAngularViewInit();
    }
    if($.isReady) {
        //called on route change
        pages_data.spend_page_exchanges();
    } else {
        //called on page init
        $(document).ready(async function() {
            pages_data.spend_page_exchanges();
        });
    }
};

window.initdApp = async function(){
    if(!dApp.loaded) {
        additionalMethodsAfterAngularViewInit();
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

async function getEthgasstationData() {
    return await $.ajax({
        type: 'GET',
        url: 'https://ethgasstation.info/json/ethgasAPI.json',
        dataType: 'json'
    });
}

async function getDentacoinDataByCoingecko() {
    return await $.ajax({
        type: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
        dataType: 'json'
    });
}

async function getEthereumDataByCoingecko() {
    return await $.ajax({
        type: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/ethereum',
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

async function getClinics() {
    return await $.ajax({
        type: 'POST',
        url: 'https://api.dentacoin.com/api/users/',
        dataType: 'json',
        data: {
            status: 'approved',
            type: 'all-dentists',
            items_per_page: 10000
        }
    });
}

async function getExchanges() {
    return await $.ajax({
        type: 'GET',
        url: 'https://dentacoin.com/info/exchanges',
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
        if($('.custom-google-label-style').attr('data-input-light-blue-border') == 'true') {
            $(this).parent().find('input').addClass('light-blue-border');
        }
    });

    $('body').on('keyup change focusout', '.custom-google-label-style input', function() {
        var value = $(this).val().trim();
        if (value.length) {
            $(this).closest('.custom-google-label-style').find('label').addClass('active-label');
            if($(this).closest('.custom-google-label-style').attr('data-input-light-blue-border') == 'true') {
                $(this).addClass('light-blue-border');
            }
        } else {
            $(this).closest('.custom-google-label-style').find('label').removeClass('active-label');
            if($(this).closest('.custom-google-label-style').attr('data-input-light-blue-border') == 'true') {
                $(this).removeClass('light-blue-border');
            }
        }
    });
}
bindGoogleAlikeButtonsEvents();

var current_meta_mask_account;
if(typeof(web3) !== 'undefined' && web3.currentProvider.isMetaMask === true) {
    current_meta_mask_account = web3.eth.defaultAccount;
}

async function initAccountChecker()  {
    is_hybrid = $('#main-container').attr('hybrid') == 'true';
    console.log('initAccountChecker');
    //checking if metamask
    if(typeof(web3) !== 'undefined' && web3.currentProvider.isMetaMask === true) {
        console.log(1);
        meta_mask_installed = true;

        console.log(current_meta_mask_account, 'current_meta_mask_account');

        window.ethereum.on('accountsChanged', async function () {
            var accounts = await web3.eth.getAccounts();
            console.log(accounts, 'accounts accountsChanged');
            if(accounts.length) {
                console.log(current_meta_mask_account, 'current_meta_mask_account');
                if(innerAddressCheck(current_meta_mask_account) && checksumAddress(current_meta_mask_account) != checksumAddress(accounts[0]) || current_meta_mask_account == null) {
                    console.log('accountsChanged reload 1');
                    window.location.reload();
                }
            } else if(current_meta_mask_account != undefined && current_meta_mask_account != null) {
                console.log('accountsChanged reload 2');
                window.location.reload();
            }
        });

        web3.currentProvider.publicConfigStore.on('update', async function() {
            var accounts = await web3.eth.getAccounts();
            console.log(accounts, 'accounts update');
            if(accounts.length) {
                console.log(current_meta_mask_account, 'current_meta_mask_account');
                if(innerAddressCheck(current_meta_mask_account) && checksumAddress(current_meta_mask_account) != checksumAddress(accounts[0]) || current_meta_mask_account == null) {
                    console.log('update reload 1');
                    window.location.reload();
                }
            } else if(current_meta_mask_account != undefined && current_meta_mask_account != null) {
                console.log('update reload 2');
                window.location.reload();
            }
        });

        if(current_meta_mask_account != undefined && current_meta_mask_account != null)  {
            console.log(1.1);
            meta_mask_logged = true;
        }else {
            console.log(1.2);
            //if metamask is installed, but user not logged show login popup
            basic.showDialog('<div class="popup-body"><div class="title">Sign in to MetaMask</div><div class="subtitle">Open up your browser\'s MetaMask extention.</div><div class="separator"></div><figure class="gif"><img src="assets/images/metamask-animation.gif" alt="Login MetaMask animation"/> </figure></div>', 'login-metamask-desktop');
        }
    } else if(window.localStorage.getItem('current_account') == null && typeof(web3) === 'undefined') {
        console.log(2);
        //show custom authentication popup
        var popup_html = '<h2 class="title">Create a new wallet or import an existing one</h2><div class="left-right-side-holder fs-0"><div class="popup-left inline-block-top" data-step="first"><div class="navigation-link"><a href="javascript:void(0)" data-slug="first" class="active">CREATE</a></div><div class="navigation-link mobile"><a href="javascript:void(0)" data-slug="second">IMPORT</a></div><div class="popup-body first"><label class="custom-label">Choose a password for your secret key file</label><div class="custom-google-label-style margin-bottom-15 max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="keystore-file-pass">Enter password:</label><input type="password" maxlength="30" id="keystore-file-pass" class="full-rounded keystore-file-pass"/></div><div class="custom-google-label-style max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="second-pass">Repeat password:</label><input type="password" maxlength="30" id="second-pass" class="full-rounded second-pass"/></div><div class="btn-container text-center padding-top-30"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border create-keystore">CREATE</a></div></div></div><div class="popup-right inline-block-top"><div class="navigation-link"><a href="javascript:void(0)" data-slug="second">IMPORT</a></div><div class="popup-body second custom-hide"><div class="padding-top-20 padding-bottom-30 fs-0 row-with-image-and-text"><svg class="inline-block width-100 max-width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 70.8 86" style="enable-background:new 0 0 70.8 86;" xml:space="preserve"><style type="text/css">.st0{fill:#FFFFFF;}.st1{stroke:#000000;stroke-width:2;stroke-miterlimit:10;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="86" width="70.7" x="16" y="29"></sliceSourceBounds></sfw></metadata><path d="M44.7,0H3.1C1.4,0,0,1.3,0,3v80c0,1.6,1.4,3,3.1,3h57.9c1.7,0,3.1-1.3,3.1-3V18.8c0-0.9-0.4-1.8-1-2.5L47.2,1C46.5,0.4,45.6,0,44.7,0z"/><circle class="st0" cx="52.8" cy="23" r="16.8"/><rect x="28" y="49" class="st0" width="8" height="37"/><path class="st0" d="M18.2,58.8l13.4-14.6c0.3-0.3,0.7-0.3,1,0l13.4,14.7c0.4,0.4,0.1,1.2-0.5,1.2H18.6C18.1,60,17.8,59.2,18.2,58.8z"/><g><path class="st1" d="M52.3,6.5C61.5,6.5,69,14,69,23.1s-7.5,16.7-16.7,16.7s-16.7-7.5-16.7-16.7S43.1,6.5,52.3,6.5 M52.3,5.7c-9.7,0-17.5,7.8-17.5,17.5s7.8,17.5,17.5,17.5s17.5-7.8,17.5-17.5S61.9,5.7,52.3,5.7L52.3,5.7z"/></g><g><g><path d="M45,16c-1.9,1.9-1.9,4.9,0,6.8c1.9,1.9,4.9,1.9,6.8,0c1.9-1.9,1.9-4.9,0-6.8C49.8,14.1,46.8,14.1,45,16z M50.9,21.9c-1.4,1.4-3.7,1.4-5.1,0c-1.4-1.4-1.4-3.7,0-5.1c1.4-1.4,3.7-1.4,5.1,0C52.3,18.2,52.3,20.5,50.9,21.9z"/><polygon points="60.7,30.7 59.7,31.8 50.9,22.9 51.9,21.9 "/></g><rect x="59" y="28.4" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.9698 50.8809)" width="1.9" height="1.2"/><rect x="58.2" y="27.7" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.6509 50.155)" width="1.9" height="1.2"/></g></svg><div class="inline-block padding-left-15 fs-16 text">To access your wallet, please upload your Keystore/ Secret Key File:</div></div><div class="text-center import-keystore-file-row">';
        if(is_hybrid) {
            popup_html+='<label class="button custom-upload-button">';
        } else {
            popup_html+='<input type="file" id="upload-keystore" class="hide-input upload-keystore"/><label for="upload-keystore" class="button custom-upload-button">';
        }
        popup_html+='<a><span>Upload your Keystore File (recommended)</span><svg class="load" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><path opacity="0.3" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg><svg class="check" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></a><div><span></span></div></label></div><div class="camping-for-action"></div><div class="padding-top-10 text-center fs-14 lato-bold or-label">OR</div><div class="padding-top-10 text-center import-private-key-row"><a href="javascript:void(0);" class="import-private-key light-blue-white-btn fs-16 fs-xs-14">Import Private Key (not recommended)</a></div></div></div>';
        basic.showDialog(popup_html, 'custom-auth-popup', null, true);

        var faq_link_position = setInterval(function() {
            $('.auth-popup-faq-link').css({'top' : $('.custom-auth-popup.bootbox .modal-content').offset().top + $('.custom-auth-popup.bootbox .modal-content').height() + 'px', 'left' : $('.custom-auth-popup.bootbox .modal-content').offset().left + $('.custom-auth-popup.bootbox .modal-content').width() / 2, 'display' : 'block'});
        }, 300);
        $('.auth-popup-faq-link').click(function() {
            $(this).hide();
            clearInterval(faq_link_position);
            basic.closeDialog();
        });

        $(document).on('click', '.refresh-import-init-page', function() {
            $('.camping-for-action').html('').show();
            $('.import-keystore-file-row #upload-keystore').val('');
            $('.import-keystore-file-row').show();
            $('.or-label').show();
            $('.import-private-key-row').html('<a href="javascript:void(0);" class="import-private-key light-blue-white-btn fs-16 fs-xs-14">Import Private Key (not recommended)</a>').show();
        });

        $(document).on('click', '.import-private-key', function() {
            $('.camping-for-action').hide();
            $('.import-keystore-file-row').hide();
            $('.or-label').hide();
            $('.import-private-key-row').html('<div class="custom-google-label-style module text-left" data-input-light-blue-border="true"><label for="import-private-key">Private key:</label><input type="text" id="import-private-key" maxlength="100" class="full-rounded"/></div><div class="continue-btn-priv-key padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border">CONTINUE</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block">Go back</span></a></div>');
            $('#import-private-key').focus();
            $('label[for="import-private-key"]').addClass('active-label');

            $('.continue-btn-priv-key > a').unbind().click(function() {
                showLoader();
                setTimeout(function() {
                    var validate_private_key = validatePrivateKey($('#import-private-key').val().trim());
                    if(validate_private_key.success) {
                        var internet = navigator.onLine;
                        if(internet) {
                            console.log('===== make request for save public keys for assurance =====');
                        }

                        window.localStorage.setItem('current_account', validate_private_key.success.address);
                        if(is_hybrid) {
                            if(basic.getMobileOperatingSystem() == 'Android') {
                                navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                            } else if(basic.getMobileOperatingSystem() == 'iOS') {
                                alert('App refresh is not tested yet with iOS');
                            }
                        } else {
                            window.location.reload();
                        }
                    } else if (validate_private_key.error) {
                        hideLoader();
                        basic.showAlert(validate_private_key.message, '', true);
                    }
                }, 500);
            });
        });

        styleKeystoreUploadBtn();

        $('.custom-auth-popup .navigation-link > a').click(function()  {
            $('.custom-auth-popup .navigation-link a').removeClass('active');
            $(this).addClass('active');
            $('.custom-auth-popup .popup-body').addClass('custom-hide');
            $('.custom-auth-popup .popup-body.'+$(this).attr('data-slug')).removeClass('custom-hide');
        });

        $('.custom-auth-popup .popup-left .btn-container a').click(function()   {
            if($('.custom-auth-popup .keystore-file-pass').val().trim() == '')  {
                basic.showAlert('Please enter password for your keystore file.', '', true);
            }else if($('.custom-auth-popup .keystore-file-pass').val().trim().length < 8 || $('.custom-auth-popup .keystore-file-pass').val().trim().length > 30)  {
                basic.showAlert('The password must be with minimum length of 8 characters and maximum 30.', '', true);
            }else if($('.custom-auth-popup .keystore-file-pass').val().trim() != $('.custom-auth-popup .second-pass').val().trim())  {
                basic.showAlert('Please make sure you entered same password in both fields.', '', true);
            }else {
                showLoader();

                setTimeout(function() {
                    var generated_keystore = generateKeystoreFile($('.custom-auth-popup .keystore-file-pass').val().trim());
                    var keystore_file_name = buildKeystoreFileName('0x' + generated_keystore.success.keystore.address);

                    //save the public key to assurance
                    var internet = navigator.onLine;
                    if(internet) {
                        console.log('===== make request for save public keys for assurance =====');
                    }

                    var private_key = generated_keystore.success.recovered.toString('hex');

                    var keystore_downloaded = false;
                    $('.custom-auth-popup .popup-left').attr('data-step', 'second');
                    $('.custom-auth-popup .popup-left[data-step="second"] .popup-body').html('<div class="padding-top-20 padding-bottom-30 fs-0 row-with-image-and-text"><svg class="inline-block width-100 max-width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 144.4 146.2" style="enable-background:new 0 0 144.4 146.2;" xml:space="preserve"><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="146.2" width="144.4" x="-39.2" y="-23.6"></sliceSourceBounds></sfw></metadata><g><g><path d="M71.1,38.1c9.6,0,16.9-11.9,16.9-21.2S80.5,0,71.1,0C61.8,0,54,7.5,54,16.9S61.6,38.1,71.1,38.1z"/></g><g><path d="M43.6,63.6h7.8c0.7-3.2,0.7-3.4,0.7-3.9c0-0.7,1.1-0.7,1.1,0v3.9h36v-3.9c0-0.2,0.7-1.6,1.8,3.4c0,0.2,0,0.2,0.2,0.5h4.3v-5.2c0-3.9,3-6.8,6.8-6.8h4.3c-1.1-8.2-3.4-21.2-17.6-21.7c-3.9,7.1-10.3,12.8-18,12.8c-7.8,0-14.4-5.7-18-12.8C38.5,30.3,36.5,44,35.6,54.3C38.8,56.8,41.7,60,43.6,63.6z"/></g><g><path d="M40.1,92.4c0.7,0,1.1-0.2,1.6-0.5c2.3-0.9,4.1-2.5,5-4.8h-3.2C42.6,89.2,41.5,90.8,40.1,92.4z"/></g><g><path d="M53.1,138c0,4.3,3.4,8,7.8,8s8-3.6,8-8v-36c0-1.1,1.1-2.3,2.3-2.3c1.1,0,2.3,1.1,2.3,2.3v36.3c0,4.3,3.4,8,8,8c4.3,0,7.8-3.6,7.8-8V87.3h-36V138z"/></g><g><path d="M105.3,92.4c3.2,0,6.4-1.8,7.5-5H98C99,90.5,102.1,92.4,105.3,92.4z"/></g><g><path d="M142.3,68.2h-6.2V51.8c0-1.4-1.1-2.3-2.3-2.3h-10c-1.4,0-2.3,0.9-2.3,2.3v16.4h-7.1v-9.8c0-1.4-1.1-2.3-2.3-2.3h-10c-1.1,0-2.3,0.9-2.3,2.3v9.8H40.6C37.6,60,29.6,54.5,21,54.5c-11.6,0-21,9.3-21,21s9.3,21,21,21c8.9,0,16.6-5.5,19.6-13.7h101.5c1.1,0,2.3-1.1,2.3-2.3v-10C144.6,69.1,143.4,68.2,142.3,68.2z M21,83.9c-4.8,0-8.4-3.9-8.4-8.4c0-4.6,3.9-8.4,8.4-8.4c4.8,0,8.4,3.9,8.4,8.4C29.4,80,25.8,83.9,21,83.9z"/></g></g></svg><div class="inline-block padding-left-15 fs-16 text">Your Keystore/ Secret Key file contains <span class="calibri-bold">highly sensitive information. Please keep it safe</span> as it allows you to access and manage your Dentacoin tokens. </div></div><div class="download-btn btn-container" data-private-key=""><a href="javascript:void(0)" class="width-100 white-light-blue-btn no-hover"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-alt-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="width-100 max-width-30 inline-block margin-right-15 color-white"><path fill="currentColor" d="M176 32h96c13.3 0 24 10.7 24 24v200h103.8c21.4 0 32.1 25.8 17 41L241 473c-9.4 9.4-24.6 9.4-34 0L31.3 297c-15.1-15.1-4.4-41 17-41H152V56c0-13.3 10.7-24 24-24z" class=""></path></svg>Download Secret Key File (recommended)</a></div><div class="padding-top-15 padding-bottom-20 show-private-key-container"><a href="javascript:void(0);" class="width-100 show-private-key light-blue-white-btn">Show Private Key (not recommended)</a></div><div class="text-center padding-top-10"><input type="checkbox" id="agree-to-cache-create" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-create"><span class="padding-left-5 padding-right-5 inline-block">Remember keystore file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block more-info-keystore-remember fs-0" data-content="Remembering your keystore file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-top-20 padding-bottom-40 btn-container"><a href="javascript:void(0)" class="disabled white-light-blue-btn light-blue-border">I understand. CONTINUE</a></div>');

                    $('.more-info-keystore-remember').popover({
                        trigger: 'click'
                    });

                    $('.show-private-key-container .show-private-key').click(function() {
                        $(this).parent().hide();
                        $(this).remove();
                        $('.show-private-key-container').append('<div class="private-key-holder"><div class="scroll-content">'+private_key+'</div></div><div class="padding-top-10 padding-bottom-15 fs-14 color-warning-red">This is NOT a recommended way of accessing your wallet. The information is highly sensitive and should therefore be used in offline settings by experienced crypto users.</div><div class="padding-top-10 padding-bottom-10 padding-left-30 padding-right-30 padding-left-xs-10 padding-right-xs-10 text-left fs-14 color-white row-with-warning-red-background"><div>*Do not lose it! It cannot be recovered if you lose it.</div><div>*Do not share it! Your funds will be stolen if you use this file on a malicious/phishing site.</div><div>*Make a backup! Secure it like the millions of dollars it may one day be worth.</div></div>').fadeIn(1000);
                    });


                    $('.custom-auth-popup .popup-left[data-step="second"] .popup-body .download-btn > a').click(function() {
                        if(is_hybrid) {
                            //MOBILE APP
                            if(basic.getMobileOperatingSystem() == 'Android') {
                                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
                                    dirEntry.getFile(keystore_file_name, { create: true, exclusive: true }, function (fileEntry) {
                                        fileEntry.createWriter(function (fileWriter) {
                                            fileWriter.onwriteend = function (e) {
                                                $('.custom-auth-popup .popup-left[data-step="second"] .popup-body .continue-btn > a').removeClass('disabled');
                                                keystore_downloaded = true;
                                                basic.showAlert('File ' + keystore_file_name + ' has been downloaded to the top-level directory of your device file system.', '', true);
                                            };

                                            fileWriter.onerror = function (e) {
                                                alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                                            };

                                            // Create a new Blob and write they keystore content inside of it
                                            var blob = new Blob([JSON.stringify(generated_keystore.success.keystore)], {type: 'text/plain'});
                                            fileWriter.write(blob);
                                        }, function(err) {
                                            alert('Something went wrong with caching your file (Core error 4). Please contact admin@dentacoin.com.');
                                        });
                                    }, function(err) {
                                        alert('Seems like file with this name already exist in your root directory, move it or delete it and try again.');
                                    });
                                });
                            } else if(basic.getMobileOperatingSystem() == 'iOS') {
                                alert('Downloading still not tested in iOS');
                            }
                        } else {
                            //BROWSER
                            downloadFile(buildKeystoreFileName('0x' + generated_keystore.success.keystore.address), JSON.stringify(generated_keystore.success.keystore));
                            $('.custom-auth-popup .popup-left[data-step="second"] .popup-body .continue-btn > a').removeClass('disabled');
                            keystore_downloaded = true;
                        }
                    });


                    hideLoader();

                    //save address and/or keystore file path and page reload
                    $('.custom-auth-popup .popup-left[data-step="second"] .popup-body .continue-btn > a').click(function() {
                        if(keystore_downloaded) {
                            if($('.custom-auth-popup .popup-left .popup-body #agree-to-cache-create').is(':checked')) {
                                if(is_hybrid) {
                                    //in mobile app saving in localstorage only path to keystore file
                                    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                                        dirEntry.getFile(keystore_file_name, { create: true, exclusive: true }, function (fileEntry) {
                                            fileEntry.createWriter(function (fileWriter) {
                                                fileWriter.onwriteend = function (e) {
                                                    window.localStorage.setItem('keystore_path', cordova.file.externalDataDirectory + keystore_file_name);
                                                    window.localStorage.setItem('current_account', '0x' + generated_keystore.success.keystore.address);
                                                    console.log('window.location.reload 1');

                                                    if(basic.getMobileOperatingSystem() == 'Android') {
                                                        navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                                                    } else if(basic.getMobileOperatingSystem() == 'iOS') {
                                                        alert('App refresh is not tested yet with iOS');
                                                    }
                                                };

                                                fileWriter.onerror = function (e) {
                                                    alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                                                };

                                                // Create a new Blob and write they keystore content inside of it
                                                var blob = new Blob([JSON.stringify(generated_keystore.success.keystore)], {type: 'text/plain'});
                                                fileWriter.write(blob);
                                            }, function(err) {
                                                alert('Something went wrong with caching your file (Core error 4). Please contact admin@dentacoin.com.');
                                            });
                                        }, function(err) {
                                            alert('Seems like file with this name already exist in your application directory, move it or delete it. If not please contact admin@dentacoin.com.');
                                        });
                                    });
                                } else {
                                    //in browser saving keystore file in localstorage
                                    window.localStorage.setItem('keystore_file', JSON.stringify(generated_keystore.success.keystore));
                                    window.localStorage.setItem('current_account', '0x' + generated_keystore.success.keystore.address);
                                    window.location.reload();
                                }
                            } else {
                                window.localStorage.setItem('current_account', '0x' + generated_keystore.success.keystore.address);
                                if(is_hybrid) {
                                    if(basic.getMobileOperatingSystem() == 'Android') {
                                        navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                                    } else if(basic.getMobileOperatingSystem() == 'iOS') {
                                        alert('App refresh is not tested yet with iOS');
                                    }
                                } else {
                                    window.location.reload();
                                }
                            }
                        } else {
                            basic.showAlert('Please download the Keystore file and keep it safe!', '', true);
                        }
                    });
                }, 500);
            }
        });
    }
}

//styling input type file
function styleKeystoreUploadBtn()    {
    if(is_hybrid) {
        //MOBILE APP
        if(basic.getMobileOperatingSystem() == 'Android') {
            //ANDROID
            $('.custom-upload-button').click(function() {
                var this_btn = $(this);
                fileChooser.open(function(file_uri) {
                    console.log(file_uri, 'file_uri');
                    window.resolveLocalFileSystemURL(decodeURIComponent(file_uri), function (entry) {
                        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (rootEntry) {
                            rootEntry.getFile(decodeURIComponent(entry.fullPath), {create: false}, function (fileEntry) {
                                fileEntry.file(function (file) {
                                    var reader = new FileReader();

                                    initCustomInputFileAnimation(this_btn);

                                    reader.onloadend = function () {
                                        var keystore_string = this.result;
                                        setTimeout(function () {
                                            if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address')) {
                                                var address = JSON.parse(keystore_string).address;

                                                $('.or-label').hide();
                                                $('.import-private-key-row').hide();

                                                setTimeout(function () {
                                                    //show continue button next step button
                                                    $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('<div class="enter-pass-label"><label>Please enter password for the secret key file.</label></div><div class="custom-google-label-style margin-bottom-15 max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="import-keystore-password">Enter password:</label><input type="password" id="import-keystore-password" class="full-rounded import-keystore-password"/></div><div class="text-center padding-top-10"><input type="checkbox" id="agree-to-cache-import" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-import"><span class="padding-left-5 padding-right-5 inline-block">Remember keystore file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block import-more-info-keystore-remember fs-0" data-content="Remembering your keystore file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border">CONTINUE</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block">Go back</span></a></div>');

                                                    $('.import-more-info-keystore-remember').popover({
                                                        trigger: 'click'
                                                    });

                                                    $('.custom-auth-popup .popup-right .popup-body .continue-btn > a').click(function () {
                                                        var keystore_password = $('.custom-auth-popup .popup-right .popup-body .import-keystore-password').val().trim();
                                                        if (keystore_password == '') {
                                                            basic.showAlert('Please enter password for your keystore file.', '', true);
                                                        } else {
                                                            showLoader();

                                                            setTimeout(function () {
                                                                var imported_keystore = importKeystoreFile(keystore_string, keystore_password);
                                                                if (imported_keystore.success) {
                                                                    var internet = navigator.onLine;
                                                                    if (internet) {
                                                                        console.log('===== make request for save public keys for assurance =====');
                                                                    }

                                                                    if ($('.custom-auth-popup .popup-right .popup-body #agree-to-cache-import').is(':checked')) {
                                                                        var keystore_file_name = buildKeystoreFileName('0x' + address);
                                                                        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                                                                            dirEntry.getFile(keystore_file_name, {
                                                                                create: true,
                                                                                exclusive: true
                                                                            }, function (fileEntry) {
                                                                                fileEntry.createWriter(function (fileWriter) {
                                                                                    fileWriter.onwriteend = function (e) {
                                                                                        window.localStorage.setItem('keystore_path', cordova.file.externalDataDirectory + keystore_file_name);
                                                                                        window.localStorage.setItem('current_account', '0x' + address);
                                                                                        navigator.app.loadUrl("file:///android_asset/www/index.html", {
                                                                                            loadingDialog: "Wait,Loading App",
                                                                                            loadUrlTimeoutValue: 60000
                                                                                        });
                                                                                    };

                                                                                    fileWriter.onerror = function (e) {
                                                                                        alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                                                                                    };

                                                                                    // Create a new Blob and write they keystore content inside of it
                                                                                    var blob = new Blob([keystore_string], {type: 'text/plain'});
                                                                                    fileWriter.write(blob);
                                                                                }, function (err) {
                                                                                    alert('Something went wrong with caching your file (Core error 4). Please contact admin@dentacoin.com.');
                                                                                });
                                                                            }, function (err) {
                                                                                alert('Something went wrong with caching your file (Core error 5). Please contact admin@dentacoin.com.');
                                                                            });
                                                                        });
                                                                    } else {
                                                                        window.localStorage.setItem('current_account', '0x' + address);
                                                                        navigator.app.loadUrl("file:///android_asset/www/index.html", {
                                                                            loadingDialog: "Wait,Loading App",
                                                                            loadUrlTimeoutValue: 60000
                                                                        });
                                                                    }
                                                                } else if (imported_keystore.error) {
                                                                    hideLoader();
                                                                    basic.showAlert(imported_keystore.message, '', true);
                                                                }
                                                            }, 500);
                                                        }
                                                    });
                                                }, 500);
                                            } else {
                                                $('.custom-auth-popup .popup-right .popup-body #upload-keystore').val('');
                                                basic.showAlert('Please upload valid keystore file.', '', true);
                                                $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('');
                                            }
                                        }, 500);
                                    };

                                    reader.readAsText(file);
                                }, function (err) {
                                    alert('Something went wrong with reading your cached file (Core error 2). Please contact admin@dentacoin.com.');
                                });
                            });
                        });
                    });
                }, function(err) {
                    alert('File upload failed, please try again with file inside your internal storage.');
                });
            });
        }else if(basic.getMobileOperatingSystem() == 'iOS') {
            //iOS
            alert('iOS not supported yet');
        }
    } else {
        //BROWSER
        Array.prototype.forEach.call( document.querySelectorAll('.upload-keystore'), function( input ) {
            var label = input.nextElementSibling;
            input.addEventListener('change', function(e) {
                console.log('change');
                var myFile = this.files[0];
                var reader = new FileReader();

                reader.addEventListener('load', function (e) {
                    console.log('addEventListener');
                    if(basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address'))    {
                        var keystore_string = e.target.result;
                        var address = JSON.parse(keystore_string).address;
                        //init upload button animation
                        initCustomInputFileAnimation(label);

                        $('.or-label').hide();
                        $('.import-private-key-row').hide();

                        setTimeout(function()   {
                            //show continue button next step button
                            $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('<div class="enter-pass-label"><label>Please enter password for the secret key file.</label></div><div class="custom-google-label-style margin-bottom-15 max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="import-keystore-password">Enter password:</label><input type="password" id="import-keystore-password" class="full-rounded import-keystore-password"/></div><div class="text-center padding-top-10"><input type="checkbox" id="agree-to-cache-import" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-import"><span class="padding-left-5 padding-right-5 inline-block">Remember keystore file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block import-more-info-keystore-remember fs-0" data-content="Remembering your keystore file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border">CONTINUE</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block">Go back</span></a></div>');

                            $('.import-more-info-keystore-remember').popover({
                                trigger: 'click'
                            });

                            //calling IMPORT METHOD
                            $('.custom-auth-popup .popup-right .popup-body .continue-btn > a').click(function()   {
                                var keystore_password = $('.custom-auth-popup .popup-right .popup-body .import-keystore-password').val().trim();
                                if(keystore_password == '')  {
                                    basic.showAlert('Please enter password for your keystore file.', '', true);
                                } else {
                                    showLoader();

                                    setTimeout(function() {
                                        var imported_keystore = importKeystoreFile(keystore_string, keystore_password);
                                        if(imported_keystore.success) {
                                            var internet = navigator.onLine;
                                            if(internet) {
                                                console.log('===== make request for save public keys for assurance =====');
                                            }

                                            if($('.custom-auth-popup .popup-right .popup-body #agree-to-cache-import').is(':checked')) {
                                                window.localStorage.setItem('current_account', '0x' + address);
                                                window.localStorage.setItem('keystore_file', JSON.stringify(imported_keystore.success));
                                                window.location.reload();
                                            } else {
                                                window.localStorage.setItem('current_account', '0x' + address);
                                                window.location.reload();
                                            }
                                        } else if(imported_keystore.error) {
                                            hideLoader();
                                            basic.showAlert(imported_keystore.message, '', true);
                                        }
                                    }, 500);
                                }
                            });
                        }, 500);
                    }else {
                        $('.custom-auth-popup .popup-right .popup-body #upload-keystore').val('');
                        basic.showAlert('Please upload valid keystore file.', '', true);
                        $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('');
                    }
                });

                reader.readAsBinaryString(myFile);
            });
        });
    }
}

function initCustomInputFileAnimation(this_btn) {
    console.log('initCustomInputFileAnimation');
    var btn = $(this_btn);
    var loadSVG = btn.children("a").children(".load");
    var loadBar = btn.children("div").children("span");
    var checkSVG = btn.children("a").children(".check");

    var btn_width = 320;
    $('body').addClass('overflow-hidden');
    var window_width = $(window).width();
    $('body').removeClass('overflow-hidden');
    if(window_width < 768) {
        btn_width = 260;
    }

    btn.children("a").children("span").fadeOut(200, function() {
        btn.children("a").animate({
            width: 56
        }, 100, function() {
            loadSVG.fadeIn(300);
            btn.animate({
                width: btn_width
            }, 200, function() {
                btn.children("div").fadeIn(200, function() {
                    loadBar.animate({
                        width: "100%"
                    }, 500, function() {
                        loadSVG.fadeOut(200, function() {
                            checkSVG.fadeIn(200, function() {
                                setTimeout(function() {
                                    btn.children("div").fadeOut(200, function() {
                                        loadBar.width(0);
                                        checkSVG.fadeOut(200, function() {
                                            btn.children("a").animate({
                                                width: btn_width
                                            });
                                            btn.animate({
                                                width: btn_width
                                            }, 300, function() {
                                                btn.children("a").children("span").fadeIn(200);
                                            });
                                        });
                                    });
                                }, 500);
                            });
                        });
                    });
                });
            });
        });
    });
}

function showLoader() {
    $('.camping-loader').html('<div class="response-layer"><div class="wrapper"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/wallet-loading.svg" class="max-width-160" alt="Loader"></figure></div></div>');
    $('.response-layer').show();
}

function hideLoader() {
    $('.camping-loader').html('');
}

function buildKeystoreFileName(address) {
    return 'Dentacoin secret key - ' + address;
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//transfer all selects to bootstrap combobox
function initComboboxes() {
    if($('select.combobox').length) {
        $('select.combobox').each(function () {
            $(this).combobox();
        });
    }
}

$(document).on('click', '.open-settings', function() {
    basic.closeDialog();
    var settings_html = '<div class="text-center fs-0 color-white lato-bold popup-header"><a href="javascript:void(0)" class="custom-close-bootbox max-width-20 inline-block margin-right-10"><svg class="width-100" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 62 52.3" style="enable-background:new 0 0 62 52.3;" xml:space="preserve"><style type="text/css">.st1{fill:#FFFFFF;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="52.3" width="62" x="19" y="48.9"/></sfw></metadata><path class="st1" d="M62,26.2c0-2.2-1.8-4-4-4H14.2L30.4,7c1.7-1.4,1.8-4,0.4-5.6c-1.4-1.7-4-1.8-5.6-0.4C25.1,1,25,1.1,25,1.2 L1.3,23.2c-1.6,1.5-1.7,4-0.2,5.7C1.1,29,1.2,29,1.3,29.1L25,51.2c1.6,1.5,4.1,1.4,5.7-0.2c1.5-1.6,1.4-4.1-0.2-5.7L14.2,30.2H58 C60.2,30.2,62,28.4,62,26.2z"/></svg></a><span class="inline-block text-center fs-28 fs-xs-16">DENTACOIN WALLET OPTIONS</span></div><div class="popup-body">';

    if((is_hybrid && window.localStorage.getItem('keystore_path') == null) || (!is_hybrid && window.localStorage.getItem('keystore_file') == null)) {
        settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important remember-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14,0H2C0.9,0,0,0.9,0,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V2C16,0.9,15.1,0,14,0z M15,14c0,0.6-0.4,1-1,1 H2c-0.6,0-1-0.4-1-1v-3h14V14z M15,10H1V6h14V10z M1,5V2c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v3H1z M14,3.5C14,3.8,13.8,4,13.5,4h-1 C12.2,4,12,3.8,12,3.5v-1C12,2.2,12.2,2,12.5,2h1C13.8,2,14,2.2,14,2.5V3.5z M14,8.5C14,8.8,13.8,9,13.5,9h-1C12.2,9,12,8.8,12,8.5 v-1C12,7.2,12.2,7,12.5,7h1C13.8,7,14,7.2,14,7.5V8.5z M14,13.5c0,0.3-0.2,0.5-0.5,0.5h-1c-0.3,0-0.5-0.2-0.5-0.5v-1 c0-0.3,0.2-0.5,0.5-0.5h1c0.3,0,0.5,0.2,0.5,0.5V13.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Remember Keystore File</span></a><div class="fs-14 option-description">By doing so, you will not be asked to upload it every time you want to access your wallet.</div><div class="camping-for-action"></div></div>';
    } else if((is_hybrid && window.localStorage.getItem('keystore_path') != null) || (!is_hybrid && window.localStorage.getItem('keystore_file') != null)) {
        settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important forget-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14,0H2C0.9,0,0,0.9,0,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V2C16,0.9,15.1,0,14,0z M15,14c0,0.6-0.4,1-1,1 H2c-0.6,0-1-0.4-1-1v-3h14V14z M15,10H1V6h14V10z M1,5V2c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v3H1z M14,3.5C14,3.8,13.8,4,13.5,4h-1 C12.2,4,12,3.8,12,3.5v-1C12,2.2,12.2,2,12.5,2h1C13.8,2,14,2.2,14,2.5V3.5z M14,8.5C14,8.8,13.8,9,13.5,9h-1C12.2,9,12,8.8,12,8.5 v-1C12,7.2,12.2,7,12.5,7h1C13.8,7,14,7.2,14,7.5V8.5z M14,13.5c0,0.3-0.2,0.5-0.5,0.5h-1c-0.3,0-0.5-0.2-0.5-0.5v-1 c0-0.3,0.2-0.5,0.5-0.5h1c0.3,0,0.5,0.2,0.5,0.5V13.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Forget Keystore File</span></a><div class="fs-14 option-description">By doing so, you’ll be asked to upload it every time you want to access your wallet.</div></div><div class="option-row"><a href="javascript:void(0)" class="display-block-important download-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14.4,10.4v3.2c0,0.1,0,0.2-0.1,0.3c0,0.1-0.1,0.2-0.2,0.3c-0.1,0.1-0.2,0.1-0.3,0.2c-0.1,0-0.2,0.1-0.3,0.1 H2.4c-0.1,0-0.2,0-0.3-0.1c-0.1,0-0.2-0.1-0.3-0.2S1.7,14,1.7,13.9c0-0.1-0.1-0.2-0.1-0.3v-3.2c0-0.4-0.4-0.8-0.8-0.8S0,10,0,10.4 v3.2c0,0.3,0.1,0.6,0.2,0.9c0.1,0.3,0.3,0.6,0.5,0.8c0.2,0.2,0.5,0.4,0.8,0.5C1.8,15.9,2.1,16,2.4,16h11.2c0.3,0,0.6-0.1,0.9-0.2 c0.3-0.1,0.6-0.3,0.8-0.5c0.2-0.2,0.4-0.5,0.5-0.8c0.1-0.3,0.2-0.6,0.2-0.9v-3.2c0-0.4-0.4-0.8-0.8-0.8S14.4,10,14.4,10.4z M8.8,8.5 V0.8C8.8,0.4,8.4,0,8,0C7.6,0,7.2,0.4,7.2,0.8v7.7L4.6,5.8c-0.3-0.3-0.8-0.3-1.1,0C3.1,6.1,3.1,6.7,3.4,7l4,4c0,0,0,0,0,0 c0.1,0.1,0.2,0.1,0.3,0.2c0.1,0,0.2,0.1,0.3,0.1c0,0,0,0,0,0c0.1,0,0.2,0,0.3-0.1c0.1,0,0.2-0.1,0.3-0.2l4-4c0.3-0.3,0.3-0.8,0-1.1 s-0.8-0.3-1.1,0L8.8,8.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Download Keystore File</span></a><div class="fs-14 option-description">Forgot where you’ve stored your wallet access file? Make sure you save it again.</div></div>';
    }

    settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important generate-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 21.3" style="enable-background:new 0 0 16 21.3;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="21.3" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M5.3,0C5.1,0,5,0.1,4.9,0.2L0.2,4.9C0.1,5,0,5.2,0,5.3v13.9c0,1.1,0.9,2.1,2.1,2.1h11.8c1.1,0,2.1-0.9,2.1-2.1 V2.1C16,0.9,15.1,0,13.9,0H5.3C5.3,0,5.3,0,5.3,0z M6.2,1.2h7.7c0.5,0,0.9,0.4,0.9,0.9v17.2c0,0.5-0.4,0.9-0.9,0.9H2.1 c-0.5,0-0.9-0.4-0.9-0.9v-13h4.4C6,6.2,6.2,6,6.2,5.6V1.2z M5,1.7V5H1.7L5,1.7z M4.4,9.8c-1.1,0-2.1,0.9-2.1,2.1s0.9,2.1,2.1,2.1 c0.9,0,1.7-0.6,2-1.5h3.6v0.9c0,0.3,0.3,0.6,0.6,0.6c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0v-0.9h1.2v0.9c0,0.3,0.3,0.6,0.6,0.6 c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0v-1.5c0-0.3-0.3-0.6-0.6-0.6H6.4C6.2,10.4,5.4,9.8,4.4,9.8L4.4,9.8z M4.4,11 c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9C3.6,11.3,3.9,11,4.4,11z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Generate Keystore File</span></a><div class="fs-14 option-description">Create an easy-to-use wallet access file from your private key and secure it with a password.</div><div class="camping-for-action"></div></div></div><div class="popup-footer text-center"><div><a href="javascript:void(0)" class="log-out light-blue-white-btn min-width-220"><svg xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 18.4" style="enable-background:new 0 0 16 18.4;" xml:space="preserve" class="margin-right-5 inline-block max-width-20"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="18.4" width="16" x="1" y="8.4"/></sfw></metadata><g><path class="st0" d="M2.5,0h10.6c1.4,0,2.5,1.1,2.5,2.5v3.2h-1.5V2.5c0-0.5-0.4-1-1-1H2.5c-0.5,0-1,0.4-1,1v13.4c0,0.5,0.4,1,1,1 h10.6c0.5,0,1-0.4,1-1v-3.2h1.5v3.2c0,1.4-1.1,2.5-2.5,2.5H2.5c-1.4,0-2.5-1.1-2.5-2.5V2.5C0,1.1,1.1,0,2.5,0z M11,7.5H6.2v3.4H11 v1.9l5-3.5l-5-3.5V7.5L11,7.5z"/></g></svg><span class="inline-block">Log out</span></a></div><div class="padding-top-10 fs-14">Don\'t forget to download and save your log in files for the next time that you want to log in.</div></div>';
    basic.showDialog(settings_html, 'settings-popup', null, true);

    $('.settings-popup .custom-close-bootbox').click(function() {
        basic.closeDialog();
    });

    $('.settings-popup .log-out').click(function() {
        console.log('log out');
        if(is_hybrid) {
            if(basic.getMobileOperatingSystem() == 'Android') {
                console.log(window.localStorage.getItem('keystore_path'), 'window.localStorage.getItem(\'keystore_path\')');
                if(window.localStorage.getItem('keystore_path') != null) {
                    window.resolveLocalFileSystemURL(window.localStorage.getItem('keystore_path'), function (entry) {
                        console.log(entry, 'entry');
                        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                            console.log(dirEntry, 'dirEntry');
                            dirEntry.getFile(entry.fullPath, {create: false}, function (fileEntry) {
                                console.log(entry.fullPath, 'entry.fullPath')
                                fileEntry.remove(function (file) {
                                    window.localStorage.clear();
                                    navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                                }, function (error) {
                                    alert('Keystore file cache deletion failed. Error code: ' + error.code);
                                }, function () {
                                    alert('Keystore file does not exist in Dentacoin Wallet caching folder.');
                                });
                            });
                        });
                    });
                } else {
                    window.localStorage.clear();
                    navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                }
            } else if(basic.getMobileOperatingSystem() == 'iOS') {
                alert('App refresh is not tested yet with iOS');
            }
        } else {
            window.localStorage.clear();
            window.location.reload();
        }
    });

    $('.settings-popup .remember-keystore').click(function() {
        $('.settings-popup .camping-for-action').html('');

        var remember_keystore_html;
        if(is_hybrid) {
            remember_keystore_html = '<div class="text-center import-keystore-file-row margin-top-20"><label class="button remember-keystore-upload custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold">Upload your Keystore File</span><svg class="load" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><path opacity="0.3" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg><svg class="check" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></a><div><span></span></div></label></div>';
        } else {
            remember_keystore_html = '<div class="text-center import-keystore-file-row margin-top-20"><input type="file" id="remember-keystore-upload" class="hide-input remember-keystore-upload"/><label for="remember-keystore-upload" class="button custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold">Upload your Keystore File</span><svg class="load" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><path opacity="0.3" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg><svg class="check" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></a><div><span></span></div></label></div>';
        }

        var this_camping_row = $(this).closest('.option-row').find('.camping-for-action');
        this_camping_row.html(remember_keystore_html);

        if(is_hybrid) {
            //MOBILE APP
            if(basic.getMobileOperatingSystem() == 'Android') {
                //ANDROID
                $('.remember-keystore-upload').click(function() {
                    var this_btn = $(this);
                    fileChooser.open(function(file_uri) {
                        console.log(file_uri, 'file_uri');
                        window.resolveLocalFileSystemURL(decodeURIComponent(file_uri), function (entry) {
                            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (rootEntry) {
                                rootEntry.getFile(decodeURIComponent(entry.fullPath), {create: false}, function (fileEntry) {
                                    fileEntry.file(function (file) {
                                        var reader = new FileReader();

                                        initCustomInputFileAnimation(this_btn);

                                        reader.onloadend = function () {
                                            var keystore_string = this.result;

                                            if(basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && '0x' + JSON.parse(keystore_string).address == global_state.account) {
                                                validateKeystoreFileAndPassword(this_camping_row, keystore_string);
                                            } else {
                                                basic.showAlert('Please upload valid keystore file which is related to your Dentacoin Wallet address.', '', true);
                                            }
                                        };

                                        reader.readAsText(file);
                                    }, function (err) {
                                        alert('Something went wrong with reading your cached file (Core error 2). Please contact admin@dentacoin.com.');
                                    });
                                });
                            });
                        });
                    }, function(err) {
                        alert('File upload failed, please try again with file inside your internal storage.');
                    });
                });
            }else if(basic.getMobileOperatingSystem() == 'iOS') {
                //iOS
                alert('iOS not supported yet');
            }
        } else {
            //BROWSER
            Array.prototype.forEach.call(document.querySelectorAll('.remember-keystore-upload'), function(input) {
                var label = input.nextElementSibling;
                input.addEventListener('change', function(e) {
                    console.log('change');
                    var myFile = this.files[0];
                    var reader = new FileReader();

                    reader.addEventListener('load', function (e) {
                        if(basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address') && '0x' + JSON.parse(e.target.result).address == global_state.account)    {
                            var keystore_string = e.target.result;
                            //init upload button animation
                            initCustomInputFileAnimation(label);

                            validateKeystoreFileAndPassword(this_camping_row, keystore_string);
                        } else {
                            basic.showAlert('Please upload valid keystore file which is related to your Dentacoin Wallet address.', '', true);
                        }
                    });

                    reader.readAsBinaryString(myFile);
                });
            });
        }
    });

    function validateKeystoreFileAndPassword(this_camping_row, keystore_string) {
        console.log('validateKeystoreFileAndPassword');
        $('.settings-popup .continue-with-keystore-validation').remove();
        this_camping_row.append('<div class="continue-with-keystore-validation"><div class="custom-google-label-style margin-top-25 margin-bottom-15 max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="cache-keystore-password">Keystore Password:</label><input type="password" id="cache-keystore-password" class="full-rounded"/></div><div class="padding-bottom-10 text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border continue-caching">CONTINUE</a></div></div>');

        $('.settings-popup .continue-caching').click(function() {
            if($('.settings-popup #cache-keystore-password').val().trim() == '') {
                basic.showAlert('Please enter password for your keystore file.', '', true);
            } else {
                showLoader();
                setTimeout(function() {
                    var import_keystore_response = importKeystoreFile(keystore_string, $('.settings-popup #cache-keystore-password').val().trim());
                    console.log(import_keystore_response, 'import_keystore_response');
                    if(import_keystore_response.success) {
                        if(is_hybrid) {
                            var keystore_file_name = buildKeystoreFileName('0x' + JSON.parse(keystore_string).address);
                            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                                dirEntry.getFile(keystore_file_name, {
                                    create: true,
                                    exclusive: true
                                }, function (fileEntry) {
                                    fileEntry.createWriter(function (fileWriter) {
                                        fileWriter.onwriteend = function (e) {
                                            window.localStorage.setItem('keystore_path', cordova.file.externalDataDirectory + keystore_file_name);

                                            basic.closeDialog();
                                            basic.showAlert('Your keystore file has been cached successfully.', '', true);
                                        };

                                        fileWriter.onerror = function (e) {
                                            alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                                        };

                                        // Create a new Blob and write they keystore content inside of it
                                        var blob = new Blob([keystore_string], {type: 'text/plain'});
                                        fileWriter.write(blob);
                                    }, function (err) {
                                        alert('Something went wrong with caching your file (Core error 4). Please contact admin@dentacoin.com.');
                                    });
                                }, function (err) {
                                    alert('Something went wrong with caching your file (Core error 5). Please contact admin@dentacoin.com.');
                                });
                            });
                        } else {
                            window.localStorage.setItem('keystore_file', keystore_string);

                            basic.closeDialog();
                            basic.showAlert('Your keystore file has been cached successfully.', '', true);
                        }
                    } else if(import_keystore_response.error) {
                        basic.showAlert(import_keystore_response.message, '', true);
                    }

                    hideLoader();
                }, 500);
            }
        });
    }

    $('.settings-popup .download-keystore').click(function() {
        if(is_hybrid) {
            //MOBILE APP
            if(basic.getMobileOperatingSystem() == 'Android') {
                //getting the file content by it path saved in localstorage
                window.resolveLocalFileSystemURL(window.localStorage.getItem('keystore_path'), function (entry) {
                    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (rootEntry) {
                        rootEntry.getFile(entry.fullPath, {create: false}, function (fileEntry) {
                            fileEntry.file(function(file) {
                                var reader = new FileReader();

                                reader.onloadend = function () {
                                    var keystore_string = this.result;
                                    var address = '0x' + JSON.parse(keystore_string).address;
                                    var keystore_file_name = buildKeystoreFileName(address);
                                    showLoader();

                                    setTimeout(function () {
                                        //downloading the file in mobile device file system
                                        androidFileDownload(keystore_file_name, keystore_string);
                                    }, 500);
                                };

                                reader.readAsText(file);
                            }, function(err) {
                                alert('Something went wrong with reading your cached file (Core error 1). Please contact admin@dentacoin.com.');
                            });
                        });
                    });
                });
            } else if(basic.getMobileOperatingSystem() == 'iOS') {
                alert('Downloading still not tested in iOS');
            }
        } else {
            //BROWSER
            downloadFile(buildKeystoreFileName(global_state.account), window.localStorage.getItem('keystore_file'));
            basic.closeDialog();
            basic.showAlert('File ' + buildKeystoreFileName(global_state.account) + ' has been downloaded to the top-level directory of your device file system.', '', true);
        }
    });

    $('.settings-popup .generate-keystore').click(function() {
        $('.settings-popup .camping-for-action').html('');
        $(this).closest('.option-row').find('.camping-for-action').html('<div class="padding-top-20"><div class="custom-google-label-style margin-bottom-15 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="generate-keystore-private-key">Private key:</label><input type="text" id="generate-keystore-private-key" class="full-rounded"/></div></div><div><div class="custom-google-label-style margin-bottom-15 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="generate-keystore-password">Password:</label><input type="password" id="generate-keystore-password" class="full-rounded"/></div></div><div><div class="custom-google-label-style margin-bottom-15 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="generate-keystore-repeat-password">Repeat Password:</label><input type="password" id="generate-keystore-repeat-password" class="full-rounded"/></div></div><div class="text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border fs-xs-18 width-xs-100 generate-keystore-keystore-action">GENERATE KEYSTORE FILE</a></div>');

        $('.generate-keystore-keystore-action').click(function() {
            var generate_error = false;
            if($('#generate-keystore-private-key').val().trim() == '') {
                generate_error = true;
                basic.showAlert('Please enter valid private key.', '', true);
            } else if($('#generate-keystore-password').val().trim() == '' || $('#generate-keystore-repeat-password').val().trim() == '') {
                generate_error = true;
                basic.showAlert('Please enter both passwords.', '', true);
            } else if($('#generate-keystore-password').val().trim().length < 8 || $('#generate-keystore-password').val().trim().length > 30)  {
                generate_error = true;
                basic.showAlert('The password must be with minimum length of 8 characters and maximum 30.', '', true);
            } else if($('#generate-keystore-password').val().trim() != $('#generate-keystore-repeat-password').val().trim())  {
                generate_error = true;
                basic.showAlert('Please make sure you entered same password in both fields.', '', true);
            }

            if(!generate_error) {
                showLoader();
                setTimeout(async function() {
                    var generate_response = await generateKeystoreFromPrivateKey($('#generate-keystore-private-key').val().trim(), $('#generate-keystore-password').val().trim());

                    if(generate_response.success) {
                        if(is_hybrid) {
                            //MOBILE APP
                            //downloading the file in mobile device file system
                            androidFileDownload(buildKeystoreFileName(generate_response.success.address), generate_response.success.keystore_file);
                        } else {
                            //BROWSER
                            hideLoader();

                            downloadFile(buildKeystoreFileName(generate_response.success.address), generate_response.success.keystore_file);
                            basic.closeDialog();
                            basic.showAlert('File ' + buildKeystoreFileName(generate_response.success.address) + ' has been downloaded to the top-level directory of your device file system.', '', true);
                        }
                    } else if(generate_response.error) {
                        hideLoader();
                        basic.showAlert(generate_response.message, '', true);
                    }
                }, 1000);
            }
        });
    });

    $('.settings-popup .forget-keystore').click(function() {
        console.log('forget-keystore');
        if(window.localStorage.getItem('keystore_path') != null) {
            console.log(window.localStorage.getItem('keystore_path'));
            window.resolveLocalFileSystemURL(window.localStorage.getItem('keystore_path'), function(entry) {
                window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                    dirEntry.getFile(entry.fullPath, {create: false}, function (fileEntry) {
                        fileEntry.remove(function (file) {
                            window.localStorage.removeItem('keystore_path');
                            basic.closeDialog();
                            basic.showAlert('Your keystore file cache was deleted successfully.', '', true);
                        }, function (error) {
                            alert('Keystore file cache deletion failed. Error code: ' + error.code);
                        }, function () {
                            alert('Keystore file does not exist in Dentacoin Wallet caching folder.');
                        });
                    });
                });
            });
        }

        if(window.localStorage.getItem('keystore_file') != null) {
            console.log('cached keystore_file');
            window.localStorage.removeItem('keystore_file');

            basic.closeDialog();
            basic.showAlert('Your keystore file cache was deleted successfully.', '', true);
        }
    });
});

function androidFileDownload(file_name, file_content) {
    console.log('androidFileDownload');
    console.log(file_name, 'file_name');
    console.log(file_content, 'file_content');

    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
        console.log(dirEntry, 'dirEntry');
        dirEntry.getFile(file_name, {create: true, exclusive: true}, function (fileEntry) {
            console.log(fileEntry, 'fileEntry');
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    basic.closeDialog();
                    basic.showAlert('File ' + file_name + ' has been downloaded to the top-level directory of your device file system.', '', true);
                    hideLoader();
                };

                fileWriter.onerror = function (e) {
                    hideLoader();
                    alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                };

                // Create a new Blob and write they keystore content inside of it
                var blob = new Blob([file_content], {type: 'text/plain'});
                fileWriter.write(blob);
            }, function(err) {
                hideLoader();
                alert('Something went wrong with downloading your file (Core error 4). Please contact admin@dentacoin.com.');
            });
        }, function(err) {
            hideLoader();
            alert('Seems like file with this name already exist in your root directory, move it or delete it and try again.');
        });
    });
}

var internet_variable = navigator.onLine;
function checkIfInternetConnection() {
    setInterval(function() {
        if(internet_variable != navigator.onLine) {
            if(navigator.onLine) {
                $('header .camping-currently-offline').html('');
                internet_variable = navigator.onLine;
            } else {
                $('header .camping-currently-offline').html('<div class="currently-offline">You are currently offline</div>');
                internet_variable = navigator.onLine;
            }
        }
    }, 1000);
}
checkIfInternetConnection();