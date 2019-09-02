var {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore, validatePrivateKey, generateKeystoreFromPrivateKey} = require('./helper');

console.log("( ͡° ͜ʖ ͡°) I see you.");

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

    //=================================== internet connection check ONLY for MOBILE DEVICES ===================================

    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.NONE] = 'no-internet';

    if(states[networkState] == 'no-internet') {
        console.log('===== we are offline =====');
        $('header .camping-currently-offline').html('<div class="currently-offline">You are currently offline</div>');
    }

    //event to track whenever device lose internet connection
    document.addEventListener('offline', function(e){
        console.log('===== we are offline =====');
        $('header .camping-currently-offline').html('<div class="currently-offline">You are currently offline</div>');
    }, false);

    //event to track whenever device connect to internet
    document.addEventListener('online', function(e){
        console.log('===== we are online =====');
        $('header .camping-currently-offline').html('');
    }, false);

    //=================================== /internet connection check ONLY for MOBILE DEVICES ===================================
}, false);

//=================================== internet connection check ONLY for BROWSERS ===================================

var internet_variable = navigator.onLine;
function checkIfInternetConnection() {
    if(!is_hybrid) {
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
}
checkIfInternetConnection();

//=================================== /internet connection check ONLY for BROWSERS ===================================

var custom_popover_interval;
var request_response = {};
var request_interval_for_rest_of_transaction_history;
var is_hybrid;
var meta_mask_installed = false;
var meta_mask_logged = false;
var temporally_timestamps = {};
var global_state = {};
var getInstance;
var DCNContract;
var core_db_clinics;
var core_db_clinics_time_to_request;
var block_number_of_dcn_creation = 3170000;
var load_qr_code_lib = true;
var indacoin_data = {};
var dApp = {
    loaded: false,
    contract_address: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
    web3Provider: null,
    web3_0_2: null,
    web3_1_0: null,
    init: function (callback) {
        console.log('dApp init');
        dApp.loaded = true;

        //init web3
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

            dApp.web3_1_0 = getWeb3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/c6ab28412b494716bc5315550c0d4071'));
        }

        if(typeof(global_state.account) != 'undefined' && typeof(web3) == 'undefined') {
            if(!$('.logo-and-settings-row .open-settings-col').length) {
                $('.logo-and-settings-row').append('<div class="col-xs-6 inline-block open-settings-col"><figure itemscope="" itemtype="http://schema.org/Organization" class="text-right"><a href="javascript:void(0)" itemprop="url" class="open-settings"><img src="assets/images/settings-icon.svg" class="max-width-30" itemprop="logo" alt="Settings icon"/></a></figure></div>');
            }
        } else {
            $('.logo-and-settings-row .open-settings-col').remove();
        }

        //init contract
        if(typeof(global_state.account) != 'undefined') {
            $.getJSON('assets/jsons/DentacoinToken.json', function (DCNArtifact) {
                // get the contract artifact file and use it to instantiate a truffle contract abstraction
                getInstance = getContractInstance(dApp.web3_1_0);
                DCNContract = getInstance(DCNArtifact, dApp.contract_address);

                if(callback != undefined) {
                    callback();
                }

                dApp.buildTransactionHistory();
            });
        }
    },
    buildTransactionHistory: function() {
        //getting transactions data by etherscan
        $.ajax({
            type: 'GET',
            url: 'https://api.etherscan.io/api?module=account&action=txlist&address='+global_state.account+'&startblock='+block_number_of_dcn_creation,
            dataType: 'json',
            success: function(response) {
                var etherscan_transactions = response;

                var ethereum_transactions_arr = [];
                if(etherscan_transactions.result) {
                    for(var i = 0, len = etherscan_transactions.result.length; i < len; i+=1) {
                        if(etherscan_transactions.result[i].input == '0x') {
                            etherscan_transactions.result[i].type = 'eth_transaction';
                            ethereum_transactions_arr.push(etherscan_transactions.result[i]);
                        }
                    }
                }

                //getting blockchain events where the logged user was the sender of the transaction
                DCNContract.getPastEvents('Transfer', {
                    filter: {_from: global_state.account},
                    fromBlock: block_number_of_dcn_creation,
                    toBlock: 'latest'
                }, function(events_from_user_err, events_from_user){
                    if(!events_from_user_err) {

                        //getting blockchain events where the logged user was the receiver of the transaction
                        DCNContract.getPastEvents('Transfer', {
                            filter: {_to: global_state.account},
                            fromBlock: block_number_of_dcn_creation,
                            toBlock: 'latest'
                        }, function(events_to_user_err, events_to_user){
                            if(!events_to_user_err) {
                                //combining both events arrays ( from + to )
                                var merged_events_arr = events_from_user.concat(events_to_user, ethereum_transactions_arr);

                                if(merged_events_arr.length > 0) {
                                    //sorting the mixed array by blockNumber
                                    sortByKey(merged_events_arr, 'blockNumber');
                                    merged_events_arr = merged_events_arr.reverse();

                                    $.ajax({
                                        type: 'GET',
                                        url: 'https://api.coingecko.com/api/v3/coins/ethereum',
                                        dataType: 'json',
                                        success: function(response) {
                                            var ethereum_data = response;

                                            $.ajax({
                                                type: 'GET',
                                                url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
                                                dataType: 'json',
                                                success: function(response) {
                                                    var dentacoin_data = response;

                                                    $('.camping-transaction-history').html('<h2 class="lato-bold fs-25 text-center white-crossed-label color-white"><span>Transaction history</span></h2><div class="transaction-history container"><div class="row"><div class="col-xs-12 no-gutter-xs col-md-10 col-md-offset-1 padding-top-20"><table class="color-white"><tbody></tbody></table></div></div><div class="row camping-show-more"></div></div>');

                                                    $(document).on('click', '.camping-transaction-history .show-more', function() {
                                                        $(this).fadeOut();
                                                        $(this).attr('show-all-transactions', 'true');
                                                        $('.camping-transaction-history table tr').addClass('show-this');
                                                    });

                                                    var transaction_history_html = '';
                                                    var array_with_already_shown_transactions = [];

                                                    //clearing the array with transactions from dupped ones
                                                    for(var i = 0, len = merged_events_arr.length; i < len; i+=1) {
                                                        if(basic.property_exists(merged_events_arr[i], 'hash')) {
                                                            if(array_with_already_shown_transactions.includes(merged_events_arr[i].hash)) {
                                                                merged_events_arr.splice(i, 1);
                                                            } else {
                                                                array_with_already_shown_transactions.push(merged_events_arr[i].hash);
                                                            }
                                                        } else if(basic.property_exists(merged_events_arr[i], 'transactionHash')) {
                                                            if(array_with_already_shown_transactions.includes(merged_events_arr[i].transactionHash)) {
                                                                merged_events_arr.splice(i, 1);
                                                            } else {
                                                                array_with_already_shown_transactions.push(merged_events_arr[i].transactionHash);
                                                            }
                                                        }
                                                    }

                                                    //requesting blockchain for a lot of transactions data takes sometime and this is why first we select the latest 5 transactions for the logged user (which are shown on page load) and then we make a second query to select everything before these 5 latest transactions and show loader until they are ready to be shown
                                                    var intervals_stopper = 5;
                                                    if(merged_events_arr.length < 5) {
                                                        intervals_stopper = merged_events_arr.length;
                                                    }

                                                    var stop_intervals = false;
                                                    function recursiveLoop(custom_iterator) {
                                                        if(custom_iterator < 5 && custom_iterator < intervals_stopper) {
                                                            console.log(custom_iterator, 'custom_iterator');
                                                            var other_address = '';
                                                            var class_name = '';
                                                            var label = '';
                                                            if(basic.property_exists(merged_events_arr[custom_iterator], 'type') && merged_events_arr[custom_iterator].type == 'eth_transaction') {
                                                                //eth transaction
                                                                var eth_amount_symbol;
                                                                if(checksumAddress(merged_events_arr[custom_iterator].to) == checksumAddress(global_state.account)) {
                                                                    //IF THE CURRENT ACCOUNT IS RECEIVER
                                                                    other_address = merged_events_arr[custom_iterator].from;
                                                                    label = 'Received from';
                                                                    class_name = 'received_from';
                                                                    eth_amount_symbol = '+';
                                                                } else if(checksumAddress(merged_events_arr[custom_iterator].from) == checksumAddress(global_state.account)) {
                                                                    //IF THE CURRENT ACCOUNT IS SENDER
                                                                    other_address = merged_events_arr[custom_iterator].to;
                                                                    label = 'Sent to';
                                                                    class_name = 'sent_to';
                                                                    eth_amount_symbol = '-';
                                                                }

                                                                var eth_amount = dApp.web3_1_0.utils.fromWei(merged_events_arr[custom_iterator].value, 'ether');
                                                                var usd_amount = (ethereum_data.market_data.current_price.usd * eth_amount).toFixed(2);
                                                                var timestamp_javascript = merged_events_arr[custom_iterator].timeStamp*1000;
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

                                                                transaction_history_html+='<tr class="'+class_name+' single-transaction" onclick="window.open(\'https://etherscan.io/tx/'+merged_events_arr[custom_iterator].hash+'\');"><td class="icon"></td><td><ul><li>'+(date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() +'</li><li>'+hours+':'+minutes+'</li></ul></td><td><ul><li><span><strong>'+label+': </strong>'+other_address+'</span></li><li><a href="https://etherscan.io/tx/'+merged_events_arr[custom_iterator].hash+'" target="_blank" class="lato-bold color-white">Transaction ID</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5"><ul><li class="lato-bold dcn-amount">'+eth_amount_symbol+eth_amount+' ETH</li><li>'+usd_amount+' USD</li></ul></td></tr>';

                                                                if(custom_iterator < 5) {
                                                                    custom_iterator+=1;
                                                                    recursiveLoop(custom_iterator);
                                                                } else {
                                                                    stop_intervals = true;
                                                                }
                                                            } else {
                                                                //dcn transaction
                                                                dApp.helper.addBlockTimestampToTransaction(merged_events_arr[custom_iterator].blockNumber, custom_iterator);

                                                                var request_interval = setInterval(function() {
                                                                    if(!stop_intervals) {
                                                                        if (temporally_timestamps[custom_iterator] != 0 && temporally_timestamps[custom_iterator] != undefined) {
                                                                            clearInterval(request_interval);
                                                                            merged_events_arr[custom_iterator].timestamp = temporally_timestamps[custom_iterator];

                                                                            var dcn_amount_symbol;
                                                                            var usd_amount = (parseInt(merged_events_arr[custom_iterator].returnValues._value) * dentacoin_data.market_data.current_price.usd).toFixed(2);
                                                                            if(checksumAddress(merged_events_arr[custom_iterator].returnValues._to) == checksumAddress(global_state.account)) {
                                                                                //IF THE CURRENT ACCOUNT IS RECEIVER
                                                                                other_address = merged_events_arr[custom_iterator].returnValues._from;
                                                                                label = 'Received from';
                                                                                class_name = 'received_from';
                                                                                dcn_amount_symbol = '+';
                                                                            } else if(checksumAddress(merged_events_arr[custom_iterator].returnValues._from) == checksumAddress(global_state.account)) {
                                                                                //IF THE CURRENT ACCOUNT IS SENDER
                                                                                other_address = merged_events_arr[custom_iterator].returnValues._to;
                                                                                label = 'Sent to';
                                                                                class_name = 'sent_to';
                                                                                dcn_amount_symbol = '-';
                                                                            }

                                                                            var dcn_amount = dcn_amount_symbol+merged_events_arr[custom_iterator].returnValues._value+' DCN';
                                                                            var timestamp_javascript = merged_events_arr[custom_iterator].timestamp*1000;
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

                                                                            transaction_history_html+='<tr class="'+class_name+' single-transaction" onclick="window.open(\'https://etherscan.io/tx/'+merged_events_arr[custom_iterator].transactionHash+'\');"><td class="icon"></td><td><ul><li>'+(date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() +'</li><li>'+hours+':'+minutes+'</li></ul></td><td><ul><li><span><strong>'+label+': </strong>'+other_address+'</span></li><li><a href="https://etherscan.io/tx/'+merged_events_arr[custom_iterator].transactionHash+'" target="_blank" class="lato-bold color-white">Transaction ID</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5"><ul><li class="lato-bold dcn-amount">'+dcn_amount+'</li><li>'+usd_amount+' USD</li></ul></td></tr>';

                                                                            if(custom_iterator < 5) {
                                                                                custom_iterator+=1;
                                                                                recursiveLoop(custom_iterator);
                                                                            } else {
                                                                                stop_intervals = true;
                                                                            }
                                                                        }
                                                                    }
                                                                }, 300);
                                                            }
                                                        } else {
                                                            stop_intervals = false;

                                                            if(merged_events_arr.length > 5) {
                                                                transaction_history_html+='<tr class="loading-tr"><td class="text-center" colspan="5"><figure class="inline-block rotate-animation"><img src="assets/images/exchange.png" alt="Exchange icon"/></figure></td></tr>';
                                                                $('.camping-transaction-history .camping-show-more').html('<div class="col-xs-12 text-center padding-top-30"><a href="javascript:void(0)" class="white-light-blue-btn show-more">Show more</a></div>');
                                                                recursiveLoopForRestOfHistory(5);
                                                            }

                                                            $('.camping-transaction-history table tbody').html(transaction_history_html);
                                                        }
                                                    }
                                                    recursiveLoop(0);

                                                    //requesting all transactions before the latest 5
                                                    var next_transaction_history_html = '';
                                                    function recursiveLoopForRestOfHistory(custom_iterator) {
                                                        if(custom_iterator < merged_events_arr.length) {
                                                            var other_address = '';
                                                            var class_name = '';
                                                            var label = '';
                                                            if(basic.property_exists(merged_events_arr[custom_iterator], 'type') && merged_events_arr[custom_iterator].type == 'eth_transaction') {
                                                                //eth transaction
                                                                var eth_amount_symbol;
                                                                if(checksumAddress(merged_events_arr[custom_iterator].to) == checksumAddress(global_state.account)) {
                                                                    //IF THE CURRENT ACCOUNT IS RECEIVER
                                                                    other_address = merged_events_arr[custom_iterator].from;
                                                                    label = 'Received from';
                                                                    class_name = 'received_from';
                                                                    eth_amount_symbol = '+';
                                                                } else if(checksumAddress(merged_events_arr[custom_iterator].from) == checksumAddress(global_state.account)) {
                                                                    //IF THE CURRENT ACCOUNT IS SENDER
                                                                    other_address = merged_events_arr[custom_iterator].to;
                                                                    label = 'Sent to';
                                                                    class_name = 'sent_to';
                                                                    eth_amount_symbol = '-';
                                                                }

                                                                var eth_amount = dApp.web3_1_0.utils.fromWei(merged_events_arr[custom_iterator].value, 'ether');
                                                                var usd_amount = (ethereum_data.market_data.current_price.usd * eth_amount).toFixed(2);
                                                                var timestamp_javascript = merged_events_arr[custom_iterator].timeStamp*1000;
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

                                                                next_transaction_history_html+='<tr class="'+class_name+' single-transaction" onclick="window.open(\'https://etherscan.io/tx/'+merged_events_arr[custom_iterator].hash+'\');"><td class="icon"></td><td><ul><li>'+(date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() +'</li><li>'+hours+':'+minutes+'</li></ul></td><td><ul><li><span><strong>'+label+': </strong>'+other_address+'</span></li><li><a href="https://etherscan.io/tx/'+merged_events_arr[custom_iterator].hash+'" target="_blank" class="lato-bold color-white">Transaction ID</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5"><ul><li class="lato-bold dcn-amount">'+eth_amount_symbol+eth_amount+' ETH</li><li>'+usd_amount+' USD</li></ul></td></tr>';

                                                                if(custom_iterator < merged_events_arr.length) {
                                                                    custom_iterator+=1;
                                                                    recursiveLoopForRestOfHistory(custom_iterator);
                                                                } else {
                                                                    stop_intervals = true;
                                                                }
                                                            } else {
                                                                //dcn transaction
                                                                dApp.helper.addBlockTimestampToTransaction(merged_events_arr[custom_iterator].blockNumber, custom_iterator);

                                                                request_interval_for_rest_of_transaction_history = setInterval(function() {
                                                                    if(!stop_intervals) {
                                                                        if (temporally_timestamps[custom_iterator] != 0 && temporally_timestamps[custom_iterator] != undefined) {
                                                                            clearInterval(request_interval_for_rest_of_transaction_history);
                                                                            merged_events_arr[custom_iterator].timestamp = temporally_timestamps[custom_iterator];

                                                                            var other_address = '';
                                                                            var class_name = '';
                                                                            var label = '';
                                                                            var dcn_amount_symbol;
                                                                            var usd_amount = (parseInt(merged_events_arr[custom_iterator].returnValues._value) * dentacoin_data.market_data.current_price.usd).toFixed(2);
                                                                            if(checksumAddress(merged_events_arr[custom_iterator].returnValues._to) == checksumAddress(global_state.account))    {
                                                                                //IF THE CURRENT ACCOUNT IS RECEIVER
                                                                                other_address = merged_events_arr[custom_iterator].returnValues._from;
                                                                                label = 'Received from';
                                                                                class_name = 'received_from';
                                                                                dcn_amount_symbol = '+';
                                                                            }else if(checksumAddress(merged_events_arr[custom_iterator].returnValues._from) == checksumAddress(global_state.account)) {
                                                                                //IF THE CURRENT ACCOUNT IS SENDER
                                                                                other_address = merged_events_arr[custom_iterator].returnValues._to;
                                                                                label = 'Sent to';
                                                                                class_name = 'sent_to';
                                                                                dcn_amount_symbol = '-';
                                                                            }

                                                                            var dcn_amount = dcn_amount_symbol+merged_events_arr[custom_iterator].returnValues._value+' DCN';
                                                                            var timestamp_javascript = merged_events_arr[custom_iterator].timestamp*1000;
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

                                                                            next_transaction_history_html+='<tr class="'+class_name+' single-transaction" onclick="window.open(\'https://etherscan.io/tx/'+merged_events_arr[custom_iterator].transactionHash+'\');"><td class="icon"></td><td><ul><li>'+(date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() +'</li><li>'+hours+':'+minutes+'</li></ul></td><td><ul><li><span><strong>'+label+': </strong>'+other_address+'</span></li><li><a href="https://etherscan.io/tx/'+merged_events_arr[custom_iterator].transactionHash+'" target="_blank" class="lato-bold color-white">Transaction ID</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5"><ul><li class="lato-bold dcn-amount">'+dcn_amount+'</li><li>'+usd_amount+' USD</li></ul></td></tr>';
                                                                            if(custom_iterator < merged_events_arr.length) {
                                                                                custom_iterator+=1;
                                                                                recursiveLoopForRestOfHistory(custom_iterator);
                                                                            } else {
                                                                                stop_intervals = true;
                                                                            }
                                                                        }
                                                                    }
                                                                }, 300);
                                                            }
                                                        } else {
                                                            $('.camping-transaction-history table tbody tr.loading-tr').remove();
                                                            $('.camping-transaction-history table tbody').append(next_transaction_history_html);
                                                            if($('.camping-transaction-history .show-more').attr('show-all-transactions') == 'true') {
                                                                $('.camping-transaction-history table tr').addClass('show-this');
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    $('.camping-transaction-history').html('<h2 class="lato-bold fs-16 text-center color-white"><span>No transactions yet</span></h2>');
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    getTransferFromEvents: function () {
        return new Promise(function(resolve, reject) {
            DCNContract.getPastEvents('Transfer', {
                filter: {_from: global_state.account},
                fromBlock: block_number_of_dcn_creation,
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
                fromBlock: block_number_of_dcn_creation,
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
        getDCNBalance: function(address, callback)  {
            DCNContract.methods.balanceOf(address).call({from: address}, function(err, response) {
                callback(err, response);
            });
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
        getBlockNum: function()  {
            return new Promise(function(resolve, reject) {
                dApp.web3_1_0.eth.getBlockNumber(function(error, result) {
                    if(!error){
                        global_state.curr_block = result;
                        resolve(global_state.curr_block);
                    }
                });
            });
        },
        addBlockTimestampToTransaction: function(blockNumber, object_key)    {
            dApp.web3_1_0.eth.getBlock(blockNumber, function(error, result) {
                if (error !== null) {

                }
                if(result != undefined && result != null) {
                    temporally_timestamps[object_key] = result.timestamp;
                }
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
    homepage: function() {
        console.log('homepage');
        console.log(global_state.account, 'global_state.account');
        if(typeof(global_state.account) != 'undefined') {
            function refreshAccountDataButtonLogic(init_loader) {
                if(init_loader != undefined) {
                    showLoader();

                    clearInterval(request_interval_for_rest_of_transaction_history);
                    dApp.buildTransactionHistory();
                    setTimeout(function() {
                        updateUserAccountData(true);
                    }, 500);
                } else {
                    updateUserAccountData();
                }
            }
            refreshAccountDataButtonLogic();

            function updateUserAccountData(hide_loader) {
                //show user ethereum address
                $('.eth-address-container .address-value').val(global_state.account);

                //update dentacoin amount
                dApp.methods.getDCNBalance(global_state.account, function(err, response) {
                    var dcn_balance = parseInt(response);

                    $('.dcn-amount').html(dcn_balance);

                    //update usd amount (dentacoins in usd)
                    getDentacoinDataByCoingecko(function(request_response) {
                        var dentacoin_data = request_response;

                        $('.usd-amount').html((dcn_balance * dentacoin_data.market_data.current_price.usd).toFixed(2));

                        //update ether amount
                        dApp.web3_1_0.eth.getBalance(global_state.account, function(error, result) {
                            if(error) {
                                console.log(error);
                            } else {
                                $('.eth-amount').html(parseFloat(dApp.web3_1_0.utils.fromWei(result)).toFixed(6));

                                if(hide_loader != undefined) {
                                    hideLoader();
                                }
                            }
                        });
                    });
                });
            }

            $(document).on('click', '.refresh-account-data', function() {
                refreshAccountDataButtonLogic(true);
            });

            $('body').addClass('overflow-hidden');
            var window_width = $(window).width();
            $('body').removeClass('overflow-hidden');
            if(window_width > 768) {
                //show qr code generated by the user ethereum address
                if($('#qrcode').length) {
                    $('#qrcode').html('');
                    var qrcode = new QRCode(document.getElementById('qrcode'), {
                        width : 160,
                        height : 160
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

        $('.more-info').click(function() {
            $('.camp-for-custom-popover').toggleClass('hide');

            if(!$('.camp-for-custom-popover').hasClass('hide')) {
                custom_popover_interval = setInterval(function() {
                    positionCustomPopover();
                }, 500);
            } else {
                clearInterval(custom_popover_interval);
            }
        });

        function positionCustomPopover() {
            if(!$('.camp-for-custom-popover').hasClass('hide')) {
                $('.camp-for-custom-popover').offset({
                    top: $('.more-info').height() + $('.more-info').offset().top + 15,
                    left: $('.more-info').offset().left - $('.camp-for-custom-popover').width()
                });
            }
        }
    },
    buy_page: function() {
        if(typeof(global_state.account) != 'undefined') {
            $('section.ready-to-purchase-with-external-api input#dcn_address').parent().find('label').addClass('active-label');
            $('section.ready-to-purchase-with-external-api input#dcn_address').val(global_state.account);
        }

        //getting DCN data from Indacoin every 10 minutes
        if(!basic.property_exists(indacoin_data, 'dcn') || (basic.property_exists(indacoin_data, 'dcn') && indacoin_data.dcn.timestamp < Date.now())) {
            getCryptoDataByIndacoin('DCN', function(indacoin_dcn_data) {
                passedGetDCNDataRequest(indacoin_dcn_data);
            });
        } else {
            passedGetDCNDataRequest(indacoin_data);
        }

        function passedGetDCNDataRequest(indacoin_dcn_data) {
            var dcn_for_one_usd = parseFloat(indacoin_dcn_data.dcn.value) / 100;

            //getting ETH data from Indacoin every 10 minutes
            if(!basic.property_exists(indacoin_data, 'eth') || (basic.property_exists(indacoin_data, 'eth') && indacoin_data.eth.timestamp < Date.now())) {
                getCryptoDataByIndacoin('ETH', function(indacoin_eth_data) {
                    passedGetETHDataRequest(indacoin_eth_data);
                });
            } else  {
                passedGetETHDataRequest(indacoin_data);
            }

            function passedGetETHDataRequest(indacoin_eth_data) {
                var eth_for_one_usd = parseFloat(indacoin_eth_data.eth.value) / 100;

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

                //on BUY action button make few inputs validations and redirect to indacoin external link
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
            }
        }
    },
    send_page: function() {
        //reading all clinics/ dentists from the CoreDB EVERY 1h
        showLoader();

        setTimeout(function() {
            if(core_db_clinics == undefined || core_db_clinics_time_to_request < Date.now()) {

                $.ajax({
                    type: 'POST',
                    url: 'https://api.dentacoin.com/api/users/',
                    dataType: 'json',
                    data: {
                        status: 'approved',
                        is_partner: 1,
                        type: 'all-dentists',
                        items_per_page: 10000
                    },
                    success: function(response) {
                        core_db_clinics_time_to_request = Date.now() + 3600 * 1000;
                        core_db_clinics = response;

                        ifCoreDBReturnsClinics(true);
                    }
                });
            } else {
                //if we did make clinics request in the past 1h dont make request again just show what was requested
                ifCoreDBReturnsClinics();
            }

            //search input validation for next button to become active
            $('.search-field #search').on('change keyup change focusout', function() {
                var input_value = $(this).val().trim();
                if(input_value != '') {
                    if(innerAddressCheck(input_value)) {
                        $('.next-send').removeClass('disabled');
                    } else {
                        $('.next-send').addClass('disabled');
                    }
                }
            });

            $('.scan-qr-code').click(function() {
                if(is_hybrid) {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            $('#search').val(result.text).trigger('change');
                        },
                        function (error) {
                            alert('Scanning failed. Please go to Settings/ Permissions and allow Camera access to Dentacoin Wallet and try again.');
                        }
                    );
                } else {
                    //BROWSER SCAN
                    if(load_qr_code_lib) {
                        showLoader();
                        $.getScript('https://rawgit.com/schmich/instascan-builds/master/instascan.min.js', function() {
                            load_qr_code_lib = false;
                            hideLoader();

                            initQRCodePopupForSendingTransaction();
                        });
                        hideLoader();
                    } else {
                        initQRCodePopupForSendingTransaction();
                    }

                    function initQRCodePopupForSendingTransaction() {
                        basic.showDialog('<div class="video-container"><video id="qr-preview"></video></div>', 'popup-scan-qr-code', null, true);

                        var cameras_global;
                        var scanner = new Instascan.Scanner({ video: document.getElementById('qr-preview') });
                        scanner.addListener('scan', function (content) {
                            $('#search').val(content).trigger('change');
                            scanner.stop(cameras_global[0]);
                            basic.closeDialog();
                        });

                        Instascan.Camera.getCameras().then(function (cameras) {
                            console.log(cameras, 'cameras');
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
                }
            });

            //sorting both clinics and address book lists in alphabetic order
            function sortList(id) {
                var mylist = $('#'+id);
                var listitems = mylist.children('li').get();
                listitems.sort(function(a, b) {
                    return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
                });
                $.each(listitems, function(idx, itm) { mylist.append(itm); });
            }

            function ifCoreDBReturnsClinics() {
                if(core_db_clinics.success) {
                    var clinics_select_html = '';
                    for(var i = 0, len = core_db_clinics.data.length; i < len; i+=1) {
                        if(core_db_clinics.data[i].dcn_address != null) {
                            clinics_select_html += '<li><a href="javascript:void(0);" class="display-block-important" data-value="'+core_db_clinics.data[i].dcn_address+'">'+core_db_clinics.data[i].name+'</a></li>';
                        }
                    }

                    $('.clinics-list').append(clinics_select_html);
                    sortList('clinics-list');

                    $('.search-result .search-header a').click(function() {
                        $('.search-body .hideable-element').hide();
                        $('.search-result .search-header a').removeClass('active');

                        $(this).addClass('active');
                        $('.search-body .hideable-element.'+$(this).attr('data-type')).show();
                    });

                    $(document).on('click', '.search-result .search-body ul li a', function() {
                        $('.search-field #search').val($(this).attr('data-value')).trigger('change');
                        $('.search-field #search-label').html($(this).html());
                        $('.search-result').hide();
                    });

                    $(document).click(function(event) {
                        var $target = event.target;
                        if($target.closest('.search-field') == null) {
                            $('.search-result').hide();
                        }
                    });

                    $('.search-field #search').on('focus', function() {
                        $('.search-result').show();
                    });

                    $('.search-field #search').on('input', function() {
                        if($(this).val().trim() != '') {
                            $('.search-result').show();

                            var value_to_check = $(this).val().trim().toLowerCase();
                            $('.search-result .search-body ul li a').each(function() {
                                if($(this).html().toLowerCase().indexOf(value_to_check) == -1) {
                                    $(this).parent().addClass('hide-this');
                                } else {
                                    $(this).parent().removeClass('hide-this');
                                }
                            });
                        } else {
                            $('.search-field #search-label').html('Enter receiving address/ clinic name or scan QR');
                            $('.search-result .search-body ul li').removeClass('hide-this');
                            $('.search-result').hide();
                        }
                    });

                    function updateAddressBookHtml() {
                        var address_book_list_in_storage = window.localStorage.getItem('address_book');
                        if(address_book_list_in_storage != null && basic.isJsonString(address_book_list_in_storage)) {
                            var address_book_list_in_storage_obj = JSON.parse(address_book_list_in_storage);
                            var address_book_html = '<ul id="address-book">';
                            for(var i = 0, len = address_book_list_in_storage_obj.length; i < len; i+=1) {
                                address_book_html += '<li class="removeable-element fs-0"><a href="javascript:void(0);" class="inline-block" data-value="'+address_book_list_in_storage_obj[i].address+'">'+address_book_list_in_storage_obj[i].name+'</a><button type="button" class="remove-address-book-element inline-block">×</button></li>';
                            }
                            address_book_html += '</ul>';

                            $('.search-body .address-book').html(address_book_html);
                            sortList('address-book');
                        }
                    }
                    updateAddressBookHtml();

                    function updateAddressBooklocalStorageVariable() {
                        var array = [];
                        $('.search-body .address-book ul li a').each(function() {
                            array.push({'name': $(this).html().trim(), 'address': $(this).attr('data-value')});
                        });

                        window.localStorage.setItem('address_book', JSON.stringify(array));
                    }

                    $(document).on('click', '.search-body .address-book ul li button', function() {
                        var this_btn = $(this);
                        var delete_address_book_wallet_address = {};
                        delete_address_book_wallet_address.callback = function (result) {
                            if (result) {
                                this_btn.closest('li').remove();
                                updateAddressBooklocalStorageVariable();
                            }
                        };
                        basic.showConfirm('Are you sure you want to remove this Wallet Address from Address Book?', '', delete_address_book_wallet_address, true);
                    });

                    $('.search-field .search-footer .add-to-address-book').click(function() {
                        basic.closeDialog();
                        basic.showDialog('<h2 class="fs-18 padding-bottom-20 text-center">Save to Address Book</h2><div class="custom-google-label-style module max-width-350 margin-0-auto margin-bottom-15" data-input-light-blue-border="true"><label for="contact-name">Name:</label><input type="text" id="contact-name" maxlength="100" class="full-rounded"></div><div class="custom-google-label-style module max-width-350 margin-0-auto" data-input-light-blue-border="true"><label for="wallet-address">Wallet Address:</label><input type="text" id="wallet-address" maxlength="42" class="full-rounded"></div><div class="padding-top-10"><a href="javascript:void(0)" class="display-block-important margin-0-auto max-width-80 add-to-address-book-scan-qr-code"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/scan-qr-code.svg" class="width-100" alt="Scan QR code icon" itemprop="contentUrl"/></figure></a></div><div class="padding-top-20 padding-bottom-15 text-center"><a href="javascript:void(0);" class="white-light-blue-btn light-blue-border save-to-address-book min-width-160">Save</a></div>', 'popup-save-to-address-book', null, true);

                        //open QR code reader to add new address to address book
                        $('.add-to-address-book-scan-qr-code').click(function() {
                            if(is_hybrid) {
                                cordova.plugins.barcodeScanner.scan(
                                    function (result) {
                                        $('.popup-save-to-address-book #wallet-address').val(result.text).trigger('change');
                                    },
                                    function (error) {
                                        alert('Scanning failed. Please go to Settings/ Permissions and allow Camera access to Dentacoin Wallet and try again.');
                                    }
                                );
                            } else {
                                //BROWSER SCAN
                                if(load_qr_code_lib) {
                                    showLoader();
                                    $.getScript('https://rawgit.com/schmich/instascan-builds/master/instascan.min.js', function() {
                                        load_qr_code_lib = false;
                                        hideLoader();

                                        initQRCodePopupForAddressBook();
                                    });
                                } else {
                                    initQRCodePopupForAddressBook();
                                }

                                function initQRCodePopupForAddressBook() {
                                    basic.showDialog('<div class="video-container"><video id="qr-preview"></video></div>', 'popup-scan-qr-code', null, true);

                                    var cameras_global;
                                    var scanner = new Instascan.Scanner({ video: document.getElementById('qr-preview') });
                                    scanner.addListener('scan', function (content) {
                                        $('.popup-save-to-address-book #wallet-address').val(content).trigger('change');
                                        scanner.stop(cameras_global[0]);
                                        $('.popup-scan-qr-code .bootbox-close-button').click();
                                    });

                                    Instascan.Camera.getCameras().then(function (cameras) {
                                        console.log(cameras, 'cameras');
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
                            }
                        });

                        $('.save-to-address-book').click(function() {
                            if($('.popup-save-to-address-book #contact-name').val().trim() == '') {
                                basic.showAlert('Please enter name.', '', true);
                            } else if($('.popup-save-to-address-book #wallet-address').val().trim() == '' || !innerAddressCheck($('.popup-save-to-address-book #wallet-address').val().trim())){
                                basic.showAlert('Please enter valid Wallet Address.', '', true);
                            } else {
                                var address_book_list_in_storage = window.localStorage.getItem('address_book');

                                if(address_book_list_in_storage == null) {
                                    window.localStorage.setItem('address_book', JSON.stringify([{'name' : $('.popup-save-to-address-book #contact-name').val().trim(), 'address' : $('.popup-save-to-address-book #wallet-address').val().trim()}]));

                                    updateAddressBookHtml();
                                    basic.closeDialog();
                                    basic.showAlert('Address book updated successfully.', '', true);
                                } else {
                                    if(basic.isJsonString(address_book_list_in_storage)) {
                                        var object = JSON.parse(address_book_list_in_storage);
                                        object.unshift({'name' : $('.popup-save-to-address-book #contact-name').val().trim(), 'address' : $('.popup-save-to-address-book #wallet-address').val().trim()});

                                        window.localStorage.setItem('address_book', JSON.stringify(object));

                                        updateAddressBookHtml();
                                        basic.closeDialog();
                                        basic.showAlert('Address book updated successfully.', '', true);
                                    } else {
                                        //if the local storage variable is not object remove it and recreate it with object
                                        window.localStorage.removeItem('address_book');

                                        window.localStorage.setItem('address_book', JSON.stringify([{'name' : $('.popup-save-to-address-book #contact-name').val().trim(), 'address' : $('.popup-save-to-address-book #wallet-address').val().trim()}]));

                                        updateAddressBookHtml();
                                        basic.closeDialog();
                                        basic.showAlert('Address book updated successfully.', '', true);
                                    }
                                }
                            }
                        });
                    });

                    hideLoader();

                    bindSendPageElementsEvents();
                } else {
                    bindSendPageElementsEvents();
                }
            }

            function bindSendPageElementsEvents() {
                $('.section-send .next-send').click(function() {
                    if(!$(this).hasClass('disabled')) {
                        fireGoogleAnalyticsEvent('Pay', 'Next', 'DCN Address');

                        $('.section-send').hide();
                        $('.section-amount-to .address-cell').html($('.search-field #search').val().trim()).attr('data-receiver', $('.search-field #search').val().trim());
                        $('.section-amount-to').fadeIn(500);
                    }
                });

                $('.section-amount-to .edit-address').click(function() {
                    $('.section-amount-to').hide();
                    $('.section-send').fadeIn(500);
                });

                getEthereumDataByCoingecko(function(request_response) {
                    var ethereum_data = request_response;

                    //getting dentacoin data by Coingecko
                    getDentacoinDataByCoingecko(function(request_response) {
                        var dentacoin_data = request_response;

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

                        $.ajax({
                            type: 'GET',
                            url: 'https://ethgasstation.info/json/ethgasAPI.json',
                            dataType: 'json',
                            success: function(response) {
                                var ethgasstation_data = response;

                                $('.section-amount-to .open-transaction-recipe').click(function() {
                                    var crypto_val = $('.section-amount-to input#crypto-amount').val().trim();
                                    var usd_val = $('.section-amount-to input#usd-val').val().trim();
                                    var sending_to_address = $('.section-amount-to .address-cell').attr('data-receiver');

                                    dApp.methods.getDCNBalance(global_state.account, function(err, response) {
                                        var dcn_balance = parseInt(response);

                                        dApp.web3_1_0.eth.getBalance(global_state.account, function(error, eth_balance) {
                                            if(error) {
                                                console.log(error);
                                            } else {
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
                                                } else if (0.005 > parseFloat(dApp.web3_1_0.utils.fromWei(eth_balance))) {
                                                    //checking if current balance is lower than the desired value to send
                                                    if($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                        basic.showAlert('For sending Dentacoins you need at least 0.005 ETH. Please refill.', '', true);
                                                    } else if($('.section-amount-to #active-crypto').val() == 'eth') {
                                                        basic.showAlert('For sending Ethereum you need at least 0.005 ETH. Please refill.', '', true);
                                                    }
                                                    return false;
                                                } else if($('.section-amount-to #active-crypto').val() == 'dcn' && crypto_val > parseInt(dcn_balance)) {
                                                    basic.showAlert('The value you want to send is higher than your balance.', '', true);
                                                    return false;
                                                } else if($('.section-amount-to #active-crypto').val() == 'eth' && crypto_val > parseFloat(dApp.web3_1_0.utils.fromWei(eth_balance))) {
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

                                                    //using ethgasstation gas price and not dApp.helper.getGasPrice(), because its more accurate
                                                    dApp.web3_1_0.eth.estimateGas({
                                                        to: sending_to_address,
                                                        data: function_abi
                                                    }, function(error, result) {
                                                        if(error) {
                                                            console.log(error);
                                                        } else {
                                                            var eth_fee = dApp.web3_1_0.utils.fromWei((on_popup_load_gas_price * result).toString(), 'ether');

                                                            var transaction_popup_html = '<div class="title">Send confirmation</div><div class="pictogram-and-dcn-usd-price"><svg version="1.1" class="width-100 max-width-100 margin-bottom-10" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100.1 100" style="enable-background:new 0 0 100.1 100;" xml:space="preserve"><style type="text/css">.st0-recipe{fill:#FFFFFF;}.st1-recipe{fill:#CA675A;}.st2-recipe{fill:none;stroke:#CA675A;stroke-width:2.8346;stroke-linecap:round;stroke-miterlimit:10;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="100" width="105.7" x="-7.2" y="-6.4"></sliceSourceBounds></sfw></metadata><circle class="st0-recipe" cx="50" cy="50" r="50"/><g><g><g><path class="st1-recipe" d="M50.1,93.7c-18.7,0-36-12.4-41.3-31.3C2.4,39.6,15.8,16,38.5,9.6C48.9,6.7,60,7.8,69.6,12.8c1.2,0.6,1.6,2,1,3.2s-2,1.6-3.2,1c-8.6-4.4-18.4-5.4-27.7-2.8c-20.1,5.6-32,26.7-26.3,46.9s26.7,32.1,46.9,26.4s32.1-26.7,26.4-46.9c-1.1-3.9-2.8-7.6-5-10.9c-0.7-1.1-0.4-2.6,0.7-3.3c1.1-0.7,2.6-0.4,3.3,0.7c2.5,3.8,4.4,7.9,5.6,12.3c6.4,22.8-7,46.5-29.7,52.8C57.8,93.2,53.9,93.7,50.1,93.7z"/></g><g><path class="st1-recipe" d="M33.1,78.6c-0.5,0-1-0.2-1.5-0.5c-1-0.8-1.2-2.3-0.4-3.4l40.4-50.5c0.8-1,2.3-1.2,3.4-0.4c1,0.8,1.2,2.3,0.4,3.4L35,77.7C34.5,78.3,33.8,78.6,33.1,78.6z"/></g><g><g><path class="st2-recipe" d="M105.7,56.9"/></g></g></g><g><path class="st1-recipe" d="M73.7,54.2c-0.1,0-0.2,0-0.2,0c-1.3-0.2-2.3-1.4-2.2-2.7L74,23.9L47.6,39.8c-1.1,0.7-2.6,0.3-3.3-0.8c-0.7-1.1-0.3-2.6,0.8-3.3l34.5-20.8L76.1,52C76,53.2,74.9,54.2,73.7,54.2z"/></g></g></svg><div class="dcn-amount">-'+crypto_val+' '+token_symbol+'</div><div class="usd-amount">=$'+usd_val+'</div></div><div class="confirm-row to"> <div class="label inline-block">To:</div><div class="value inline-block">'+sending_to_address+'</div></div><div class="confirm-row from"> <div class="label inline-block">From:</div><div class="value inline-block">'+global_state.account+'</div></div><div class="confirm-row free"> <div class="label inline-block">Ether fee:</div><div class="value inline-block">'+parseFloat(eth_fee).toFixed(8)+'</div></div>';

                                                            if(window.localStorage.getItem('keystore_file') != null) {
                                                                //cached keystore path on mobile device or cached keystore file on browser
                                                                transaction_popup_html+='<div class="container-fluid"><div class="row padding-top-25 cached-keystore-file"><div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">Secret password:</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"></div></div><div class="btn-container col-xs-12"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">Confirm</a></div></div></div>';
                                                                basic.showDialog(transaction_popup_html, 'transaction-confirmation-popup', true);

                                                                $('.cached-keystore-file .confirm-transaction.keystore-file').click(function() {
                                                                    if($('.cached-keystore-file #your-secret-key-password').val().trim() == '') {
                                                                        basic.showAlert('Please enter valid secret file password.', '', true);
                                                                    } else {
                                                                        showLoader();

                                                                        setTimeout(function() {
                                                                            showLoader('Hold on...<br>Your transaction is being processed.');

                                                                            setTimeout(function () {
                                                                                var decrypting_keystore = decryptKeystore(window.localStorage.getItem('keystore_file'), $('.cached-keystore-file #your-secret-key-password').val().trim());
                                                                                if(decrypting_keystore.success) {
                                                                                    submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, on_popup_load_gas_price, decrypting_keystore.success);
                                                                                } else if(decrypting_keystore.error) {
                                                                                    basic.showAlert(decrypting_keystore.message, '', true);
                                                                                    hideLoader();
                                                                                }
                                                                            }, 500);
                                                                        }, 500);
                                                                    }
                                                                });
                                                            } else {
                                                                //nothing is cached
                                                                transaction_popup_html+='<div class="container-fluid proof-of-address padding-top-20 padding-bottom-20"> <div class="row fs-0"> <div class="col-xs-12 col-sm-5 inline-block padding-left-30 padding-left-xs-15"> <a href="javascript:void(0)" class="light-blue-white-btn text-center enter-private-key display-block-important fs-18 line-height-18"><span>Enter your Private Key<div class="fs-16">(not recommended)</div></span></a> </div><div class="col-xs-12 col-sm-2 text-center calibri-bold fs-20 inline-block">or</div><div class="col-xs-12 col-sm-5 inline-block padding-right-30 padding-right-xs-15"> <div class="upload-file-container" data-id="upload-keystore-file" data-label="Upload your Backup file"> <input type="file" id="upload-keystore-file" class="custom-upload-keystore-file hide-input"/> <div class="btn-wrapper"></div></div></div></div><div class="row on-change-result"></div></div>';
                                                                basic.showDialog(transaction_popup_html, 'transaction-confirmation-popup', true);

                                                                //init private key btn logic
                                                                $(document).on('click', '.enter-private-key', function() {
                                                                    $('.proof-of-address #upload-keystore-file').val('');
                                                                    $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-20"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-private-key">Your Private Key:</label><input type="text" id="your-private-key" maxlength="64" class="full-rounded"/></div></div><div class="btn-container col-xs-12"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction private-key">Confirm</a></div>');

                                                                    $('.confirm-transaction.private-key').click(function() {
                                                                        if($('.proof-of-address #your-private-key').val().trim() == '') {
                                                                            basic.showAlert('Please enter valid private key.', '', true);
                                                                        } else {
                                                                            showLoader('Hold on...<br>Your transaction is being processed.');

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
                                                }
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    });
                });
            }
        }, 500);
    },
    spend_page_gift_cards: function() {
        if(!bidali_lib_loaded) {
            showLoader();
            $.getScript('assets/libs/bidali/bidali-commerce.js', function() {
                bidali_lib_loaded = true;
                hideLoader();
                bidaliWidgetInit();
            });
        } else {
            bidaliWidgetInit();
        }

        function bidaliWidgetInit() {
            $('.buy-gift-cards').click(function() {
                bidaliSdk.Commerce.render({
                    apiKey: 'pk_n6mvpompwzm83egzrz2vnh',
                    paymentCurrencies: ['DCN']
                });
            });
        }
    },
    spend_page_exchanges: function() {
        showLoader();

        //getting exchanges from dentacoin.com DB
        $.ajax({
            type: 'GET',
            url: 'https://dentacoin.com/info/exchanges',
            dataType: 'json',
            success: function(response) {
                var exchanges = response;

                var exchanges_html = '';
                for(var i = 0, len = exchanges.length; i < len; i+=1) {
                    exchanges_html+='<li><a href="'+exchanges[i].link+'" target="_blank">• '+exchanges[i].title+'</a></li>';
                }

                $('.camping-for-exchanges').html(exchanges_html);

                hideLoader();
            }
        });
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
                    window.resolveLocalFileSystemURL(decodeURIComponent(file_uri), function (entry) {
                        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (rootEntry) {
                            console.log(rootEntry, 'rootEntry');
                            rootEntry.getFile(decodeURIComponent(entry.fullPath), { create: false }, function (fileEntry) {
                                console.log(fileEntry, 'fileEntry');
                                fileEntry.file(function (file) {
                                    var reader = new FileReader();

                                    reader.onloadend = function () {
                                        var keystore_string = this.result;
                                        setTimeout(function () {
                                            if(basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && checksumAddress('0x' + JSON.parse(keystore_string).address) == checksumAddress(global_state.account)) {
                                                $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="fs-14 light-gray-color text-center padding-bottom-10 padding-top-15 file-name">' + fileEntry.name + '</div><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">Secret password:</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"/></div></div><div class="col-xs-12"><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-tx-sign" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-tx-sign"><span class="padding-left-5 padding-right-5 inline-block">Remember backup file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block tx-sign-more-info-keystore-remember fs-0" data-content="Remembering your backup file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div></div><div class="btn-container col-xs-12 padding-top-25"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">Confirm</a></div>');

                                                $('.tx-sign-more-info-keystore-remember').popover({
                                                    trigger: 'click'
                                                });

                                                $('.confirm-transaction.keystore-file').click(function () {
                                                    if ($('.proof-of-address #your-secret-key-password').val().trim() == '') {
                                                        basic.showAlert('Please enter valid secret file password.', '', true);
                                                    } else {
                                                        showLoader('Hold on...<br>Your transaction is being processed.');

                                                        setTimeout(function () {
                                                            var decrypting_keystore = decryptKeystore(keystore_string, $('.proof-of-address #your-secret-key-password').val().trim());
                                                            if (decrypting_keystore.success) {
                                                                if ($('.proof-of-address #agree-to-cache-tx-sign').is(':checked')) {
                                                                    window.localStorage.setItem('keystore_file', keystore_string);
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
                            $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="fs-14 light-gray-color text-center padding-bottom-10 padding-top-15 file-name">'+fileName+'</div><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">Secret password:</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"/></div></div><div class="col-xs-12"><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-tx-sign" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-tx-sign"><span class="padding-left-5 padding-right-5 inline-block">Remember backup file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block tx-sign-more-info-keystore-remember fs-0" data-content="Remembering your backup file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div></div><div class="btn-container col-xs-12 padding-top-25"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">Confirm</a></div>');

                            $('.tx-sign-more-info-keystore-remember').popover({
                                trigger: 'click'
                            });

                            $('.confirm-transaction.keystore-file').click(function() {
                                if($('.proof-of-address #your-secret-key-password').val().trim() == '') {
                                    basic.showAlert('Please enter valid secret file password.', '', true);
                                } else {
                                    showLoader('Hold on...<br>Your transaction is being processed.');

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

//method to sign and submit transaction to blockchain
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

        //function_abi is when we want to add logic into our transaction (mostly when iteracting with contracts)
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
        //submit the transaction
        dApp.web3_1_0.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (err, transactionHash) {
            hideLoader();
            basic.closeDialog();

            if(symbol == 'DCN') {
                fireGoogleAnalyticsEvent('Pay', 'Next', 'DCN', token_val);
            } else if(symbol == 'ETH') {
                getEthereumDataByCoingecko(function(request_response) {
                    fireGoogleAnalyticsEvent('Pay', 'Next', 'ETH in USD', Math.floor(parseFloat(token_val) * request_response.market_data.current_price.usd));
                });
            }

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

//custom fix for parent menu active class
setInterval(function() {
    if($('app-spend-page-exchanges').length || $('app-spend-page-pay-assurance-fees').length || $('app-spend-page-gift-cards').length || $('app-spend-page-pay-for-dental-services').length) {
        if(is_hybrid || basic.isMobile()) {
            $('.camp-for-fixed-mobile-nav .send').addClass('active');
        } else {
            $('.nav-link.spend').addClass('active');
        }
    } else {;
        if(is_hybrid || basic.isMobile()) {
            $('.camp-for-fixed-mobile-nav .send').removeClass('active');
        } else {
            $('.nav-link.spend').removeClass('active')
        }
    }
}, 500);

//method for 'refreshing' the mobile app
window.refreshApp = function() {
    basic.closeDialog();
    hideLoader();

    custom_popover_interval = undefined;
    request_interval_for_rest_of_transaction_history = undefined;
    request_response = {};
    temporally_timestamps = {};
    global_state = {};
    core_db_clinics = undefined;
    core_db_clinics_time_to_request = undefined;
    load_qr_code_lib = true;
    DCNContract = undefined;
    getInstance = undefined;

    initAccountChecker();

    if($('.main-holder app-homepage').length) {
        dApp.init(function() {
            pages_data.homepage();
        });
    } else {
        dApp.init();
    }
};

var DCNContract_instance_interval = false;
window.getHomepageData = function() {
    initAccountChecker();

    if(!dApp.loaded) {
        dApp.init(function() {
            loadHomepageData();
        });
    } else {
        loadHomepageData();
    }

    function loadHomepageData() {
        if($.isReady) {
            //called on route change
            pages_data.homepage();
        } else {
            //called on page init
            $(document).ready(function() {
                pages_data.homepage();
            });
        }
    }
};

window.getBuyPageData = function(){
    if(!dApp.loaded) {
        dApp.init();
    }
    if($.isReady) {
        //called on route change
        pages_data.buy_page();
    } else {
        //called on page init
        $(document).ready(function() {
            pages_data.buy_page();
        });
    }
};

window.getSendPageData = function(){
    initAccountChecker();

    if(!dApp.loaded) {
        dApp.init();
    }
    if($.isReady) {
        //called on route change
        pages_data.send_page();
    } else {
        //called on page init
        $(document).ready(function() {
            pages_data.send_page();
        });
    }
};

window.getSpendPageGiftCards = function(){
    if(!dApp.loaded) {
        dApp.init();
    }
    if($.isReady) {
        //called on route change
        pages_data.spend_page_gift_cards();
    } else {
        //called on page init
        $(document).ready(function() {
            pages_data.spend_page_gift_cards();
        });
    }
};

window.getSpendPageExchanges = function(){
    if(!dApp.loaded) {
        dApp.init();
    }
    if($.isReady) {
        //called on route change
        pages_data.spend_page_exchanges();
    } else {
        //called on page init
        $(document).ready(function() {
            pages_data.spend_page_exchanges();
        });
    }
};

window.initdApp = function(){
    if(!dApp.loaded) {
        dApp.init();
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

//sorting object by keys
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

//loading mobile bottom fixed navigation IF mobile
function loadMobileBottomFixedNav() {
    $('body').addClass('overflow-hidden');
    var window_width = $(window).width();
    $('body').removeClass('overflow-hidden');
    if(window_width < 768) {
        $('.camp-for-fixed-mobile-nav').fadeIn(1000);
    }
}

//styling google alike inputs
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

//checking if metamask or if saved current_account in the local storage. If both are false then show custom login popup with CREATE / IMPORT logic
function initAccountChecker()  {
    is_hybrid = $('#main-container').attr('hybrid') == 'true';
    checkIfLoadingFromMobileBrowser();

    //checking if metamask
    if(typeof(web3) !== 'undefined' && web3.currentProvider.isMetaMask === true) {
        meta_mask_installed = true;

        //on metamask account change refresh the website
        window.ethereum.on('accountsChanged', function () {
            web3.eth.getAccounts(function(error, accounts) {
                if(error) {
                    console.log(error);
                } else {
                    if(accounts.length) {
                        if(innerAddressCheck(current_meta_mask_account) && checksumAddress(current_meta_mask_account) != checksumAddress(accounts[0]) || current_meta_mask_account == null) {
                            window.location.reload();
                        }
                    } else if(current_meta_mask_account != undefined && current_meta_mask_account != null) {
                        window.location.reload();
                    }
                }
            });
        });

        //on metamask login refresh the website
        web3.currentProvider.publicConfigStore.on('update', function() {
            web3.eth.getAccounts(function(error, accounts) {
                if(error) {
                    console.log(error);
                } else {
                    if(accounts.length) {
                        if(innerAddressCheck(current_meta_mask_account) && checksumAddress(current_meta_mask_account) != checksumAddress(accounts[0]) || current_meta_mask_account == null) {
                            window.location.reload();
                        }
                    } else if(current_meta_mask_account != undefined && current_meta_mask_account != null) {
                        window.location.reload();
                    }
                }
            });
        });

        if(current_meta_mask_account != undefined && current_meta_mask_account != null)  {
            meta_mask_logged = true;
        }else {
            //if metamask is installed, but user not logged show login popup
            basic.showDialog('<div class="popup-body"><div class="title">Sign in to MetaMask</div><div class="subtitle">Open up your browser\'s MetaMask extention.</div><div class="separator"></div><figure class="gif"><img src="assets/images/metamask-animation.gif" alt="Login MetaMask animation"/> </figure></div>', 'login-metamask-desktop');
        }
    } else if(window.localStorage.getItem('current_account') == null && typeof(web3) === 'undefined') {
        //show custom authentication popup
        var popup_html = '<div class="popup-header padding-bottom-5 text-center"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/wallet-loading.png" class="max-width-80 width-100" alt="Dentacoin wallet logo"></figure></div><div class="left-right-side-holder fs-0"><div class="popup-left inline-block-top" data-step="first"><div class="navigation-link"><a href="javascript:void(0)" data-slug="first" class="active">CREATE</a></div><div class="navigation-link mobile"><a href="javascript:void(0)" data-slug="second">IMPORT</a></div><div class="popup-body first"><div class="creation-text max-width-400 padding-top-20 padding-bottom-20"><svg class="inline-block-top" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 63.3 64.1" style="enable-background:new 0 0 63.3 64.1;" xml:space="preserve"><style type="text/css">.keyholder-st0{fill:url(#SVGID_1_);}.keyholder-st1{fill:url(#SVGID_2_);}.keyholder-st2{fill:url(#SVGID_3_);}.keyholder-st3{fill:url(#SVGID_4_);}.keyholder-st4{fill:url(#SVGID_5_);}.keyholder-st5{fill:url(#SVGID_6_);}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="64.1" width="63.3" x="1.3" y="17.4"></sliceSourceBounds></sfw></metadata><g><g><linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="23.7" y1="8.35" x2="38.6" y2="8.35"><stop offset="0" style="stop-color:#00A99D"/><stop offset="1" style="stop-color:#0071BC"/></linearGradient><path class="keyholder-st0" d="M31.2,16.7c4.2,0,7.4-5.2,7.4-9.3S35.3,0,31.2,0s-7.5,3.3-7.5,7.4S27,16.7,31.2,16.7z"/></g><g><linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="15.6" y1="20.5" x2="46.8" y2="20.5"><stop offset="0" style="stop-color:#00A99D"/><stop offset="1" style="stop-color:#0071BC"/></linearGradient><path class="keyholder-st1" d="M19.1,27.9h3.4c0.3-1.4,0.3-1.5,0.3-1.7c0-0.3,0.5-0.3,0.5,0v1.7h15.8v-1.7c0-0.1,0.3-0.7,0.8,1.5c0,0.1,0,0.1,0.1,0.2h1.9v-2.3c0-1.7,1.3-3,3-3h1.9c-0.5-3.6-1.5-9.3-7.7-9.5c-1.7,3.1-4.5,5.6-7.9,5.6s-6.3-2.5-7.9-5.6c-6.4,0.2-7.3,6.2-7.7,10.7C17,24.9,18.3,26.3,19.1,27.9z"/></g><g><linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="17.6" y1="39.35" x2="20.5" y2="39.35"><stop offset="0" style="stop-color:#00A99D"/><stop offset="1" style="stop-color:#0071BC"/></linearGradient><path class="keyholder-st2" d="M17.6,40.5c0.3,0,0.5-0.1,0.7-0.2c1-0.4,1.8-1.1,2.2-2.1h-1.4C18.7,39.1,18.2,39.8,17.6,40.5z"/></g><g><linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="23.3" y1="51.2" x2="39.1" y2="51.2"><stop offset="0" style="stop-color:#00A99D"/><stop offset="1" style="stop-color:#0071BC"/></linearGradient><path class="keyholder-st3" d="M23.3,60.5c0,1.9,1.5,3.5,3.4,3.5c1.9,0,3.5-1.6,3.5-3.5V44.7c0-0.5,0.5-1,1-1s1,0.5,1,1v15.9c0,1.9,1.5,3.5,3.5,3.5c1.9,0,3.4-1.6,3.4-3.5V38.3H23.3V60.5z"/></g><g><linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="43" y1="39.4" x2="49.5" y2="39.4"><stop offset="0" style="stop-color:#00A99D"/><stop offset="1" style="stop-color:#0071BC"/></linearGradient><path class="keyholder-st4" d="M46.2,40.5c1.4,0,2.8-0.8,3.3-2.2H43C43.4,39.7,44.8,40.5,46.2,40.5z"/></g><g><linearGradient id="SVGID_6_" gradientUnits="userSpaceOnUse" x1="0" y1="32" x2="63.3129" y2="32"><stop offset="0" style="stop-color:#32FFC2"/><stop offset="1" style="stop-color:#00A9EB"/></linearGradient><path class="keyholder-st5" d="M62.4,29.9h-2.7v-7.2c0-0.6-0.5-1-1-1h-4.4c-0.6,0-1,0.4-1,1v7.2h-3.1v-4.3c0-0.6-0.5-1-1-1h-4.4c-0.5,0-1,0.4-1,1v4.3h-26c-1.3-3.6-4.8-6-8.6-6C4.1,23.9,0,28,0,33.1s4.1,9.2,9.2,9.2c3.9,0,7.3-2.4,8.6-6h44.5c0.5,0,1-0.5,1-1v-4.4C63.4,30.3,62.9,29.9,62.4,29.9z M9.2,36.8c-2.1,0-3.7-1.7-3.7-3.7s1.7-3.7,3.7-3.7c2.1,0,3.7,1.7,3.7,3.7S11.3,36.8,9.2,36.8z"/></g></g></svg><div class="inline-block-top text padding-left-10 fs-xs-14 fs-16"><div class="lato-bold fs-18">Let\'s create a new wallet!</div>Please set a secure password, download your Backup File and keep it safe! If lost, there is no way to access your tokens. </div></div><div class="field-parent margin-bottom-15 max-width-300 margin-left-right-auto"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="keystore-file-pass">Enter password:</label><input type="password" maxlength="30" id="keystore-file-pass" class="full-rounded keystore-file-pass required-field"/></div></div><div class="field-parent max-width-300 margin-left-right-auto"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="second-pass">Repeat password:</label><input type="password" maxlength="30" id="second-pass" class="full-rounded second-pass required-field"/></div></div><div class="text-center padding-top-15"><input type="checkbox" checked id="agree-to-cache-create" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-create"><span class="padding-left-5 padding-right-5 inline-block">Remember backup file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block more-info-keystore-remember fs-0" data-content="Remembering your backup file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="btn-container text-center padding-top-15"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border login-into-wallet min-width-180">CREATE</a></div><div class="auth-popup-faq-link padding-top-20 text-center"><a href="//dentacoin.com/how-to-create-wallet" target="_blank">?</a></div></div></div><div class="popup-right inline-block-top"><div class="navigation-link"><a href="javascript:void(0)" data-slug="second">IMPORT</a></div><div class="popup-body second custom-hide"><div class="padding-top-20 padding-bottom-30 fs-0 row-with-image-and-text max-width-400 max-width-xs-300"><svg class="max-width-80 inline-block" version="1.1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 70.1 86" style="enable-background:new 0 0 70.1 86;" xml:space="preserve"><style type="text/css">.st0-import{fill:url(#SVGID_1_import);}.st1-import{fill:url(#SVGID_2_import);}.st2-import{fill:#FFFFFF;}.st3-import{fill:url(#SVGID_3_import);stroke:#FFFFFF;stroke-width:0.75;stroke-miterlimit:10;}.st4-import{fill:#FFFFFF;stroke:#FFFFFF;stroke-miterlimit:10;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="86" width="70.1" x="16" y="29"></sliceSourceBounds></sfw></metadata><linearGradient id="SVGID_1_import" gradientUnits="userSpaceOnUse" x1="0" y1="43" x2="64" y2="43"><stop offset="0" style="stop-color:#00A99D"/><stop offset="1" style="stop-color:#0071BC"/></linearGradient><path class="st0-import" d="M44.7,0H3.1C1.4,0,0,1.3,0,3v80c0,1.6,1.4,3,3.1,3h57.9c1.7,0,3.1-1.3,3.1-3V18.8c0-0.9-0.4-1.8-1-2.5L47.2,1C46.5,0.4,45.6,0,44.7,0z"/><linearGradient id="SVGID_2_import" gradientUnits="userSpaceOnUse" x1="35.9571" y1="23.008" x2="69.6066" y2="23.008"><stop offset="0" style="stop-color:#32FFC2"/><stop offset="1" style="stop-color:#00A9EB"/></linearGradient><circle class="st1-import" cx="52.8" cy="23" r="16.8"/><rect x="28" y="49" class="st2-import" width="8" height="37"/><path class="st2-import" d="M18.2,58.8l13.4-14.6c0.3-0.3,0.7-0.3,1,0l13.4,14.7c0.4,0.4,0.1,1.2-0.5,1.2H18.6C18.1,60,17.8,59.2,18.2,58.8z"/><g><linearGradient id="SVGID_3_import" gradientUnits="userSpaceOnUse" x1="34.8246" y1="23.1469" x2="69.7484" y2="23.1469"><stop offset="0" style="stop-color:#32FFC2"/><stop offset="1" style="stop-color:#00A9EB"/></linearGradient><path class="st3-import" d="M52.3,6.5C61.5,6.5,69,14,69,23.1s-7.5,16.7-16.7,16.7s-16.7-7.5-16.7-16.7S43.1,6.5,52.3,6.5 M52.3,5.7c-9.7,0-17.5,7.8-17.5,17.5s7.8,17.5,17.5,17.5s17.5-7.8,17.5-17.5S61.9,5.7,52.3,5.7L52.3,5.7z"/></g><g><rect x="59" y="28.4" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.9698 50.8809)" class="st4-import" width="1.9" height="1.2"/><rect x="58.2" y="27.7" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.6509 50.155)" class="st4-import" width="1.9" height="1.2"/><g><polygon class="st4-import" points="60.7,30.7 59.7,31.8 50.9,22.9 51.9,21.9 "/><path class="st4-import" d="M45,16c-1.9,1.9-1.9,4.9,0,6.8c1.9,1.9,4.9,1.9,6.8,0c1.9-1.9,1.9-4.9,0-6.8C49.8,14.1,46.8,14.1,45,16z M50.9,21.9c-1.4,1.4-3.7,1.4-5.1,0c-1.4-1.4-1.4-3.7,0-5.1c1.4-1.4,3.7-1.4,5.1,0C52.3,18.2,52.3,20.5,50.9,21.9z"/></g></g></svg><div class="inline-block padding-left-10 fs-16 fs-xs-14 text"><div class="lato-bold fs-18">Welcome back!</div>To import an existing wallet, please upload your Backup File.</div></div><div class="text-center import-keystore-file-row">';
        if(is_hybrid) {
            popup_html+='<label class="button custom-upload-button">';
        } else {
            popup_html+='<input type="file" id="upload-keystore" class="hide-input upload-keystore"/><label for="upload-keystore" class="button custom-upload-button">';
        }
        popup_html+='<a><span>Upload your Backup File (recommended)</span><svg class="load" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><path opacity="0.3" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg><svg class="check" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></a><div><span></span></div></label></div><div class="camping-for-action"></div><div class="padding-top-10 text-center fs-14 lato-bold or-label">OR</div><div class="padding-top-10 text-center import-private-key-row"><a href="javascript:void(0);" class="import-private-key light-blue-white-btn fs-16 fs-xs-14">Import Private Key (not recommended)</a></div></div></div>';
        basic.showDialog(popup_html, 'custom-auth-popup', null, true);

        $('.custom-auth-popup .navigation-link > a').click(function()  {
            $('.custom-auth-popup .navigation-link a').removeClass('active');
            $(this).addClass('active');
            $('.custom-auth-popup .popup-body').addClass('custom-hide');
            $('.custom-auth-popup .popup-body.'+$(this).attr('data-slug')).removeClass('custom-hide');
        });

        $('.more-info-keystore-remember').popover({
            trigger: 'click'
        });

        // ================================= IMPORTING ==========================================
        $(document).on('click', '.refresh-import-init-page', function() {
            $('.camping-for-action').html('').show();
            $('.import-keystore-file-row #upload-keystore').val('');
            $('.import-keystore-file-row').show();
            $('.or-label').show();
            $('.import-private-key-row').html('<a href="javascript:void(0);" class="import-private-key light-blue-white-btn fs-16 fs-xs-14">Import Private Key (not recommended)</a>').show();
        });

        //importing with private key
        $(document).on('click', '.import-private-key', function() {
            $('.camping-for-action').hide();
            $('.import-keystore-file-row').hide();
            $('.or-label').hide();
            $('.import-private-key-row').html('<div class="field-parent"><div class="custom-google-label-style module text-left" data-input-light-blue-border="true"><label for="import-private-key">Private key:</label><input type="text" id="import-private-key" maxlength="100" class="full-rounded"/></div></div><div class="continue-btn-priv-key padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border">CONTINUE</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block">Go back</span></a></div>');
            $('#import-private-key').focus();
            $('label[for="import-private-key"]').addClass('active-label');

            $('.continue-btn-priv-key > a').unbind().click(function() {
                $('.import-private-key-row .error-handle').remove();

                showLoader();
                setTimeout(function() {
                    var validate_private_key = validatePrivateKey($('#import-private-key').val().trim());
                    if(validate_private_key.success) {
                        var internet = navigator.onLine;
                        if(internet) {
                            console.log('===== make request for save public keys for assurance =====');
                        }

                        window.localStorage.setItem('current_account', validate_private_key.success.address);
                        fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

                        if(is_hybrid) {
                            if(basic.getMobileOperatingSystem() == 'Android') {
                                refreshApp();
                                //navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                            } else if(basic.getMobileOperatingSystem() == 'iOS') {
                                alert('App refresh is not tested yet with iOS');
                            }
                        } else {
                            window.location.reload();
                        }
                    } else if (validate_private_key.error) {
                        hideLoader();

                        customErrorHandle($('#import-private-key').closest('.field-parent'), validate_private_key.message);
                    }
                }, 500);
            });
        });

        //importing with keystore file
        styleKeystoreUploadBtn();

        // ================================= /IMPORTING ==========================================

        // ================================= CREATING ==========================================

        $('.custom-auth-popup .popup-left .login-into-wallet').click(function()   {
            var login_errors = false;
            $('.popup-left .error-handle').remove();
            var login_fields = $('.popup-left .required-field');

            for(var i = 0, len = login_fields.length; i < len; i+=1) {
                if(login_fields.eq(i).val().trim() == '') {
                    customErrorHandle(login_fields.eq(i).closest('.field-parent'), 'Please enter password.');
                    login_errors = true;
                } else if(login_fields.eq(i).val().trim().length < 8 || login_fields.eq(i).val().trim().length > 30)  {
                    customErrorHandle(login_fields.eq(i).closest('.field-parent'), 'Password must be minimum 8 characters and max 30.');
                    login_errors = true;
                }
            }

            if($('.custom-auth-popup .keystore-file-pass').val().trim() != $('.custom-auth-popup .second-pass').val().trim())  {
                customErrorHandle($('.custom-auth-popup .second-pass').closest('.field-parent'), 'Please enter same password in both fields.');
                login_errors = true;
            }

            if(!login_errors) {
                showLoader('This might take a few minutes... <br>Please allow access to your device if asked for it.');

                setTimeout(function() {
                    var generated_keystore = generateKeystoreFile($('.custom-auth-popup .keystore-file-pass').val().trim());
                    var keystore_file_name = buildKeystoreFileName('0x' + generated_keystore.success.keystore.address);

                    //save the public key to assurance
                    var internet = navigator.onLine;
                    if(internet) {
                        console.log('===== make request for save public keys for assurance =====');
                    }

                    if(is_hybrid) {
                        //MOBILE APP
                        if(basic.getMobileOperatingSystem() == 'Android') {
                            androidFileDownload(keystore_file_name, JSON.stringify(generated_keystore.success.keystore), function() {
                                fireGoogleAnalyticsEvent('Register', 'Download', 'Download Keystore');
                                loginIntoWallet();
                            });
                        } else if(basic.getMobileOperatingSystem() == 'iOS') {
                            console.log('iOS DOWNLOAD');
                            console.log(cordova.file, 'cordova.file');
                            window.resolveLocalFileSystemURL(cordova.file.documentsDirectory , function (fileSystem) {
                                fileSystem.getDirectory('Download', {create: true, exclusive: false}, function(dirEntry) {
                                    dirEntry.getFile(keystore_file_name, {create: true, exclusive: true}, function (fileEntry) {
                                        fileEntry.createWriter(function (fileWriter) {
                                            fileWriter.onwriteend = function (e) {
                                                callback();
                                            };

                                            fileWriter.onerror = function (e) {
                                                hideLoader();
                                                alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                                            };

                                            // Create a new Blob and write they keystore content inside of it
                                            var blob = new Blob([JSON.stringify(generated_keystore.success.keystore)], {type: 'text/plain'});
                                            fileWriter.write(blob);
                                        }, function(err) {
                                            console.log(err, 'err');
                                            hideLoader();
                                            alert('Something went wrong with downloading your file (Core error 4). Please contact admin@dentacoin.com.');
                                        });
                                    }, function(err) {
                                        console.log(err, 'err');
                                        hideLoader();
                                        alert('Seems like file with this name already exist in your root directory, move it or delete it and try again.');
                                    });
                                }, function(err) {
                                    console.log(err, 'err');
                                    hideLoader();
                                    alert('Something went wrong with downloading your file (Core error 5). Please contact admin@dentacoin.com.');
                                });
                            });
                        }
                    } else {
                        //BROWSER
                        downloadFile(buildKeystoreFileName('0x' + generated_keystore.success.keystore.address), JSON.stringify(generated_keystore.success.keystore));
                        fireGoogleAnalyticsEvent('Register', 'Download', 'Download Keystore');
                        loginIntoWallet();
                    }

                    function loginIntoWallet() {
                        if($('.custom-auth-popup .popup-left .popup-body #agree-to-cache-create').is(':checked')) {
                            window.localStorage.setItem('current_account', '0x' + generated_keystore.success.keystore.address);
                            basic.showAlert('File ' + keystore_file_name + ' has been stored to the Downloads folder of your device and remembered for faster transactions.', '', true);

                            setTimeout(function() {
                                if(is_hybrid) {
                                    //in browser saving keystore file in localstorage
                                    window.localStorage.setItem('keystore_file', JSON.stringify(generated_keystore.success.keystore));
                                    window.localStorage.setItem('current_account', '0x' + generated_keystore.success.keystore.address);

                                    fireGoogleAnalyticsEvent('Register', 'Create', 'Wallet');

                                    if(basic.getMobileOperatingSystem() == 'Android') {
                                        refreshApp();
                                        //navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                                    } else if(basic.getMobileOperatingSystem() == 'iOS') {
                                        alert('App refresh is not tested yet with iOS');
                                    }
                                } else {
                                    //in browser saving keystore file in localstorage
                                    window.localStorage.setItem('keystore_file', JSON.stringify(generated_keystore.success.keystore));
                                    window.localStorage.setItem('current_account', '0x' + generated_keystore.success.keystore.address);

                                    fireGoogleAnalyticsEvent('Register', 'Create', 'Wallet');

                                    window.location.reload();
                                }
                            }, 6000);
                        } else {
                            window.localStorage.setItem('current_account', '0x' + generated_keystore.success.keystore.address);
                            basic.showAlert('File ' + keystore_file_name + ' has been stored to the Downloads folder of your device.', '', true);

                            setTimeout(function() {
                                if(is_hybrid) {
                                    if(basic.getMobileOperatingSystem() == 'Android') {
                                        refreshApp();
                                        //navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                                    } else if(basic.getMobileOperatingSystem() == 'iOS') {
                                        alert('App refresh is not tested yet with iOS');
                                    }
                                } else {
                                    window.location.reload();
                                }
                            }, 6000);
                        }
                    }
                }, 500);
            }
        });
        // ================================= /CREATING ==========================================
    }
}

//INIT LOGIC FOR ALL STEPS
function customErrorHandle(el, string) {
    el.append('<div class="error-handle">'+string+'</div>');
}

//styling input type file for importing keystore file
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

                                                //show continue button next step button
                                                $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('<div class="enter-pass-label"><label>Please enter password for the secret key file.</label></div><div class="field-parent margin-bottom-15 max-width-300 margin-left-right-auto"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="import-keystore-password">Enter password:</label><input type="password" id="import-keystore-password" class="full-rounded import-keystore-password"/></div></div><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-import" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-import"><span class="padding-left-5 padding-right-5 inline-block">Remember backup file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block import-more-info-keystore-remember fs-0" data-content="Remembering your backup file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border">CONTINUE</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block">Go back</span></a></div>');

                                                $('.import-more-info-keystore-remember').popover({
                                                    trigger: 'click'
                                                });

                                                $('.custom-auth-popup .popup-right .popup-body .continue-btn > a').click(function () {
                                                    $('.custom-auth-popup .popup-right .error-handle').remove();
                                                    var keystore_password = $('.custom-auth-popup .popup-right .popup-body .import-keystore-password').val().trim();
                                                    if (keystore_password == '') {
                                                        customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), 'Please enter your backup file password.');
                                                    } else {
                                                        showLoader('Hold on...<br>Importing your Backup File.');

                                                        setTimeout(function () {
                                                            var imported_keystore = importKeystoreFile(keystore_string, keystore_password);
                                                            if (imported_keystore.success) {
                                                                var internet = navigator.onLine;
                                                                if (internet) {
                                                                    console.log('===== make request for save public keys for assurance =====');
                                                                }

                                                                fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

                                                                if ($('.custom-auth-popup .popup-right .popup-body #agree-to-cache-import').is(':checked')) {
                                                                    window.localStorage.setItem('keystore_file', keystore_string);
                                                                    window.localStorage.setItem('current_account', '0x' + address);

                                                                    if(basic.getMobileOperatingSystem() == 'Android') {
                                                                        refreshApp();
                                                                        //navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                                                                    } else if(basic.getMobileOperatingSystem() == 'iOS') {
                                                                        alert('App refresh is not tested yet with iOS');
                                                                    }
                                                                } else {
                                                                    window.localStorage.setItem('current_account', '0x' + address);
                                                                    refreshApp();
                                                                    //navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog: "Wait,Loading App", loadUrlTimeoutValue: 60000});
                                                                }
                                                            } else if (imported_keystore.error) {
                                                                hideLoader();
                                                                customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), imported_keystore.message);
                                                            }
                                                        }, 500);
                                                    }
                                                });
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
                            $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('<div class="enter-pass-label"><label>Please enter password for the secret key file.</label></div><div class="field-parent margin-bottom-15 max-width-300 margin-left-right-auto"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="import-keystore-password">Enter password:</label><input type="password" id="import-keystore-password" class="full-rounded import-keystore-password"/></div></div><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-import" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-import"><span class="padding-left-5 padding-right-5 inline-block">Remember backup file</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block import-more-info-keystore-remember fs-0" data-content="Remembering your backup file allows for easier and faster transactions. It is stored only in local device storage and nobody else has access to it."><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border">CONTINUE</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block">Go back</span></a></div>');

                            $('.import-more-info-keystore-remember').popover({
                                trigger: 'click'
                            });

                            //calling IMPORT METHOD
                            $('.custom-auth-popup .popup-right .popup-body .continue-btn > a').click(function()   {
                                $('.custom-auth-popup .popup-right .error-handle').remove();
                                var keystore_password = $('.custom-auth-popup .popup-right .popup-body .import-keystore-password').val().trim();
                                if(keystore_password == '')  {
                                    customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), 'Please enter your backup file password.');
                                } else {
                                    showLoader('Hold on...<br>Importing your Backup File.');

                                    setTimeout(function() {
                                        var imported_keystore = importKeystoreFile(keystore_string, keystore_password);
                                        if(imported_keystore.success) {
                                            var internet = navigator.onLine;
                                            if(internet) {
                                                console.log('===== make request for save public keys for assurance =====');
                                            }

                                            fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

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
                                            customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), imported_keystore.message);
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

//animation of the button which uploads keystore file
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

function showLoader(message) {
    if(message === undefined) {
        message = 'Loading ...';
    }
    $('.camping-loader').html('<div class="response-layer"><div class="wrapper"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/wallet-loading.png" class="max-width-160 width-100" alt="Loader"></figure><div class="message lato-bold fs-24">'+message+'</div></div></div>');
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

//opening WALLET SETTINGS
$(document).on('click', '.open-settings', function() {
    basic.closeDialog();
    var settings_html = '<div class="text-center fs-0 color-white lato-bold popup-header"><a href="javascript:void(0)" class="custom-close-bootbox max-width-20 inline-block margin-right-10"><svg class="width-100" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 62 52.3" style="enable-background:new 0 0 62 52.3;" xml:space="preserve"><style type="text/css">.st1{fill:#FFFFFF;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="52.3" width="62" x="19" y="48.9"/></sfw></metadata><path class="st1" d="M62,26.2c0-2.2-1.8-4-4-4H14.2L30.4,7c1.7-1.4,1.8-4,0.4-5.6c-1.4-1.7-4-1.8-5.6-0.4C25.1,1,25,1.1,25,1.2 L1.3,23.2c-1.6,1.5-1.7,4-0.2,5.7C1.1,29,1.2,29,1.3,29.1L25,51.2c1.6,1.5,4.1,1.4,5.7-0.2c1.5-1.6,1.4-4.1-0.2-5.7L14.2,30.2H58 C60.2,30.2,62,28.4,62,26.2z"/></svg></a><span class="inline-block text-center fs-28 fs-xs-16">DENTACOIN WALLET SETTINGS</span></div><div class="popup-body">';

    if((window.localStorage.getItem('keystore_file') == null)) {
        //if not cached keystore file show the option for caching it
        settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important remember-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14,0H2C0.9,0,0,0.9,0,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V2C16,0.9,15.1,0,14,0z M15,14c0,0.6-0.4,1-1,1 H2c-0.6,0-1-0.4-1-1v-3h14V14z M15,10H1V6h14V10z M1,5V2c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v3H1z M14,3.5C14,3.8,13.8,4,13.5,4h-1 C12.2,4,12,3.8,12,3.5v-1C12,2.2,12.2,2,12.5,2h1C13.8,2,14,2.2,14,2.5V3.5z M14,8.5C14,8.8,13.8,9,13.5,9h-1C12.2,9,12,8.8,12,8.5 v-1C12,7.2,12.2,7,12.5,7h1C13.8,7,14,7.2,14,7.5V8.5z M14,13.5c0,0.3-0.2,0.5-0.5,0.5h-1c-0.3,0-0.5-0.2-0.5-0.5v-1 c0-0.3,0.2-0.5,0.5-0.5h1c0.3,0,0.5,0.2,0.5,0.5V13.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Remember Backup File</span></a><div class="fs-14 option-description">By doing so, you will not be asked to upload it every time you want to access your wallet.</div><div class="camping-for-action"></div></div>';

        $(document).on('click', '.settings-popup .remember-keystore', function() {
            $('.settings-popup .camping-for-action').html('');

            var remember_keystore_html;
            if(is_hybrid) {
                remember_keystore_html = '<div class="text-center import-keystore-file-row margin-top-20"><label class="button remember-keystore-upload custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold">Upload your Backup File</span><svg class="load" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><path opacity="0.3" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg><svg class="check" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></a><div><span></span></div></label></div>';
            } else {
                remember_keystore_html = '<div class="text-center import-keystore-file-row margin-top-20"><input type="file" id="remember-keystore-upload" class="hide-input remember-keystore-upload"/><label for="remember-keystore-upload" class="button custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold">Upload your Backup File</span><svg class="load" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><path opacity="0.3" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg><svg class="check" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></a><div><span></span></div></label></div>';
            }

            var this_camping_row = $(this).closest('.option-row').find('.camping-for-action');
            this_camping_row.html(remember_keystore_html);

            if(is_hybrid) {
                //MOBILE APP
                if(basic.getMobileOperatingSystem() == 'Android') {
                    //ANDROID
                    $('.remember-keystore-upload').click(function() {
                        var this_btn = $(this);

                        // =================================== TEST THIS ON GALAXY s7 ===========================================
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

                                                if(basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && checksumAddress('0x' + JSON.parse(keystore_string).address) == checksumAddress(global_state.account)) {
                                                    validateKeystoreFileAndPasswordForCachingKeystoreFile(this_camping_row, keystore_string);
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
                            if(basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address') && checksumAddress('0x' + JSON.parse(e.target.result).address) == checksumAddress(global_state.account)) {
                                var keystore_string = e.target.result;
                                //init upload button animation
                                initCustomInputFileAnimation(label);

                                validateKeystoreFileAndPasswordForCachingKeystoreFile(this_camping_row, keystore_string);
                            } else {
                                basic.showAlert('Please upload valid keystore file which is related to your Dentacoin Wallet address.', '', true);
                            }
                        });

                        reader.readAsBinaryString(myFile);
                    });
                });
            }
        });

        function validateKeystoreFileAndPasswordForCachingKeystoreFile(this_camping_row, keystore_string) {
            $('.settings-popup .continue-with-keystore-validation').remove();
            this_camping_row.append('<div class="continue-with-keystore-validation"><div class="custom-google-label-style margin-top-25 margin-bottom-15 max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="cache-keystore-password">Backup Password:</label><input type="password" id="cache-keystore-password" class="full-rounded"/></div><div class="padding-bottom-10 text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border continue-caching">CONTINUE</a></div></div>');

            $('.settings-popup .continue-caching').click(function() {
                if($('.settings-popup #cache-keystore-password').val().trim() == '') {
                    basic.showAlert('Please enter password for your backup file.', '', true);
                } else {
                    showLoader('Hold on...<br>Caching your Backup File.');
                    setTimeout(function() {
                        var import_keystore_response = importKeystoreFile(keystore_string, $('.settings-popup #cache-keystore-password').val().trim());
                        console.log(import_keystore_response, 'import_keystore_response');
                        if(import_keystore_response.success) {
                            window.localStorage.setItem('keystore_file', keystore_string);

                            basic.closeDialog();
                            basic.showAlert('Your backup file has been cached successfully.', '', true);
                        } else if(import_keystore_response.error) {
                            basic.showAlert(import_keystore_response.message, '', true);
                        }

                        hideLoader();
                    }, 500);
                }
            });
        }
    } else if(window.localStorage.getItem('keystore_file') != null) {
        //if cached keystore file show the option for downloading it
        settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important forget-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14,0H2C0.9,0,0,0.9,0,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V2C16,0.9,15.1,0,14,0z M15,14c0,0.6-0.4,1-1,1 H2c-0.6,0-1-0.4-1-1v-3h14V14z M15,10H1V6h14V10z M1,5V2c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v3H1z M14,3.5C14,3.8,13.8,4,13.5,4h-1 C12.2,4,12,3.8,12,3.5v-1C12,2.2,12.2,2,12.5,2h1C13.8,2,14,2.2,14,2.5V3.5z M14,8.5C14,8.8,13.8,9,13.5,9h-1C12.2,9,12,8.8,12,8.5 v-1C12,7.2,12.2,7,12.5,7h1C13.8,7,14,7.2,14,7.5V8.5z M14,13.5c0,0.3-0.2,0.5-0.5,0.5h-1c-0.3,0-0.5-0.2-0.5-0.5v-1 c0-0.3,0.2-0.5,0.5-0.5h1c0.3,0,0.5,0.2,0.5,0.5V13.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Forget Backup File</span></a><div class="fs-14 option-description">By doing so, you’ll be asked to upload it every time you want to access your wallet.</div></div><div class="option-row"><a href="javascript:void(0)" class="display-block-important download-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14.4,10.4v3.2c0,0.1,0,0.2-0.1,0.3c0,0.1-0.1,0.2-0.2,0.3c-0.1,0.1-0.2,0.1-0.3,0.2c-0.1,0-0.2,0.1-0.3,0.1 H2.4c-0.1,0-0.2,0-0.3-0.1c-0.1,0-0.2-0.1-0.3-0.2S1.7,14,1.7,13.9c0-0.1-0.1-0.2-0.1-0.3v-3.2c0-0.4-0.4-0.8-0.8-0.8S0,10,0,10.4 v3.2c0,0.3,0.1,0.6,0.2,0.9c0.1,0.3,0.3,0.6,0.5,0.8c0.2,0.2,0.5,0.4,0.8,0.5C1.8,15.9,2.1,16,2.4,16h11.2c0.3,0,0.6-0.1,0.9-0.2 c0.3-0.1,0.6-0.3,0.8-0.5c0.2-0.2,0.4-0.5,0.5-0.8c0.1-0.3,0.2-0.6,0.2-0.9v-3.2c0-0.4-0.4-0.8-0.8-0.8S14.4,10,14.4,10.4z M8.8,8.5 V0.8C8.8,0.4,8.4,0,8,0C7.6,0,7.2,0.4,7.2,0.8v7.7L4.6,5.8c-0.3-0.3-0.8-0.3-1.1,0C3.1,6.1,3.1,6.7,3.4,7l4,4c0,0,0,0,0,0 c0.1,0.1,0.2,0.1,0.3,0.2c0.1,0,0.2,0.1,0.3,0.1c0,0,0,0,0,0c0.1,0,0.2,0,0.3-0.1c0.1,0,0.2-0.1,0.3-0.2l4-4c0.3-0.3,0.3-0.8,0-1.1 s-0.8-0.3-1.1,0L8.8,8.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Download Backup File</span></a><div class="fs-14 option-description">Forgot where you’ve stored your wallet access file? Make sure you save it again.</div></div>';

        $(document).on('click', '.settings-popup .download-keystore', function() {
            if(is_hybrid) {
                //MOBILE APP
                if(basic.getMobileOperatingSystem() == 'Android') {
                    //getting the file content by it path saved in localstorage
                    showLoader('Downloading ... <br> Please allow access to your device if asked for it.');

                    setTimeout(function () {
                        var keystore_file_name = buildKeystoreFileName(global_state.account);
                        //downloading the file in mobile device file system
                        androidFileDownload(keystore_file_name, window.localStorage.getItem('keystore_file'), function() {
                            basic.closeDialog();
                            basic.showAlert('File ' + keystore_file_name + ' has been downloaded to the top-level directory of your device file system.', '', true);
                            hideLoader();
                        });
                    }, 500);
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
    }

    settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important generate-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 21.3" style="enable-background:new 0 0 16 21.3;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="21.3" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M5.3,0C5.1,0,5,0.1,4.9,0.2L0.2,4.9C0.1,5,0,5.2,0,5.3v13.9c0,1.1,0.9,2.1,2.1,2.1h11.8c1.1,0,2.1-0.9,2.1-2.1 V2.1C16,0.9,15.1,0,13.9,0H5.3C5.3,0,5.3,0,5.3,0z M6.2,1.2h7.7c0.5,0,0.9,0.4,0.9,0.9v17.2c0,0.5-0.4,0.9-0.9,0.9H2.1 c-0.5,0-0.9-0.4-0.9-0.9v-13h4.4C6,6.2,6.2,6,6.2,5.6V1.2z M5,1.7V5H1.7L5,1.7z M4.4,9.8c-1.1,0-2.1,0.9-2.1,2.1s0.9,2.1,2.1,2.1 c0.9,0,1.7-0.6,2-1.5h3.6v0.9c0,0.3,0.3,0.6,0.6,0.6c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0v-0.9h1.2v0.9c0,0.3,0.3,0.6,0.6,0.6 c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0v-1.5c0-0.3-0.3-0.6-0.6-0.6H6.4C6.2,10.4,5.4,9.8,4.4,9.8L4.4,9.8z M4.4,11 c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9C3.6,11.3,3.9,11,4.4,11z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Generate Backup File</span></a><div class="fs-14 option-description">Create an easy-to-use wallet access file from your private key and secure it with a password.</div><div class="camping-for-action"></div></div><div class="option-row"><a href="javascript:void(0)" class="display-block-important show-private-key"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 21.3" style="enable-background:new 0 0 16 21.3;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="21.3" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M5.3,0C5.1,0,5,0.1,4.9,0.2L0.2,4.9C0.1,5,0,5.2,0,5.3v13.9c0,1.1,0.9,2.1,2.1,2.1h11.8c1.1,0,2.1-0.9,2.1-2.1 V2.1C16,0.9,15.1,0,13.9,0H5.3C5.3,0,5.3,0,5.3,0z M6.2,1.2h7.7c0.5,0,0.9,0.4,0.9,0.9v17.2c0,0.5-0.4,0.9-0.9,0.9H2.1 c-0.5,0-0.9-0.4-0.9-0.9v-13h4.4C6,6.2,6.2,6,6.2,5.6V1.2z M5,1.7V5H1.7L5,1.7z M4.4,9.8c-1.1,0-2.1,0.9-2.1,2.1s0.9,2.1,2.1,2.1 c0.9,0,1.7-0.6,2-1.5h3.6v0.9c0,0.3,0.3,0.6,0.6,0.6c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0v-0.9h1.2v0.9c0,0.3,0.3,0.6,0.6,0.6 c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0v-1.5c0-0.3-0.3-0.6-0.6-0.6H6.4C6.2,10.4,5.4,9.8,4.4,9.8L4.4,9.8z M4.4,11 c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9C3.6,11.3,3.9,11,4.4,11z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold">Display Private Key</span></a><div class="fs-14 option-description">Upload your backup file and the secret password to decrypt and show the private key.</div><div class="camping-for-action"></div></div></div><div class="popup-footer text-center"><div><a href="javascript:void(0)" class="log-out light-blue-white-btn min-width-220"><svg xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 18.4" style="enable-background:new 0 0 16 18.4;" xml:space="preserve" class="margin-right-5 inline-block max-width-20"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="18.4" width="16" x="1" y="8.4"/></sfw></metadata><g><path class="st0" d="M2.5,0h10.6c1.4,0,2.5,1.1,2.5,2.5v3.2h-1.5V2.5c0-0.5-0.4-1-1-1H2.5c-0.5,0-1,0.4-1,1v13.4c0,0.5,0.4,1,1,1 h10.6c0.5,0,1-0.4,1-1v-3.2h1.5v3.2c0,1.4-1.1,2.5-2.5,2.5H2.5c-1.4,0-2.5-1.1-2.5-2.5V2.5C0,1.1,1.1,0,2.5,0z M11,7.5H6.2v3.4H11 v1.9l5-3.5l-5-3.5V7.5L11,7.5z"/></g></svg><span class="inline-block">Log out</span></a></div><div class="padding-top-10 fs-14">Don\'t forget to download and save your log in files for the next time that you want to log in.</div></div>';
    basic.showDialog(settings_html, 'settings-popup', null, true);

    $('.settings-popup .custom-close-bootbox').click(function() {
        basic.closeDialog();
    });

    //logging out of the application
    $('.settings-popup .log-out').click(function() {
        var log_out_reminder_warning = {};
        log_out_reminder_warning.callback = function (result) {
            if (result) {
                if(is_hybrid) {
                    if(basic.getMobileOperatingSystem() == 'Android') {
                        window.localStorage.clear();

                        refreshApp();
                        //navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                    } else if(basic.getMobileOperatingSystem() == 'iOS') {
                        alert('App refresh is not tested yet with iOS');
                    }
                } else {
                    window.localStorage.clear();
                    window.location.reload();
                }
            }
        };
        basic.showConfirm('Are you sure you downloaded your Backup file? Once logged out, you will not be able to access your wallet without it.', '', log_out_reminder_warning, true);
    });

    //showing private key
    $('.settings-popup .show-private-key').click(function() {
        $('.settings-popup .camping-for-action').html('');
        var show_private_key_html = '';
        if(window.localStorage.getItem('keystore_file') != null) {
            //cached keystore path on mobile device or cached keystore file on browser
            show_private_key_html += '<div class="custom-google-label-style margin-bottom-15 margin-top-20 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="show-private-key-password">Password:</label><input type="password" id="show-private-key-password" class="full-rounded"></div><div class="text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border fs-xs-18 width-xs-100 show-private-key-action">DISPLAY PRIVATE KEY</a></div>';

            var this_camping_row = $(this).closest('.option-row').find('.camping-for-action');
            this_camping_row.html(show_private_key_html);

            $('.show-private-key-action').click(function() {
                if($('#show-private-key-password').val().trim() == '') {
                    basic.showAlert('Please enter password for your backup file.', '', true);
                } else {
                    showLoader('Hold on...<br>Decrypting your Backup File.');

                    setTimeout(function() {
                        var decrypt_keystore_response = decryptKeystore(window.localStorage.getItem('keystore_file'), $('#show-private-key-password').val().trim());
                        console.log(window.localStorage.getItem('keystore_file'), 'window.localStorage.getItem(\'keystore_file\')');
                        console.log($('#show-private-key-password').val().trim(), '$(\'#show-private-key-password\').val().trim()');
                        console.log(decrypt_keystore_response, 'decrypt_keystore_response');
                        if(decrypt_keystore_response.success) {
                            this_camping_row.html('<div class="private-key-holder"><div class="scroll-content">'+decrypt_keystore_response.to_string+'</div></div><div class="padding-top-10 padding-bottom-15 fs-14 color-warning-red">This is NOT a recommended way of accessing your wallet. The information is highly sensitive and should therefore be used in offline settings by experienced crypto users.</div><div class="padding-top-10 padding-bottom-10 padding-left-70 padding-right-70 padding-left-xs-10 padding-right-xs-10 text-left fs-14 color-white row-with-warning-red-background"><div>*Do not lose it! It cannot be recovered if you lose it.</div><div>*Do not share it! Your funds will be stolen if you use this file on a malicious/phishing site.</div><div>*Make a backup! Secure it like the millions of dollars it may one day be worth.</div></div>');
                        } else if (decrypt_keystore_response.error) {
                            basic.showAlert(decrypt_keystore_response.message, '', true);
                            $('#show-private-key-password').val('');
                        }

                        hideLoader();
                    }, 500);
                }
            });
        } else {
            if(is_hybrid) {
                show_private_key_html = '<div class="text-center import-keystore-file-row margin-top-20"><label class="button show-private-key-keystore-upload custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold">Upload your Backup File</span><svg class="load" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><path opacity="0.3" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg><svg class="check" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></a><div><span></span></div></label></div>';
            } else {
                show_private_key_html = '<div class="text-center import-keystore-file-row margin-top-20"><input type="file" id="show-private-key-keystore-upload" class="hide-input show-private-key-keystore-upload"/><label for="show-private-key-keystore-upload" class="button custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold">Upload your Backup File</span><svg class="load" version="1.1" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 40 40" enable-background="new 0 0 40 40"><path opacity="0.3" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/><path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/></path></svg><svg class="check" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></a><div><span></span></div></label></div>';
            }

            function decryptKeystoreFileAndShowPrivateKey(this_camping_row, keystore_string) {
                $('.settings-popup .continue-with-keystore-validation').remove();
                this_camping_row.append('<div class="continue-with-keystore-validation"><div class="custom-google-label-style margin-top-25 margin-bottom-15 max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="show-private-key-password">Backup Password:</label><input type="password" id="show-private-key-password" class="full-rounded"/></div><div class="padding-bottom-10 text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border continue-to-private-key">CONTINUE</a></div></div>');

                $('.settings-popup .continue-to-private-key').click(function() {
                    if($('.settings-popup #show-private-key-password').val().trim() == '') {
                        basic.showAlert('Please enter password for your backup file.', '', true);
                    } else {
                        showLoader('Hold on...<br>Decrypting your Backup File.');
                        setTimeout(function() {
                            var decrypt_keystore_response = decryptKeystore(keystore_string, $('.settings-popup #show-private-key-password').val().trim());
                            console.log(window.localStorage.getItem('keystore_file'), 'window.localStorage.getItem(\'keystore_file\')');
                            console.log($('.settings-popup #show-private-key-password').val().trim(), '$(\'.settings-popup #show-private-key-password\').val().trim()');
                            console.log(decrypt_keystore_response, 'decrypt_keystore_response');
                            if(decrypt_keystore_response.success) {
                                this_camping_row.html('<div class="private-key-holder"><div class="scroll-content">'+decrypt_keystore_response.to_string+'</div></div><div class="padding-top-10 padding-bottom-15 fs-14 color-warning-red">This is NOT a recommended way of accessing your wallet. The information is highly sensitive and should therefore be used in offline settings by experienced crypto users.</div><div class="padding-top-10 padding-bottom-10 padding-left-70 padding-right-70 padding-left-xs-10 padding-right-xs-10 text-left fs-14 color-white row-with-warning-red-background"><div>*Do not lose it! It cannot be recovered if you lose it.</div><div>*Do not share it! Your funds will be stolen if you use this file on a malicious/phishing site.</div><div>*Make a backup! Secure it like the millions of dollars it may one day be worth.</div></div>');
                            } else if (decrypt_keystore_response.error) {
                                basic.showAlert(decrypt_keystore_response.message, '', true);
                                $('.settings-popup #show-private-key-password').val('');
                            }

                            hideLoader();
                        }, 500);
                    }
                });
            }

            var this_camping_row = $(this).closest('.option-row').find('.camping-for-action');
            this_camping_row.html(show_private_key_html);

            if(is_hybrid) {
                //MOBILE APP
                if(basic.getMobileOperatingSystem() == 'Android') {
                    //ANDROID
                    $('.show-private-key-keystore-upload').click(function() {
                        var this_btn = $(this);

                        fileChooser.open(function(file_uri) {
                            window.resolveLocalFileSystemURL(decodeURIComponent(file_uri), function (entry) {
                                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (rootEntry) {
                                    rootEntry.getFile(decodeURIComponent(entry.fullPath), {create: false}, function (fileEntry) {
                                        fileEntry.file(function (file) {
                                            var reader = new FileReader();

                                            initCustomInputFileAnimation(this_btn);

                                            reader.onloadend = function () {
                                                var keystore_string = this.result;

                                                if(basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && checksumAddress('0x' + JSON.parse(keystore_string).address) == checksumAddress(global_state.account)) {
                                                    decryptKeystoreFileAndShowPrivateKey(this_camping_row, keystore_string);
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
                Array.prototype.forEach.call(document.querySelectorAll('.show-private-key-keystore-upload'), function(input) {
                    var label = input.nextElementSibling;
                    input.addEventListener('change', function(e) {
                        var myFile = this.files[0];
                        var reader = new FileReader();

                        reader.addEventListener('load', function (e) {
                            if(basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address') && checksumAddress('0x' + JSON.parse(e.target.result).address) == checksumAddress(global_state.account)) {
                                var keystore_string = e.target.result;
                                //init upload button animation
                                initCustomInputFileAnimation(label);

                                decryptKeystoreFileAndShowPrivateKey(this_camping_row, keystore_string);
                            } else {
                                basic.showAlert('Please upload valid keystore file which is related to your Dentacoin Wallet address.', '', true);
                            }
                        });

                        reader.readAsBinaryString(myFile);
                    });
                });
            }
        }
    });

    //encrypting private key with user password and return keystore file
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
                showLoader('Hold on...<br>Your Backup File is being generated.');

                setTimeout(function() {
                    var generate_response = generateKeystoreFromPrivateKey($('#generate-keystore-private-key').val().trim(), $('#generate-keystore-password').val().trim());

                    if(generate_response.success) {
                        var keystore_file_name = buildKeystoreFileName(generate_response.success.address);
                        if(is_hybrid) {
                            //MOBILE APP
                            //downloading the file in mobile device file system
                            androidFileDownload(keystore_file_name, generate_response.success.keystore_file, function() {
                                basic.closeDialog();
                                basic.showAlert('File ' + keystore_file_name + ' has been downloaded to the top-level directory of your device file system.', '', true);
                                hideLoader();
                            });
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

    //removing the cached keystore file from localstorage
    $('.settings-popup .forget-keystore').click(function() {
        if(window.localStorage.getItem('keystore_file') != null) {
            window.localStorage.removeItem('keystore_file');

            basic.closeDialog();
            basic.showAlert('Your backup file cache was deleted successfully.', '', true);
        }
    });
});

//method to download files in Download folder in Android device
function androidFileDownload(file_name, file_content, callback) {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (fileSystem) {
        fileSystem.getDirectory('Download', {create: true, exclusive: false}, function(dirEntry) {
            dirEntry.getFile(file_name, {create: true, exclusive: true}, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        callback();
                    };

                    fileWriter.onerror = function (e) {
                        hideLoader();
                        alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                    };

                    // Create a new Blob and write they keystore content inside of it
                    var blob = new Blob([file_content], {type: 'text/plain'});
                    fileWriter.write(blob);
                }, function(err) {
                    console.log(err, 'err');
                    hideLoader();
                    alert('Something went wrong with downloading your file (Core error 4). Please contact admin@dentacoin.com.');
                });
            }, function(err) {
                console.log(err, 'err');
                hideLoader();
                alert('Seems like file with this name already exist in your root directory, move it or delete it and try again.');
            });
        }, function(err) {
            console.log(err, 'err');
            hideLoader();
            alert('Something went wrong with downloading your file (Core error 5). Please contact admin@dentacoin.com.');
        });
    });
}

//promote mobile app when user load wallet.dentacoin.com via mobile browser
function checkIfLoadingFromMobileBrowser() {
    if(!is_hybrid && basic.isMobile() && basic.cookies.get('show-download-mobile-app') != '1') {
        basic.cookies.set('show-download-mobile-app', 1);
        if(basic.getMobileOperatingSystem() == 'Android') {
            basic.showDialog('<div><h2 class="fs-24 lato-bold text-center padding-top-15 padding-bottom-25">Dentacoin Wallet App is here!<br>Download for free:</h2><figure itemscope="" itemtype="http://schema.org/Organization" class="text-center phone-container"><img src="assets/images/download-android-app.png" class="max-width-300 width-100" itemprop="logo" alt="Phone"/><a class="inline-block max-width-150 absolute-content" href="javascript:void(0)" onclick="return alert(\'Coming soon!\')" itemprop="url"><img src="assets/images/google-play-badge.svg" class="width-100" itemprop="logo" alt="Google play icon"/></a></figure></div>', 'download-mobile-app', null, null);
        } else if(basic.getMobileOperatingSystem() == 'iOS') {
            basic.showDialog('<div><h2 class="fs-24 lato-bold text-center padding-top-15 padding-bottom-25">Dentacoin Wallet App is here!<br>Download for free:</h2><figure itemscope="" itemtype="http://schema.org/Organization" class="text-center phone-container"><img src="assets/images/download-ios-app.png" class="max-width-300 width-100" itemprop="logo" alt="Phone"/><a class="inline-block max-width-150 absolute-content" href="javascript:void(0)" onclick="return alert(\'Coming soon!\')" itemprop="url"><img src="assets/images/app-store.svg" class="width-100" itemprop="logo" alt="App store icon"/></a></figure></div>', 'download-mobile-app', null, null);
        }
    }
}

function fireGoogleAnalyticsEvent(category, action, label, value) {
    var event_obj = {
        'event_action' : action,
        'event_category': category,
        'event_label': label
    };

    if(value != undefined) {
        event_obj.value = value;
    }

    gtag('event', label, event_obj);
}

function getEthereumDataByCoingecko(callback) {
    $.ajax({
        type: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/ethereum',
        dataType: 'json',
        success: function(response) {
            callback(response);
        }
    });
}

function getDentacoinDataByCoingecko(callback) {
    $.ajax({
        type: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
        dataType: 'json',
        success: function(response) {
            callback(response);
        }
    });
}

function getCryptoDataByIndacoin(cryptocurrency_symbol, callback) {
    $.ajax({
        type: 'GET',
        url: 'https://indacoin.com/api/GetCoinConvertAmount/USD/'+cryptocurrency_symbol+'/100/dentacoin',
        dataType: 'json',
        success: function(response) {
            if(cryptocurrency_symbol == 'DCN') {
                indacoin_data.dcn = {
                    value: response,
                    timestamp: Date.now() + 600 * 1000
                }
            } else if(cryptocurrency_symbol == 'ETH') {
                indacoin_data.eth = {
                    value: response,
                    timestamp: Date.now() + 600 * 1000
                }
            }
            callback(indacoin_data);
        }
    });
}

//custom router camping for html changes, because old Android versions do not recognize Angular router
function router() {
    var current_route;

    if($('.main-holder app-homepage').length) {
        current_route = 'home';
        getHomepageData();
    } else if($('.main-holder app-buy-page').length) {
        current_route = 'buy';
        getBuyPageData();
    } else if($('.main-holder app-send-page').length) {
        current_route = 'send';
        getSendPageData();
    } else if($('.main-holder app-spend-page-pay-for-dental-services').length) {
        current_route = 'pay-for-dental-services';
        initdApp();
    } else if($('.main-holder app-spend-page-gift-cards').length) {
        current_route = 'gift-cards';
        getSpendPageGiftCards();
    } else if($('.main-holder app-spend-page-exchanges').length) {
        current_route = 'page-exchanges';
        getSpendPageExchanges();
    } else if($('.main-holder app-spend-page-pay-assurance-fees').length) {
        current_route = 'pay-assurance-fees';
        initdApp();
    }

    $('body').on('DOMSubtreeModified', '.main-holder', function() {
        if($('.main-holder app-homepage').length && current_route != 'home') {
            current_route = 'home';
            getHomepageData();
        } else if($('.main-holder app-buy-page').length && current_route != 'buy') {
            current_route = 'buy';
            getBuyPageData();
        } else if($('.main-holder app-send-page').length && current_route != 'send') {
            current_route = 'send';
            getSendPageData();
        } else if($('.main-holder app-spend-page-pay-for-dental-services').length && current_route != 'pay-for-dental-services') {
            current_route = 'pay-for-dental-services';
            initdApp();
        } else if($('.main-holder app-spend-page-gift-cards').length && current_route != 'gift-cards') {
            current_route = 'gift-cards';
            getSpendPageGiftCards();
        } else if($('.main-holder app-spend-page-exchanges').length && current_route != 'page-exchanges') {
            current_route = 'page-exchanges';
            getSpendPageExchanges();
        } else if($('.main-holder app-spend-page-pay-assurance-fees').length && current_route != 'pay-assurance-fees') {
            current_route = 'pay-assurance-fees';
            initdApp();
        }

        if(current_route != 'home' && !$('.camp-for-custom-popover').hasClass('hide')) {
            $('.camp-for-custom-popover').addClass('hide');
            clearInterval(custom_popover_interval);
        }
    });

    console.log(current_route, 'current_route');
}
router();