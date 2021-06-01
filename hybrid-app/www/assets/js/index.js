var closeOnLoadLoader = true;
//importing methods for keystore import, export, decrypt
var {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore, validatePrivateKey, generateKeystoreFromPrivateKey} = require('./helper');

var {config_variable} = require('./config');
var assurance_config;
var iframeHeightListenerInit = true;
var isDeviceReady = false;
var lastHybridScreen;
var inAppBrowserSettings = 'location=yes,zoom=no,toolbarposition=top,closebuttoncaption=Back,presentationstyle=fullscreen,fullscreen=yes';
if (basic.getMobileOperatingSystem() == 'iOS') {
    inAppBrowserSettings = 'location=no,hardwareback=no,zoom=no,toolbarposition=top,closebuttoncaption=Back,presentationstyle=fullscreen,fullscreen=yes';
}

console.log("( ͡° ͜ʖ ͡°) I see you.");

$(document).ready(function () {
    loadMobileBottomFixedNav();
});

$(window).on('beforeunload', function () {

});

$(window).on("load", function () {

});

$(window).on('resize', function () {

});

$(window).on('scroll', function () {

});

window.addEventListener('load', function () {

});

// event called only on hybrid app
document.addEventListener('deviceready', function () {
    console.log('================= deviceready ===================');
    isDeviceReady = true;

    // if DPGuests wifi is available in the device range then connect to it
    /*WifiWizard2.startScan().then(startscanresponse => {
        // Success
        console.log(startscanresponse, 'startscanresponse');
    }).catch(e => {
        console.log(JSON.stringify(e));
    });*/

    // Wifi scanning works only for Android
    /*if (basic.getMobileOperatingSystem() == 'Android') {
        console.log('Android Wifi connect');

        WifiWizard2.getScanResults().then(response => {
            console.log(response, 'getScanResults');
            if (Array.isArray(response) && response.length) {
                for (var i = 0, len = response.length; i < len; i+=1) {
                    if (response[i]['SSID'] == config_variable.dp_wifi_user) {
                        console.log('Android Wifi connect');
                        WifiWizard2.connect(config_variable.dp_wifi_user, false, config_variable.dp_wifi_pass, 'WPA').then(function(res) {
                            console.log(res, 'WifiWizard2.connect');
                        }).catch(function(err) {
                            console.log(err, 'WifiWizard2.connect');
                        });
                        break;
                    }
                }
            }
        }).catch(e => {
            console.log(JSON.stringify(e));
        });
    }*/ /*else if (basic.getMobileOperatingSystem() == 'iOS') {
        console.log('iOS Wifi connect');
        WifiWizard2.iOSConnectNetwork(config_variable.dp_wifi_user, config_variable.dp_wifi_pass).then(function(res) {
            console.log(res, 'WifiWizard2.connect');
        }).catch(function(err) {
            console.log(err, 'WifiWizard2.connect');
        });
    }*/

    // overwrite window.open to work with inappbrowser
    window.open = cordova.InAppBrowser.open;

    // start hybrid app analytics tracker
    cordova.plugins.firebase.analytics.setCurrentScreen($('title').html());

    //=================================== internet connection check ONLY for MOBILE DEVICES ===================================

    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.NONE] = 'no-internet';

    if (states[networkState] == 'no-internet') {
        console.log('===== we are offline =====');
        $('header .camping-currently-offline').html('<div class="currently-offline">'+$('.translates-holder').attr('data-offline')+'</div>');
    }

    //event to track whenever device lose internet connection
    document.addEventListener('offline', function (e) {
        console.log('===== we are offline =====');
        $('header .camping-currently-offline').html('<div class="currently-offline">'+$('.translates-holder').attr('data-offline')+'</div>');
    }, false);

    //event to track whenever device connect to internet
    document.addEventListener('online', function (e) {
        console.log('===== we are online =====');
        $('header .camping-currently-offline').html('');
    }, false);

    //=================================== /internet connection check ONLY for MOBILE DEVICES ===================================
}, false);

//=================================== internet connection check ONLY for BROWSERS ===================================

var internet_variable = navigator.onLine;

function checkIfInternetConnection() {
    if (!is_hybrid) {
        setInterval(function () {
            if (internet_variable != navigator.onLine) {
                if (navigator.onLine) {
                    $('header .camping-currently-offline').html('');
                    internet_variable = navigator.onLine;
                } else {
                    $('header .camping-currently-offline').html('<div class="currently-offline">'+$('.translates-holder').attr('data-offline')+'</div>');
                    internet_variable = navigator.onLine;
                }
            }
        }, 1000);
    }
}

checkIfInternetConnection();

//=================================== /internet connection check ONLY for BROWSERS ===================================

// create this custom function, because toFixed() is rounding numbers
Number.prototype.toFixedNoRounding = function (n) {
    const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
    const a = this.toString().match(reg)[0];
    const dot = a.indexOf(".");
    if (dot === -1) { // integer, insert decimal dot and pad up zeros
        return a + "." + "0".repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? (a + "0".repeat(b)) : a;
};

Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
};

var custom_popover_interval;
var request_response = {};
var request_interval_for_rest_of_transaction_history;
//by this variable we recognize is project is loaded from web browser or like hybrid app
var is_hybrid = $('body').hasClass('hybrid-app');
var meta_mask_installed = false;
var temporally_timestamps = {};
var global_state = {};
var getInstance;
var DCNContract;
var core_db_clinics;
var core_db_clinics_time_to_request;
var block_number_of_dcn_creation = 3170000;
var load_qr_code_lib = true;
var indacoin_data = {};

//dApp init
var dApp = {
    loaded: false,
    contract_address: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
    web3Provider: null,
    web3_0_2: null,
    web3_1_0: null,
    init: function (callback) {
        dApp.loaded = true;

        //init web3
        if (window.ethereum && window.localStorage.getItem('custom_wallet_over_external_web3_provider') == null) {
            $(document).ready(async function () {
                // sometimes for some reason window.ethereum comes as object with undefined properties, after refreshing its working as it should
                //if (window.ethereum.chainId == undefined || window.ethereum.networkVersion == undefined) {
                    // window.location.reload();
                //}

                // var accountsOnEnable = await ethereum.enable(); // depracated
                var accountsOnEnable = await ethereum.request({method: 'eth_requestAccounts'});

                //METAMASK INSTALLED
                if (accountsOnEnable.length == 0 || accountsOnEnable[0] == undefined || accountsOnEnable[0] == null) {
                    //if metamask is installed, but user not logged show login popup
                    basic.showDialog('<div class="popup-body"><div class="title">Sign in to MetaMask</div><div class="subtitle">Open up your browser\'s MetaMask extention and give approval if asked for it.</div><div class="separator"></div><figure class="gif"><img src="assets/images/metamask-animation.gif" alt="Login MetaMask animation"/> </figure><div class="padding-top-20 text-center"><a href="javascript:void(0);" class="fs-20 white-light-blue-btn light-blue-border proceed-without-using-metamask">OR PROCEED WITHOUT IT</a></div></div>', 'login-metamask-desktop');

                    $('.proceed-without-using-metamask').click(function () {
                        window.localStorage.setItem('custom_wallet_over_external_web3_provider', true);
                        window.location.reload();
                    });
                } else {
                    proceedWithMetaMaskWalletConnection(accountsOnEnable[0]);
                }

                window.ethereum.on('accountsChanged', function (accounts) {
                    if (accounts[0] != null && accounts[0] != undefined && !basic.property_exists(global_state, 'account')) {
                        proceedWithMetaMaskWalletConnection(accounts[0]);
                    } else if ((accounts[0] == null || accounts[0] == undefined) && basic.property_exists(global_state, 'account')) {
                        //if user logged in with metamask, but logging out or dissaproved wallet.dentacoin.com from metamask trusted domain
                        window.location.reload();
                    } else if (accounts[0] != null && accounts[0] != undefined && basic.property_exists(global_state, 'account') && accounts[0] != global_state.account) {
                        //if user logged in with metamask, but trying to switch his active metamask account
                        window.location.reload();
                    }
                });

                async function proceedWithMetaMaskWalletConnection(account) {
                    var chainId = await ethereum.request({method: 'eth_chainId'});
                    if (chainId != '0x1') {
                        basic.showAlert($('.translates-holder').attr('data-wrong-chain'), '', true);
                        return false;
                    } else {
                        if (ethereum.isMetaMask) {
                            projectData.general_logic.addDCNTokenToMetamask();
                        }

                        global_state.account = account;

                        web3 = getWeb3(window['ethereum']);
                        dApp.web3_1_0 = web3;
                        meta_mask_installed = true;

                        basic.closeDialog();
                        continueWithContractInstanceInit();
                    }
                }
            });
        } else if (typeof(web3) !== 'undefined' && window.localStorage.getItem('custom_wallet_over_external_web3_provider') == null) {
            //OLD METAMASK OR EXTERNAL web3 PROVIDER INSTALLED
            if (web3.eth.defaultAccount != null && web3.eth.defaultAccount != undefined && web3.eth.defaultAccount != '') {
                global_state.account = web3.eth.defaultAccount;
                //overwrite web3 0.2 with web 1.0
                web3 = getWeb3(web3.currentProvider);
                dApp.web3_1_0 = web3;

                continueWithContractInstanceInit();
            }
        } else {
            //NO METAMASK INSTALLED
            if (window.localStorage.getItem('current_account') != null && (typeof(web3) === 'undefined' || window.localStorage.getItem('custom_wallet_over_external_web3_provider') == 'true')) {
                global_state.account = window.localStorage.getItem('current_account');
            }

            dApp.web3_1_0 = getWeb3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/c6ab28412b494716bc5315550c0d4071'));
            dApp.web3_1_0_assurance = getWeb3(new Web3.providers.HttpProvider(assurance_config.infura_node));

            continueWithContractInstanceInit();
        }

        function continueWithContractInstanceInit() {
            if ((typeof(global_state.account) == 'undefined' || !projectData.utils.innerAddressCheck(global_state.account)) && typeof(web3) !== 'undefined' && window.localStorage.getItem('custom_wallet_over_external_web3_provider') == null) {
                $('.logo-and-settings-row .open-settings-col').remove();
            }

            // global_state.account = projectData.utils.checksumAddress(global_state.account);

            //init contract
            if (typeof(global_state.account) != 'undefined' && projectData.utils.innerAddressCheck(global_state.account)) {
                $.getJSON('assets/jsons/DentacoinToken.json', function (DCNArtifact) {
                    if ((typeof(web3) === 'undefined' || window.localStorage.getItem('custom_wallet_over_external_web3_provider') == 'true') && $('.logo-and-settings-row .open-settings-col').length == 0 && $('.logo-and-settings-row').length > 0) {
                        $('.logo-and-settings-row').append('<div class="col-xs-6 inline-block open-settings-col"><figure itemscope="" itemtype="http://schema.org/Organization" class="text-right"><a href="javascript:void(0)" itemprop="url" class="open-settings"><img src="assets/images/settings-icon.svg" class="max-width-30" itemprop="logo" alt="Settings icon"/></a></figure></div>');
                    }

                    // get the contract artifact file and use it to instantiate a truffle contract abstraction
                    getInstance = getContractInstance(dApp.web3_1_0);
                    DCNContract = getInstance(DCNArtifact, dApp.contract_address);

                    if (callback != undefined) {
                        callback();
                    }

                    dApp.buildTransactionHistory();
                });
            }
        }
    },
    buildTransactionHistory: function () {
        //getting transactions data by etherscan
        $.ajax({
            type: 'GET',
            url: 'https://api.etherscan.io/api?module=account&action=txlist&address=' + global_state.account + '&startblock=' + block_number_of_dcn_creation,
            dataType: 'json',
            success: function (response) {
                var etherscan_transactions = response;

                var ethereum_transactions_arr = [];
                if (etherscan_transactions.result) {
                    for (var i = 0, len = etherscan_transactions.result.length; i < len; i += 1) {
                        if (etherscan_transactions.result[i].input == '0x') {
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
                }, function (events_from_user_err, events_from_user) {
                    if (!events_from_user_err) {
                        //getting blockchain events where the logged user was the receiver of the transaction
                        DCNContract.getPastEvents('Transfer', {
                            filter: {_to: global_state.account},
                            fromBlock: block_number_of_dcn_creation,
                            toBlock: 'latest'
                        }, function (events_to_user_err, events_to_user) {
                            if (!events_to_user_err) {
                                //combining both events arrays ( from + to )
                                var merged_events_arr = events_from_user.concat(events_to_user, ethereum_transactions_arr);

                                if (merged_events_arr.length > 0) {
                                    //sorting the mixed array by blockNumber
                                    projectData.utils.sortByKey(merged_events_arr, 'blockNumber');
                                    merged_events_arr = merged_events_arr.reverse();

                                    projectData.requests.getEthereumDataByCoingecko(function (ethereumResponse) {
                                        var ethereum_data = ethereumResponse;
                                        projectData.requests.getDentacoinDataByCoingeckoProvider(function (dentacoinResponse) {
                                            var dentacoin_data = dentacoinResponse;

                                            $('.camping-transaction-history').html('<h2 class="lato-bold fs-25 text-center white-crossed-label color-white"><span class="renew-on-lang-switch" data-slug="tx-history">'+$('.translates-holder').attr('tx-history')+'</span></h2><div class="transaction-history container"><div class="row"><div class="col-xs-12 no-gutter-xs col-md-10 col-md-offset-1 padding-top-20"><table class="color-white"><tbody></tbody></table></div></div><div class="row camping-show-more"></div></div>');

                                            $(document).on('click', '.camping-transaction-history .show-more', function () {
                                                $(this).fadeOut();
                                                $(this).attr('show-all-transactions', 'true');
                                                $('.camping-transaction-history table tr').addClass('show-this');
                                            });

                                            var transaction_history_html = '';
                                            var array_with_already_shown_transactions = [];

                                            //clearing the array with transactions from dupped ones
                                            for (var i = 0, len = merged_events_arr.length; i < len; i += 1) {
                                                if (basic.property_exists(merged_events_arr[i], 'hash')) {
                                                    if (array_with_already_shown_transactions.includes(merged_events_arr[i].hash)) {
                                                        merged_events_arr.splice(i, 1);
                                                    } else {
                                                        array_with_already_shown_transactions.push(merged_events_arr[i].hash);
                                                    }
                                                } else if (basic.property_exists(merged_events_arr[i], 'transactionHash')) {
                                                    if (array_with_already_shown_transactions.includes(merged_events_arr[i].transactionHash)) {
                                                        merged_events_arr.splice(i, 1);
                                                    } else {
                                                        array_with_already_shown_transactions.push(merged_events_arr[i].transactionHash);
                                                    }
                                                }
                                            }

                                            //requesting blockchain for a lot of transactions data takes sometime and this is why first we select the latest 5 transactions for the logged user (which are shown on page load) and then we make a second query to select everything before these 5 latest transactions and show loader until they are ready to be shown
                                            var intervals_stopper = 5;
                                            if (merged_events_arr.length < 5) {
                                                intervals_stopper = merged_events_arr.length;
                                            }

                                            var stop_intervals = false;

                                            function recursiveLoop(custom_iterator) {
                                                if (custom_iterator < 5 && custom_iterator < intervals_stopper) {
                                                    if (basic.property_exists(merged_events_arr[custom_iterator], 'type') && merged_events_arr[custom_iterator].type == 'eth_transaction') {
                                                        //eth transaction
                                                        transaction_history_html += buildEthereumHistoryTransaction(ethereum_data, projectData.utils.fromWei(merged_events_arr[custom_iterator].value, 'ether'), merged_events_arr[custom_iterator].to, merged_events_arr[custom_iterator].from, merged_events_arr[custom_iterator].timeStamp, merged_events_arr[custom_iterator].hash);

                                                        if (custom_iterator < 5) {
                                                            custom_iterator += 1;
                                                            recursiveLoop(custom_iterator);
                                                        } else {
                                                            stop_intervals = true;
                                                        }
                                                    } else {
                                                        //dcn transaction
                                                        dApp.helper.addBlockTimestampToTransaction(merged_events_arr[custom_iterator].blockNumber, custom_iterator);

                                                        var request_interval = setInterval(function () {
                                                            if (!stop_intervals) {
                                                                if (temporally_timestamps[custom_iterator] != 0 && temporally_timestamps[custom_iterator] != undefined) {
                                                                    clearInterval(request_interval);

                                                                    transaction_history_html += buildDentacoinHistoryTransaction(dentacoin_data, merged_events_arr[custom_iterator].returnValues._value, merged_events_arr[custom_iterator].returnValues._to, merged_events_arr[custom_iterator].returnValues._from, temporally_timestamps[custom_iterator], merged_events_arr[custom_iterator].transactionHash);

                                                                    if (custom_iterator < 5) {
                                                                        custom_iterator += 1;
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

                                                    if (merged_events_arr.length > 5) {
                                                        transaction_history_html += '<tr class="loading-tr"><td class="text-center" colspan="5"><figure class="inline-block rotate-animation"><img src="assets/images/exchange.png" alt="Exchange icon"/></figure></td></tr>';
                                                        $('.camping-transaction-history .camping-show-more').html('<div class="col-xs-12 text-center padding-top-30"><a href="javascript:void(0)" class="white-light-blue-btn show-more renew-on-lang-switch" data-slug="show-more">'+$('.translates-holder').attr('show-more')+'</a></div>');
                                                        recursiveLoopForRestOfHistory(5);
                                                    }

                                                    $('.camping-transaction-history table tbody').html(transaction_history_html);
                                                    updateExternalURLsForiOSDevice();
                                                }
                                            }

                                            recursiveLoop(0);

                                            //requesting all transactions before the latest 5
                                            var next_transaction_history_html = '';

                                            function recursiveLoopForRestOfHistory(custom_iterator) {
                                                if (custom_iterator < merged_events_arr.length) {
                                                    if (custom_iterator > 5 && custom_iterator % 5 == 0) {
                                                        $('.camping-transaction-history table tbody tr.loading-tr').before(next_transaction_history_html);
                                                        next_transaction_history_html = '';
                                                        updateExternalURLsForiOSDevice();

                                                        if ($('.camping-transaction-history .show-more').attr('show-all-transactions') == 'true') {
                                                            $('.camping-transaction-history table tr').addClass('show-this');
                                                        }
                                                    }

                                                    if (basic.property_exists(merged_events_arr[custom_iterator], 'type') && merged_events_arr[custom_iterator].type == 'eth_transaction') {
                                                        //eth transaction
                                                        next_transaction_history_html += buildEthereumHistoryTransaction(ethereum_data, projectData.utils.fromWei(merged_events_arr[custom_iterator].value, 'ether'), merged_events_arr[custom_iterator].to, merged_events_arr[custom_iterator].from, merged_events_arr[custom_iterator].timeStamp, merged_events_arr[custom_iterator].hash);

                                                        if (custom_iterator < merged_events_arr.length) {
                                                            custom_iterator += 1;
                                                            recursiveLoopForRestOfHistory(custom_iterator);
                                                        } else {
                                                            stop_intervals = true;
                                                        }
                                                    } else {
                                                        //dcn transaction
                                                        dApp.helper.addBlockTimestampToTransaction(merged_events_arr[custom_iterator].blockNumber, custom_iterator);

                                                        request_interval_for_rest_of_transaction_history = setInterval(function () {
                                                            if (!stop_intervals) {
                                                                if (temporally_timestamps[custom_iterator] != 0 && temporally_timestamps[custom_iterator] != undefined) {
                                                                    clearInterval(request_interval_for_rest_of_transaction_history);

                                                                    next_transaction_history_html += buildDentacoinHistoryTransaction(dentacoin_data, merged_events_arr[custom_iterator].returnValues._value, merged_events_arr[custom_iterator].returnValues._to, merged_events_arr[custom_iterator].returnValues._from, temporally_timestamps[custom_iterator], merged_events_arr[custom_iterator].transactionHash);

                                                                    if (custom_iterator < merged_events_arr.length) {
                                                                        custom_iterator += 1;
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
                                                    updateExternalURLsForiOSDevice();

                                                    if ($('.camping-transaction-history .show-more').attr('show-all-transactions') == 'true') {
                                                        $('.camping-transaction-history table tr').addClass('show-this');
                                                    }

                                                    //updating transaction history every 10 minutes, because the project is SPA and pages are not really refreshed on route change, routes are dynamicly loaded with AngularJS
                                                    setTimeout(function () {
                                                        dApp.buildTransactionHistory();
                                                    }, 600000);
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    $('.camping-transaction-history').html('<h2 class="lato-bold fs-16 text-center color-white"><span class="renew-on-lang-switch" data-slug="no-tx">'+$('.translates-holder').attr('no-tx')+'</span></h2>');
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    getTransferFromEvents: function () {
        return new Promise(function (resolve, reject) {
            DCNContract.getPastEvents('Transfer', {
                filter: {_from: global_state.account},
                fromBlock: block_number_of_dcn_creation,
                toBlock: 'latest'
            }, function (error, event) {
                if (!error) {
                    resolve(event);
                } else {
                    resolve(error);
                }
            });
        });
    },
    getTransferToEvents: function () {
        return new Promise(function (resolve, reject) {
            DCNContract.getPastEvents('Transfer', {
                filter: {_to: global_state.account},
                fromBlock: block_number_of_dcn_creation,
                toBlock: 'latest'
            }, function (error, event) {
                if (!error) {
                    resolve(event);
                } else {
                    resolve(error);
                }
            });
        });
    },
    methods: {
        getDCNBalance: function (address, callback) {
            DCNContract.methods.balanceOf(address).call({from: address}, function (err, response) {
                callback(err, response);
            });
        },
        transfer: function (send_addr, value) {
            return DCNContract.methods.transfer(send_addr, value).send({
                from: global_state.account,
                gas: 60000
            }).on('transactionHash', function (hash) {
                displayMessageOnTransactionSend('Dentacoin tokens', hash);
            }).catch(function (err) {
                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
            });
        }
    },
    helper: {
        getBlockNum: function () {
            return new Promise(function (resolve, reject) {
                dApp.web3_1_0.eth.getBlockNumber(function (error, result) {
                    if (!error) {
                        global_state.curr_block = result;
                        resolve(global_state.curr_block);
                    }
                });
            });
        },
        addBlockTimestampToTransaction: function (blockNumber, object_key) {
            dApp.web3_1_0.eth.getBlock(blockNumber, function (error, result) {
                if (error !== null) {

                }
                if (result != undefined && result != null) {
                    temporally_timestamps[object_key] = result.timestamp;
                }
            });
        },
        getAddressETHBalance: function (address) {
            return new Promise(function (resolve, reject) {
                resolve(dApp.web3_1_0.eth.getBalance(address));
            });
        },
        estimateGas: function (address, function_abi) {
            return new Promise(function (resolve, reject) {
                dApp.web3_1_0.eth.estimateGas({
                    to: address,
                    data: function_abi
                }, function (error, result) {
                    if (!error) {
                        resolve(result);
                    }
                });
            });
        }
    }
};

//logic splitted by pages
var bidali_lib_loaded = false;
var projectData = {
    pages: {
        homepage: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            if (typeof(global_state.account) != 'undefined') {
                showMobileAppBannerForDesktopBrowsers();

                function refreshAccountDataButtonLogic(init_loader) {
                    if (init_loader != undefined) {
                        showLoader();

                        clearInterval(request_interval_for_rest_of_transaction_history);
                        dApp.buildTransactionHistory();
                        setTimeout(function () {
                            updateUserAccountData(true);
                        }, 500);
                    } else {
                        updateUserAccountData();
                    }
                }

                refreshAccountDataButtonLogic();

                function updateUserAccountData(hide_loader) {
                    //show user ethereum address
                    $('.eth-address-container .address-value').val(projectData.utils.checksumAddress(global_state.account));

                    //update dentacoin amount
                    dApp.methods.getDCNBalance(global_state.account, function (err, response) {
                        var dcn_balance = parseInt(response);

                        $('.main-wrapper .dcn-amount').html(dcn_balance);

                        //update usd amount (dentacoins in usd)
                        projectData.requests.getDentacoinDataByCoingeckoProvider(function (request_response) {
                            var dentacoin_data = request_response;
                            if (dentacoin_data != 0) {
                                $('.usd-amount').html((dcn_balance * dentacoin_data).toFixed(2));
                            } else {
                                $('.usd-amount-parent').hide();
                            }

                            //update ether amount
                            dApp.web3_1_0.eth.getBalance(global_state.account, function (error, result) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    if (parseFloat(projectData.utils.fromWei(result)).toFixed(8) != 0) {
                                        $('.eth-amount').html(parseFloat(projectData.utils.fromWei(result)).toFixedNoRounding(8));
                                    } else {
                                        $('.eth-amount').html('0.00000000');
                                    }

                                    if (hide_loader != undefined) {
                                        hideLoader();
                                    }
                                }
                            });
                        });
                    });
                }

                $(document).on('click', '.refresh-account-data', function () {
                    refreshAccountDataButtonLogic(true);
                });

                $('body').addClass('overflow-hidden');
                var window_width = $(window).width();
                $('body').removeClass('overflow-hidden');
                if (window_width > 768) {
                    //show qr code generated by the user ethereum address
                    if ($('#qrcode').length) {
                        $('#qrcode').html('');
                        var qrcode = new QRCode(document.getElementById('qrcode'), {
                            width: 160,
                            height: 160
                        });

                        qrcode.makeCode(projectData.utils.checksumAddress(global_state.account));
                    }

                    //init copy button event
                    var clipboard = new ClipboardJS('.copy-address');
                    clipboard.on('success', function (e) {
                        $('.copy-address').tooltip('show');
                        setTimeout(function () {
                            $('.copy-address').tooltip('hide');
                        }, 1000);
                    });

                    $('.copy-address').tooltip({
                        trigger: 'click'
                    });
                } else {
                    $('.eth-address-container').click(function () {
                        basic.closeDialog();
                        basic.showDialog('<h2 class="renew-on-lang-switch fs-18" data-slug="dcn-address">'+$('.translates-holder').attr('dcn-address')+'</h2><figure itemscope="" itemtype="http://schema.org/ImageObject" id="mobile-qrcode" class="padding-top-20 padding-bottom-20"></figure><a href="javascript:void(0)" class="mobile-copy-address text-center fs-0" data-toggle="tooltip" title="Copied." data-placement="bottom" data-clipboard-target="#mobile-copy-address"><figure class="inline-block mobile-copy-icon" itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/black-copy-icon.svg" class="max-width-20 width-100 margin-right-5" alt="Copy address to clipboard icon" itemprop="contentUrl"/></figure><input type="text" readonly class="address-value inline-block fs-18 fs-xs-10" id="mobile-copy-address"/></a>', 'mobile-dentacoin-address-and-qr', null);

                        $('.mobile-dentacoin-address-and-qr .address-value').val(projectData.utils.checksumAddress(global_state.account));

                        var qrcode = new QRCode(document.getElementById('mobile-qrcode'), {
                            width: 180,
                            height: 180
                        });
                        qrcode.makeCode(projectData.utils.checksumAddress(global_state.account));

                        var clipboard = new ClipboardJS('.mobile-copy-address');
                        clipboard.on('success', function (e) {
                            $('.mobile-copy-address').tooltip('show');
                            setTimeout(function () {
                                $('.mobile-copy-address').tooltip('hide');
                            }, 1000);
                        });

                        var img = document.querySelector('#mobile-qrcode img');

                        function loaded() {
                            $('.mobile-dentacoin-address-and-qr .modal-dialog').css('margin-top', Math.max(20, ($(window).height() - $('.mobile-dentacoin-address-and-qr .modal-dialog').height()) / 2));
                        }

                        if (img.complete) {
                            loaded();
                        } else {
                            img.addEventListener('load', loaded);
                        }
                    });
                }
            }

            $('.fade-in-element').fadeIn(500);

            $('.more-info').click(function () {
                $('.camp-for-custom-popover').toggleClass('hide');

                if (!$('.camp-for-custom-popover').hasClass('hide')) {
                    custom_popover_interval = setInterval(function () {
                        positionCustomPopover();
                    }, 500);
                } else {
                    clearInterval(custom_popover_interval);
                }
            });

            function positionCustomPopover() {
                if (!$('.camp-for-custom-popover').hasClass('hide')) {
                    $('.camp-for-custom-popover').offset({
                        top: $('.more-info').height() + $('.more-info').offset().top + 15,
                        left: $('.more-info').offset().left - $('.camp-for-custom-popover').width()
                    });
                }
            }
        },
        buy_page: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            projectData.requests.getMinimumUsdValueFromIndacoin(function (minimumIndacoinUsdForTransaction) {
                // rounding to 5 or 0
                minimumIndacoinUsdForTransaction = Math.ceil(minimumIndacoinUsdForTransaction / 5) * 5;
                $('.min-usd-amount').html(minimumIndacoinUsdForTransaction);

                showMobileAppBannerForDesktopBrowsers();

                if (typeof(global_state.account) != 'undefined') {
                    $('section.ready-to-purchase-with-external-api input#dcn_address').parent().find('label').addClass('active-label');
                    $('section.ready-to-purchase-with-external-api input#dcn_address').val(projectData.utils.checksumAddress(global_state.account));
                }

                //getting DCN data from Indacoin every 10 minutes
                if (!basic.property_exists(indacoin_data, 'dcn') || (basic.property_exists(indacoin_data, 'dcn') && indacoin_data.dcn.timestamp < Date.now())) {
                    showLoader();
                    projectData.requests.getCryptoDataByIndacoin('DCN', minimumIndacoinUsdForTransaction, function (indacoin_dcn_data) {
                        passedGetDCNDataRequest(indacoin_dcn_data);
                    });
                } else {
                    passedGetDCNDataRequest(indacoin_data);
                }

                function passedGetDCNDataRequest(indacoin_dcn_data) {
                    // var dcn_for_one_usd = parseFloat(indacoin_dcn_data.dcn.value) / 100;
                    var minimumUsdValueOfDcn = parseFloat(indacoin_dcn_data.dcn.value);

                    //getting ETH data from Indacoin every 10 minutes
                    if (!basic.property_exists(indacoin_data, 'eth') || (basic.property_exists(indacoin_data, 'eth') && indacoin_data.eth.timestamp < Date.now())) {
                        showLoader();
                        projectData.requests.getCryptoDataByIndacoin('ETH', minimumIndacoinUsdForTransaction, function (indacoin_eth_data) {
                            passedGetETHDataRequest(indacoin_eth_data);
                        });
                    } else {
                        passedGetETHDataRequest(indacoin_data);
                    }

                    function passedGetETHDataRequest(indacoin_eth_data) {
                        //var eth_for_one_usd = parseFloat(indacoin_eth_data.eth.value) / 100;
                        $('section.ready-to-purchase-with-external-api #usd-value').val(minimumIndacoinUsdForTransaction);
                        $('section.ready-to-purchase-with-external-api #crypto-amount').val(Math.floor(minimumUsdValueOfDcn));

                        if ($('[data-toggle="tooltip"]').length) {
                            $('[data-toggle="tooltip"]').tooltip();
                        }

                        if (Math.floor(minimumUsdValueOfDcn) == 0) {
                            $('.camping-for-issue-with-the-external-provider').html('<div class="col-xs-12"><div class="alert alert-info">'+$('.translates-holder').attr('smth-wrong')+'</div></div>');
                        }

                        hideLoader();

                        // on currency switch from the dropdown
                        $('section.ready-to-purchase-with-external-api #active-crypto').unbind().on('change', function () {
                            var thisValue = $(this);

                            showLoader();
                            setTimeout(function() {
                                projectData.requests.getMinimumUsdValueFromIndacoin(function (onChangeMinimumIndacoinUsdForTransaction) {
                                    // rounding to 5 or 0
                                    onChangeMinimumIndacoinUsdForTransaction = Math.ceil(onChangeMinimumIndacoinUsdForTransaction / 5) * 5;
                                    $('section.ready-to-purchase-with-external-api #usd-value').val(onChangeMinimumIndacoinUsdForTransaction);

                                    if (thisValue.val() == 'dcn') {
                                        projectData.requests.getCryptoDataByIndacoin('DCN', onChangeMinimumIndacoinUsdForTransaction, function (onChangeDcnData) {
                                            $('.ready-to-purchase-with-external-api .address-to-receive').html('DCN');
                                            $('section.ready-to-purchase-with-external-api #crypto-amount').val(onChangeDcnData.dcn.value);

                                            hideLoader();
                                        });
                                    } else if (thisValue.val() == 'eth') {
                                        projectData.requests.getCryptoDataByIndacoin('ETH', onChangeMinimumIndacoinUsdForTransaction, function (onChangeEthData) {
                                            $('.ready-to-purchase-with-external-api .address-to-receive').html('ETH');
                                            $('section.ready-to-purchase-with-external-api #crypto-amount').val(onChangeEthData.eth.value);

                                            hideLoader();
                                        });
                                    }
                                });
                            }, 1000);
                        });

                        // on changing the usd value
                        $('section.ready-to-purchase-with-external-api #usd-value').unbind().on('input', function () {
                            if ($(this).val().trim() < minimumIndacoinUsdForTransaction) {
                                $(this).parent().addClass('error-field');
                            } else {
                                $(this).parent().removeClass('error-field');
                            }

                            if (parseFloat($(this).val().trim()) < 0) {
                                $(this).val(minimumIndacoinUsdForTransaction);
                            } else if (parseFloat($(this).val().trim()) > 6000) {
                                $(this).val(6000);
                            }

                            if ($('section.ready-to-purchase-with-external-api #active-crypto').val() == 'dcn') {
                                projectData.requests.getCryptoDataByIndacoin('DCN', $(this).val().trim(), function (onInputDcnData) {
                                    $('section.ready-to-purchase-with-external-api #crypto-amount').val(Math.floor(onInputDcnData.dcn.value));
                                });
                            } else if ($('section.ready-to-purchase-with-external-api #active-crypto').val() == 'eth') {
                                projectData.requests.getCryptoDataByIndacoin('ETH', $(this).val().trim(), function (onInputEthData) {
                                    $('section.ready-to-purchase-with-external-api #crypto-amount').val(onInputEthData.eth.value);
                                });
                            }
                        });

                        //on BUY action button make few inputs validations and redirect to indacoin external link
                        $('.buy-crypto-btn').unbind().click(function () {
                            var currency = $('section.ready-to-purchase-with-external-api #active-crypto').val();

                            if (parseFloat($('section.ready-to-purchase-with-external-api #usd-value').val().trim()) < minimumIndacoinUsdForTransaction) {
                                basic.showAlert($('.translates-holder').attr('min-tx-limit') + ' ' + minimumIndacoinUsdForTransaction+' USD.', '', true);
                            } else if (parseFloat($('section.ready-to-purchase-with-external-api #usd-value').val().trim()) > 6000) {
                                basic.showAlert($('.translates-holder').attr('max-tx-limit'), '', true);
                            } else if (!projectData.utils.innerAddressCheck($('section.ready-to-purchase-with-external-api input#dcn_address').val().trim())) {
                                basic.showAlert($('.translates-holder').attr('valid-wallet'), '', true);
                            } else if (!basic.validateEmail($('section.ready-to-purchase-with-external-api input#email').val().trim())) {
                                basic.showAlert($('.translates-holder').attr('valid-email'), '', true);
                            } else if (!$('section.ready-to-purchase-with-external-api #privacy-policy-agree').is(':checked')) {
                                basic.showAlert($('.translates-holder').attr('agree-policy'), '', true);
                            } else {
                                window.open('https://indacoin.com/gw/payment_form?partner=dentacoin&cur_from=USD&cur_to=' + currency.toUpperCase() + '&amount=' + $('section.ready-to-purchase-with-external-api #usd-value').val().trim() + '&address=' + $('section.ready-to-purchase-with-external-api input#dcn_address').val().trim() + '&user_id=' + $('section.ready-to-purchase-with-external-api input#email').val().trim(), '_blank');
                            }
                        });
                    }
                }
            });
        },
        send_page: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            if (typeof(global_state.account) != 'undefined') {
                showMobileAppBannerForDesktopBrowsers();

                //reading all clinics/ dentists from the CoreDB EVERY 1h
                showLoader();

                setTimeout(async function () {
                    if (core_db_clinics == undefined || core_db_clinics_time_to_request < Date.now()) {
                        $.ajax({
                            type: 'POST',
                            url: 'https://api.dentacoin.com/api/get-partners',
                            dataType: 'json',
                            success: function (response) {
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
                    $('.search-field #search').on('change keyup focusout paste', function () {
                        var input_value = $(this).val().trim();
                        if (input_value != '') {
                            if (projectData.utils.innerAddressCheck(input_value)) {
                                $('.search-result').hide();
                                $('.next-send').removeClass('disabled');
                            } else {
                                $('.next-send').addClass('disabled');

                                // scan QR from assurance
                            }
                        }
                    });

                    initScan($('.scan-qr-code'), $('#search'));

                    //sorting both clinics and address book lists in alphabetic order
                    function sortList(id) {
                        var mylist = $('#' + id);
                        var listitems = mylist.children('li').get();
                        listitems.sort(function (a, b) {
                            return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
                        });
                        $.each(listitems, function (idx, itm) {
                            mylist.append(itm);
                        });
                    }

                    function ifCoreDBReturnsClinics() {
                        if (core_db_clinics.success) {
                            var clinics_select_html = '';
                            for (var i = 0, len = core_db_clinics.data.length; i < len; i += 1) {
                                if (core_db_clinics.data[i].dcn_address != null) {
                                    clinics_select_html += '<li><a href="javascript:void(0);" class="display-block-important" data-value="' + core_db_clinics.data[i].dcn_address + '">' + core_db_clinics.data[i].name + '</a></li>';
                                }
                            }

                            clinics_select_html += '<li><a href="javascript:void(0);" class="display-block-important" data-value="0x65D5a4fc19DBb1d5da873bc5a7fe1b03F46eda5B">Swiss Dentaprime - V <span>(0x65D5a4fc19DBb1d5da873bc5a7fe1b03F46eda5B)</span></a></li><li><a href="javascript:void(0);" class="display-block-important" data-value="0x90336e8F76c720B449eE64976aF98696CabA36FB">Swiss Dentaprime - N <span>(0x90336e8F76c720B449eE64976aF98696CabA36FB)</span></a></li><li><a href="javascript:void(0);" class="display-block-important" data-value="0x4Db7E0A6474f39f4FBFFd96bD0B39C83a9F291C8">Swiss Dentaprime - New V <span>(0x4Db7E0A6474f39f4FBFFd96bD0B39C83a9F291C8)</span></a></li>';

                            $('.clinics-list').append(clinics_select_html);
                            sortList('clinics-list');

                            $('.search-result .search-header a').click(function () {
                                $('.search-body .hideable-element').hide();
                                $('.search-result .search-header a').removeClass('active');

                                $(this).addClass('active');
                                $('.search-body .hideable-element.' + $(this).attr('data-type')).show();
                            });

                            $(document).on('click', '.search-result .search-body ul li a', function () {
                                $('.search-field #search').val($(this).attr('data-value')).trigger('change');
                                $('.search-field #search-label').html($(this).html());
                                $('.search-result').hide();
                            });

                            $(document).click(function (event) {
                                var $target = event.target;
                                if ($target.closest('.search-field') == null) {
                                    $('.search-result').hide();
                                }
                            });

                            $('.search-field #search').on('focus', function () {
                                if (!projectData.utils.innerAddressCheck($('.search-field #search').val().trim())) {
                                    $('.search-result').show();
                                }
                            });

                            $('.search-field #search').on('input', function () {
                                if ($(this).val().trim() != '' && !projectData.utils.innerAddressCheck($(this).val().trim())) {
                                    $('.search-result').show();

                                    var value_to_check = $(this).val().trim().toLowerCase();
                                    $('.search-result .search-body ul li a').each(function () {
                                        if ($(this).html().toLowerCase().indexOf(value_to_check) == -1) {
                                            $(this).parent().addClass('hide-this');
                                        } else {
                                            $(this).parent().removeClass('hide-this');
                                        }
                                    });
                                } else {
                                    $('.search-field #search-label').html($('.translates-holder').attr('address-clinic-name'));
                                    $('.search-result .search-body ul li').removeClass('hide-this');
                                    $('.search-result').hide();
                                }
                            });

                            function updateAddressBookHtml() {
                                var address_book_list_in_storage = window.localStorage.getItem('address_book');
                                if (address_book_list_in_storage != null && basic.isJsonString(address_book_list_in_storage)) {
                                    var address_book_list_in_storage_obj = JSON.parse(address_book_list_in_storage);
                                    var address_book_html = '<ul id="address-book">';
                                    for (var i = 0, len = address_book_list_in_storage_obj.length; i < len; i += 1) {
                                        address_book_html += '<li class="removeable-element fs-0"><a href="javascript:void(0);" class="inline-block" data-value="' + address_book_list_in_storage_obj[i].address + '">' + address_book_list_in_storage_obj[i].name + '</a><button type="button" class="remove-address-book-element inline-block">×</button></li>';
                                    }
                                    address_book_html += '</ul>';

                                    $('.search-body .address-book').html(address_book_html);
                                    sortList('address-book');
                                }
                            }

                            updateAddressBookHtml();

                            function updateAddressBooklocalStorageVariable() {
                                var array = [];
                                $('.search-body .address-book ul li a').each(function () {
                                    array.push({'name': $(this).html().trim(), 'address': $(this).attr('data-value')});
                                });

                                window.localStorage.setItem('address_book', JSON.stringify(array));
                            }

                            $(document).on('click', '.search-body .address-book ul li button', function () {
                                var this_btn = $(this);
                                var delete_address_book_wallet_address = {};
                                delete_address_book_wallet_address.callback = function (result) {
                                    if (result) {
                                        this_btn.closest('li').remove();
                                        updateAddressBooklocalStorageVariable();
                                    }
                                };
                                basic.showConfirm($('.translates-holder').attr('wallet-address'), '', delete_address_book_wallet_address, true);
                            });

                            $('.search-field .search-footer .add-to-address-book').click(function () {
                                basic.closeDialog();
                                basic.showDialog('<h2 class="fs-18 padding-bottom-20 text-center">'+$('.translates-holder').attr('save-address-book')+'</h2><div class="custom-google-label-style module max-width-350 margin-0-auto margin-bottom-15" data-input-light-blue-border="true"><label for="contact-name">'+$('.translates-holder').attr('name-field')+'</label><input type="text" id="contact-name" maxlength="100" class="full-rounded"></div><div class="custom-google-label-style module max-width-350 margin-0-auto" data-input-light-blue-border="true"><label for="wallet-address">'+$('.translates-holder').attr('wallet-address-field')+'</label><input type="text" id="wallet-address" maxlength="42" class="full-rounded"></div><div class="padding-top-10"><a href="javascript:void(0)" class="display-block-important margin-0-auto max-width-80 add-to-address-book-scan-qr-code"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/scan-qr-code.svg" class="width-100" alt="Scan QR code icon" itemprop="contentUrl"/></figure></a></div><div class="padding-top-20 padding-bottom-15 text-center"><a href="javascript:void(0);" class="white-light-blue-btn light-blue-border save-to-address-book min-width-160">'+$('.translates-holder').attr('save')+'</a></div>', 'popup-save-to-address-book', null, true);

                                //open QR code reader to add new address to address book
                                $('.add-to-address-book-scan-qr-code').click(function () {
                                    if (is_hybrid) {
                                        cordova.plugins.barcodeScanner.scan(
                                            function (result) {
                                                $('.popup-save-to-address-book #wallet-address').val(result.text).trigger('change');
                                            },
                                            function (error) {
                                                alert($('.translates-holder').attr('scanning-failed'));
                                            }
                                        );
                                    } else {
                                        //BROWSER SCAN
                                        if (load_qr_code_lib) {
                                            showLoader();
                                            $.getScript('https://rawgit.com/schmich/instascan-builds/master/instascan.min.js', function () {
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
                                            var scanner = new Instascan.Scanner({video: document.getElementById('qr-preview')});
                                            scanner.addListener('scan', function (content) {
                                                $('.popup-save-to-address-book #wallet-address').val(content).trigger('change');
                                                scanner.stop(cameras_global[0]);
                                                $('.popup-scan-qr-code .bootbox-close-button').click();
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

                                            $('.popup-scan-qr-code .bootbox-close-button').click(function () {
                                                if (cameras_global.length > 0) {
                                                    scanner.stop(cameras_global[0]);
                                                }
                                            });
                                        }
                                    }
                                });

                                $('.save-to-address-book').click(function () {
                                    if ($('.popup-save-to-address-book #contact-name').val().trim() == '') {
                                        basic.showAlert('Please enter name.', '', true);
                                    } else if ($('.popup-save-to-address-book #wallet-address').val().trim() == '' || !projectData.utils.innerAddressCheck($('.popup-save-to-address-book #wallet-address').val().trim())) {
                                        basic.showAlert($('.translates-holder').attr('wallet-error'), '', true);
                                    } else {
                                        var address_book_list_in_storage = window.localStorage.getItem('address_book');

                                        if (address_book_list_in_storage == null) {
                                            window.localStorage.setItem('address_book', JSON.stringify([{
                                                'name': $('.popup-save-to-address-book #contact-name').val().trim(),
                                                'address': $('.popup-save-to-address-book #wallet-address').val().trim()
                                            }]));

                                            updateAddressBookHtml();
                                            basic.closeDialog();
                                            basic.showAlert($('.translates-holder').attr('address-book-response'), '', true);
                                        } else {
                                            if (basic.isJsonString(address_book_list_in_storage)) {
                                                var object = JSON.parse(address_book_list_in_storage);
                                                object.unshift({
                                                    'name': $('.popup-save-to-address-book #contact-name').val().trim(),
                                                    'address': $('.popup-save-to-address-book #wallet-address').val().trim()
                                                });

                                                window.localStorage.setItem('address_book', JSON.stringify(object));

                                                updateAddressBookHtml();
                                                basic.closeDialog();
                                                basic.showAlert($('.translates-holder').attr('address-book-response'), '', true);
                                            } else {
                                                //if the local storage variable is not object remove it and recreate it with object
                                                window.localStorage.removeItem('address_book');

                                                window.localStorage.setItem('address_book', JSON.stringify([{
                                                    'name': $('.popup-save-to-address-book #contact-name').val().trim(),
                                                    'address': $('.popup-save-to-address-book #wallet-address').val().trim()
                                                }]));

                                                updateAddressBookHtml();
                                                basic.closeDialog();
                                                basic.showAlert($('.translates-holder').attr('address-book-response'), '', true);
                                            }
                                        }
                                    }
                                });
                            });

                            bindSendPageElementsEvents();
                        } else {
                            bindSendPageElementsEvents();
                        }
                    }

                    var gasPriceObject = await projectData.requests.getGasPrice();
                    // var ethgasstation_json = await $.getJSON('https://ethgasstation.info/json/ethgasAPI.json');
                    // var gasPrice = await dApp.web3_1_0.eth.getGasPrice();

                    function bindSendPageElementsEvents() {
                        hideLoader();

                        $('.section-send .next-send').click(function () {
                            if (!$(this).hasClass('disabled')) {
                                fireGoogleAnalyticsEvent('Pay', 'Next', 'DCN Address');

                                showLoader();
                                projectData.requests.getEthereumDataByCoingecko(function (request_response) {
                                    var ethereum_data = request_response;

                                    //getting dentacoin data by Coingecko
                                    projectData.requests.getDentacoinDataByCoingeckoProvider(function (request_response) {
                                        $('.section-send').hide();
                                        $('.section-amount-to .address-cell').html($('.search-field #search').val().trim()).attr('data-receiver', $('.search-field #search').val().trim());
                                        window.scrollTo(0, 0);

                                        // remove loader from send page when all external requests are made
                                        hideLoader();

                                        $('.section-amount-to').fadeIn(500);

                                        var dentacoin_data = request_response;

                                        // if user has enough dcn balance show maximum spending balance shortcut
                                        dApp.methods.getDCNBalance(global_state.account, function (err, response) {
                                            var dcn_balance = parseInt(response);

                                            $('.spendable-amount').addClass('active').html('<div class="spendable-dcn-amount inline-block fs-18 fs-xs-16 lato-bold" data-value="' + dcn_balance + '"><label class="color-light-blue renew-on-lang-switch" data-slug="spendable-amount">'+$('.translates-holder').attr('spendable-amount')+' </label><span></span></div><div class="max-btn inline-block"><button class="white-light-blue-btn use-max-dcn-amount renew-on-lang-switch" data-slug="max">'+$('.translates-holder').attr('max')+'</button></div>');
                                            $('.spendable-amount .spendable-dcn-amount span').html(dcn_balance + ' DCN');
                                            $('.section-amount-to #active-crypto').val('dcn');

                                            $('.use-max-dcn-amount').click(function () {
                                                $('.section-amount-to input#crypto-amount').val($('.spendable-dcn-amount').attr('data-value'));
                                                $('.section-amount-to input#crypto-amount').closest('.custom-google-label-style').find('label').addClass('active-label');

                                                var to_fixed_num = 2;
                                                if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                    if (($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data) < 0.01) {
                                                        to_fixed_num = 4;
                                                    }
                                                    $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data).toFixed(to_fixed_num)).trigger('change');
                                                } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                    if (($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd) < 0.01) {
                                                        to_fixed_num = 4;
                                                    }
                                                    $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
                                                }
                                            });
                                        });

                                        //on input in dcn/ eth input change usd input
                                        $('.section-amount-to input#crypto-amount').unbind().on('input', function () {
                                            var to_fixed_num = 2;
                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                if (($(this).val().trim() * dentacoin_data) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($(this).val().trim() * dentacoin_data).toFixed(to_fixed_num)).trigger('change');
                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                if (($(this).val().trim() * ethereum_data.market_data.current_price.usd) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($(this).val().trim() * ethereum_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
                                            }
                                        });

                                        //on input in usd input change dcn/ eth input
                                        $('.section-amount-to input#usd-val').unbind().on('input', function () {
                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                $('.section-amount-to input#crypto-amount').val(Math.floor($(this).val().trim() / dentacoin_data)).trigger('change');
                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                $('.section-amount-to input#crypto-amount').val($(this).val().trim() / ethereum_data.market_data.current_price.usd).trigger('change');
                                            }
                                        });

                                        //on select with cryptocurrencies options change
                                        $('.section-amount-to #active-crypto').unbind().on('change', function () {
                                            var to_fixed_num = 2;
                                            if ($(this).val() == 'dcn') {
                                                dApp.methods.getDCNBalance(global_state.account, function (err, response) {
                                                    var dcn_balance = parseInt(response);
                                                    $('.spendable-dcn-amount').attr('data-value', dcn_balance);
                                                    $('.spendable-amount .spendable-dcn-amount span').html(dcn_balance + ' DCN');
                                                });

                                                if (($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data).toFixed(to_fixed_num)).trigger('change');
                                            } else if ($(this).val() == 'eth') {
                                                dApp.web3_1_0.eth.getBalance(global_state.account, async function (error, eth_balance) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        var newDecimal = new Decimal(projectData.utils.fromWei(eth_balance));
                                                        var ethSendGasEstimation = await dApp.web3_1_0.eth.estimateGas({
                                                            to: $('.section-amount-to .address-cell').attr('data-receiver')
                                                        });

                                                        var ethSendGasEstimationNumber = new BigNumber(ethSendGasEstimation);
                                                        //calculating the fee from the gas price and the estimated gas price
                                                        var on_popup_load_gwei = gasPriceObject.result.SafeGasPrice;
                                                        //adding 10% of the outcome just in case transactions don't take so long
                                                        var on_popup_load_gas_price = on_popup_load_gwei * 1000000000 + ((on_popup_load_gwei * 1000000000) * 0.1);
                                                        var cost = ethSendGasEstimationNumber * on_popup_load_gas_price;

                                                        var eth_fee = projectData.utils.fromWei(cost.toString(), 'ether');
                                                        var correctSendAmount = newDecimal.minus(eth_fee).toString();
                                                        if (parseInt(eth_balance) > parseInt(ethSendGasEstimation)) {
                                                            $('.spendable-dcn-amount').attr('data-value', correctSendAmount);
                                                            $('.spendable-amount .spendable-dcn-amount span').html(correctSendAmount + ' ETH');
                                                        } else {
                                                            $('.spendable-dcn-amount').attr('data-value', 0);
                                                            $('.spendable-amount .spendable-dcn-amount span').html('0 ETH');
                                                        }
                                                    }
                                                });

                                                if (($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
                                            }
                                        });

                                        $('.section-amount-to .open-transaction-recipe').unbind().click(function () {
                                            var crypto_val = $('.section-amount-to input#crypto-amount').val().trim();
                                            var usd_val = $('.section-amount-to input#usd-val').val().trim();
                                            var sending_to_address = $('.section-amount-to .address-cell').attr('data-receiver');

                                            if (isNaN(crypto_val) || crypto_val == '' || crypto_val == 0 || ((isNaN(usd_val) || usd_val == '' || usd_val == 0) && dentacoin_data > 0)) {
                                                //checking if not a number or empty values
                                                basic.showAlert($('.translates-holder').attr('ly-numbers'), '', true);
                                                return false;
                                            }

                                            if (parseFloat(crypto_val).countDecimals() > 17) {
                                                crypto_val = parseFloat(crypto_val).toFixedNoRounding(17).toString();
                                            }

                                            dApp.methods.getDCNBalance(global_state.account, function (err, response) {
                                                var dcn_balance = parseInt(response);

                                                dApp.web3_1_0.eth.getBalance(global_state.account, async function (error, eth_balance) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        if (crypto_val < 0 || (usd_val < 0 && dentacoin_data > 0)) {
                                                            //checking if negative numbers
                                                            basic.showAlert($('.translates-holder').attr('greater-than-zero'), '', true);
                                                            return false;
                                                        } else if (crypto_val < 10 && $('.section-amount-to #active-crypto').val() == 'dcn') {
                                                            //checking if dcn value is lesser than 10 (contract condition)
                                                            basic.showAlert($('.translates-holder').attr('greater-dcn-value'), '', true);
                                                            return false;
                                                        }/* else if (0.005 > parseFloat(projectData.utils.fromWei(eth_balance))) {
                                                            //checking if current balance is lower than the desired value to send
                                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                basic.showAlert('For sending Dentacoins you need at least 0.005 ETH. Please refill.', '', true);
                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                basic.showAlert('For sending Ethereum you need at least 0.005 ETH. Please refill.', '', true);
                                                            }
                                                            return false;
                                                        }*/ else if ($('.section-amount-to #active-crypto').val() == 'dcn' && crypto_val > parseInt(dcn_balance)) {
                                                            basic.showAlert($('.translates-holder').attr('higher-than-balance'), '', true);
                                                            return false;
                                                        } else if ($('.section-amount-to #active-crypto').val() == 'eth' && crypto_val > parseFloat(projectData.utils.fromWei(eth_balance))) {
                                                            basic.showAlert($('.translates-holder').attr('higher-than-balance'), '', true);
                                                            return false;
                                                        } else if (!projectData.utils.innerAddressCheck(sending_to_address)) {
                                                            //checking again if valid address
                                                            basic.showAlert($('.translates-holder').attr('enter-valid-address'), '', true);
                                                            return false;
                                                        } else if (!$('.section-amount-to #verified-receiver-address').is(':checked')) {
                                                            //checking again if valid address
                                                            basic.showAlert($('.translates-holder').attr('checkbox'), '', true);
                                                            return false;
                                                        }

                                                        if (meta_mask_installed) {
                                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                dApp.methods.transfer(sending_to_address, crypto_val);
                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                dApp.web3_1_0.eth.sendTransaction({
                                                                    from: global_state.account,
                                                                    to: sending_to_address,
                                                                    value: projectData.utils.toWei(crypto_val)
                                                                }).on('transactionHash', function (hash) {
                                                                    displayMessageOnTransactionSend('Ethers', hash);
                                                                }).catch(function (err) {
                                                                    basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                                                });
                                                            }
                                                        } else {
                                                            showLoader();

                                                            var function_abi;
                                                            var token_symbol;
                                                            var gasLimit;
                                                            var on_popup_load_gwei;
                                                            var on_popup_load_gas_price;
                                                            var visibleGasPriceNumber;
                                                            var nonce = await dApp.web3_1_0_assurance.eth.getTransactionCount(global_state.account);
                                                            var pendingNonce = await dApp.web3_1_0_assurance.eth.getTransactionCount(global_state.account, 'pending');
                                                            sending_to_address = projectData.utils.checksumAddress(sending_to_address);

                                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                token_symbol = 'DCN';
                                                                function_abi = DCNContract.methods.transfer(sending_to_address, crypto_val).encodeABI();

                                                                //gasLimit = 65000;
                                                                gasLimit = await DCNContract.methods.transfer(sending_to_address, crypto_val).estimateGas({
                                                                    from: global_state.account
                                                                });

                                                                // adding 10 percent to the gas limit just in case
                                                                gasLimit = Math.round(gasLimit + (gasLimit * 0.1));
                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                token_symbol = 'ETH';
                                                                gasLimit = await dApp.web3_1_0.eth.estimateGas({
                                                                    to: sending_to_address
                                                                });
                                                            }

                                                            //calculating the fee from the gas price and the estimated gas price
                                                            on_popup_load_gwei = gasPriceObject.result.SafeGasPrice;
                                                            //adding 10% of the outcome just in case transactions don't take so long
                                                            on_popup_load_gas_price = on_popup_load_gwei * 1000000000 + ((on_popup_load_gwei * 1000000000) * 10 / 100);
                                                            visibleGasPriceNumber = on_popup_load_gas_price / 1000000000;

                                                            if (usd_val == '') {
                                                                var usdHtml = '';
                                                            } else {
                                                                var usdHtml = '<div class="usd-amount">=$' + usd_val + '</div>';
                                                            }

                                                            var eth_fee = projectData.utils.fromWei((on_popup_load_gas_price * gasLimit).toString(), 'ether');
                                                            var transaction_popup_html = '<div class="tx-data-holder" data-visibleGasPriceNumber="'+visibleGasPriceNumber+'" data-initial-visibleGasPriceNumber="'+visibleGasPriceNumber+'" data-gasLimit="'+gasLimit+'" data-nonce="'+pendingNonce+'" data-initial-nonce="'+pendingNonce+'" data-on_popup_load_gas_price="'+on_popup_load_gas_price+'"></div><div class="title">'+$('.translates-holder').attr('sending-conf')+'</div><div class="pictogram-and-dcn-usd-price"><svg version="1.1" class="width-100 max-width-100 margin-bottom-10" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100.1 100" style="enable-background:new 0 0 100.1 100;" xml:space="preserve"><style type="text/css">.st0-recipe{fill:#FFFFFF;}.st1-recipe{fill:#CA675A;}.st2-recipe{fill:none;stroke:#CA675A;stroke-width:2.8346;stroke-linecap:round;stroke-miterlimit:10;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="100" width="105.7" x="-7.2" y="-6.4"></sliceSourceBounds></sfw></metadata><circle class="st0-recipe" cx="50" cy="50" r="50"/><g><g><g><path class="st1-recipe" d="M50.1,93.7c-18.7,0-36-12.4-41.3-31.3C2.4,39.6,15.8,16,38.5,9.6C48.9,6.7,60,7.8,69.6,12.8c1.2,0.6,1.6,2,1,3.2s-2,1.6-3.2,1c-8.6-4.4-18.4-5.4-27.7-2.8c-20.1,5.6-32,26.7-26.3,46.9s26.7,32.1,46.9,26.4s32.1-26.7,26.4-46.9c-1.1-3.9-2.8-7.6-5-10.9c-0.7-1.1-0.4-2.6,0.7-3.3c1.1-0.7,2.6-0.4,3.3,0.7c2.5,3.8,4.4,7.9,5.6,12.3c6.4,22.8-7,46.5-29.7,52.8C57.8,93.2,53.9,93.7,50.1,93.7z"/></g><g><path class="st1-recipe" d="M33.1,78.6c-0.5,0-1-0.2-1.5-0.5c-1-0.8-1.2-2.3-0.4-3.4l40.4-50.5c0.8-1,2.3-1.2,3.4-0.4c1,0.8,1.2,2.3,0.4,3.4L35,77.7C34.5,78.3,33.8,78.6,33.1,78.6z"/></g><g><g><path class="st2-recipe" d="M105.7,56.9"/></g></g></g><g><path class="st1-recipe" d="M73.7,54.2c-0.1,0-0.2,0-0.2,0c-1.3-0.2-2.3-1.4-2.2-2.7L74,23.9L47.6,39.8c-1.1,0.7-2.6,0.3-3.3-0.8c-0.7-1.1-0.3-2.6,0.8-3.3l34.5-20.8L76.1,52C76,53.2,74.9,54.2,73.7,54.2z"/></g></g></svg><div class="dcn-amount">-' + crypto_val + ' ' + token_symbol + '</div>' + usdHtml + '</div><div class="confirm-row to"> <div class="label inline-block">'+$('.translates-holder').attr('to-label')+'</div><div class="value inline-block">' + projectData.utils.checksumAddress(sending_to_address) + '</div></div><div class="confirm-row from"> <div class="label inline-block">'+$('.translates-holder').attr('from-label')+'</div><div class="value inline-block">' + global_state.account + '</div></div><div class="confirm-row nonce"> <div class="label inline-block">'+$('.translates-holder').attr('nonce')+'</div><div class="value inline-block">' + pendingNonce + '</div></div><div class="confirm-row fee"> <div class="label inline-block">'+$('.translates-holder').attr('eth-fee')+'</div><div class="value inline-block"><div class="inline-block eth-value">' + parseFloat(eth_fee).toFixed(8) + '</div><div class="inline-block tx-settings-icon"><a href="javascript:void(0);"><svg id="e68760ed-3659-43b9-ad7b-73b5b189fe7a" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 56.81 61"><defs><clipPath id="f9d5df6d-58de-4fe9-baeb-2948a9aeab40"><rect class="bb542d8f-936a-4524-831e-8152ec1848dd" x="-3.59" y="-1.5" width="64" height="64"/></clipPath></defs><g class="e20091d8-5cd8-4fc6-97bc-34f6a53a9fd6"><path style="fill:#888;" d="M28.29,61a25,25,0,0,1-4.05-.3,2.46,2.46,0,0,1-1.83-1.63L20.8,53.51a2.8,2.8,0,0,0-1.06-1.36l-5.86-3.38a2.67,2.67,0,0,0-1.69-.22L6.67,50a2.48,2.48,0,0,1-2.33-.73A28,28,0,0,1,.16,42.1a2.47,2.47,0,0,1,.5-2.39l4.15-4.33a2.76,2.76,0,0,0,.64-1.6V27a2.6,2.6,0,0,0-.65-1.57L.66,21.31a2.43,2.43,0,0,1-.52-2.38A31.86,31.86,0,0,1,2,15.27a30.47,30.47,0,0,1,2.33-3.49A2.48,2.48,0,0,1,6.61,11l5.9,1.45a2.69,2.69,0,0,0,1.7-.24l5.86-3.38a2.67,2.67,0,0,0,1-1.35L22.6,1.93A2.4,2.4,0,0,1,24.4.29a27.62,27.62,0,0,1,8.22,0A2.42,2.42,0,0,1,34.41,2L35.89,7.5a2.67,2.67,0,0,0,1,1.35l5.86,3.38a2.63,2.63,0,0,0,1.68.22L50,11a2.44,2.44,0,0,1,2.33.73,27.84,27.84,0,0,1,4.3,7.48,2.46,2.46,0,0,1-.54,2.39L52.2,25.45A2.66,2.66,0,0,0,51.55,27v6.76a2.72,2.72,0,0,0,.65,1.58l3.94,3.94a2.46,2.46,0,0,1,.54,2.38,29.28,29.28,0,0,1-2,4,29,29,0,0,1-2.32,3.5,2.44,2.44,0,0,1-2.33.73l-5.24-1.4a2.67,2.67,0,0,0-1.69.22l-5.86,3.38a2.71,2.71,0,0,0-1,1.35l-1.46,5.44A2.48,2.48,0,0,1,33,60.61h0A25.92,25.92,0,0,1,28.29,61ZM12.68,47.49a3.62,3.62,0,0,1,1.7.41l5.86,3.39a3.67,3.67,0,0,1,1.52,1.94l1.61,5.56a1.48,1.48,0,0,0,1,.92,27.08,27.08,0,0,0,8.38-.08h0a1.49,1.49,0,0,0,1-.94l1.46-5.45a3.65,3.65,0,0,1,1.5-2l5.86-3.39a3.64,3.64,0,0,1,2.45-.32L50.31,49a1.42,1.42,0,0,0,1.3-.41,29.64,29.64,0,0,0,2.23-3.36,30,30,0,0,0,1.9-3.87,1.5,1.5,0,0,0-.3-1.35l-3.95-3.94a3.6,3.6,0,0,1-.94-2.28V27a3.64,3.64,0,0,1,.94-2.28l3.89-3.88a1.48,1.48,0,0,0,.3-1.34,26.75,26.75,0,0,0-4.12-7.17,1.45,1.45,0,0,0-1.31-.41l-5.52,1.48a3.57,3.57,0,0,1-2.44-.33L36.43,9.71a3.59,3.59,0,0,1-1.5-2L33.45,2.24a1.43,1.43,0,0,0-1-.93,26.61,26.61,0,0,0-7.87,0,1.4,1.4,0,0,0-1,.92l-1.5,5.56a3.54,3.54,0,0,1-1.5,2l-5.86,3.38a3.68,3.68,0,0,1-2.44.35L6.37,12a1.5,1.5,0,0,0-1.32.43,31.07,31.07,0,0,0-2.22,3.35,29.61,29.61,0,0,0-1.75,3.51,1.41,1.41,0,0,0,.29,1.32l4.14,4.14A3.64,3.64,0,0,1,6.45,27v6.76a3.73,3.73,0,0,1-.92,2.29L1.38,40.4a1.47,1.47,0,0,0-.28,1.35,26.44,26.44,0,0,0,4,6.9,1.41,1.41,0,0,0,1.3.41l5.52-1.48A3,3,0,0,1,12.68,47.49Zm15.72-3a14,14,0,1,1,14-14A14,14,0,0,1,28.4,44.53Zm0-27.06a13,13,0,1,0,13,13A13,13,0,0,0,28.4,17.47Z"/><path style="fill:#888;" d="M28.29,60.87a25.85,25.85,0,0,1-4.11-.31,4.3,4.3,0,0,1-3.29-3l-1.51-5.17s-.07-.07-.12-.11l-5.37-3.1s0,0-.09,0L8.74,50.61A4.27,4.27,0,0,1,4.5,49.27,27.7,27.7,0,0,1,.26,42a4.32,4.32,0,0,1,.9-4.33l3.86-4s0-.1,0-.16V27.27s0,0-.06-.08L1.2,23.4a4.23,4.23,0,0,1-1-4.35,29.26,29.26,0,0,1,1.84-3.71A31.23,31.23,0,0,1,4.44,11.8a4.32,4.32,0,0,1,4.21-1.37l5.48,1.35s.1,0,.15,0l5.3-3.07a.41.41,0,0,0,.1-.13l1.37-5.1a4.24,4.24,0,0,1,3.3-3,27.69,27.69,0,0,1,8.33,0,4.26,4.26,0,0,1,3.27,3l1.36,5a.6.6,0,0,0,.09.13l5.32,3.07.16,0,5-1.36a4.28,4.28,0,0,1,4.24,1.33,28.05,28.05,0,0,1,4.36,7.58,4.31,4.31,0,0,1-1,4.34L52,27.19a.67.67,0,0,0-.07.18v6.18s0,0,.06.07l3.61,3.61a4.29,4.29,0,0,1,1,4.33,30.43,30.43,0,0,1-2,4.1,31.86,31.86,0,0,1-2.36,3.53A4.28,4.28,0,0,1,48,50.54l-4.8-1.29-.18,0-5.3,3.06-.1.15-1.33,5a4.31,4.31,0,0,1-3.23,3h0A26.57,26.57,0,0,1,28.29,60.87Zm-2.88-4a25.3,25.3,0,0,0,6.33-.07L33,52.05a5.63,5.63,0,0,1,2.46-3.2l5.69-3.28a5.59,5.59,0,0,1,4-.53l4.51,1.21c.39-.54,1-1.48,1.61-2.51a29.91,29.91,0,0,0,1.48-2.91l-3.42-3.42a5.61,5.61,0,0,1-1.54-3.72V27.12a5.61,5.61,0,0,1,1.54-3.72L52.7,20a25.27,25.27,0,0,0-3.08-5.36L44.82,16a5.6,5.6,0,0,1-4-.53l-5.69-3.29A5.61,5.61,0,0,1,32.68,9L31.4,4.15a24.46,24.46,0,0,0-5.8,0L24.31,9a5.64,5.64,0,0,1-2.45,3.2l-5.69,3.28a5.71,5.71,0,0,1-4,.56L7,14.72A28.64,28.64,0,0,0,5.4,17.26c-.57,1-1.05,2-1.33,2.55L7.66,23.4A5.59,5.59,0,0,1,9.2,27.12v6.57a5.77,5.77,0,0,1-1.48,3.7l-3.65,3.8a24.17,24.17,0,0,0,3,5.14L11.85,45a5.65,5.65,0,0,1,4,.53l5.69,3.28A5.7,5.7,0,0,1,24,52ZM25,55.63h0Zm12.64-3.26h0ZM7.45,15.28h0ZM8.27,15ZM19.65,8.62h0Zm0,0h0Zm17.66,0h0ZM28.4,44.85A14.35,14.35,0,1,1,42.75,30.5,14.37,14.37,0,0,1,28.4,44.85Zm0-24.42A10.07,10.07,0,1,0,38.47,30.5,10.08,10.08,0,0,0,28.4,20.43Z"/></g></svg></a></div></div></div>';

                                                            dApp.web3_1_0.eth.getBalance(global_state.account, function (error, eth_balance) {
                                                                if (error) {
                                                                    console.log(error);
                                                                } else {
                                                                    eth_balance = new Decimal(projectData.utils.fromWei(eth_balance));

                                                                    if (window.localStorage.getItem('keystore_file') != null) {
                                                                        //cached keystore path on mobile device or cached keystore file on browser
                                                                        transaction_popup_html += '<div class="container-fluid"><div class="row padding-top-25 cached-keystore-file"><div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">'+$('.translates-holder').attr('password-label')+'</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"></div></div><div class="btn-container col-xs-12"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">'+$('.translates-holder').attr('confirm')+'</a></div></div></div>';
                                                                        basic.showDialog(transaction_popup_html, 'transaction-confirmation-popup', true);
                                                                        projectData.general_logic.bindTxSettings(visibleGasPriceNumber, nonce);

                                                                        $('.cached-keystore-file .confirm-transaction.keystore-file').click(function () {
                                                                            var eth_fee_check;
                                                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                                eth_fee_check = parseFloat($('.transaction-confirmation-popup .confirm-row.fee .value .eth-value').html());
                                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                                var crypto_val_decimal = new Decimal(crypto_val);
                                                                                eth_fee_check = crypto_val_decimal.plus(parseFloat($('.transaction-confirmation-popup .confirm-row.fee .value .eth-value').html()));
                                                                            }

                                                                            if (eth_balance.lessThan(eth_fee_check)) {
                                                                                basic.showAlert($('.translates-holder').attr('no-balance'), '', true);
                                                                                $('.transaction-confirmation-popup .on-change-result').html('');
                                                                            } else {
                                                                                if ($('.cached-keystore-file #your-secret-key-password').val().trim() == '') {
                                                                                    basic.showAlert($('.translates-holder').attr('valid-password'), '', true);
                                                                                } else {
                                                                                    showLoader($('.translates-holder').attr('hold-on'));

                                                                                    setTimeout(function () {
                                                                                        decryptKeystore(window.localStorage.getItem('keystore_file'), $('.cached-keystore-file #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                                                                            if (success) {
                                                                                                submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, success);
                                                                                            } else if (error) {
                                                                                                basic.showAlert(error_message, '', true);
                                                                                                hideLoader();
                                                                                            }
                                                                                        });
                                                                                    }, 2000);
                                                                                }
                                                                            }
                                                                        });
                                                                    } else {
                                                                        //nothing is cached
                                                                        transaction_popup_html += '<div class="container-fluid proof-of-address padding-top-20 padding-bottom-20"> <div class="row fs-0"> <div class="col-xs-12 col-sm-5 inline-block padding-left-30 padding-left-xs-15 priv-key-btn"> <a href="javascript:void(0)" class="light-blue-white-btn text-center enter-private-key display-block-important fs-18 fs-xs-14 line-height-18"><span>'+$('.translates-holder').attr('enter-priv-key')+'</span></a> </div><div class="col-xs-12 col-sm-2 text-center calibri-bold fs-20 fs-xs-16 inline-block or-label">or</div><div class="col-xs-12 col-sm-5 inline-block padding-right-30 padding-right-xs-15 keystore-btn"><div class="upload-file-container" data-id="upload-keystore-file"><input type="file" id="upload-keystore-file" class="custom-upload-keystore-file hide-input"/> <div class="btn-wrapper"></div></div></div></div><div class="row on-change-result"></div></div>';
                                                                        basic.showDialog(transaction_popup_html, 'transaction-confirmation-popup', true);
                                                                        projectData.general_logic.bindTxSettings(visibleGasPriceNumber, nonce);

                                                                        //init private key btn logic
                                                                        $(document).on('click', '.enter-private-key', function () {
                                                                            var eth_fee_check;
                                                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                                eth_fee_check = parseFloat($('.transaction-confirmation-popup .confirm-row.fee .value .eth-value').html());
                                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                                var crypto_val_decimal = new Decimal(crypto_val);
                                                                                eth_fee_check = crypto_val_decimal.plus(parseFloat($('.transaction-confirmation-popup .confirm-row.fee .value .eth-value').html()));
                                                                            }

                                                                            if (eth_balance.lessThan(eth_fee_check)) {
                                                                                basic.showAlert($('.translates-holder').attr('no-balance'), '', true);
                                                                                $('.transaction-confirmation-popup .on-change-result').html('');
                                                                            } else {
                                                                                $('.proof-of-address #upload-keystore-file').val('');
                                                                                $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-20"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-private-key">'+$('.translates-holder').attr('your-priv-key')+'</label><input type="text" id="your-private-key" maxlength="64" class="full-rounded"/></div></div><div class="btn-container col-xs-12"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction private-key">'+$('.translates-holder').attr('confirm-btn')+'</a></div>');

                                                                                $('#your-private-key').focus();
                                                                                $('label[for="your-private-key"]').addClass('active-label');

                                                                                $('.confirm-transaction.private-key').click(function () {
                                                                                    if ($('.proof-of-address #your-private-key').val().trim() == '') {
                                                                                        basic.showAlert($('.translates-holder').attr('enter-priv-key-error'), '', true);
                                                                                    } else {
                                                                                        showLoader($('.translates-holder').attr('hold-on'));

                                                                                        setTimeout(function () {
                                                                                            var validating_private_key = validatePrivateKey($('.proof-of-address #your-private-key').val().trim());
                                                                                            if (validating_private_key.success) {
                                                                                                if (projectData.utils.checksumAddress(validating_private_key.success.address) == projectData.utils.checksumAddress(global_state.account)) {
                                                                                                    submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, new Buffer($('.proof-of-address #your-private-key').val().trim(), 'hex'));
                                                                                                } else {
                                                                                                    basic.showAlert($('.translates-holder').attr('key-related'), '', true);
                                                                                                    hideLoader();
                                                                                                }
                                                                                            } else if (validating_private_key.error) {
                                                                                                basic.showAlert(validating_private_key.message, '', true);
                                                                                                hideLoader();
                                                                                            }
                                                                                        }, 2000);
                                                                                    }
                                                                                });
                                                                            }
                                                                        });

                                                                        //init keystore btn logic
                                                                        styleKeystoreUploadBtnForTx(function (key) {
                                                                            var eth_fee_check;
                                                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                                eth_fee_check = parseFloat($('.transaction-confirmation-popup .confirm-row.fee .value .eth-value').html());
                                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                                var crypto_val_decimal = new Decimal(crypto_val);
                                                                                eth_fee_check = crypto_val_decimal.plus(parseFloat($('.transaction-confirmation-popup .confirm-row.fee .value .eth-value').html()));
                                                                            }

                                                                            if (eth_balance.lessThan(eth_fee_check)) {
                                                                                basic.showAlert($('.translates-holder').attr('no-balance'), '', true);
                                                                                $('.transaction-confirmation-popup .on-change-result').html('');
                                                                                hideLoader();
                                                                            } else {
                                                                                submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, key);
                                                                            }
                                                                        });
                                                                    }
                                                                    hideLoader();
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });

                        $('.section-amount-to .edit-address').click(function () {
                            $('.section-amount-to').hide();
                            window.scrollTo(0, 0);
                            $('.section-send').fadeIn(500);
                        });
                    }
                }, 500);
            }
        },
        spend_page_dental_services: function () {
            projectData.utils.saveHybridAppCurrentScreen();
            if (iframeHeightListenerInit) {
                iframeHeightListenerInit = false;

                window.addEventListener('message', function(event) {
                    var height = event.data.data.height;

                    console.log(height, 'height');
                    if(event.data.event_id === 'iframe_size_event' && (height != undefined && height > 0)){
                        $('.main-wrapper iframe').height(height + 50);
                    }
                });
            }

            showMobileAppBannerForDesktopBrowsers();
        },
        spend_page_gift_cards: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            showMobileAppBannerForDesktopBrowsers();

            if (!bidali_lib_loaded) {
                //loading bidali lib for buying tickets with DCN api
                showLoader();
                $.getScript('https://wallet.dentacoin.com/assets/libs/bidali/bidali-commerce.js', function () {
                    bidali_lib_loaded = true;
                    hideLoader();
                    bidaliWidgetInit();
                });
            } else {
                bidaliWidgetInit();
            }

            function bidaliWidgetInit() {
                $('.buy-gift-cards').click(function () {
                    if (is_hybrid && basic.getMobileOperatingSystem() == 'iOS') {
                        window.open('https://wallet.dentacoin.com/spend-gift-cards?show-vouchers=true', '_system');
                        return false;
                    } else {
                        bidaliSdk.Commerce.render({
                            apiKey: config_variable.bidali_api_key,
                            paymentCurrencies: ['DCN']
                        });
                    }
                });

                var get_params = getGETParameters();
                if (basic.property_exists(get_params, 'show-vouchers')) {
                    $('.buy-gift-cards').click();
                }
            }
        },
        spend_page_exchanges: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            showMobileAppBannerForDesktopBrowsers();
            showLoader();

            //getting exchanges from dentacoin.com DB
            $.ajax({
                type: 'GET',
                url: 'https://dentacoin.com/info/exchanges',
                dataType: 'json',
                success: function (response) {
                    var exchanges = response;

                    var exchanges_html = '';
                    for (var i = 0, len = exchanges.length; i < len; i += 1) {
                        exchanges_html += '<li><a href="' + exchanges[i].link + '" target="_blank" class="data-external-link">• ' + exchanges[i].title + '</a></li>';
                    }

                    $('.camping-for-exchanges').html(exchanges_html);
                    updateExternalURLsForiOSDevice();

                    hideLoader();
                }
            });
        },
        spend_page_assurance_fees: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            showMobileAppBannerForDesktopBrowsers();

            /*if (is_hybrid) {
                $('.camp-assurance-mobile-phone-scanning').html('<div class="padding-top-15 padding-bottom-20 fs-16 max-width-600 margin-0-auto">You can handle all Dentacoin Assurance contract actions - such as contract creation or cancellation for patients or contact approvals and withdrawals for dentists - directly from here!</div><div class="text-center padding-bottom-30"><a href="javascript:void(0)" class="light-blue-white-btn no-hover open-transaction-scanner min-width-270 margin-right-10 margin-bottom-10 width-xs-100 max-width-400 margin-right-xs-0 padding-left-5 padding-right-5 fs-18 text-center">SCAN TRANSACTION <figure itemscope="" itemtype="http://schema.org/ImageObject" class="inline-block max-width-30 width-100 margin-left-5"><img src="assets/images/scan-qr-code-blue.svg" alt="Scan icon"/></figure></a></div>');

                if ((window.localStorage.getItem('current_account') == null && typeof(web3) === 'undefined') || (window.localStorage.getItem('current_account') == null && window.localStorage.getItem('custom_wallet_over_external_web3_provider') == 'true')) {
                    $('.open-transaction-scanner').click(function () {
                        window.scrollTo(0, 0);
                        initAccountChecker();

                        if (!dApp.loaded) {
                            dApp.init();
                        }
                    });
                } else {
                    executeGlobalLogic();
                    initScan($('.open-transaction-scanner'), null, function (content) {
                        var content = decodeURIComponent(content);

                        if (basic.isJsonString(content)) {
                            var scanObject = JSON.parse(content);

                            if (projectData.utils.checksumAddress(global_state.account) != projectData.utils.checksumAddress(scanObject[2])) {
                                basic.showAlert('You are trying to scan Assurance transaction which is not related to your Dentacoin Wallet Address.', '', true);
                                return false
                            }

                            $.ajax({
                                type: 'POST',
                                url: 'https://assurance.dentacoin.com/get-scanning-data',
                                data: {
                                    slug: scanObject[3]
                                },
                                dataType: 'json',
                                success: async function (response) {
                                    if (response.success) {
                                        var dcnValue = await projectData.requests.convertUsdToDcn(response.data.usd);

                                        function scanningRouter(key) {
                                            if (scanObject[4] == 'approval-creation') {
                                                assuranceTransactions.approval(scanObject[1], key, function (signedUnsubmittedTransactionApproval) {
                                                    assuranceTransactions.creation(response.data.dentist, response.data.usd, dcnValue, response.data.next_transfer, response.data.ipfs_hash, scanObject[1], key, function (signedUnsubmittedTransaction) {

                                                        $.ajax({
                                                            type: 'POST',
                                                            url: 'https://assurance.dentacoin.com/submit-assurance-transaction',
                                                            dataType: 'json',
                                                            data: {
                                                                slug: scanObject[3],
                                                                to_status: 'awaiting-approval',
                                                                patient_address: projectData.utils.checksumAddress(global_state.account),
                                                                dentist_address: projectData.utils.checksumAddress(response.data.dentist),
                                                                signedUnsubmittedTransactionApproval: signedUnsubmittedTransactionApproval,
                                                                signedUnsubmittedTransaction: signedUnsubmittedTransaction,
                                                                wallet_signed: true,
                                                                network: $('#main-container').attr('network')
                                                            },
                                                            success: function (response) {
                                                                hideLoader();
                                                                basic.closeDialog();
                                                                if (response.success) {
                                                                    basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                    firePushNotification('Assurance transaction', 'Contract created successfully.');
                                                                } else {
                                                                    basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                                                }
                                                            }
                                                        });
                                                    }, true);
                                                });
                                            } else if (scanObject[4] == 'creation') {
                                                assuranceTransactions.creation(response.data.dentist, response.data.usd, dcnValue, response.data.next_transfer, response.data.ipfs_hash, scanObject[1], key, function (signedUnsubmittedTransaction) {
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: 'https://assurance.dentacoin.com/submit-assurance-transaction',
                                                        dataType: 'json',
                                                        data: {
                                                            slug: scanObject[3],
                                                            to_status: 'awaiting-approval',
                                                            patient_address: projectData.utils.checksumAddress(global_state.account),
                                                            dentist_address: projectData.utils.checksumAddress(response.data.dentist),
                                                            signedUnsubmittedTransaction: signedUnsubmittedTransaction,
                                                            wallet_signed: true,
                                                            network: $('#main-container').attr('network')
                                                        },
                                                        success: function (response) {
                                                            hideLoader();
                                                            basic.closeDialog();
                                                            if (response.success) {
                                                                basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                firePushNotification('Assurance transaction', 'Contract created successfully.');
                                                            } else {
                                                                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                                            }
                                                        }
                                                    });
                                                });
                                            } else if (scanObject[4] == 'dentist-approval') {
                                                assuranceTransactions.dentist_approval(response.data.patient, scanObject[1], key, function (signedUnsubmittedTransaction) {
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: 'https://assurance.dentacoin.com/submit-assurance-transaction',
                                                        dataType: 'json',
                                                        data: {
                                                            slug: scanObject[3],
                                                            to_status: 'active',
                                                            patient_address: projectData.utils.checksumAddress(response.data.patient),
                                                            dentist_address: projectData.utils.checksumAddress(global_state.account),
                                                            signedUnsubmittedTransaction: signedUnsubmittedTransaction,
                                                            wallet_signed: true,
                                                            network: $('#main-container').attr('network')
                                                        },
                                                        success: function (response) {
                                                            hideLoader();
                                                            basic.closeDialog();
                                                            if (response.success) {
                                                                basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                firePushNotification('Assurance transaction', 'Contract approved successfully.');
                                                            } else {
                                                                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                                            }
                                                        }
                                                    });
                                                });
                                            } else if (scanObject[4] == 'active-withdraw') {
                                                assuranceTransactions.withdraw(response.data.patient, scanObject[1], key, function (signedUnsubmittedTransaction) {
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: 'https://assurance.dentacoin.com/submit-assurance-transaction',
                                                        dataType: 'json',
                                                        data: {
                                                            slug: scanObject[3],
                                                            to_status: 'active-withdraw',
                                                            patient_address: projectData.utils.checksumAddress(response.data.patient),
                                                            dentist_address: projectData.utils.checksumAddress(global_state.account),
                                                            signedUnsubmittedTransaction: signedUnsubmittedTransaction,
                                                            wallet_signed: true,
                                                            network: $('#main-container').attr('network')
                                                        },
                                                        success: function (response) {
                                                            hideLoader();
                                                            basic.closeDialog();
                                                            if (response.success) {
                                                                basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                firePushNotification('Assurance transaction', 'Successful withdraw.');
                                                            } else {
                                                                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                                            }
                                                        }
                                                    });
                                                });
                                            } else if (scanObject[4] == 'cancel') {
                                                assuranceTransactions.cancel(response.data.patient, response.data.dentist, scanObject[1], key, function (signedUnsubmittedTransaction) {
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: 'https://assurance.dentacoin.com/submit-assurance-transaction',
                                                        dataType: 'json',
                                                        data: {
                                                            slug: scanObject[3],
                                                            to_status: 'cancelled',
                                                            patient_address: projectData.utils.checksumAddress(response.data.patient),
                                                            dentist_address: projectData.utils.checksumAddress(response.data.dentist),
                                                            type: scanObject[5],
                                                            reason: scanObject[6],
                                                            signedUnsubmittedTransaction: signedUnsubmittedTransaction,
                                                            wallet_signed: true,
                                                            network: $('#main-container').attr('network')
                                                        },
                                                        success: function (response) {
                                                            hideLoader();
                                                            basic.closeDialog();
                                                            if (response.success) {
                                                                basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                firePushNotification('Assurance transaction', 'Contract cancelled successfully.');
                                                            } else {
                                                                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        }

                                        var transactionPopupTitle = '';
                                        var transactionPopupExtraHtml = '';
                                        if (scanObject[4] == 'approval-creation' || scanObject[4] == 'creation') {
                                            transactionPopupTitle = 'Activate Autopayments';
                                            transactionPopupExtraHtml = '<div class="dcn-amount">-' + dcnValue + ' DCN</div><div class="usd-amount">=$' + response.data.usd + '</div>';
                                        } else if (scanObject[4] == 'dentist-approval') {
                                            transactionPopupTitle = 'Approve Contract';
                                        } else if (scanObject[4] == 'active-withdraw') {
                                            transactionPopupTitle = 'Withdraw Now';
                                        } else if (scanObject[4] == 'cancel') {
                                            transactionPopupTitle = 'Cancel Contract';
                                        }

                                        var transaction_popup_html = '<div class="title">' + transactionPopupTitle + '</div><div class="pictogram-and-dcn-usd-price"><svg version="1.1" class="width-100 max-width-100 margin-bottom-10" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100.1 100" style="enable-background:new 0 0 100.1 100;" xml:space="preserve"><style type="text/css">.st0-recipe{fill:#FFFFFF;}.st1-recipe{fill:#CA675A;}.st2-recipe{fill:none;stroke:#CA675A;stroke-width:2.8346;stroke-linecap:round;stroke-miterlimit:10;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="100" width="105.7" x="-7.2" y="-6.4"></sliceSourceBounds></sfw></metadata><circle class="st0-recipe" cx="50" cy="50" r="50"/><g><g><g><path class="st1-recipe" d="M50.1,93.7c-18.7,0-36-12.4-41.3-31.3C2.4,39.6,15.8,16,38.5,9.6C48.9,6.7,60,7.8,69.6,12.8c1.2,0.6,1.6,2,1,3.2s-2,1.6-3.2,1c-8.6-4.4-18.4-5.4-27.7-2.8c-20.1,5.6-32,26.7-26.3,46.9s26.7,32.1,46.9,26.4s32.1-26.7,26.4-46.9c-1.1-3.9-2.8-7.6-5-10.9c-0.7-1.1-0.4-2.6,0.7-3.3c1.1-0.7,2.6-0.4,3.3,0.7c2.5,3.8,4.4,7.9,5.6,12.3c6.4,22.8-7,46.5-29.7,52.8C57.8,93.2,53.9,93.7,50.1,93.7z"/></g><g><path class="st1-recipe" d="M33.1,78.6c-0.5,0-1-0.2-1.5-0.5c-1-0.8-1.2-2.3-0.4-3.4l40.4-50.5c0.8-1,2.3-1.2,3.4-0.4c1,0.8,1.2,2.3,0.4,3.4L35,77.7C34.5,78.3,33.8,78.6,33.1,78.6z"/></g><g><g><path class="st2-recipe" d="M105.7,56.9"/></g></g></g><g><path class="st1-recipe" d="M73.7,54.2c-0.1,0-0.2,0-0.2,0c-1.3-0.2-2.3-1.4-2.2-2.7L74,23.9L47.6,39.8c-1.1,0.7-2.6,0.3-3.3-0.8c-0.7-1.1-0.3-2.6,0.8-3.3l34.5-20.8L76.1,52C76,53.2,74.9,54.2,73.7,54.2z"/></g></g></svg>' + transactionPopupExtraHtml + '</div></div><div class="confirm-row from"> <div class="label inline-block">From:</div><div class="value inline-block">' + global_state.account + '</div></div><div class="confirm-row fee"> <div class="label inline-block">Ether fee:</div><div class="value inline-block">' + parseFloat(scanObject[0]).toFixed(8) + '</div></div>';

                                        if (window.localStorage.getItem('keystore_file') != null) {
                                            //cached keystore path on mobile device or cached keystore file on browser
                                            transaction_popup_html += '<div class="container-fluid"><div class="row padding-top-25 cached-keystore-file"><div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">'+$('.translates-holder').attr('password-label')+'</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"></div></div><div class="btn-container col-xs-12"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">Confirm</a></div></div></div>';
                                            basic.showDialog(transaction_popup_html, 'transaction-confirmation-popup', true);

                                            $('.cached-keystore-file .confirm-transaction.keystore-file').click(function () {
                                                if ($('.cached-keystore-file #your-secret-key-password').val().trim() == '') {
                                                    basic.showAlert($('.translates-holder').attr('valid-password'), '', true);
                                                } else {
                                                    showLoader($('.translates-holder').attr('hold-on'));

                                                    setTimeout(function () {
                                                        decryptKeystore(window.localStorage.getItem('keystore_file'), $('.cached-keystore-file #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                                            if (success) {
                                                                scanningRouter(success);
                                                            } else if (error) {
                                                                basic.showAlert(error_message, '', true);
                                                                hideLoader();
                                                            }
                                                        });
                                                    }, 2000);
                                                }
                                            });
                                        } else {
                                            //nothing is cached
                                            transaction_popup_html += '<div class="container-fluid proof-of-address padding-top-20 padding-bottom-20"> <div class="row fs-0"> <div class="col-xs-12 col-sm-5 inline-block padding-left-30 padding-left-xs-15 priv-key-btn"> <a href="javascript:void(0)" class="light-blue-white-btn text-center enter-private-key display-block-important fs-18 fs-xs-14 line-height-18"><span>'+$('.translates-holder').attr('enter-priv-key')+'</span></a> </div><div class="col-xs-12 col-sm-2 text-center calibri-bold fs-20 inline-block">or</div><div class="col-xs-12 col-sm-5 inline-block padding-right-30 padding-right-xs-15 keystore-btn"> <div class="upload-file-container" data-id="upload-keystore-file"><input type="file" id="upload-keystore-file" class="custom-upload-keystore-file hide-input"/> <div class="btn-wrapper"></div></div></div></div><div class="row on-change-result"></div></div>';
                                            basic.showDialog(transaction_popup_html, 'transaction-confirmation-popup', true);

                                            //init private key btn logic
                                            $(document).on('click', '.enter-private-key', function () {
                                                $('.proof-of-address #upload-keystore-file').val('');
                                                $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-20"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-private-key">'+$('.translates-holder').attr('your-priv-key')+'</label><input type="text" id="your-private-key" maxlength="64" class="full-rounded" maxlength="64"/></div></div><div class="btn-container col-xs-12"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction private-key">'+$('.translates-holder').attr('confirm-btn')+'</a></div>');

                                                $('#your-private-key').focus();
                                                $('label[for="your-private-key"]').addClass('active-label');

                                                $('.confirm-transaction.private-key').click(function () {
                                                    if ($('.proof-of-address #your-private-key').val().trim() == '') {
                                                        basic.showAlert($('.translates-holder').attr('enter-priv-key-error'), '', true);
                                                    } else {
                                                        showLoader($('.translates-holder').attr('hold-on'));

                                                        setTimeout(function () {
                                                            var validating_private_key = validatePrivateKey($('.proof-of-address #your-private-key').val().trim());
                                                            if (validating_private_key.success) {
                                                                if (projectData.utils.checksumAddress(validating_private_key.success.address) == projectData.utils.checksumAddress(global_state.account)) {
                                                                    scanningRouter(new Buffer($('.proof-of-address #your-private-key').val().trim(), 'hex'));
                                                                } else {
                                                                    basic.showAlert('Please enter private key related to your Wallet Address.', '', true);
                                                                    hideLoader();
                                                                }
                                                            } else if (validating_private_key.error) {
                                                                basic.showAlert(validating_private_key.message, '', true);
                                                                hideLoader();
                                                            }
                                                        }, 2000);
                                                    }
                                                });
                                            });

                                            //init keystore btn logic
                                            styleKeystoreUploadBtnForTx(function (key) {
                                                scanningRouter(key);
                                            });
                                        }
                                    } else {
                                        basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                    }
                                }
                            });
                        } else {
                            basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                        }
                    });
                }

            }*/
        }
    },
    general_logic: {
        bindTxSettings: function(visibleGasPriceNumber, nonce) {
            $('.tx-settings-icon').click(async function () {
                basic.showDialog('<div class="lato-bold fs-22 text-center padding-top-30 padding-bottom-20">'+$('.translates-holder').attr('advanced-settings')+'</div><div class="padding-bottom-15 form-row"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label class="active-label" for="edit-gas-price">'+$('.translates-holder').attr('gas-price')+'</label><input type="text" id="edit-gas-price" maxlength="5" class="full-rounded light-blue-border" value="'+$('.tx-data-holder').attr('data-visibleGasPriceNumber')+'" data-value="'+$('.tx-data-holder').attr('data-visibleGasPriceNumber')+'"/></div></div><div class="padding-bottom-20 form-row"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label class="active-label" for="edit-nonce">'+$('.translates-holder').attr('nonce')+'</label><input type="text" id="edit-nonce" maxlength="10" class="full-rounded light-blue-border" value="'+$('.tx-data-holder').attr('data-nonce')+'" data-value="'+$('.tx-data-holder').attr('data-nonce')+'" data-min-value="'+nonce+'"/></div></div><div class="fs-0 btns-container"><div class="inline-block fs-18 lato-bold width-50"><a href="javascript:void(0);" class="reset-settings"><img alt="Reset icon" itemprop="contentUrl" src="assets/images/reset-icon.svg" class="width-100 max-width-20"/> '+$('.translates-holder').attr('reset')+'</a></div><div class="inline-block text-right width-50"><a href="javascript:void(0);" class="white-light-blue-btn light-blue-border save-tx-settings padding-left-30 padding-right-30">'+$('.translates-holder').attr('save-btn')+'</a></div></div>', 'tx-settings-popup', null, true);

                $('.tx-settings-popup #edit-nonce').on('input paste change', function() {
                    if (!/^\d*$/.test($(this).val().trim())) {
                        $('.tx-settings-popup #edit-nonce').val($('.tx-settings-popup #edit-nonce').attr('data-value'));
                    } else {
                        if (parseInt($(this).val().trim()) > parseInt($('.tx-settings-popup #edit-nonce').attr('data-min-value'))) {
                            $('.tx-settings-popup #edit-nonce').closest('.form-row').find('.error-handle').remove();
                        }
                    }
                });

                $('.tx-settings-popup #edit-gas-price').on('input paste change', function() {
                    if (!$.isNumeric($(this).val().trim()) && $(this).val().trim() != '') {
                        $('.tx-settings-popup #edit-gas-price').val($('.tx-settings-popup #edit-gas-price').attr('data-value'));
                    } else {
                        $('.tx-settings-popup #edit-nonce').closest('.form-row').find('.error-handle').remove();
                        if (parseFloat($('.tx-data-holder').attr('data-initial-visibleGasPriceNumber')) > parseFloat($(this).val().trim())) {
                            $('.tx-settings-popup #edit-gas-price').closest('.form-row').find('.warning-handle').remove();
                            customWarningHandle($('.tx-settings-popup #edit-gas-price').closest('.form-row'), $('.translates-holder').attr('low-gas'))
                        } else {
                            $('.tx-settings-popup #edit-gas-price').closest('.form-row').find('.warning-handle').remove();
                        }
                    }
                });

                $('.tx-settings-popup .reset-settings').click(function() {
                    $('.tx-settings-popup #edit-gas-price').val($('.tx-data-holder').attr('data-initial-visibleGasPriceNumber'));
                    $('.tx-settings-popup #edit-nonce').val($('.tx-data-holder').attr('data-initial-nonce'));

                    $('.transaction-confirmation-popup .fee').removeClass('changed-settings');
                });

                $('.tx-settings-popup .save-tx-settings').click(function() {
                    if ($('.tx-settings-popup #edit-gas-price').val().trim() == '') {
                        customErrorHandle($('.tx-settings-popup #gas-price').closest('.form-row'), $('.translates-holder').attr('enter-gas'));
                    } else if (parseInt($('.tx-settings-popup #edit-nonce').val().trim()) < parseInt($('.tx-settings-popup #edit-nonce').attr('data-min-value'))) {
                        customErrorHandle($('.tx-settings-popup #edit-nonce').closest('.form-row'), $('.translates-holder').attr('cant-submit'));
                    } else {
                        $('.transaction-confirmation-popup .on-change-result').html('');

                        $('.tx-data-holder').attr('data-nonce', parseInt($('.tx-settings-popup #edit-nonce').val().trim()));
                        $('.transaction-confirmation-popup .confirm-row.nonce .value').html(parseInt($('.tx-settings-popup #edit-nonce').val().trim()));

                        $('.tx-data-holder').attr('data-visibleGasPriceNumber', $('.tx-settings-popup #edit-gas-price').val().trim());
                        $('.tx-data-holder').attr('data-on_popup_load_gas_price', parseInt($('.tx-settings-popup #edit-gas-price').val().trim()) * 1000000000);

                        var eth_fee = projectData.utils.fromWei(((parseInt($('.tx-settings-popup #edit-gas-price').val().trim()) * 1000000000) * parseInt($('.tx-data-holder').attr('data-gasLimit'))).toString(), 'ether');
                        $('.transaction-confirmation-popup .confirm-row.fee .value .eth-value').html(parseFloat(eth_fee).toFixed(8));

                        if (parseFloat($('.tx-settings-popup #edit-gas-price').val().trim()) != parseFloat($('.tx-data-holder').attr('data-initial-visibleGasPriceNumber')) || parseInt($('.tx-settings-popup #edit-nonce').val().trim()) != parseInt($('.tx-data-holder').attr('data-initial-nonce'))) {
                            $('.transaction-confirmation-popup .fee').addClass('changed-settings');
                        } else {
                            $('.transaction-confirmation-popup .fee').removeClass('changed-settings');
                        }

                        $('.tx-settings-popup').modal('hide');
                    }
                });
            });
        },
        addDCNTokenToMetamask: async function() {
            if (window.localStorage.getItem('dcn_token_added_to_metamask') == null) {
                try {
                    const wasAdded = await ethereum.request({
                        method: 'wallet_watchAsset',
                        params: {
                            type: 'ERC20', // Initially only supports ERC20, but eventually more!
                            options: {
                                address: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6', // The address that the token is at.
                                symbol: 'DCN', // A ticker symbol or shorthand, up to 5 chars.
                                decimals: 0, // The number of decimals in the token
                                image: 'https://dentacoin.com/assets/images/logo.svg', // A string url of the token logo
                            },
                        },
                    });

                    if (wasAdded) {
                        window.localStorage.setItem('dcn_token_added_to_metamask', true);
                        console.log('DCN token added successfully.');
                    } else {
                        window.localStorage.setItem('dcn_token_added_to_metamask', false);
                        console.log('User does not want to add DCN token.');
                    }
                } catch (error) {
                    console.log(error, 'addDCNTokenToMetamask');
                }
            }
        },
        generatePrivateKeyFile: function(privateKey) {
            var QRCode = require('qrcode');
            QRCode.toDataURL(privateKey, function (err, url) {
                console.log(url, 'url');
                proceedWithPrinting('<img src="' + url + '" style=" height: auto; width: 160px;">');
            });

            function proceedWithPrinting(qrCodeBase64Data) {
                var borderImage = '';
                var borderStyle = 'height: 95vh';
                var printingHtml;
                if (is_hybrid) {
                    if (basic.getMobileOperatingSystem() == 'Android') {
                        borderImage = 'src="assets/images/private-key-background.png"';
                        borderStyle = 'height: 97.5vh';

                        printingHtml = '<html><head><style>body, html {margin: 0; padding: 0;text-align: center;color: black;font-family: “Helvetica Neue”,Helvetica,Arial,sans-serif;} .border-parent{text-align: left;position:relative; display: inline-block;} img {'+borderStyle+'} .absolute-content{position: absolute;z-index: 100;width: 80%;height: 80%;top: 0;left: 0;padding: 10%;}</style></head><body><div class="border-parent"><img '+borderImage+' id="border-image"/><div class="absolute-content"><div style="text-align:center;"><i>'+$('.translates-holder').attr('confidential')+'</i><h1 style="margin-top: 10px;font-weight:bold;color: black; margin-bottom: 10px;">DENTACOIN</h1><div style="font-size: 16px;color: #2a3575;padding-bottom: 15px;"><b>'+$('.translates-holder').attr('unlock-funds')+'</b></div><div style="background-color: white;padding: 20px 10px;text-align: left;"><div style="color: #888888;padding-bottom: 5px;font-weight: bold;">'+$('.translates-holder').attr('pk-label')+':</div><div style="font-size: 12px;">'+privateKey+'</div></div><div style="font-size: 18px;padding: 30px 0 10px;"><b>'+$('.translates-holder').attr('pk-as-qr')+'</b></div><div>'+qrCodeBase64Data+'</div><div style=" text-align: left; "><div style="font-size: 17px;color: #2a3575;padding-bottom: 15px;padding-top: 20px;font-weight: bold;">'+$('.translates-holder').attr('important')+'</div><div style=" padding-bottom: 15px;"><b>1.</b> '+$('.translates-holder').attr('provides')+'<div></div>'+projectData.utils.checksumAddress(window.localStorage.getItem('current_account'))+'</div><div style=" padding-bottom: 15px;"><b>2.</b> '+$('.translates-holder').attr('secure-place')+'</div><div style=" padding-bottom: 15px;"><b>3. '+$('.translates-holder').attr('never-share')+'</div><div><b>4.</b> '+$('.translates-holder').attr('to-unlock')+'</div></div></div></div></div></body></html>';
                    } else if (basic.getMobileOperatingSystem() == 'iOS') {
                        //borderImage = 'src="https://dentacoin.com/assets/uploads/private-key-background.png"';
                        showLoader();
                        borderImage = 'src="data:image/png;base64,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"';
                        console.log(borderImage, 'borderImage 123');
                        borderStyle = 'width: 100%';

                        printingHtml = '<html><head><style>body, html {margin: 0; padding: 0;text-align: center;color: black;font-family: “Helvetica Neue”,Helvetica,Arial,sans-serif;} .border-parent{text-align: left;position:relative; display: inline-block;} img {'+borderStyle+'} .absolute-content{position: absolute;z-index: 100;width: 80%;height: 80%;top: 0;left: 0;padding: 10%;}</style></head><body><div class="border-parent"><img '+borderImage+' id="border-image"/><div class="absolute-content"><div style="text-align:center;"><i>'+$('.translates-holder').attr('confidential')+'</i><h1 style="margin-top: 15px;font-weight:bold;color: black; margin-bottom: 10px;">DENTACOIN</h1><div style="font-size: 18px;color: #2a3575;padding-bottom: 15px;"><b>'+$('.translates-holder').attr('unlock-funds')+'</b></div><div style="background-color: white;padding: 20px 10px;text-align: left;"><div style="color: #888888;padding-bottom: 5px;font-weight: bold;">'+$('.translates-holder').attr('pk-label')+':</div><div style="font-size: 14px;">'+privateKey+'</div></div><div style="font-size: 22px;padding: 30px 0 10px;"><b>'+$('.translates-holder').attr('pk-as-qr')+'</b></div><div>'+qrCodeBase64Data+'</div><div style=" text-align: left; "><div style="font-size: 20px;color: #2a3575;padding-bottom: 15px;padding-top: 20px;font-weight: bold;">'+$('.translates-holder').attr('important')+'</div><div style=" padding-bottom: 15px;"><b>1.</b> '+$('.translates-holder').attr('provides')+'<div></div>'+projectData.utils.checksumAddress(window.localStorage.getItem('current_account'))+'</div><div style=" padding-bottom: 15px;"><b>2.</b> '+$('.translates-holder').attr('secure-place')+'</div><div style=" padding-bottom: 15px;"><b>3. '+$('.translates-holder').attr('never-share')+'</div><div><b>4.</b> '+$('.translates-holder').attr('to-unlock')+'</div></div></div></div></div></body></html>';
                    }
                }

                if (is_hybrid) {
                    if (basic.getMobileOperatingSystem() == 'iOS') {
                        console.log('timeout');
                        setTimeout(function() {
                            cordova.plugins.printer.print(printingHtml, {
                                paper: {
                                    name: 'IsoA4'
                                },
                                pageCount: 1,
                                margin: {
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0
                                }
                            }, function() {
                                hideLoader();
                            });
                        }, 2000);
                    } else {
                        cordova.plugins.printer.print(printingHtml, {
                            paper: {
                                name: 'IsoA4'
                            },
                            pageCount: 1,
                            margin: {
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0
                            }
                        });
                    }
                } else {
                    var mywindow = window.open('', 'PRINT');
                    mywindow.document.write(printingHtml);

                    var imgTag = mywindow.document.getElementById('border-image');
                    var newImg = new Image;
                    newImg.onload = function() {
                        imgTag.src = this.src;

                        setTimeout(function() {
                            mywindow.document.close(); // necessary for IE >= 10
                            mywindow.focus(); // necessary for IE >= 10*/

                            mywindow.print();
                            mywindow.close();

                            return true;
                        }, 1000);
                    };
                    newImg.src = '/assets/images/private-key-background.png';
                }
            }
        }
    },
    requests: {
        getGasPrice: async function () {
            return await $.getJSON('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=' + config_variable.etherscan_api_key);
        },
        getDentacoinDataByCoingeckoProvider: async function (callback) {
            $.ajax({
                type: 'GET',
                url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
                dataType: 'json',
                success: function (response) {
                    callback(response.market_data.current_price.usd);
                },
                error: function() {
                    hideLoader();
                    alert($('.translates-holder').attr('smth-went-wrong') + ' (Code error 10.0).');
                }
            });
        },
        /*getDentacoinDataByExternalProvider: async function (callback) {
            /!*$.ajax({
                type: 'GET',
                url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
                dataType: 'json',
                success: function(response) {
                    callback(response);
                }
            });*!/

            if (callback != undefined) {
                $.ajax({
                    type: 'GET',
                    url: 'https://indacoin.com/api/GetCoinConvertAmount/USD/DCN/100/dentacoin',
                    dataType: 'json',
                    success: function (response) {
                        if (response > 0) {
                            callback(projectData.utils.prepareDcnPrice(response));
                        } else {
                            // callback to coingecko price reader if indacoin fails
                            $.ajax({
                                type: 'GET',
                                url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
                                dataType: 'json',
                                success: function (response) {
                                    callback(response.market_data.current_price.usd);
                                },
                                error: function() {
                                    hideLoader();
                                    alert($('.translates-holder').attr('smth-went-wrong') + ' (Code error 10.0).');
                                }
                            });
                        }
                    }
                });
            } else {
                var ajaxResponse = await $.ajax({
                    type: 'GET',
                    url: 'https://indacoin.com/api/GetCoinConvertAmount/USD/DCN/100/dentacoin',
                    dataType: 'json'
                });

                if (ajaxResponse > 0) {
                    return projectData.utils.prepareDcnPrice(ajaxResponse);
                } else {
                    // callback to coingecko price reader if indacoin fails
                    var coingeckoAjaxResponse = await $.ajax({
                        type: 'GET',
                        url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
                        dataType: 'json'
                    });

                    return coingeckoAjaxResponse.market_data.current_price.usd;
                }
            }
        },*/
        getEthereumDataByCoingecko: function(callback) {
            $.ajax({
                type: 'GET',
                url: 'https://api.coingecko.com/api/v3/coins/ethereum',
                dataType: 'json',
                success: function (response) {
                    callback(response);
                },
                error: function() {
                    hideLoader();
                    alert($('.translates-holder').attr('smth-went-wrong') + ' (Code error 10.1).');
                }
            });
        },
        getCryptoDataByIndacoin: function(cryptocurrency_symbol, usd_value, callback) {
            $.ajax({
                type: 'GET',
                url: 'https://indacoin.com/api/GetCoinConvertAmount/USD/' + cryptocurrency_symbol + '/'+usd_value+'/dentacoin',
                dataType: 'json',
                success: function (response) {
                    if (cryptocurrency_symbol == 'DCN') {
                        indacoin_data.dcn = {
                            value: response,
                            timestamp: Date.now() + 600 * 1000
                        }
                    } else if (cryptocurrency_symbol == 'ETH') {
                        indacoin_data.eth = {
                            value: response,
                            timestamp: Date.now() + 600 * 1000
                        }
                    }
                    callback(indacoin_data);
                },
                error: function() {
                    hideLoader();
                    alert($('.translates-holder').attr('smth-went-wrong') + ' (Code error 10.2).');
                }
            });
        },
        getMinimumUsdValueFromIndacoin: function(callback) {
            $.ajax({
                type: 'GET',
                url: 'https://indacoin.com/api/GetCoinConvertAmount/btc/usd/0.001',
                dataType: 'json',
                success: function (response) {
                    callback(response);
                },
                error: function() {
                    hideLoader();
                    alert($('.translates-holder').attr('smth-went-wrong') + ' (Code error 10.3).');
                }
            });
        },
        convertUsdToDcn: async function (usd_val) {
            var ajaxResponse = await $.ajax({
                type: 'GET',
                url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
                dataType: 'json'
            });

            /*var ajaxResponse = await $.ajax({
                type: 'GET',
                url: 'https://indacoin.com/api/GetCoinConvertAmount/USD/DCN/100/dentacoin',
                dataType: 'json'
            });*/

            if (ajaxResponse > 0) {
                return Math.floor((Math.floor(ajaxResponse.market_data.current_price.usd) / 100) * usd_val);
            } else {
                // callback to coingecko price reader if indacoin fails
                var coingeckoAjaxResponse = await $.ajax({
                    type: 'GET',
                    url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
                    dataType: 'json'
                });

                return Math.floor((Math.floor(coingeckoAjaxResponse.market_data.current_price.usd) / 100) * usd_val);
            }
        }
    },
    utils: {
        innerAddressCheck: function (address) {
            return dApp.web3_1_0.utils.isAddress(address);
        },
        fromWei: function (wei_amount, type) {
            if (type != undefined) {
                return dApp.web3_1_0.utils.fromWei(wei_amount, type);
            } else {
                return dApp.web3_1_0.utils.fromWei(wei_amount);
            }
        },
        toWei: function (eth_amount, unit) {
            if (unit == undefined) {
                unit = 'ether';
            }
            return dApp.web3_1_0.utils.toWei(eth_amount, unit);
        },
        checksumAddress: function (address) {
            if (address.length == 40) {
                address = '0x' + address;
            }
            return dApp.web3_1_0.utils.toChecksumAddress(address);
        },
        sortByKey: function (array, key) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];

                if (typeof x == "string") {
                    x = ("" + x).toLowerCase();
                }
                if (typeof y == "string") {
                    y = ("" + y).toLowerCase();
                }
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },
        substr_replace: function (str, replace, start, length) {
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
        },
        prepareDcnPrice: function (price) {
            return 1 / parseInt(parseInt(price) / 100);
        },
        saveHybridAppCurrentScreen: function () {
            if (is_hybrid && isDeviceReady && lastHybridScreen != $('title').html()) {
                lastHybridScreen = $('title').html();
                cordova.plugins.firebase.analytics.setCurrentScreen($('title').html());
            }
        }
    }
};

function styleKeystoreUploadBtnForTx(callback) {
    $('.custom-upload-keystore-file').each(function () {
        var this_btn_vanilla = this;
        var this_btn = $(this_btn_vanilla);

        var this_btn_parent = this_btn.closest('.upload-file-container');
        this_btn_parent.find('.btn-wrapper').append("<label for='" + this_btn_parent.attr('data-id') + "'  role='button' class='light-blue-white-btn display-block-important custom-upload-keystore-file-label'><span class='display-block-important fs-18 fs-xs-14 text-center'>"+$('.translates-holder').attr('upload-backup')+"</span> <div class='fs-16 fs-xs-12'>"+$('.translates-holder').attr('recommended')+"</div></label>");

        if (is_hybrid) {
            // MOBILE APP
            $('.custom-upload-keystore-file-label').removeAttr('for');
            $('.custom-upload-keystore-file-label').click(function () {
                if (basic.getMobileOperatingSystem() == 'Android') {
                    fileChooser.open(function (file_uri) {
                        androidFileUpload(file_uri, function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function () {
                                var keystore_string = this.result;
                                proceedWithTransactionFiringAfterHavingTheKeystoreFile(keystore_string);
                            };

                            reader.readAsText(file);
                        });
                    }, function (err) {
                        console.log(err);
                        alert($('.translates-holder').attr('upload-failed'));
                    });
                } else if (basic.getMobileOperatingSystem() == 'iOS') {
                    iOSFileUpload(function (keystore_string) {
                        proceedWithTransactionFiringAfterHavingTheKeystoreFile(keystore_string);
                    });
                }
            });

            function proceedWithTransactionFiringAfterHavingTheKeystoreFile(keystore_string) {
                if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && projectData.utils.checksumAddress(JSON.parse(keystore_string).address) == projectData.utils.checksumAddress(global_state.account)) {
                    $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="fs-14 light-gray-color text-center padding-bottom-10 padding-top-15 file-name">' + fileEntry.name + '</div><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">'+$('.translates-holder').attr('password-label')+'</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"/></div></div><div class="col-xs-12"><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-tx-sign" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-tx-sign"><span class="padding-left-5 padding-right-5 inline-block">'+$('.translates-holder').attr('remember-file')+'</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block tx-sign-more-info-keystore-remember fs-0" data-content="'+$('.translates-holder').attr('remembering-file')+'"><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div></div><div class="btn-container col-xs-12 padding-top-25"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">'+$('.translates-holder').attr('confirm')+'</a></div>');

                    $('.tx-sign-more-info-keystore-remember').popover({
                        trigger: 'click'
                    });

                    $('.confirm-transaction.keystore-file').click(function () {
                        if ($('.proof-of-address #your-secret-key-password').val().trim() == '') {
                            basic.showAlert($('.translates-holder').attr('valid-password'), '', true);
                        } else {
                            showLoader($('.translates-holder').attr('hold-on'));

                            setTimeout(function () {
                                decryptKeystore(keystore_string, $('.proof-of-address #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                    if (success) {
                                        if ($('.proof-of-address #agree-to-cache-tx-sign').is(':checked')) {
                                            window.localStorage.setItem('keystore_file', keystore_string);
                                        }

                                        callback(success);
                                    } else if (error) {
                                        basic.showAlert(error_message, '', true);
                                        hideLoader();
                                    }
                                });
                            }, 2000);
                        }
                    });
                } else {
                    basic.showAlert('Please upload valid secret file.', '', true);
                }
            }
        } else {
            // BROWSER
            this_btn_vanilla.addEventListener('change', function (e) {
                var fileName = '';
                if (this.files && this.files.length > 1) {
                    fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                } else {
                    fileName = e.target.value.split('\\').pop();
                }

                if (this_btn.attr('id') == 'upload-keystore-file') {
                    var uploaded_file = this.files[0];
                    var reader = new FileReader();
                    reader.addEventListener('load', function (e) {
                        if (basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address') && projectData.utils.checksumAddress(JSON.parse(e.target.result).address) == projectData.utils.checksumAddress(global_state.account)) {
                            var keystore_string = e.target.result;
                            $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5"><div class="fs-14 light-gray-color text-center padding-bottom-10 padding-top-15 file-name">' + fileName + '</div><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">'+$('.translates-holder').attr('password-label')+'</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"/></div></div><div class="col-xs-12"><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-tx-sign" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-tx-sign"><span class="padding-left-5 padding-right-5 inline-block">'+$('.translates-holder').attr('remember-file')+'</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block tx-sign-more-info-keystore-remember fs-0" data-content="'+$('.translates-holder').attr('remembering-file')+'"><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div></div><div class="btn-container col-xs-12 padding-top-25"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">'+$('.translates-holder').attr('confirm-btn')+'</a></div>');

                            $('.tx-sign-more-info-keystore-remember').popover({
                                trigger: 'click'
                            });

                            $('#your-secret-key-password').focus();
                            $('label[for="your-secret-key-password"]').addClass('active-label');

                            $('.confirm-transaction.keystore-file').click(function () {
                                if ($('.proof-of-address #your-secret-key-password').val().trim() == '') {
                                    basic.showAlert($('.translates-holder').attr('valid-password'), '', true);
                                } else {
                                    showLoader($('.translates-holder').attr('hold-on'));

                                    setTimeout(function () {
                                        decryptKeystore(keystore_string, $('.proof-of-address #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                            if (success) {
                                                if ($('.proof-of-address #agree-to-cache-tx-sign').is(':checked')) {
                                                    window.localStorage.setItem('keystore_file', keystore_string);
                                                }

                                                callback(success);
                                            } else if (error) {
                                                basic.showAlert(error_message, '', true);
                                                hideLoader();
                                            }
                                        });
                                    }, 2000);
                                }
                            });
                        } else {
                            $('#upload-keystore-file').val('');
                            basic.showAlert($('.translates-holder').attr('backup-for-wallet'), '', true);
                        }
                    });
                    reader.readAsBinaryString(uploaded_file);
                }
            });
            // Firefox bug fix
            this_btn_vanilla.addEventListener('focus', function () {
                this_btn.classList.add('has-focus');
            });
            this_btn_vanilla.addEventListener('blur', function () {
                this_btn.classList.remove('has-focus');
            });
        }
    });
}

//method to sign and submit transaction to blockchain
function submitTransactionToBlockchain(function_abi, symbol, token_val, receiver, key) {
    const EthereumTx = require('ethereumjs-tx');
    var transaction_obj = {
        gasLimit: dApp.web3_1_0.utils.toHex($('.tx-data-holder').attr('data-gasLimit')),
        gasPrice: dApp.web3_1_0.utils.toHex($('.tx-data-holder').attr('data-on_popup_load_gas_price')),
        from: global_state.account,
        nonce: dApp.web3_1_0.utils.toHex($('.tx-data-holder').attr('data-nonce')),
        chainId: 1
    };

    //function_abi is when we want to add logic into our transaction (mostly when iteracting with contracts)
    if (function_abi != 'undefined') {
        transaction_obj.data = function_abi;
    }

    var token_label;
    if (symbol == 'DCN') {
        transaction_obj.to = dApp.contract_address;
        token_label = 'Dentacoin tokens';
    } else if (symbol == 'ETH') {
        transaction_obj.to = receiver;
        transaction_obj.value = dApp.web3_1_0.utils.toHex(projectData.utils.toWei(token_val.toString()));
        token_label = 'Ethers';
    }

    const tx = new EthereumTx(transaction_obj);
    //signing the transaction
    tx.sign(key);
    //submit the transaction
    dApp.web3_1_0.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (err, transactionHash) {
        hideLoader();
        basic.closeDialog();

        var pending_history_transaction;
        if (symbol == 'DCN') {
            projectData.requests.getDentacoinDataByCoingeckoProvider(function (request_response) {
                pending_history_transaction += buildDentacoinHistoryTransaction(request_response, token_val, receiver, global_state.account, Math.round((new Date()).getTime() / 1000), transactionHash, true);

                fireGoogleAnalyticsEvent('Pay', 'Next', 'DCN', token_val);
                displayMessageOnTransactionSend(token_label, transactionHash);

                $('.transaction-history tbody').prepend(pending_history_transaction);

                $('.search-field #search').val('');
                $('.section-amount-to').hide();
                $('.section-send').fadeIn(500);
                $('#search').val('');

                firePushNotification('Dentacoin transaction', token_val + ' DCN sent successfully.');
            });
        } else if (symbol == 'ETH') {
            projectData.requests.getEthereumDataByCoingecko(function (request_response) {
                pending_history_transaction += buildEthereumHistoryTransaction(request_response, token_val, receiver, global_state.account, Math.round((new Date()).getTime() / 1000), transactionHash, true);

                fireGoogleAnalyticsEvent('Pay', 'Next', 'ETH in USD', Math.floor(parseFloat(token_val) * request_response.market_data.current_price.usd));
                displayMessageOnTransactionSend(token_label, transactionHash);

                $('.transaction-history tbody').prepend(pending_history_transaction);

                $('.search-field #search').val('');
                $('.section-amount-to').hide();
                $('.section-send').fadeIn(500);

                firePushNotification('Ethereum transaction', token_val + ' ETH sent successfully.');
            });
        }
    });
}

function displayMessageOnTransactionSend(token_label, tx_hash) {
    window.scrollTo(0, 0);
    $('.section-amount-to #crypto-amount').val('').trigger('change');
    $('.section-amount-to #usd-val').val('').trigger('change');
    $('.section-amount-to #verified-receiver-address').prop('checked', false);

    basic.showAlert('<div class="padding-top-15 padding-bottom-10 fs-16">' + $('.translates-holder').attr('your') + token_label + $('.translates-holder').attr('the-way') + ' <a href="https://etherscan.io/tx/' + tx_hash + '" target="_blank" class="lato-bold color-light-blue data-external-link">Etherscan</a>.</div>', '', true);
    updateExternalURLsForiOSDevice();
}

//method for 'refreshing' the mobile app
window.refreshApp = function () {
    console.log(22);
    $('.account-checker-container').addClass('hide').removeClass('visible');
    basic.closeDialog();
    hideLoader();

    $('.custom-auth-popup .on-page-load').removeClass('hide');
    $('.custom-auth-popup .on-option-selected').addClass('custom-hide');
    $('.custom-auth-popup .nav-steps').addClass('custom-hide');
    $('.custom-auth-popup .popup-body').addClass('hide');
    $('.custom-auth-popup .popup-left .popup-element').removeClass('hide');
    $('.custom-auth-popup .popup-left .popup-element.second').addClass('hide');
    $('.custom-auth-popup .popup-left .popup-element.third').addClass('hide');
    $('.custom-auth-popup .popup-header .nav-steps').removeClass('second-step third-step').addClass('first-step');

    if (!$('.settings-popup').hasClass('hide')) {
        $('body').removeClass('overflow-hidden');
        $('.settings-popup').addClass('hide');
    }

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

    executeGlobalLogic();
    initAccountChecker();
    window.scrollTo(0, 0);

    if ($('.main-holder app-homepage').length) {
        dApp.init(function () {
            projectData.pages.homepage();
        });
    } else {
        dApp.init();
    }
};

window.getHomepageData = function () {
    console.log('getHomepageData');
    executeGlobalLogic();
    initAccountChecker();

    if (!dApp.loaded) {
        dApp.init(function () {
            loadHomepageData();
        });
    } else {
        loadHomepageData();
    }

    function loadHomepageData() {
        if ($.isReady) {
            //called on route change
            projectData.pages.homepage();
        } else {
            //called on page init
            $(document).ready(function () {
                projectData.pages.homepage();
            });
        }
    }
};

window.getBuyPageData = function () {
    executeGlobalLogic();
    removeAccountChecker();

    if (!dApp.loaded) {
        dApp.init();
    }

    if ($.isReady) {
        //called on route change
        projectData.pages.buy_page();
    } else {
        //called on page init
        $(document).ready(function () {
            projectData.pages.buy_page();
        });
    }
};

window.getSendPageData = function () {
    executeGlobalLogic();
    initAccountChecker();

    if (!dApp.loaded) {
        dApp.init(function () {
            loadSendPageData();
        });
    } else {
        loadSendPageData();
    }

    function loadSendPageData() {
        if ($.isReady) {
            //called on route change
            projectData.pages.send_page();
        } else {
            //called on page init
            $(document).ready(function () {
                projectData.pages.send_page();
            });
        }
    }
};

window.getSpendPageDentalServices = function () {
    executeGlobalLogic();
    removeAccountChecker();

    if (!dApp.loaded) {
        dApp.init();
    }

    if ($.isReady) {
        //called on route change
        projectData.pages.spend_page_dental_services();
    } else {
        //called on page init
        $(document).ready(function () {
            projectData.pages.spend_page_dental_services();
        });
    }
};

/*window.getSpendPageGiftCards = function () {
    executeGlobalLogic();
    removeAccountChecker();

    if (!dApp.loaded) {
        dApp.init();
    }

    if ($.isReady) {
        //called on route change
        projectData.pages.spend_page_gift_cards();
    } else {
        //called on page init
        $(document).ready(function () {
            projectData.pages.spend_page_gift_cards();
        });
    }
};*/

window.getSpendPageExchanges = function () {
    executeGlobalLogic();
    removeAccountChecker();

    if (!dApp.loaded) {
        dApp.init();
    }

    if ($.isReady) {
        //called on route change
        projectData.pages.spend_page_exchanges();
    } else {
        //called on page init
        $(document).ready(function () {
            projectData.pages.spend_page_exchanges();
        });
    }
};

window.getSpendPageAssuranceFees = function () {
    executeGlobalLogic();
    removeAccountChecker();

    if (!dApp.loaded) {
        dApp.init();
    }

    if ($.isReady) {
        //called on route change
        projectData.pages.spend_page_assurance_fees();
    } else {
        //called on page init
        $(document).ready(function () {
            projectData.pages.spend_page_assurance_fees();
        });
    }
};

window.initdApp = function () {
    if (!dApp.loaded) {
        dApp.init();
    }
};

//loading mobile bottom fixed navigation IF mobile
function loadMobileBottomFixedNav() {
    if (basic.isMobile()) {
        //if iOS adding space to bottom fixed mobile nav, because iPhones X, XS and so on have their home button inside the screen
        if (basic.getMobileOperatingSystem() == 'iOS') {
            $('.camp-for-fixed-mobile-nav').addClass('padding-bottom-20');
        }
        $('.camp-for-fixed-mobile-nav').fadeIn(1000);
    }
}

//styling google alike inputs
function bindGoogleAlikeButtonsEvents() {
    //google alike style for label/placeholders
    $('body').on('click', '.custom-google-label-style label', function () {
        $(this).addClass('active-label');
        if ($('.custom-google-label-style').attr('data-input-light-blue-border') == 'true') {
            $(this).parent().find('input, textarea').addClass('light-blue-border');
        }
    });

    $('body').on('keyup change focusout', '.custom-google-label-style input, .custom-google-label-style textarea', function () {
        var value = $(this).val().trim();
        if (value.length) {
            $(this).closest('.custom-google-label-style').find('label').addClass('active-label');
            if ($(this).closest('.custom-google-label-style').attr('data-input-light-blue-border') == 'true') {
                $(this).addClass('light-blue-border');
            }
        } else {
            $(this).closest('.custom-google-label-style').find('label').removeClass('active-label');
            if ($(this).closest('.custom-google-label-style').attr('data-input-light-blue-border') == 'true') {
                $(this).removeClass('light-blue-border');
            }
        }
    });
}

bindGoogleAlikeButtonsEvents();

var mobileAppBannerForDesktopBrowsersHtml = '<div class="container-fluid"><div class="row"><figure itemscope="" itemtype="http://schema.org/ImageObject" class="col-xs-3 inline-block-bottom"><img src="assets/images/left-hand-with-phone.png" alt="Left hand holding phone"/></figure><div class="col-xs-6 inline-block-bottom text-center padding-bottom-20"><h3 class="fs-30 fs-md-24 padding-bottom-10 color-white mobile-app-banner-title renew-on-lang-switch" data-slug="also-available"></h3><div><figure itemscope="" itemtype="http://schema.org/ImageObject" class="inline-block padding-right-10"><a href="https://play.google.com/store/apps/details?id=wallet.dentacoin.com" target="_blank"><img src="assets/images/google-play-badge.svg" class="width-100 max-width-150" itemprop="logo" alt="Google play icon"/></a></figure><figure itemscope="" itemtype="http://schema.org/ImageObject" class="inline-block padding-left-10"><a href="https://apps.apple.com/us/app/dentacoin-wallet/id1478732657" target="_blank"><img src="assets/images/app-store.svg" class="width-100 max-width-150" itemprop="logo" alt="App store icon"/></a></figure></div></div><figure itemscope="" itemtype="http://schema.org/ImageObject" class="col-xs-3 inline-block-bottom text-right"><img src="assets/images/right-hand-with-phone.png" alt="Right hand holding phone"/></figure></div></div>';

function executeGlobalLogic() {
    if ($('#main-container').attr('network') == 'mainnet' && assurance_config == undefined) {
        var {assurance_config_temp} = require('./assurance_config_mainnet');
        assurance_config = assurance_config_temp;
    } else if ($('#main-container').attr('network') == 'rinkeby' && assurance_config == undefined) {
        var {assurance_config_temp} = require('./assurance_config_rinkeby');
        assurance_config = assurance_config_temp;
    }
    // variable to track if the wallet is loaded as mobile application
    // is_hybrid = $('#main-container').attr('hybrid') == 'true';
    $('body').addClass('hybrid-app');

    $('.nav-row .nav-link').removeClass('active');
    $('.camp-for-fixed-mobile-nav a').removeClass('active');

    /*if (is_hybrid && basic.getMobileOperatingSystem() == 'iOS' && window.localStorage.getItem('keystore_file_ios_saved') == null) {
        setTimeout(function() {
            $('.ios-camper').html('<div class="ios-reminder-for-downloading-keystore-file"> <div class="white-bg container padding-top-30 padding-bottom-30"><div class="row"><div class="col-xs-12"> <div class="padding-bottom-15 color-warning-red fs-16"><img src="assets/images/attention-icon.svg" alt="Warning icon" class="warning-icon"/> <span class=" renew-on-lang-switch" data-slug="export">'+$('.translates-holder').attr('export')+'</span></div><div class="custom-google-label-style margin-bottom-15 margin-top-20 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="ios-camper-download-keystore-password" class="renew-on-lang-switch" data-slug="pass-label">'+$('.translates-holder').attr('pass-label')+'</label><input type="password" id="ios-camper-download-keystore-password" class="full-rounded"></div><div class="text-center padding-top-10 padding-bottom-30"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border fs-xs-18 width-xs-100 ios-camper-download-keystore-action renew-on-lang-switch" data-slug="export-btn">'+$('.translates-holder').attr('export-btn')+'</a></div><div style="display: none" class="text-center fs-18 hidden-checkbox"><input type="checkbox" id="keystore-downloaded-verifier"> <label for="keystore-downloaded-verifier" class="lato-bold blinking-animation renew-on-lang-switch" data-slug="i-verify">'+$('.translates-holder').attr('i-verify')+'</label></div></div></div></div></div>');
            $('#main-container').addClass('full-visual-height');

            $('.ios-camper .ios-camper-download-keystore-action').click(function () {
                showLoader($('.translates-holder').attr('hold-on-decrypt'));

                setTimeout(function () {
                    importKeystoreFile(window.localStorage.getItem('keystore_file'), $('.ios-camper #ios-camper-download-keystore-password').val().trim(), function (success, public_key, address, error, error_message) {
                        if (success) {
                            hideLoader();
                            window.plugins.socialsharing.share(window.localStorage.getItem('keystore_file'));
                            $('#ios-camper-download-keystore-password').val('');

                            $('.ios-camper .hidden-checkbox').fadeIn(500);
                            $('#keystore-downloaded-verifier').change(function() {
                                if($(this).is(':checked')) {
                                    window.localStorage.setItem('keystore_file_ios_saved', true);
                                    $('.ios-camper').html('');
                                    $('#main-container').removeClass('full-visual-height');
                                }
                            });
                        } else if (error) {
                            hideLoader();
                            basic.showAlert(error_message, '', true);
                        }
                    });
                }, 2000);
            });
        }, 2000);
    }*/
}

//checking if metamask or if saved current_account in the local storage. If both are false then show custom login popup with CREATE / IMPORT logic
function initAccountChecker() {
    setTimeout(function() {
        if ($('.account-checker-container').hasClass('visible')) {
            return;
        }

        hideMobileAppBannerForDesktopBrowsers();

        if (is_hybrid) {
            // opening the external links in app browser
            $(document).on('click', '.data-external-link', function () {
                event.preventDefault();
                cordova.InAppBrowser.open($(this).attr('href'), '_blank', inAppBrowserSettings);
            });
        }

        if ((window.localStorage.getItem('current_account') == null && typeof(web3) === 'undefined') || (window.localStorage.getItem('current_account') == null && window.localStorage.getItem('custom_wallet_over_external_web3_provider') == 'true')) {
            $('.account-checker-container').addClass('visible').removeClass('hide');

            if (!is_hybrid) {
                if (!basic.isMobile()) {
                    $('.account-checker-wrapper').append('<div class="mobile-app-banner padding-top-50">' + mobileAppBannerForDesktopBrowsersHtml + '</div>');
                }
            }
            updateExternalURLsForiOSDevice();

            $(window).on('load', function () {
                if ($('.custom-auth-popup .modal-content').height() > $('.custom-auth-popup .modal-dialog').height()) {
                    $('.custom-auth-popup .modal-content').addClass('clear-center-position');
                }
            });

            $('.custom-auth-popup .navigation-link a').click(function () {
                $('.custom-auth-popup .on-page-load').addClass('hide');
                $('.custom-auth-popup .on-option-selected').removeClass('custom-hide');

                if ($(this).attr('data-slug') == 'first') {
                    $('.custom-auth-popup .nav-steps').removeClass('custom-hide');

                    $('#keystore-file-pass').focus();
                    $('label[for="keystore-file-pass"]').addClass('active-label');

                    $('.download-login-file .btn-text').html($('.translates-holder').attr('download-login-file')).addClass('renew-on-lang-switch').attr('data-slug', 'download-login-file');
                }

                $('.custom-auth-popup .popup-body').addClass('hide');
                $('.custom-auth-popup .popup-body.' + $(this).attr('data-slug')).removeClass('hide');
            });

            $('.custom-auth-popup .go-back-to-main-menu').click(function () {
                $('.custom-auth-popup .on-page-load').removeClass('hide');
                $('.custom-auth-popup .on-option-selected').addClass('custom-hide');
                $('.custom-auth-popup .nav-steps').addClass('custom-hide');

                $('.custom-auth-popup .popup-body').addClass('hide');
            });

            $('.more-info-keystore-remember').popover({
                trigger: 'click'
            });

            // ================================= IMPORTING ==========================================
            $(document).on('click', '.refresh-import-init-page', function () {
                $('.camping-for-action').html('').show();
                $('.import-keystore-file-row #upload-keystore').val('');
                $('.import-keystore-file-row').show();
                $('.or-label').show();
                $('.import-private-key-row').html('<a href="javascript:void(0);" class="import-private-key light-blue-white-btn fs-16 fs-xs-14 renew-on-lang-switch" data-slug="import-key">'+$('.translates-holder').attr('import-key')+'</a>').show();
            });

            //importing with private key
            $(document).on('click', '.import-private-key', function () {
                $('.camping-for-action').hide();
                $('.import-keystore-file-row').hide();
                $('.or-label').hide();
                $('.import-private-key-row').html('<div class="field-parent"><div class="custom-google-label-style module text-left max-width-400 margin-0-auto" data-input-light-blue-border="true"><label for="import-private-key" class="renew-on-lang-switch" data-slug="priv-key">'+$('.translates-holder').attr('priv-key')+'</label><textarea id="import-private-key" maxlength="64" class="full-rounded"></textarea></div></div><div class="padding-top-10"><a class="inline-block max-width-80 scan-qr-code-importing-priv-key" href="javascript:void(0)"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img alt="Scan QR code icon" class="width-100" itemprop="contentUrl" src="assets/images/scan-qr-code.svg"></figure></a></div><div class="continue-btn-priv-key padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border renew-on-lang-switch" data-slug="CONTINUE-btn">'+$('.translates-holder').attr('CONTINUE-btn')+'</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block renew-on-lang-switch" data-slug="go-back">'+$('.translates-holder').attr('go-back')+'</span></a></div>');
                $('#import-private-key').focus();
                $('label[for="import-private-key"]').addClass('active-label');

                initScan($('.scan-qr-code-importing-priv-key'), $('#import-private-key'), function () {
                    $('#import-private-key').focus();
                    $('label[for="import-private-key"]').addClass('active-label');
                });

                $('.continue-btn-priv-key > a').unbind().click(function () {
                    $('.import-private-key-row .error-handle').remove();

                    showLoader();
                    setTimeout(function () {
                        var validate_private_key = validatePrivateKey($('#import-private-key').val().trim());
                        if (validate_private_key.success) {
                            var internet = navigator.onLine;
                            if (internet) {
                                savePublicKeyToAssurance(validate_private_key.success.address, validate_private_key.success.public_key);
                            }
                            setTimeout(function () {
                                window.localStorage.setItem('current_account', validate_private_key.success.address);
                                fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

                                if (is_hybrid) {
                                    if (basic.getMobileOperatingSystem() == 'iOS') {
                                        window.localStorage.setItem('keystore_file_ios_saved', true);
                                        if ($('.ios-camper .ios-reminder-for-downloading-keystore-file').length) {
                                            $('.ios-camper .ios-reminder-for-downloading-keystore-file').remove();
                                        }
                                    }

                                    refreshApp();
                                    //navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog:"Wait,Loading App", loadUrlTimeoutValue: 60000});
                                } else {
                                    window.location.reload();
                                }
                            }, 500);
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

            /*var passwordWarningShow = true;
            $('.popup-left .required-field').on('change keyup focusout paste', function() {
                if (passwordWarningShow) {
                    passwordWarningShow = false;

                    if (is_hybrid && basic.getMobileOperatingSystem() == 'iOS') {
                        $('.custom-auth-popup .popup-left .wallet-creation-warning').addClass('max-width-300 margin-left-right-auto').html('<div class="color-warning-red fs-14 lato-bold">Keep your password and backup file safe!<br>NOBODY CAN RESET THEM IF LOST.</div><div class="padding-bottom-15 fs-14">To access your wallet, you need both the password and the backup file which you must export on the next step or from the Settings.</div>');
                    } else {
                        $('.custom-auth-popup .popup-left .wallet-creation-warning').addClass('max-width-300 margin-left-right-auto').html('<div class="color-warning-red fs-14 lato-bold">Keep your password and backup file safe!<br>NOBODY CAN RESET THEM IF LOST.</div><div class="padding-bottom-15 fs-14">To access your wallet, you need both the password and the backup file which will be automatically downloaded on your device.</div>');
                    }
                }
            });*/

            var tempPrivKey;
            var tempAddress;
            $('.custom-auth-popup .popup-left .download-login-file').unbind().click(function () {
                var login_errors = false;
                $('.popup-left .error-handle').remove();
                var login_fields = $('.popup-left .required-field');

                for (var i = 0, len = login_fields.length; i < len; i += 1) {
                    if (login_fields.eq(i).val().trim() == '') {
                        customErrorHandle(login_fields.eq(i).closest('.field-parent'), $('.translates-holder').attr('enter-pass'));
                        login_errors = true;
                    } else if (login_fields.eq(i).val().trim().length < 8 || login_fields.eq(i).val().trim().length > 30) {
                        customErrorHandle(login_fields.eq(i).closest('.field-parent'), $('.translates-holder').attr('min-pass-error'));
                        login_errors = true;
                    }
                }

                if ($('.custom-auth-popup .keystore-file-pass').val().trim() != $('.custom-auth-popup .second-pass').val().trim()) {
                    customErrorHandle($('.custom-auth-popup .second-pass').closest('.field-parent'), $('.translates-holder').attr('def-pass-error'));
                    login_errors = true;
                }

                if (!login_errors) {
                    if (is_hybrid) {
                        //MOBILE APP
                        if (basic.getMobileOperatingSystem() == 'Android') {
                            showLoader($('.translates-holder').attr('few-mins'));
                        }/* else if (basic.getMobileOperatingSystem() == 'iOS') {
                        showLoader($('.translates-holder').attr('few-mins-two'));
                    }*/
                    } else {
                        showLoader($('.translates-holder').attr('few-mins'));
                    }

                    setTimeout(function () {
                        generateKeystoreFile($('.custom-auth-popup .keystore-file-pass').val().trim(), function (public_key, keystore, private_key) {
                            var keystore_file_name = buildKeystoreFileName(keystore.address);
                            tempPrivKey = private_key;
                            tempAddress = '0x' + keystore.address;

                            // if internet connection save the public key to assurance
                            var internet = navigator.onLine;
                            if (internet) {
                                savePublicKeyToAssurance(keystore.address, public_key);
                            }

                            if (is_hybrid) {
                                //MOBILE APP
                                if (basic.getMobileOperatingSystem() == 'Android') {
                                    //saving keystore file to Downloads folder
                                    hybridAppFileDownload(keystore_file_name, JSON.stringify(keystore), function () {
                                        //saving keystore file to App folder
                                        hybridAppFileDownload(keystore_file_name, JSON.stringify(keystore), function () {
                                            fireGoogleAnalyticsEvent('Register', 'Download', 'Download Keystore');
                                            loginIntoWallet();

                                            basic.showAlert($('.translates-holder').attr('file') + keystore_file_name + $('.translates-holder').attr('has-been-stored'), 'overlap-loading-popup', true);
                                            setTimeout(function () {
                                                fireGoogleAnalyticsEvent('Register', 'Create', 'Wallet');
                                                basic.closeDialog();
                                                hideLoader();
                                                clearCreation();
                                            }, 6000);

                                        }, cordova.file.externalDataDirectory, false);
                                    }, cordova.file.externalRootDirectory, true);
                                } else if (basic.getMobileOperatingSystem() == 'iOS') {
                                    //saving keystore file to App folder
                                    /*hybridAppFileDownload(keystore_file_name, JSON.stringify(keystore), function () {
                                        loginIntoWallet();
                                        hideLoader();
                                    }, cordova.file.dataDirectory, false);*/

                                    //
                                    //hideLoader();

                                    window.plugins.socialsharing.share(JSON.stringify(keystore));

                                    $('.custom-auth-popup .popup-element.first .btn-container .download-login-file').addClass('hide');
                                    $('.custom-auth-popup .popup-element.first .btn-container .hidden-checkbox').removeClass('hide');

                                    $('.custom-auth-popup #keystore-downloaded-verifier').change(function() {
                                        if($(this).is(':checked')) {
                                            loginIntoWallet();
                                            clearCreation();
                                        }
                                    });
                                }
                            } else {
                                if (basic.getMobileOperatingSystem() == 'iOS') {
                                    //mobile browser from iPhone
                                    basic.showAlert($('.translates-holder').attr('opened-new-tab'), 'mobile-safari-keystore-creation overlap-loading-popup', true);

                                    //mobile safari
                                    downloadFile(keystore_file_name, JSON.stringify(keystore));

                                    $('.mobile-safari-keystore-creation .modal-footer .btn.btn-primary, .mobile-safari-keystore-creation .bootbox-close-button.close').click(function () {
                                        fireGoogleAnalyticsEvent('Register', 'Create', 'Wallet');
                                        basic.closeDialog();
                                        loginIntoWallet();
                                        hideLoader();
                                        clearCreation();
                                    });
                                } else {
                                    //BROWSER
                                    downloadFile(keystore_file_name, JSON.stringify(keystore));
                                    fireGoogleAnalyticsEvent('Register', 'Download', 'Download Keystore');
                                    loginIntoWallet();

                                    basic.showAlert($('.translates-holder').attr('file') +keystore_file_name + $('.translates-holder').attr('has-been-stored'), 'overlap-loading-popup', true);
                                    setTimeout(function () {
                                        fireGoogleAnalyticsEvent('Register', 'Create', 'Wallet');
                                        basic.closeDialog();
                                        hideLoader();
                                        clearCreation();
                                    }, 6000);
                                }
                            }

                            function clearCreation() {
                                $('.custom-auth-popup .popup-element.first .btn-container .download-login-file').removeClass('hide');
                                $('.custom-auth-popup .popup-element.first .btn-container .hidden-checkbox').attr('checked', false).addClass('hide');
                                $('.custom-auth-popup #keystore-file-pass').val('');
                                $('.custom-auth-popup #second-pass').val('');

                                $('.custom-auth-popup .popup-left .popup-element').addClass('hide');
                                $('.custom-auth-popup .popup-left .popup-element.second').removeClass('hide');
                                $('.custom-auth-popup .popup-header .nav-steps').removeClass('first-step').addClass('second-step');

                                if (is_hybrid && basic.getMobileOperatingSystem() == 'iOS') {
                                    var cachedPrintingImage = new Image();
                                    cachedPrintingImage.addEventListener('load', function () {
                                        console.log('Cached image loaded');
                                    });
                                    cachedPrintingImage.src = 'https://dentacoin.com/assets/uploads/private-key-background.png';
                                }
                            }

                            function loginIntoWallet() {
                                //if ($('.custom-auth-popup .popup-left .popup-body #agree-to-cache-create').is(':checked')) {
                                var localStorageAddress = keystore.address;
                                if (localStorageAddress.length == 40) {
                                    localStorageAddress = '0x' + localStorageAddress;
                                }

                                window.localStorage.setItem('current_account', localStorageAddress);
                                window.localStorage.setItem('keystore_file', JSON.stringify(keystore));
                            }
                        });
                    }, 1000);
                }
            });

            $('.custom-auth-popup .popup-left .print-pk').unbind().click(function () {
                projectData.general_logic.generatePrivateKeyFile(tempPrivKey);

                $('.custom-auth-popup .popup-left .popup-element').addClass('hide');
                $('.custom-auth-popup .popup-left .popup-element.third').removeClass('hide');
                $('.custom-auth-popup .popup-header .nav-steps').removeClass('second-step').addClass('third-step');
            });

            $('.custom-auth-popup .popup-left .remind-me-later').click(function () {
                $('.custom-auth-popup .popup-left .popup-element').addClass('hide');
                $('.custom-auth-popup .popup-left .popup-element.third').removeClass('hide');
                $('.custom-auth-popup .popup-header .nav-steps').removeClass('second-step').addClass('third-step');
            });

            $('.custom-auth-popup .popup-left .login-into-wallet').unbind().click(function () {
                if (is_hybrid) {
                    refreshApp();
                } else {
                    window.location.reload();
                }
            });
        } else {
            checkIfLoadingFromMobileBrowser();
        }
    }, 1000);
}

function removeAccountChecker() {
    console.log('removeAccountChecker');
    $('.account-checker-container').addClass('hide').removeClass('visible');
}

//method that appends front end errors
function customErrorHandle(el, string) {
    el.append('<div class="error-handle">' + string + '</div>');
}

//method that appends front end warnings
function customWarningHandle(el, string) {
    el.append('<div class="warning-handle">' + string + '</div>');
}

//styling input type file for importing keystore file
function styleKeystoreUploadBtn() {
    function proceedWithImportingAfterKeystoreUploading(keystore_string) {
        if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address')) {
            $('.or-label').hide();
            $('.import-private-key-row').hide();

            //show continue button next step button
            $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('<div class="enter-pass-label"><label class="renew-on-lang-switch" data-slug="enter-pass-secret">'+$('.translates-holder').attr('enter-pass-secret')+'</label></div><div class="field-parent margin-bottom-15 max-width-300 margin-left-right-auto"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="import-keystore-password" class="renew-on-lang-switch" data-slug="enter-pass-label">'+$('.translates-holder').attr('enter-pass-label')+'</label><input type="password" id="import-keystore-password" class="full-rounded import-keystore-password"/></div></div><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-import" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-import"><span class="padding-left-5 padding-right-5 inline-block renew-on-lang-switch" data-slug="remember-file">'+$('.translates-holder').attr('remember-file')+'</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block import-more-info-keystore-remember fs-0" data-content="'+$('.translates-holder').attr('remembering-file')+'"><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border renew-on-lang-switch" data-slug="CONTINUE-btn">'+$('.translates-holder').attr('CONTINUE-btn')+'</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block renew-on-lang-switch" data-slug="go-back">'+$('.translates-holder').attr('go-back')+'</span></a></div>');

            $('.import-more-info-keystore-remember').popover({
                trigger: 'click'
            });

            $('#import-keystore-password').focus();
            $('label[for="import-keystore-password"]').addClass('active-label');

            $('.custom-auth-popup .popup-right .popup-body .continue-btn > a').click(function () {
                $('.custom-auth-popup .popup-right .error-handle').remove();
                var keystore_password = $('.custom-auth-popup .popup-right .popup-body .import-keystore-password').val().trim();
                if (keystore_password == '') {
                    customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), $('.translates-holder').attr('enter-pass-secret'));
                } else {
                    showLoader($('.translates-holder').attr('hold-decrypt'));

                    setTimeout(function () {
                        importKeystoreFile(keystore_string, keystore_password, function (success, public_key, address, error, error_message) {
                            if (success) {
                                var internet = navigator.onLine;
                                if (internet) {
                                    savePublicKeyToAssurance(address, public_key);
                                }

                                var keystore_file_name = buildKeystoreFileName(address);
                                setTimeout(function () {
                                    //saving keystore file to App folder
                                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
                                        dirEntry.getFile(keystore_file_name, {
                                            create: true,
                                            exclusive: false
                                        }, function (fileEntry) {
                                            fileEntry.createWriter(function (fileWriter) {
                                                fileWriter.onwriteend = function (e) {
                                                    fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

                                                    if (basic.getMobileOperatingSystem() == 'iOS') {
                                                        window.localStorage.setItem('keystore_file_ios_saved', true);
                                                        if ($('.ios-camper .ios-reminder-for-downloading-keystore-file').length) {
                                                            $('.ios-camper .ios-reminder-for-downloading-keystore-file').remove();
                                                        }
                                                    }

                                                    var localStorageAddress = address;
                                                    if (localStorageAddress.length == 40) {
                                                        localStorageAddress = '0x' + localStorageAddress;
                                                    }

                                                    if ($('.custom-auth-popup .popup-right .popup-body #agree-to-cache-import').is(':checked')) {
                                                        window.localStorage.setItem('keystore_file', keystore_string);
                                                        window.localStorage.setItem('current_account', localStorageAddress);

                                                        refreshApp();
                                                    } else {
                                                        window.localStorage.setItem('current_account', localStorageAddress);
                                                        refreshApp();
                                                        //navigator.app.loadUrl("file:///android_asset/www/index.html", {loadingDialog: "Wait,Loading App", loadUrlTimeoutValue: 60000});
                                                    }
                                                };

                                                fileWriter.onerror = function (e) {
                                                    console.log(e, 'error');
                                                    hideLoader();
                                                    alert('Something went wrong with caching your file (Core error 2). Please contact admin@dentacoin.com.');
                                                };

                                                // Create a new Blob and write they keystore content inside of it
                                                var blob = new Blob([keystore_string], {type: 'text/plain'});
                                                fileWriter.write(blob);
                                            }, function (err) {
                                                console.log(err, 'err');
                                                hideLoader();
                                                alert('Something went wrong with downloading your file (Core error 3). Please contact admin@dentacoin.com.');
                                            });
                                        }, function (err) {
                                            console.log(err, 'err');
                                            hideLoader();
                                            alert('Something went wrong with downloading your file (Core error 4). Please contact admin@dentacoin.com.');
                                        });
                                    });
                                }, 500);
                            } else if (error) {
                                hideLoader();
                                customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), error_message);
                            }
                        });
                    }, 2000);
                }
            });
        } else {
            $('.custom-auth-popup .popup-right .popup-body #upload-keystore').val('');
            basic.showAlert($('.translates-holder').attr('valid-backup'), '', true);
            $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('');
        }
    }

    if (is_hybrid) {
        //MOBILE APP
        if (basic.getMobileOperatingSystem() == 'Android') {
            //ANDROID
            $('.custom-upload-button').click(function () {
                var this_btn = $(this);
                fileChooser.open(function (file_uri) {
                    androidFileUpload(file_uri, function (file) {
                        console.log(file, 'file');
                        var reader = new FileReader();

                        if (this_btn != undefined) {
                            initCustomInputFileAnimation(this_btn);
                        }

                        reader.onloadend = function () {
                            console.log(this, 'this');
                            var keystore_string = this.result;
                            setTimeout(function () {
                                proceedWithImportingAfterKeystoreUploading(keystore_string);
                            }, 500);
                        };

                        reader.readAsText(file);
                    });
                }, function (err) {
                    console.log(err);
                    alert($('.translates-holder').attr('upload-failed'));
                });
            });
        } else if (basic.getMobileOperatingSystem() == 'iOS') {
            //iOS
            $('.custom-upload-button').click(function () {
                iOSFileUpload(function (keystore_string) {
                    setTimeout(function () {
                        proceedWithImportingAfterKeystoreUploading(keystore_string);
                    }, 500);
                });
            });
        }
    } else {
        //BROWSER
        Array.prototype.forEach.call(document.querySelectorAll('.upload-keystore'), function (input) {
            var label = input.nextElementSibling;
            input.addEventListener('change', function (e) {
                var myFile = this.files[0];
                var reader = new FileReader();

                reader.addEventListener('load', function (e) {
                    if (basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address')) {
                        var keystore_string = e.target.result;
                        var address = JSON.parse(keystore_string).address;
                        //init upload button animation
                        initCustomInputFileAnimation(label);

                        $('.or-label').hide();
                        $('.import-private-key-row').hide();

                        setTimeout(function () {
                            //show continue button next step button
                            $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('<div class="enter-pass-label"><label class="renew-on-lang-switch" data-slug="enter-pass-secret">'+$('.translates-holder').attr('enter-pass-secret')+'</label></div><div class="field-parent margin-bottom-15 max-width-300 margin-left-right-auto"><div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="import-keystore-password" class="renew-on-lang-switch" data-slug="enter-pass-label">'+$('.translates-holder').attr('enter-pass-label')+'</label><input type="password" id="import-keystore-password" class="full-rounded import-keystore-password"/></div></div><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-import" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-import"><span class="padding-left-5 padding-right-5 inline-block renew-on-lang-switch" data-slug="remember-file">'+$('.translates-holder').attr('remember-file')+'</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block import-more-info-keystore-remember fs-0" data-content="'+$('.translates-holder').attr('remembering-file')+'"><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border renew-on-lang-switch" data-slug="CONTINUE-btn">'+$('.translates-holder').attr('CONTINUE-btn')+'</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block renew-on-lang-switch" data-slug="wrong-key-length">'+$('.go-back').attr('go-back')+'</span></a></div>');

                            $('.import-more-info-keystore-remember').popover({
                                trigger: 'click'
                            });

                            $('#import-keystore-password').focus();
                            $('label[for="import-keystore-password"]').addClass('active-label');

                            //calling IMPORT METHOD
                            $('.custom-auth-popup .popup-right .popup-body .continue-btn > a').click(function () {
                                $('.custom-auth-popup .popup-right .error-handle').remove();
                                var keystore_password = $('.custom-auth-popup .popup-right .popup-body .import-keystore-password').val().trim();
                                if (keystore_password == '') {
                                    customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), $('.translates-holder').attr('enter-pass-secret'));
                                } else {
                                    showLoader($('.translates-holder').attr('hold-decrypt'));

                                    setTimeout(function () {
                                        importKeystoreFile(keystore_string, keystore_password, function (success, public_key, address, error, error_message) {
                                            if (success) {
                                                var internet = navigator.onLine;
                                                if (internet) {
                                                    savePublicKeyToAssurance(address, public_key);
                                                }

                                                setTimeout(function () {
                                                    fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

                                                    var localStorageAddress = address;
                                                    if (localStorageAddress.length == 40) {
                                                        localStorageAddress = '0x' + localStorageAddress;
                                                    }

                                                    if ($('.custom-auth-popup .popup-right .popup-body #agree-to-cache-import').is(':checked')) {
                                                        window.localStorage.setItem('current_account', localStorageAddress);
                                                        window.localStorage.setItem('keystore_file', JSON.stringify(success));
                                                        window.location.reload();
                                                    } else {
                                                        window.localStorage.setItem('current_account', localStorageAddress);
                                                        window.location.reload();
                                                    }
                                                }, 500);
                                            } else if (error) {
                                                hideLoader();
                                                customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), error_message);
                                            }
                                        });
                                    }, 2000);
                                }
                            });
                        }, 500);
                    } else {
                        $('.custom-auth-popup .popup-right .popup-body #upload-keystore').val('');
                        basic.showAlert($('.translates-holder').attr('valid-backup'), '', true);
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
    var btn = $(this_btn);
    var loadSVG = btn.children("a").children(".load");
    var loadBar = btn.children("div").children("span");
    var checkSVG = btn.children("a").children(".check");

    var btn_width = 320;
    $('body').addClass('overflow-hidden');
    var window_width = $(window).width();
    $('body').removeClass('overflow-hidden');
    if (window_width < 768) {
        btn_width = 260;
    }

    btn.children("a").children("span").fadeOut(200, function () {
        btn.children("a").animate({
            width: 56
        }, 100, function () {
            loadSVG.fadeIn(300);
            btn.animate({
                width: btn_width
            }, 200, function () {
                btn.children("div").fadeIn(200, function () {
                    loadBar.animate({
                        width: "100%"
                    }, 500, function () {
                        loadSVG.fadeOut(200, function () {
                            checkSVG.fadeIn(200, function () {
                                setTimeout(function () {
                                    btn.children("div").fadeOut(200, function () {
                                        loadBar.width(0);
                                        checkSVG.fadeOut(200, function () {
                                            btn.children("a").animate({
                                                width: btn_width
                                            });
                                            btn.animate({
                                                width: btn_width
                                            }, 300, function () {
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

//showing front end loader
function showLoader(message) {
    if (message === undefined) {
        message = 'Loading ...';
    }
    $('.camping-loader').html('<div class="response-layer"><div class="wrapper"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/wallet-loading.png" class="max-width-160 width-100" alt="Loader"></figure><div class="message lato-bold fs-24">' + message + '</div></div></div>');
    $('.response-layer').show();
}

//hiding front end loader
function hideLoader() {
    $('.camping-loader').html('');
}

function buildKeystoreFileName(address) {
    if (address.length == 40) {
        address = '0x' + address;
    }
    return 'Dentacoin secret key - ' + projectData.utils.checksumAddress(address);
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.setAttribute('target', '_blank');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//opening WALLET SETTINGS
var forgetWalletLogicInitiated = false;
$(document).on('click', '.open-settings', function () {
    basic.closeDialog();
    var settings_html = '';

    if (is_hybrid && basic.getMobileOperatingSystem() == 'iOS') {
        var cachedPrintingImage = new Image();
        cachedPrintingImage.addEventListener('load', function () {
            console.log('Cached image loaded');
        });
        cachedPrintingImage.src = 'https://dentacoin.com/assets/uploads/private-key-background.png';
    }

    if (window.localStorage.getItem('keystore_file') != null/* || (is_hybrid && basic.getMobileOperatingSystem() == 'iOS' && window.localStorage.getItem('keystore_file_ios_saved') == null)*/) {
        var download_btn_label = $('.translates-holder').attr('download');
        var slug_attr = 'download';
        var warning_html = '';
        /*if (is_hybrid && basic.getMobileOperatingSystem() == 'iOS') {
            download_btn_label = $('.translates-holder').attr('export-btn');
            slug_attr = 'export-btn';*/
            /*if (window.localStorage.getItem('keystore_file_ios_saved') == null) {
                warning_html = '<div class="error-handle keystore-file-ios-saved">You have not saved your Backup file yet.</div>';
            }*/
        /*}*/

        //if cached keystore file show the option for downloading it
        settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important download-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14.4,10.4v3.2c0,0.1,0,0.2-0.1,0.3c0,0.1-0.1,0.2-0.2,0.3c-0.1,0.1-0.2,0.1-0.3,0.2c-0.1,0-0.2,0.1-0.3,0.1 H2.4c-0.1,0-0.2,0-0.3-0.1c-0.1,0-0.2-0.1-0.3-0.2S1.7,14,1.7,13.9c0-0.1-0.1-0.2-0.1-0.3v-3.2c0-0.4-0.4-0.8-0.8-0.8S0,10,0,10.4 v3.2c0,0.3,0.1,0.6,0.2,0.9c0.1,0.3,0.3,0.6,0.5,0.8c0.2,0.2,0.5,0.4,0.8,0.5C1.8,15.9,2.1,16,2.4,16h11.2c0.3,0,0.6-0.1,0.9-0.2 c0.3-0.1,0.6-0.3,0.8-0.5c0.2-0.2,0.4-0.5,0.5-0.8c0.1-0.3,0.2-0.6,0.2-0.9v-3.2c0-0.4-0.4-0.8-0.8-0.8S14.4,10,14.4,10.4z M8.8,8.5 V0.8C8.8,0.4,8.4,0,8,0C7.6,0,7.2,0.4,7.2,0.8v7.7L4.6,5.8c-0.3-0.3-0.8-0.3-1.1,0C3.1,6.1,3.1,6.7,3.4,7l4,4c0,0,0,0,0,0 c0.1,0.1,0.2,0.1,0.3,0.2c0.1,0,0.2,0.1,0.3,0.1c0,0,0,0,0,0c0.1,0,0.2,0,0.3-0.1c0.1,0,0.2-0.1,0.3-0.2l4-4c0.3-0.3,0.3-0.8,0-1.1 s-0.8-0.3-1.1,0L8.8,8.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold renew-on-lang-switch" data-slug="'+slug_attr+'">' + download_btn_label + ' <span class="renew-on-lang-switch" data-slug="backupfile">'+$('.translates-holder').attr('backupfile')+'</span></span></a><div class="fs-14 option-description renew-on-lang-switch" data-slug="very-important">'+$('.translates-holder').attr('very-important')+'</div><div class="camping-for-action"></div>' + warning_html + '</div>';
    } else if (window.localStorage.getItem('keystore_file') == null) {
        //if not cached keystore file show the option for caching it
        settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important remember-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14,0H2C0.9,0,0,0.9,0,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V2C16,0.9,15.1,0,14,0z M15,14c0,0.6-0.4,1-1,1 H2c-0.6,0-1-0.4-1-1v-3h14V14z M15,10H1V6h14V10z M1,5V2c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v3H1z M14,3.5C14,3.8,13.8,4,13.5,4h-1 C12.2,4,12,3.8,12,3.5v-1C12,2.2,12.2,2,12.5,2h1C13.8,2,14,2.2,14,2.5V3.5z M14,8.5C14,8.8,13.8,9,13.5,9h-1C12.2,9,12,8.8,12,8.5 v-1C12,7.2,12.2,7,12.5,7h1C13.8,7,14,7.2,14,7.5V8.5z M14,13.5c0,0.3-0.2,0.5-0.5,0.5h-1c-0.3,0-0.5-0.2-0.5-0.5v-1 c0-0.3,0.2-0.5,0.5-0.5h1c0.3,0,0.5,0.2,0.5,0.5V13.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold renew-on-lang-switch" data-slug="remember-file">'+$('.translates-holder').attr('remember-file')+'</span></a><div class="fs-14 option-description renew-on-lang-switch" data-slug="by-doing-so">'+$('.translates-holder').attr('by-doing-so')+'</div><div class="camping-for-action"></div></div>';

        $(document).on('click', '.settings-popup .remember-keystore', function () {
            $('.settings-popup .camping-for-action').html('');
            $('.settings-popup .error-handle').remove();

            var remember_keystore_html;
            if (is_hybrid) {
                remember_keystore_html = '<div class="text-center import-keystore-file-row margin-top-20"><label class="button remember-keystore-upload custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold renew-on-lang-switch" data-slug="renew-on-lang-switch">'+$('.translates-holder').attr('upload-backup-file-label')+'</span><img src="assets/images/loader-circle.png" class="load width-100 max-width-30"/><img src="assets/images/check.png" class="check width-100 max-width-30"/></a><div><span></span></div></label></div>';
            } else {
                remember_keystore_html = '<div class="text-center import-keystore-file-row margin-top-20"><input type="file" id="remember-keystore-upload" class="hide-input remember-keystore-upload"/><label for="remember-keystore-upload" class="button custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold renew-on-lang-switch" data-slug="upload-backup-file-label">'+$('.translates-holder').attr('upload-backup-file-label')+'</span><img src="assets/images/loader-circle.png" class="load width-100 max-width-30"/><img src="assets/images/check.png" class="check width-100 max-width-30"/></a><div><span></span></div></label></div>';
            }

            var this_row = $(this).closest('.option-row');
            var this_camping_row = this_row.find('.camping-for-action');
            this_camping_row.html(remember_keystore_html);

            if (is_hybrid) {
                //MOBILE APP
                if (basic.getMobileOperatingSystem() == 'Android') {
                    //ANDROID
                    $('.remember-keystore-upload').click(function () {
                        this_row.find('.error-handle').remove();

                        var this_btn = $(this);
                        fileChooser.open(function (file_uri) {
                            androidFileUpload(file_uri, function (file) {
                                var reader = new FileReader();
                                initCustomInputFileAnimation(this_btn);

                                reader.onloadend = function () {
                                    var keystore_string = this.result;

                                    if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && projectData.utils.checksumAddress(JSON.parse(keystore_string).address) == projectData.utils.checksumAddress(global_state.account)) {
                                        validateKeystoreFileAndPasswordForCachingKeystoreFile(this_camping_row, keystore_string, this_row);
                                    } else {
                                        $($('.translates-holder').attr('data-valid-keytore')).insertAfter(this_camping_row);
                                    }
                                };

                                reader.readAsText(file);
                            });
                        }, function (err) {
                            console.log(err);
                            $('<div class="error-handle renew-on-lang-switch" data-slug="upload-failed">'+$('.translates-holder').attr('upload-failed')+'</div>').insertAfter(this_camping_row);
                        });
                    });
                } else if (basic.getMobileOperatingSystem() == 'iOS') {
                    //iOS
                    $('.remember-keystore-upload').click(function () {
                        this_row.find('.error-handle').remove();

                        var this_btn = $(this);
                        iOSFileUpload(function (keystore_string) {
                            initCustomInputFileAnimation(this_btn);

                            if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && projectData.utils.checksumAddress(JSON.parse(keystore_string).address) == projectData.utils.checksumAddress(global_state.account)) {
                                validateKeystoreFileAndPasswordForCachingKeystoreFile(this_camping_row, keystore_string, this_row);
                            } else {
                                $($('.translates-holder').attr('data-valid-keytore')).insertAfter(this_camping_row);
                            }
                        });
                    });
                }
            } else {
                //BROWSER
                Array.prototype.forEach.call(document.querySelectorAll('.remember-keystore-upload'), function (input) {
                    var label = input.nextElementSibling;
                    input.addEventListener('change', function (e) {
                        this_row.find('.error-handle').remove();
                        var myFile = this.files[0];
                        var reader = new FileReader();

                        reader.addEventListener('load', function (e) {
                            if (basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address') && projectData.utils.checksumAddress(JSON.parse(e.target.result).address) == projectData.utils.checksumAddress(global_state.account)) {
                                var keystore_string = e.target.result;
                                //init upload button animation
                                initCustomInputFileAnimation(label);

                                validateKeystoreFileAndPasswordForCachingKeystoreFile(this_camping_row, keystore_string, this_row);
                            } else {
                                $($('.translates-holder').attr('data-valid-keytore')).insertAfter(this_camping_row);
                            }
                        });

                        reader.readAsBinaryString(myFile);
                    });
                });
            }
        });

        function validateKeystoreFileAndPasswordForCachingKeystoreFile(this_camping_row, keystore_string, this_row) {
            $('.settings-popup .continue-with-keystore-validation').remove();
            this_camping_row.append('<div class="continue-with-keystore-validation"><div class="custom-google-label-style margin-top-25 margin-bottom-15 max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="cache-keystore-password" class="renew-on-lang-switch" data-slug="upload-failed">'+$('.translates-holder').attr('backup-pass')+'</label><input type="password" id="cache-keystore-password" class="full-rounded"/></div><div class="padding-bottom-10 text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border continue-caching renew-on-lang-switch" data-slug="CONTINUE-btn">'+$('.translates-holder').attr('CONTINUE-btn')+'</a></div></div>');

            $('#cache-keystore-password').focus();
            $('label[for="cache-keystore-password"]').addClass('active-label');

            $('.settings-popup .continue-caching').click(function () {
                this_row.find('.error-handle').remove();
                if ($('.settings-popup #cache-keystore-password').val().trim() == '') {
                    $('<div class="error-handle renew-on-lang-switch" data-slug="enter-backup-pass">'+$('.translates-holder').attr('enter-backup-pass')+'</div>').insertAfter(this_camping_row);
                } else {
                    showLoader($('.translates-holder').attr('hold-on-caching'));
                    setTimeout(function () {
                        importKeystoreFile(keystore_string, $('.settings-popup #cache-keystore-password').val().trim(), function (success, public_key, address, error, error_message) {
                            if (success) {
                                window.localStorage.setItem('keystore_file', keystore_string);

                                basic.closeDialog();
                                basic.showAlert($('.translates-holder').attr('your-backup'), '', true);

                                $('body').removeClass('overflow-hidden');
                                $('.settings-popup').addClass('hide');
                            } else if (error) {
                                $('<div class="error-handle">' + error_message + '</div>').insertAfter(this_camping_row);
                            }
                        });
                        hideLoader();
                    }, 2000);
                }
            });
        }
    }

    var showPkText = $('.translates-holder').attr('upload-to-show');
    if (window.localStorage.getItem('keystore_file') != null) {
        showPkText = $('.translates-holder').attr('upload-to-show-second-option');
    }

    settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important generate-keystore"><svg class="margin-right-5 inline-block max-width-30" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66.3 74.8" style="enable-background:new 0 0 66.3 74.8;" xml:space="preserve"><style type="text/css">.st0-generate-keystore-file{fill:#00B5E2;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="74.8" width="66.3" x="16.6" y="37.3"></sliceSourceBounds></sfw></metadata><path class="st0-generate-keystore-file" d="M66.3,37.4c0-13.7-8.6-26.1-21.4-31c-0.8-0.3-1.6,0.1-1.9,0.9c-0.3,0.8,0.1,1.6,0.9,1.9c11.6,4.4,19.5,15.7,19.5,28.2c0,15.5-11.8,28.3-26.8,29.9l2.1-2.6c0.5-0.6,0.4-1.6-0.2-2.1c-0.6-0.5-1.6-0.4-2.1,0.2l-4.1,5.1c-0.3,0.2-0.4,0.6-0.5,1c0,0,0,0.1,0,0.1c0,0,0,0,0,0.1c0,0,0,0,0,0.1c0,0.1,0,0.2,0,0.2c0,0,0,0,0,0c0.1,0.3,0.2,0.7,0.5,0.9l5.3,4.3c0.3,0.2,0.6,0.3,0.9,0.3c0.4,0,0.9-0.2,1.2-0.6c0.5-0.6,0.4-1.6-0.2-2.1L37,70.3C53.5,68.3,66.3,54.3,66.3,37.4z M34.3,6.7c0.1-0.1,0.1-0.1,0.1-0.2c0,0,0,0,0,0c0-0.1,0.1-0.1,0.1-0.2c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0-0.2c0,0,0-0.1,0-0.1c0,0,0,0,0-0.1c0,0,0,0,0-0.1c0-0.1,0-0.1,0-0.2c0,0,0-0.1,0-0.1c0-0.1,0-0.1-0.1-0.2c0,0,0,0,0-0.1c0-0.1-0.1-0.1-0.1-0.2c0,0,0,0,0,0c0-0.1-0.1-0.1-0.2-0.2c0,0,0,0,0,0c0,0-0.1-0.1-0.1-0.1l-5.3-4.3c-0.6-0.5-1.6-0.4-2.1,0.2c-0.5,0.6-0.4,1.6,0.2,2.1l2.3,1.8C12.8,6.5,0,20.5,0,37.4c0,13.8,8.7,26.3,21.6,31.1c0.2,0.1,0.3,0.1,0.5,0.1c0.6,0,1.2-0.4,1.4-1c0.3-0.8-0.1-1.6-0.9-1.9C10.9,61.3,3,49.9,3,37.4C3,21.9,14.8,9.1,29.8,7.5l-2.1,2.6c-0.5,0.6-0.4,1.6,0.2,2.1c0.3,0.2,0.6,0.3,0.9,0.3c0.4,0,0.9-0.2,1.2-0.6L34.3,6.7C34.3,6.7,34.3,6.7,34.3,6.7z"/><g transform="translate(0,-952.36218)"><path class="st0-generate-keystore-file" d="M31.6,974.2c3,3,3.3,7.8,0.9,11.2l16.5,16.5c0.5,0.5,0.5,1.4,0,1.9l-3.7,3.7c-0.5,0.5-1.4,0.5-1.9,0c-0.5-0.5-0.5-1.4,0-1.9l2.7-2.7l-3.9-3.9l-4.2,4.2c-0.5,0.5-1.4,0.5-1.9,0c-0.5-0.5-0.5-1.4,0-1.9l4.2-4.2l-9.7-9.7c-3.4,2.4-8.2,2.2-11.2-0.9c-3.4-3.4-3.4-8.9,0-12.2C22.7,970.8,28.2,970.8,31.6,974.2z M29.7,976.1c-2.3-2.3-6.1-2.3-8.4,0c-2.3,2.3-2.3,6.1,0,8.4c2.3,2.3,6.1,2.3,8.4,0C32,982.2,32,978.4,29.7,976.1L29.7,976.1z"/></g></svg><span class="inline-block color-light-blue fs-18 lato-bold renew-on-lang-switch" data-slug="generate-backup">'+$('.translates-holder').attr('generate-backup')+'</span></a><div class="fs-14 option-description renew-on-lang-switch" data-slug="easy-to-easy">'+$('.translates-holder').attr('easy-to-easy')+'</div><div class="camping-for-action"></div></div><div class="option-row"><a href="javascript:void(0)" class="display-block-important show-private-key"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 21.3" style="enable-background:new 0 0 16 21.3;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="21.3" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M5.3,0C5.1,0,5,0.1,4.9,0.2L0.2,4.9C0.1,5,0,5.2,0,5.3v13.9c0,1.1,0.9,2.1,2.1,2.1h11.8c1.1,0,2.1-0.9,2.1-2.1 V2.1C16,0.9,15.1,0,13.9,0H5.3C5.3,0,5.3,0,5.3,0z M6.2,1.2h7.7c0.5,0,0.9,0.4,0.9,0.9v17.2c0,0.5-0.4,0.9-0.9,0.9H2.1 c-0.5,0-0.9-0.4-0.9-0.9v-13h4.4C6,6.2,6.2,6,6.2,5.6V1.2z M5,1.7V5H1.7L5,1.7z M4.4,9.8c-1.1,0-2.1,0.9-2.1,2.1s0.9,2.1,2.1,2.1 c0.9,0,1.7-0.6,2-1.5h3.6v0.9c0,0.3,0.3,0.6,0.6,0.6c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0v-0.9h1.2v0.9c0,0.3,0.3,0.6,0.6,0.6 c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0v-1.5c0-0.3-0.3-0.6-0.6-0.6H6.4C6.2,10.4,5.4,9.8,4.4,9.8L4.4,9.8z M4.4,11 c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,0.9c-0.5,0-0.9-0.4-0.9-0.9C3.6,11.3,3.9,11,4.4,11z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold renew-on-lang-switch" data-slug="display-key">'+$('.translates-holder').attr('display-key')+'</span></a><div class="fs-14 option-description renew-on-lang-switch" data-slug="upload-to-show">'+showPkText+'</div><div class="camping-for-action"></div></div>';

    if (window.localStorage.getItem('keystore_file') != null) {
        settings_html += '<div class="option-row"><a href="javascript:void(0)" class="display-block-important forget-keystore"><svg class="margin-right-5 inline-block max-width-30" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="16" width="16" x="1" y="5.5"/></sfw></metadata><path class="st0" d="M14,0H2C0.9,0,0,0.9,0,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V2C16,0.9,15.1,0,14,0z M15,14c0,0.6-0.4,1-1,1 H2c-0.6,0-1-0.4-1-1v-3h14V14z M15,10H1V6h14V10z M1,5V2c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v3H1z M14,3.5C14,3.8,13.8,4,13.5,4h-1 C12.2,4,12,3.8,12,3.5v-1C12,2.2,12.2,2,12.5,2h1C13.8,2,14,2.2,14,2.5V3.5z M14,8.5C14,8.8,13.8,9,13.5,9h-1C12.2,9,12,8.8,12,8.5 v-1C12,7.2,12.2,7,12.5,7h1C13.8,7,14,7.2,14,7.5V8.5z M14,13.5c0,0.3-0.2,0.5-0.5,0.5h-1c-0.3,0-0.5-0.2-0.5-0.5v-1 c0-0.3,0.2-0.5,0.5-0.5h1c0.3,0,0.5,0.2,0.5,0.5V13.5z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold renew-on-lang-switch" data-slug="forget-file">'+$('.translates-holder').attr('forget-file')+'</span></a><div class="fs-14 option-description renew-on-lang-switch" data-slug="you-will-be-asked">'+$('.translates-holder').attr('you-will-be-asked')+'</div></div>';

        //removing the cached keystore file from localstorage
        if (!forgetWalletLogicInitiated) {
            forgetWalletLogicInitiated = true;

            $(document).on('click', '.settings-popup .forget-keystore', function () {
                var forget_keystore_reminder_warning = {};
                forget_keystore_reminder_warning.callback = function (result) {
                    if (result) {
                        if (window.localStorage.getItem('keystore_file') != null) {
                            window.localStorage.removeItem('keystore_file');

                            basic.closeDialog();
                            basic.showAlert($('.translates-holder').attr('forget-file-succ'), '', true);

                            $('body').removeClass('overflow-hidden');
                            $('.settings-popup').addClass('hide');
                        }
                    }
                };
                basic.showConfirm($('.translates-holder').attr('are-you-sure'), '', forget_keystore_reminder_warning, true);
            });
        }
    }

    var settings_bottom_html = '<div class="padding-top-10 padding-left-15 padding-right-15 fs-14 renew-on-lang-switch" data-slug="dont-forget">'+$('.translates-holder').attr('dont-forget')+'</div>';

    //shop Help center menu element (FAQ) only on mobile
    if (basic.isMobile()) {
        settings_html += '<div class="option-row"><a href="https://dentacoin.com/how-to-create-wallet" target="_blank" class="display-block-important data-external-link"><svg class="margin-right-5 inline-block max-width-30" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 73.9 73.9" style="enable-background:new 0 0 73.9 73.9;" xml:space="preserve"><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="74" width="74" x="0" y="-0.1"></sliceSourceBounds></sfw></metadata><circle style="fill:none;stroke:#00B7E2;stroke-width:3;stroke-miterlimit:10;" cx="37" cy="37" r="35.5"/><path d="M46,38.6"/><path style="fill:#00B7E2;" d="M36.8,17.1c-5.8,0-11.4,3.8-11.4,11c0,1.9,1.6,3.4,3.4,3.4c1.9,0,3.4-1.6,3.4-3.4c0-3.8,4.1-3.9,4.5-3.9s4.5,0.2,4.5,3.9v0.8c0,1.6-0.8,2.8-2.2,3.6l-3,1.7c-1.7,0.9-2.7,2.7-2.7,4.5v2.8c0,1.9,1.6,3.4,3.4,3.4s3.4-1.6,3.4-3.4v-1.7l2.2-1.1c3.6-1.9,5.8-5.6,5.8-9.7v-0.9C48.2,20.9,42.4,17.1,36.8,17.1z"/><path style="fill:#00B7E2;" d="M36.8,48.9c-5.6,0-5.6,8.8,0,8.8S42.4,48.9,36.8,48.9z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold renew-on-lang-switch" data-slug="help-center">'+$('.translates-holder').attr('help-center')+'</span></a><div class="fs-14 option-description renew-on-lang-switch" data-slug="having-diff">'+$('.translates-holder').attr('having-diff')+' <a href="mailto:admin@dentacoin.com" class="color-light-blue">admin@dentacoin.com</a>.</div></div>';

        settings_bottom_html = '<div class="padding-top-10 padding-left-15 padding-right-15 fs-14 renew-on-lang-switch" data-slug="dont-forget">'+$('.translates-holder').attr('dont-forget')+'</div><div class="text-center padding-top-20 fs-14"><a class="color-light-blue data-external-link" href="https://dentacoin.com/assets/uploads/dentacoin-foundation.pdf" target="_blank"><span class="current-year"></span> Dentacoin Foundation.</a> <span class="renew-on-lang-switch" data-slug="all-rights">'+$('.translates-holder').attr('all-rights')+'</span></div><div class="text-center fs-14"><a class="color-light-blue data-external-link renew-on-lang-switch" data-slug="menu-privacy-policy" href="https://dentacoin.com/privacy-policy" target="_blank">'+$('.translates-holder').attr('menu-privacy-policy')+'</a></div>';
    }

    $('.settings-popup .popup-body').html(settings_html);
    $('.settings-popup .popup-footer').html('<div><a href="javascript:void(0)" class="log-out light-blue-white-btn min-width-220"><svg xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 16 18.4" style="enable-background:new 0 0 16 18.4;" xml:space="preserve" class="margin-right-5 inline-block max-width-20"><style type="text/css">.st0{fill:#00B5E2;}</style><metadata><sfw xmlns="http://ns.adobe.com/SaveForWeb/1.0/"><slices/><sliceSourceBounds bottomLeftOrigin="true" height="18.4" width="16" x="1" y="8.4"/></sfw></metadata><g><path class="st0" d="M2.5,0h10.6c1.4,0,2.5,1.1,2.5,2.5v3.2h-1.5V2.5c0-0.5-0.4-1-1-1H2.5c-0.5,0-1,0.4-1,1v13.4c0,0.5,0.4,1,1,1 h10.6c0.5,0,1-0.4,1-1v-3.2h1.5v3.2c0,1.4-1.1,2.5-2.5,2.5H2.5c-1.4,0-2.5-1.1-2.5-2.5V2.5C0,1.1,1.1,0,2.5,0z M11,7.5H6.2v3.4H11 v1.9l5-3.5l-5-3.5V7.5L11,7.5z"/></g></svg><span class="inline-block renew-on-lang-switch renew-on-lang-switch" data-slug="log-out" data-slug="log-out">'+$('.translates-holder').attr('log-out')+'</span></a></div>' + settings_bottom_html);
    $('body').addClass('overflow-hidden');
    $('.settings-popup').removeClass('hide');

    //basic.showDialog(settings_html, 'settings-popup', null, true);

    if ($('.settings-popup .current-year').length) {
        $('.settings-popup .current-year').html(new Date().getFullYear());
    }

    if ($('.settings-popup .download-keystore').length) {
        $('.settings-popup .download-keystore').click(function () {
            $('.settings-popup .camping-for-action').html('');
            $('.settings-popup .error-handle').remove();

            var downloadBtnLabel = $('.translates-holder').attr('download');
            var attrSlug = 'download';
            if (is_hybrid && basic.getMobileOperatingSystem() == 'iOS') {
                downloadBtnLabel = $('.translates-holder').attr('export-btn');
                attrSlug = 'export-btn';
            }

            var enterKeystorePasswordHtml = '<div class="custom-google-label-style margin-bottom-15 margin-top-20 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="download-keystore-password" class="renew-on-lang-switch" data-slug="pass-label">'+$('.translates-holder').attr('pass-label')+'</label><input type="password" id="download-keystore-password" class="full-rounded"></div><div class="text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border fs-xs-18 width-xs-100 download-keystore-action renew-on-lang-switch text-uppercase" data-slug="'+attrSlug+'">' + downloadBtnLabel + '</a></div>';

            var this_row = $(this).closest('.option-row');
            var this_camping_row = this_row.find('.camping-for-action');
            this_camping_row.html(enterKeystorePasswordHtml);

            $('#download-keystore-password').focus();
            $('label[for="download-keystore-password"]').addClass('active-label');

            $('.download-keystore-action').click(function () {
                showLoader($('.translates-holder').attr('hold-on-decrypt'));
                this_row.find('.error-handle').remove();

                setTimeout(function () {
                    importKeystoreFile(window.localStorage.getItem('keystore_file'), $('#download-keystore-password').val().trim(), function (success, public_key, address, error, error_message) {
                        if (success) {
                            if (is_hybrid) {
                                //MOBILE APP
                                if (basic.getMobileOperatingSystem() == 'Android') {
                                    //getting the file content by it path saved in localstorage
                                    showLoader($('.translates-holder').attr('downloading'));

                                    setTimeout(function () {
                                        var keystore_file_name = buildKeystoreFileName(global_state.account);
                                        //downloading the file in mobile device file system
                                        hybridAppFileDownload(keystore_file_name, window.localStorage.getItem('keystore_file'), function () {
                                            basic.closeDialog();
                                            basic.showAlert($('.translates-holder').attr('file') +keystore_file_name + $('.translates-holder').attr('has-been-downloaded'), '', true);

                                            $('body').removeClass('overflow-hidden');
                                            $('.settings-popup').addClass('hide');

                                            $('#download-keystore-password').val('');
                                            hideLoader();
                                        }, cordova.file.externalRootDirectory, true);
                                    }, 500);
                                } else if (basic.getMobileOperatingSystem() == 'iOS') {
                                    hideLoader();
                                    window.plugins.socialsharing.share(window.localStorage.getItem('keystore_file'));
                                    $('#download-keystore-password').val('');
                                }
                            } else {
                                hideLoader();
                                basic.closeDialog();

                                $('body').removeClass('overflow-hidden');
                                $('.settings-popup').addClass('hide');

                                if (basic.getMobileOperatingSystem() == 'iOS' && basic.isMobile()) {
                                    // mobile ios device
                                    basic.showAlert($('.translates-holder').attr('opened-new-tab'), '', true);
                                } else {
                                    // BROWSER
                                    basic.showAlert($('.translates-holder').attr('file') +buildKeystoreFileName(global_state.account) + $('.translates-holder').attr('has-been-downloaded'), '', true);


                                }
                                downloadFile(buildKeystoreFileName(global_state.account), window.localStorage.getItem('keystore_file'));
                                $('#download-keystore-password').val('');
                            }
                        } else if (error) {
                            hideLoader();
                            $('<div class="error-handle">' + error_message + '</div>').insertAfter(this_camping_row);
                        }
                    });
                }, 2000);
            });
        });
    }

    updateExternalURLsForiOSDevice();

    $('.settings-popup .custom-close-settings-popup').click(function () {
        $('body').removeClass('overflow-hidden');
        $('.settings-popup').addClass('hide');
    });

    //logging out of the application
    $('.settings-popup .log-out').click(function () {
        var log_out_reminder_warning = {};
        log_out_reminder_warning.callback = function (result) {
            if (result) {
                if (is_hybrid) {
                    window.localStorage.clear();
                    refreshApp();
                } else {
                    window.localStorage.clear();
                    window.location.reload();
                }
            }
        };
        basic.showConfirm($('.translates-holder').attr('are-you-downloaded'), '', log_out_reminder_warning, true);
    });

    //showing private key
    $('.settings-popup .show-private-key').click(function () {
        $('.settings-popup .camping-for-action').html('');
        $('.settings-popup .error-handle').remove();
        var show_private_key_html = '';
        if (window.localStorage.getItem('keystore_file') != null) {
            //cached keystore path on mobile device or cached keystore file on browser
            show_private_key_html += '<div class="custom-google-label-style margin-bottom-15 margin-top-20 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="show-private-key-password" class="renew-on-lang-switch" data-slug="pass-label">'+$('.translates-holder').attr('pass-label')+'</label><input type="password" id="show-private-key-password" class="full-rounded"></div><div class="text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border fs-xs-18 width-xs-100 show-private-key-action renew-on-lang-switch" data-slug="display-priv-key">'+$('.translates-holder').attr('display-priv-key')+'</a></div>';

            var this_row = $(this).closest('.option-row');
            var this_camping_row = this_row.find('.camping-for-action');
            this_camping_row.html(show_private_key_html);

            $('#show-private-key-password').focus();
            $('label[for="show-private-key-password"]').addClass('active-label');

            $('.show-private-key-action').click(function () {
                this_row.find('.error-handle').remove();
                if ($('#show-private-key-password').val().trim() == '') {
                    $('<div class="error-handle renew-on-lang-switch" data-slug="enter-backup-pass">'+$('.translates-holder').attr('enter-backup-pass')+'</div>').insertAfter(this_camping_row);
                } else {
                    showLoader($('.translates-holder').attr('hold-decrypt'));

                    setTimeout(function () {
                        decryptKeystore(window.localStorage.getItem('keystore_file'), $('#show-private-key-password').val().trim(), function (success, to_string, error, error_message) {
                            if (success) {
                                this_camping_row.html('<a href="javascript:void(0);" data-key="'+to_string+'" class="margin-top-10 fs-20 fs-xs-16 color-light-blue print-private-key inline-block white-light-blue-btn"><?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY ns_extend "http://ns.adobe.com/Extensibility/1.0/"><!ENTITY ns_ai "http://ns.adobe.com/AdobeIllustrator/10.0/"><!ENTITY ns_graphs "http://ns.adobe.com/Graphs/1.0/"><!ENTITY ns_vars "http://ns.adobe.com/Variables/1.0/"><!ENTITY ns_imrep "http://ns.adobe.com/ImageReplacement/1.0/"><!ENTITY ns_sfw "http://ns.adobe.com/SaveForWeb/1.0/"><!ENTITY ns_custom "http://ns.adobe.com/GenericCustomNamespace/1.0/"><!ENTITY ns_adobe_xpath "http://ns.adobe.com/XPath/1.0/"><svg version="1.1" style="width: 30px; display: inline-block; vertical-align: middle;" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 28 28.1" style="enable-background:new 0 0 28 28.1;" xml:space="preserve"><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="28.1" width="28" x="0" y="0"></sliceSourceBounds></sfw></metadata><path style="fill:white;" d="M25,6h-3V2c0-1.1-0.9-2-2-2H8C6.9,0,6,0.9,6,2v4H3C1.3,6,0,7.3,0,9c0,0,0,0,0,0.1V19c0,1.7,1.3,3,2.9,3.1c0,0,0,0,0.1,0h3v4c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-4h3c1.7,0,3-1.3,3-3c0,0,0,0,0-0.1V9.1C28,7.4,26.7,6,25,6L25,6z M8,2h12v4H8V2z M20,26H8v-9h12V26z M26,18.9c0,0.6-0.4,1-0.9,1.1c0,0,0,0-0.1,0h-3v-3c0-1.1-0.9-2-2-2H8c-1.1,0-2,0.9-2,2v3H3c-0.6,0-1-0.4-1-1c0,0,0,0,0-0.1V9c0-0.6,0.4-1,0.9-1.1c0,0,0,0,0.1,0h22c0.6,0,1,0.4,1,1c0,0,0,0,0,0.1V18.9z M18,23c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6C17.6,22,18,22.4,18,23z M18,20c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6C17.6,19,18,19.4,18,20z M24,11c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2C23.6,10,24,10.4,24,11z"/></svg> <span class="inline-block renew-on-lang-switch" data-slug="print-pk-text">'+$('.translates-holder').attr('print-pk-text')+'</span></a><div class="padding-top-5 fs-14 color-light-blue text-left renew-on-lang-switch" data-slug="use-a4">'+$('.translates-holder').attr('use-a4')+'</div><div class="private-key-holder"><div class="scroll-content"><a href="javascript:void(0);" class="copy-private-key inline-block padding-right-5" data-toggle="tooltip" title="Copied." data-placement="right" data-clipboard-target="#copy-private-key"><svg class="width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 19.8 24" style="enable-background:new 0 0 19.8 24;" xml:space="preserve"><style type="text/css">.st0{fill:#303030;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="24" width="19.8" x="1.2" y="0"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M19.8,2.9c0,4.9,0,9.9,0,14.8c0,0.1,0,0.1,0,0.2c-0.2,1.4-1.2,2.4-2.6,2.7c-0.2,0-0.2,0.1-0.2,0.3c0,1.3-0.6,2.2-1.8,2.8c-0.3,0.2-0.7,0.2-1,0.3c-3.8,0-7.5,0-11.3,0c0,0-0.1,0-0.1,0c-1.3-0.3-2.2-1-2.6-2.3C0.1,21.4,0,21.3,0,21.1c0-4.9,0-9.9,0-14.8c0,0,0-0.1,0-0.1c0.3-1.6,1.6-2.7,3.2-2.7c2.5,0,5.1,0,7.6,0c0.7,0,1.3,0.3,1.9,0.8c1.1,1.1,2.3,2.3,3.4,3.4c0.5,0.5,0.8,1.1,0.8,1.9c0,3,0,6.1,0,9.1c0,0.1,0,0.2,0,0.3c0.2-0.1,0.3-0.1,0.4-0.2c0.6-0.3,0.8-0.9,0.8-1.6c0-4.2,0-8.4,0-12.6c0-0.4,0-0.9,0-1.3c0-1-0.7-1.7-1.7-1.7c-3.7,0-7.3,0-11,0c-0.5,0-1,0.2-1.3,0.6c0,0.1-0.1,0.1-0.2,0.1c-0.5,0-1.1,0-1.6,0c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0.1-0.2c0.3-0.9,0.9-1.5,1.8-1.8C4.5,0.1,4.7,0.1,5,0c4,0,8,0,11.9,0c0,0,0.1,0,0.1,0c1.4,0.2,2.3,1.2,2.6,2.5C19.7,2.7,19.7,2.8,19.8,2.9z M1.6,13.7c0,2.3,0,4.6,0,6.9c0,1.1,0.7,1.7,1.7,1.7c3.4,0,6.8,0,10.2,0c1.1,0,1.8-0.7,1.8-1.8c0-3.7,0-7.3,0-11c0-0.1,0-0.1,0-0.2c0-0.2-0.1-0.2-0.3-0.2c-0.6,0-1.1,0-1.7,0c-1.4,0-2.3-1-2.3-2.4c0-0.5,0-1,0-1.5C11,5.1,11,5,10.8,5c-2.5,0-5,0-7.5,0C3,5,2.8,5.1,2.5,5.2C1.9,5.5,1.6,6.1,1.6,6.8C1.6,9.1,1.6,11.4,1.6,13.7z"/><path class="st0" d="M8.5,17.5c1.4,0,2.8,0,4.1,0c0.6,0,0.9,0.3,1,0.8c0.1,0.5-0.2,1-0.7,1.1c-0.1,0-0.2,0-0.3,0c-2.8,0-5.5,0-8.3,0c-0.6,0-1.1-0.4-1.1-0.9c0-0.5,0.4-0.9,1-0.9c0.6,0,1.3,0,1.9,0C6.9,17.5,7.7,17.5,8.5,17.5z"/><path class="st0" d="M8.4,15.3c-1.4,0-2.8,0-4.2,0c-0.4,0-0.8-0.2-0.9-0.6c-0.1-0.4,0-0.8,0.3-1c0.2-0.1,0.4-0.2,0.6-0.2c2.8,0,5.7,0,8.5,0c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,1c-0.6,0-1.2,0-1.8,0C10.1,15.3,9.3,15.3,8.4,15.3z"/><path class="st0" d="M6.7,11.2c-0.8,0-1.6,0-2.4,0c-0.4,0-0.7-0.2-0.9-0.6c-0.2-0.3-0.1-0.7,0.1-1c0.2-0.2,0.4-0.3,0.7-0.3c1.6,0,3.2,0,4.9,0c0.6,0,1,0.4,1,1c0,0.5-0.4,0.9-1,0.9C8.3,11.2,7.5,11.2,6.7,11.2z"/></g></svg></a><textarea readonly="" class="inline-block" id="copy-private-key">' + to_string + '</textarea></div></div><div class="padding-top-10 padding-bottom-15 fs-14 color-warning-red renew-on-lang-switch" data-slug="not-recomm">'+$('.translates-holder').attr('not-recomm')+'</div><div class="padding-top-10 padding-bottom-10 padding-left-70 padding-right-70 padding-left-xs-10 padding-right-xs-10 text-left fs-14 color-white row-with-warning-red-background renew-on-lang-switch" data-slug="dont-lose-it"><div>'+$('.translates-holder').attr('dont-lose-it')+'</div><div class="renew-on-lang-switch" data-slug="make-backup">'+$('.translates-holder').attr('make-backup')+'</div></div>');

                                $('.print-private-key').click(function() {
                                    projectData.general_logic.generatePrivateKeyFile($(this).attr('data-key'));
                                });

                                //init copy button event
                                var clipboard = new ClipboardJS('.copy-private-key');
                                clipboard.on('success', function (e) {
                                    $('.copy-private-key').tooltip('show');
                                    setTimeout(function () {
                                        $('.copy-private-key').tooltip('hide');
                                    }, 1000);
                                });
                            } else if (error) {
                                $('<div class="error-handle">' + error_message + '</div>').insertAfter(this_camping_row);
                                $('#show-private-key-password').val('');
                            }

                            hideLoader();
                        });
                    }, 2000);
                }
            });
        } else {
            if (is_hybrid) {
                show_private_key_html = '<div class="text-center import-keystore-file-row margin-top-20"><label class="button show-private-key-keystore-upload custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold renew-on-lang-switch" data-slug="upload-backup-file-label">'+$('.translates-holder').attr('upload-backup-file-label')+'</span><img src="assets/images/loader-circle.png" class="load width-100 max-width-30"/><img src="assets/images/check.png" class="check width-100 max-width-30"/></a><div><span></span></div></label></div>';
            } else {
                show_private_key_html = '<div class="text-center import-keystore-file-row margin-top-20"><input type="file" id="show-private-key-keystore-upload" class="hide-input show-private-key-keystore-upload"/><label for="show-private-key-keystore-upload" class="button custom-upload-button"><a><span class="fs-xs-16 fs-20 lato-bold renew-on-lang-switch" data-slug="upload-backup-file-label">'+$('.translates-holder').attr('upload-backup-file-label')+'</span><img src="assets/images/loader-circle.png" class="load width-100 max-width-30"/><img src="assets/images/check.png" class="check width-100 max-width-30"/></a><div><span></span></div></label></div>';
            }

            function decryptKeystoreFileAndShowPrivateKey(this_camping_row, keystore_string, this_row) {
                $('.settings-popup .continue-with-keystore-validation').remove();
                this_camping_row.append('<div class="continue-with-keystore-validation"><div class="custom-google-label-style margin-top-25 margin-bottom-15 max-width-300 margin-left-right-auto module" data-input-light-blue-border="true"><label for="show-private-key-password" class="renew-on-lang-switch" data-slug="backup-pass">'+$('.translates-holder').attr('backup-pass')+'</label><input type="password" id="show-private-key-password" class="full-rounded"/></div><div class="padding-bottom-10 text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border continue-to-private-key renew-on-lang-switch" data-slug="CONTINUE-btn">'+$('.translates-holder').attr('CONTINUE-btn')+'</a></div></div>');

                $('#show-private-key-password').focus();
                $('label[for="show-private-key-password"]').addClass('active-label');

                $('.settings-popup .continue-to-private-key').click(function () {
                    this_row.find('.error-handle').remove();
                    if ($('.settings-popup #show-private-key-password').val().trim() == '') {
                        $('<div class="error-handle renew-on-lang-switch" data-slug="enter-backup-pass">'+$('.translates-holder').attr('enter-backup-pass')+'</div>').insertAfter(this_camping_row);
                    } else {
                        showLoader($('.translates-holder').attr('hold-decrypt'));
                        setTimeout(function () {
                            decryptKeystore(keystore_string, $('.settings-popup #show-private-key-password').val().trim(), function (success, to_string, error, error_message) {
                                if (success) {
                                    this_camping_row.html('<a href="javascript:void(0);" data-key="'+to_string+'" class="margin-top-10 fs-20 fs-xs-16 color-light-blue print-private-key inline-block white-light-blue-btn"><?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY ns_extend "http://ns.adobe.com/Extensibility/1.0/"><!ENTITY ns_ai "http://ns.adobe.com/AdobeIllustrator/10.0/"><!ENTITY ns_graphs "http://ns.adobe.com/Graphs/1.0/"><!ENTITY ns_vars "http://ns.adobe.com/Variables/1.0/"><!ENTITY ns_imrep "http://ns.adobe.com/ImageReplacement/1.0/"><!ENTITY ns_sfw "http://ns.adobe.com/SaveForWeb/1.0/"><!ENTITY ns_custom "http://ns.adobe.com/GenericCustomNamespace/1.0/"><!ENTITY ns_adobe_xpath "http://ns.adobe.com/XPath/1.0/"><svg version="1.1" style="width: 30px; display: inline-block; vertical-align: middle;" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 28 28.1" style="enable-background:new 0 0 28 28.1;" xml:space="preserve"><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="28.1" width="28" x="0" y="0"></sliceSourceBounds></sfw></metadata><path style="fill:white" d="M25,6h-3V2c0-1.1-0.9-2-2-2H8C6.9,0,6,0.9,6,2v4H3C1.3,6,0,7.3,0,9c0,0,0,0,0,0.1V19c0,1.7,1.3,3,2.9,3.1c0,0,0,0,0.1,0h3v4c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-4h3c1.7,0,3-1.3,3-3c0,0,0,0,0-0.1V9.1C28,7.4,26.7,6,25,6L25,6z M8,2h12v4H8V2z M20,26H8v-9h12V26z M26,18.9c0,0.6-0.4,1-0.9,1.1c0,0,0,0-0.1,0h-3v-3c0-1.1-0.9-2-2-2H8c-1.1,0-2,0.9-2,2v3H3c-0.6,0-1-0.4-1-1c0,0,0,0,0-0.1V9c0-0.6,0.4-1,0.9-1.1c0,0,0,0,0.1,0h22c0.6,0,1,0.4,1,1c0,0,0,0,0,0.1V18.9z M18,23c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6C17.6,22,18,22.4,18,23z M18,20c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6C17.6,19,18,19.4,18,20z M24,11c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2C23.6,10,24,10.4,24,11z"/></svg> <span class="inline-block renew-on-lang-switch" data-slug="print-pk-text">'+$('.translates-holder').attr('print-pk-text')+'</span></a><div class="padding-top-5 fs-14 color-light-blue text-left renew-on-lang-switch" data-slug="use-a4">'+$('.translates-holder').attr('use-a4')+'</div><div class="private-key-holder"><div class="scroll-content"><a href="javascript:void(0);" class="copy-private-key inline-block padding-right-5" data-toggle="tooltip" title="Copied." data-placement="right" data-clipboard-target="#copy-private-key"><svg class="width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 19.8 24" style="enable-background:new 0 0 19.8 24;" xml:space="preserve"><style type="text/css">.st0{fill:#303030;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="24" width="19.8" x="1.2" y="0"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M19.8,2.9c0,4.9,0,9.9,0,14.8c0,0.1,0,0.1,0,0.2c-0.2,1.4-1.2,2.4-2.6,2.7c-0.2,0-0.2,0.1-0.2,0.3c0,1.3-0.6,2.2-1.8,2.8c-0.3,0.2-0.7,0.2-1,0.3c-3.8,0-7.5,0-11.3,0c0,0-0.1,0-0.1,0c-1.3-0.3-2.2-1-2.6-2.3C0.1,21.4,0,21.3,0,21.1c0-4.9,0-9.9,0-14.8c0,0,0-0.1,0-0.1c0.3-1.6,1.6-2.7,3.2-2.7c2.5,0,5.1,0,7.6,0c0.7,0,1.3,0.3,1.9,0.8c1.1,1.1,2.3,2.3,3.4,3.4c0.5,0.5,0.8,1.1,0.8,1.9c0,3,0,6.1,0,9.1c0,0.1,0,0.2,0,0.3c0.2-0.1,0.3-0.1,0.4-0.2c0.6-0.3,0.8-0.9,0.8-1.6c0-4.2,0-8.4,0-12.6c0-0.4,0-0.9,0-1.3c0-1-0.7-1.7-1.7-1.7c-3.7,0-7.3,0-11,0c-0.5,0-1,0.2-1.3,0.6c0,0.1-0.1,0.1-0.2,0.1c-0.5,0-1.1,0-1.6,0c0,0,0-0.1,0-0.1c0-0.1,0-0.1,0.1-0.2c0.3-0.9,0.9-1.5,1.8-1.8C4.5,0.1,4.7,0.1,5,0c4,0,8,0,11.9,0c0,0,0.1,0,0.1,0c1.4,0.2,2.3,1.2,2.6,2.5C19.7,2.7,19.7,2.8,19.8,2.9z M1.6,13.7c0,2.3,0,4.6,0,6.9c0,1.1,0.7,1.7,1.7,1.7c3.4,0,6.8,0,10.2,0c1.1,0,1.8-0.7,1.8-1.8c0-3.7,0-7.3,0-11c0-0.1,0-0.1,0-0.2c0-0.2-0.1-0.2-0.3-0.2c-0.6,0-1.1,0-1.7,0c-1.4,0-2.3-1-2.3-2.4c0-0.5,0-1,0-1.5C11,5.1,11,5,10.8,5c-2.5,0-5,0-7.5,0C3,5,2.8,5.1,2.5,5.2C1.9,5.5,1.6,6.1,1.6,6.8C1.6,9.1,1.6,11.4,1.6,13.7z"/><path class="st0" d="M8.5,17.5c1.4,0,2.8,0,4.1,0c0.6,0,0.9,0.3,1,0.8c0.1,0.5-0.2,1-0.7,1.1c-0.1,0-0.2,0-0.3,0c-2.8,0-5.5,0-8.3,0c-0.6,0-1.1-0.4-1.1-0.9c0-0.5,0.4-0.9,1-0.9c0.6,0,1.3,0,1.9,0C6.9,17.5,7.7,17.5,8.5,17.5z"/><path class="st0" d="M8.4,15.3c-1.4,0-2.8,0-4.2,0c-0.4,0-0.8-0.2-0.9-0.6c-0.1-0.4,0-0.8,0.3-1c0.2-0.1,0.4-0.2,0.6-0.2c2.8,0,5.7,0,8.5,0c0.5,0,0.9,0.4,0.9,0.9c0,0.5-0.4,0.9-0.9,1c-0.6,0-1.2,0-1.8,0C10.1,15.3,9.3,15.3,8.4,15.3z"/><path class="st0" d="M6.7,11.2c-0.8,0-1.6,0-2.4,0c-0.4,0-0.7-0.2-0.9-0.6c-0.2-0.3-0.1-0.7,0.1-1c0.2-0.2,0.4-0.3,0.7-0.3c1.6,0,3.2,0,4.9,0c0.6,0,1,0.4,1,1c0,0.5-0.4,0.9-1,0.9C8.3,11.2,7.5,11.2,6.7,11.2z"/></g></svg></a><textarea readonly="" class="inline-block" id="copy-private-key">' + to_string + '</textarea></div></div><div class="padding-top-10 padding-bottom-15 fs-14 color-warning-red renew-on-lang-switch" data-slug="not-recomm">'+$('.translates-holder').attr('not-recomm')+'</div><div class="padding-top-10 padding-bottom-10 padding-left-70 padding-right-70 padding-left-xs-10 padding-right-xs-10 text-left fs-14 color-white row-with-warning-red-background"><div class="renew-on-lang-switch" data-slug="dont-lose-it">'+$('.translates-holder').attr('dont-lose-it')+'</div><div class="renew-on-lang-switch" data-slug="make-backup">'+$('.translates-holder').attr('make-backup')+'</div></div>');

                                    $('.print-private-key').click(function() {
                                        projectData.general_logic.generatePrivateKeyFile($(this).attr('data-key'));
                                    });

                                    //init copy button event
                                    var clipboard = new ClipboardJS('.copy-private-key');
                                    clipboard.on('success', function (e) {
                                        $('.copy-private-key').tooltip('show');
                                        setTimeout(function () {
                                            $('.copy-private-key').tooltip('hide');
                                        }, 1000);
                                    });
                                } else if (error) {
                                    $('<div class="error-handle">' + error_message + '</div>').insertAfter(this_camping_row);
                                    $('.settings-popup #show-private-key-password').val('');
                                }

                                hideLoader();
                            });
                        }, 2000);
                    }
                });
            }

            var this_row = $(this).closest('.option-row');
            var this_camping_row = this_row.find('.camping-for-action');
            this_camping_row.html(show_private_key_html);

            if (is_hybrid) {
                //MOBILE APP
                if (basic.getMobileOperatingSystem() == 'Android') {
                    //ANDROID
                    $('.show-private-key-keystore-upload').click(function () {
                        this_row.find('.error-handle').remove();
                        var this_btn = $(this);
                        fileChooser.open(function (file_uri) {
                            androidFileUpload(file_uri, function (file) {
                                var reader = new FileReader();

                                initCustomInputFileAnimation(this_btn);

                                reader.onloadend = function () {
                                    var keystore_string = this.result;

                                    if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && projectData.utils.checksumAddress(JSON.parse(keystore_string).address) == projectData.utils.checksumAddress(global_state.account)) {
                                        decryptKeystoreFileAndShowPrivateKey(this_camping_row, keystore_string, this_row);
                                    } else {
                                        $($('.translates-holder').attr('data-valid-keytore')).insertAfter(this_camping_row);
                                    }
                                };

                                reader.readAsText(file);
                            });
                        }, function (err) {
                            console.log(err);
                            $('<div class="error-handle renew-on-lang-switch" data-slug="upload-failed">'+$('.translates-holder').attr('upload-failed')+'</div>').insertAfter(this_camping_row);
                        });
                    });
                } else if (basic.getMobileOperatingSystem() == 'iOS') {
                    //iOS
                    $('.show-private-key-keystore-upload').click(function () {
                        this_row.find('.error-handle').remove();
                        var this_btn = $(this);
                        iOSFileUpload(function (keystore_string) {
                            initCustomInputFileAnimation(this_btn);

                            if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && projectData.utils.checksumAddress(JSON.parse(keystore_string).address) == projectData.utils.checksumAddress(global_state.account)) {
                                decryptKeystoreFileAndShowPrivateKey(this_camping_row, keystore_string, this_row);
                            } else {
                                $($('.translates-holder').attr('data-valid-keytore')).insertAfter(this_camping_row);
                            }
                        });
                    });
                }
            } else {
                //BROWSER
                Array.prototype.forEach.call(document.querySelectorAll('.show-private-key-keystore-upload'), function (input) {
                    var label = input.nextElementSibling;
                    input.addEventListener('change', function (e) {
                        this_row.find('.error-handle').remove();
                        var myFile = this.files[0];
                        var reader = new FileReader();

                        reader.addEventListener('load', function (e) {
                            if (basic.isJsonString(e.target.result) && basic.property_exists(JSON.parse(e.target.result), 'address') && projectData.utils.checksumAddress(JSON.parse(e.target.result).address) == projectData.utils.checksumAddress(global_state.account)) {
                                var keystore_string = e.target.result;
                                //init upload button animation
                                initCustomInputFileAnimation(label);

                                decryptKeystoreFileAndShowPrivateKey(this_camping_row, keystore_string, this_row);
                            } else {
                                $($('.translates-holder').attr('data-valid-keytore')).insertAfter(this_camping_row);
                            }
                        });

                        reader.readAsBinaryString(myFile);
                    });
                });
            }
        }
    });

    //encrypting private key with user password and return keystore file
    $('.settings-popup .generate-keystore').click(function () {
        var this_row = $(this).closest('.option-row');
        var this_camping_row = this_row.find('.camping-for-action');

        $('.settings-popup .camping-for-action').html('');
        $('.settings-popup .error-handle').remove();
        this_camping_row.html('<div class="padding-top-20"><div class="custom-google-label-style margin-bottom-15 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="generate-keystore-private-key" class="renew-on-lang-switch" data-slug="priv-key">'+$('.translates-holder').attr('priv-key')+'</label><input type="text" id="generate-keystore-private-key" class="full-rounded" maxlength="64"/></div></div><div><div class="custom-google-label-style margin-bottom-15 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="generate-keystore-password" class="renew-on-lang-switch" data-slug="pass-label">'+$('.translates-holder').attr('pass-label')+'</label><input type="password" id="generate-keystore-password" class="full-rounded"/></div></div><div><div class="custom-google-label-style margin-bottom-15 max-width-400 margin-left-right-auto module" data-input-light-blue-border="true"><label for="generate-keystore-repeat-password" class="renew-on-lang-switch" data-slug="repeat-pass-label">'+$('.translates-holder').attr('repeat-pass-label')+'</label><input type="password" id="generate-keystore-repeat-password" class="full-rounded"/></div></div><div class="text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border fs-xs-18 width-xs-100 generate-keystore-keystore-action text-uppercase renew-on-lang-switch" data-slug="generate-backup">'+$('.translates-holder').attr('generate-backup')+'</a></div>');

        $('#generate-keystore-private-key').focus();
        $('label[for="generate-keystore-private-key"]').addClass('active-label');

        $('.generate-keystore-keystore-action').click(function () {
            this_row.find('.error-handle').remove();

            var generate_error = false;
            if ($('#generate-keystore-private-key').val().trim() == '') {
                generate_error = true;
                $('<div class="error-handle renew-on-lang-switch" data-slug="enter-priv-key-error">'+$('.translates-holder').attr('enter-priv-key-error')+'</div>').insertAfter(this_camping_row);
            } else if ($('#generate-keystore-password').val().trim() == '' || $('#generate-keystore-repeat-password').val().trim() == '') {
                generate_error = true;
                $('<div class="error-handle renew-on-lang-switch" data-slug="please-enter-both-password">'+$('.translates-holder').attr('please-enter-both-password')+'</div>').insertAfter(this_camping_row);
            } else if ($('#generate-keystore-password').val().trim().length < 8 || $('#generate-keystore-password').val().trim().length > 30) {
                generate_error = true;
                $('<div class="error-handle renew-on-lang-switch" data-slug="the-pass">'+$('.translates-holder').attr('the-pass')+'</div>').insertAfter(this_camping_row);
            } else if ($('#generate-keystore-password').val().trim() != $('#generate-keystore-repeat-password').val().trim()) {
                generate_error = true;
                $('<div class="error-handle renew-on-lang-switch" data-slug="make-sure">'+$('.translates-holder').attr('make-sure')+'</div>').insertAfter(this_camping_row);
            } else if ($('#generate-keystore-private-key').val().trim().length != 64) {
                generate_error = true;
                $('<div class="error-handle renew-on-lang-switch" data-slug="wrong-key-length">'+$('.translates-holder').attr('wrong-key-length')+'</div>').insertAfter(this_camping_row);
            }

            if (!generate_error) {
                showLoader('Hold on...<br>Your Backup File is being generated.');

                setTimeout(function () {
                    generateKeystoreFromPrivateKey($('#generate-keystore-private-key').val().trim(), $('#generate-keystore-password').val().trim(), function (generating_response, address, keystore_file) {
                        if (generating_response) {
                            var keystore_file_name = buildKeystoreFileName(address);
                            if (is_hybrid) {
                                //MOBILE APP
                                if (basic.getMobileOperatingSystem() == 'Android') {
                                    //downloading the file in mobile device file system
                                    hybridAppFileDownload(keystore_file_name, keystore_file, function () {
                                        basic.closeDialog();

                                        $('body').removeClass('overflow-hidden');
                                        $('.settings-popup').addClass('hide');
                                        basic.showAlert($('.translates-holder').attr('file') +keystore_file_name + $('.translates-holder').attr('has-been-downloaded'), '', true);
                                        hideLoader();
                                    }, cordova.file.externalRootDirectory, true);
                                } else if (basic.getMobileOperatingSystem() == 'iOS') {
                                    hideLoader();
                                    //using export plugin, because in iOS there is no such thing as direct file download
                                    window.plugins.socialsharing.share(keystore_file);
                                }
                            } else {
                                //BROWSER
                                hideLoader();

                                downloadFile(buildKeystoreFileName(address), keystore_file);
                                basic.closeDialog();

                                $('body').removeClass('overflow-hidden');
                                $('.settings-popup').addClass('hide');
                                basic.showAlert($('.translates-holder').attr('file') +buildKeystoreFileName(address) + $('.translates-holder').attr('has-been-downloaded'), '', true);
                            }
                        } else if (!generating_response) {
                            hideLoader();
                            $('<div class="error-handle renew-on-lang-switch" data-slug="wrong-key-length">'+$('.translates-holder').attr('wrong-key-length')+'</div>').insertAfter(this_camping_row);
                        }
                    });
                }, 2000);
            }
        });
    });
});

//method to download files in Download folder in Android device
function hybridAppFileDownload(file_name, file_content, callback, location, download_folder) {
    console.log(location, 'location');
    window.resolveLocalFileSystemURL(location, function (fileSystem) {
        console.log(fileSystem, 'fileSystem');
        if (download_folder) {
            fileSystem.getDirectory('Download', {create: true, exclusive: false}, function (dirEntry) {
                proceedWithDownload(dirEntry, file_name);
            }, function (err) {
                console.log(err, 'err');
                hideLoader();
                alert('Something went wrong with downloading your file (Core error 5). Please contact admin@dentacoin.com.');
            });
        } else {
            proceedWithDownload(fileSystem, file_name);
        }

        function proceedWithDownload(dirEntry, file_name) {
            dirEntry.getFile(file_name, {create: true, exclusive: true}, function (fileEntry) {
                console.log(fileEntry, 'fileEntry');
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        console.log('file saved');

                        callback();
                    };

                    fileWriter.onerror = function (e) {
                        console.log(e, 'error');
                        hideLoader();
                        alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                    };

                    // Create a new Blob and write they keystore content inside of it
                    var blob = new Blob([file_content], {type: 'text/plain'});
                    console.log(blob, 'blob');
                    fileWriter.write(blob);
                }, function (err) {
                    console.log(err, 'err');
                    hideLoader();
                    alert('Something went wrong with downloading your file (Core error 4). Please contact admin@dentacoin.com.');
                });
            }, function (err) {
                // if download fails, try to download again, but with new unique name
                console.log(err, 'err');
                proceedWithDownload(dirEntry, file_name + ' (' + Math.floor(Date.now() / 1000) + ')');
            });
        }
    });
}

//opening filepicker for Android
function androidFileUpload(file_uri, callback) {
    window.FilePath.resolveNativePath(file_uri, successNative, function(e) {
        console.log(e);
        alert('Something went wrong with uploading your Backup file. Please contact admin@dentacoin.com.');
    });

    function successNative(finalPath) {
        console.log(finalPath, 'finalPath successNative');
        window.resolveLocalFileSystemURL(finalPath, function (entry) {
            entry.file(function (file) {
                callback(file);
            }, function (err) {
                alert('Something went wrong with uploading your Backup file. Please contact admin@dentacoin.com.');
            });
        });
    }
}

//opening filepicker for iOS
function iOSFileUpload(callback) {
    FilePicker.pickFile(function (path) {
        var fileDir = cordova.file.tempDirectory.replace('file://', '');
        var fileName = path.replace(fileDir, '');

        window.resolveLocalFileSystemURL(cordova.file.tempDirectory, function (rootEntry) {
            rootEntry.getFile(fileName, {create: false}, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function () {
                        var keystore_string = this.result;
                        callback(keystore_string);
                    };

                    reader.readAsText(file);
                });
            }, function (err) {
                alert('Something went wrong with reading your cached file (Core error 2). Please contact admin@dentacoin.com.');
            });
        });
    }, function (err) {
        alert('File importing failed. Please update to one of the latest iOS versions in order to have file importing working.');
    });
}

//promote mobile app when user load wallet.dentacoin.com via mobile browser
function checkIfLoadingFromMobileBrowser() {
    if (!is_hybrid && basic.isMobile() && basic.cookies.get('show-download-mobile-app') != '1') {
        basic.cookies.set('show-download-mobile-app', 1);
        if (basic.getMobileOperatingSystem() == 'Android') {
            basic.showDialog('<div><h2 class="fs-24 lato-bold text-center padding-top-15 padding-bottom-25">'+$('.translates-holder').attr('wallet-app-here')+'<br>'+$('.translates-holder').attr('free-download')+'</h2><figure itemscope="" itemtype="http://schema.org/Organization" class="text-center phone-container"><img src="assets/images/download-android-app.png" class="max-width-300 width-100" itemprop="logo" alt="Phone"/><a class="inline-block max-width-150 absolute-content" href="https://play.google.com/store/apps/details?id=wallet.dentacoin.com" target="_blank" itemprop="url"><img src="assets/images/google-play-badge.svg" class="width-100" itemprop="logo" alt="Google play icon"/></a></figure></div>', 'download-mobile-app', null, null);
        } else if (basic.getMobileOperatingSystem() == 'iOS') {
            basic.showDialog('<div><h2 class="fs-24 lato-bold text-center padding-top-15 padding-bottom-25">'+$('.translates-holder').attr('wallet-app-here')+'<br>'+$('.translates-holder').attr('free-download')+'</h2><figure itemscope="" itemtype="http://schema.org/Organization" class="text-center phone-container"><img src="assets/images/download-ios-app.png" class="max-width-300 width-100" itemprop="logo" alt="Phone"/><a class="inline-block max-width-150 absolute-content" href="https://apps.apple.com/us/app/dentacoin-wallet/id1478732657" target="_blank" itemprop="url"><img src="assets/images/app-store.svg" class="width-100" itemprop="logo" alt="App store icon"/></a></figure></div>', 'download-mobile-app', null, null);
        }
    }
}

//method to fire google analytics event
function fireGoogleAnalyticsEvent(category, action, label, value) {
    //'Register', 'Create', 'Wallet'
    if (is_hybrid) {
        var hybridEventName = 'app_' + label.replace(/\s+/g, '_').toLowerCase();
        if (value != undefined) {
            cordova.plugins.firebase.analytics.logEvent(hybridEventName, {category: category, action: action, label: label, value: value});
        } else {
            cordova.plugins.firebase.analytics.logEvent(hybridEventName, {category: category, action: action, label: label});
        }
    } else {
        var event_obj = {
            'event_action': action,
            'event_category': category,
            'event_label': label
        };

        if (value != undefined) {
            event_obj.value = value;
        }

        gtag('event', label, event_obj);
    }
}

//custom router camping for html changes, because old Android versions do not recognize Angular router
function router() {
    var current_route;

    if ($('.main-holder app-homepage').length) {
        current_route = 'home';
        getHomepageData();
        $('.nav-row .nav-link.home').addClass('active');
        $('.camp-for-fixed-mobile-nav a.home').addClass('active');
    } else if ($('.main-holder app-buy-page').length) {
        current_route = 'buy';
        getBuyPageData();
        $('.nav-row .nav-link.buy').addClass('active');
        $('.camp-for-fixed-mobile-nav a.buy').addClass('active');
    } else if ($('.main-holder app-send-page').length) {
        current_route = 'send';
        getSendPageData();
        $('.nav-row .nav-link.send').addClass('active');
        $('.camp-for-fixed-mobile-nav a.send').addClass('active');
    } else if ($('.main-holder app-spend-page-pay-for-dental-services').length) {
        current_route = 'pay-for-dental-services';
        getSpendPageDentalServices();
        $('.nav-row .nav-link.spend').addClass('active');
        $('.camp-for-fixed-mobile-nav a.spend').addClass('active');
    }/* else if ($('.main-holder app-spend-page-gift-cards').length) {
        current_route = 'gift-cards';
        getSpendPageGiftCards();
    }*/ else if ($('.main-holder app-spend-page-exchanges').length) {
        current_route = 'page-exchanges';
        getSpendPageExchanges();
        $('.nav-row .nav-link.spend').addClass('active');
        $('.camp-for-fixed-mobile-nav a.spend').addClass('active');
    } else if ($('.main-holder app-spend-page-pay-assurance-fees').length) {
        current_route = 'pay-assurance-fees';
        getSpendPageAssuranceFees();
        $('.nav-row .nav-link.spend').addClass('active');
        $('.camp-for-fixed-mobile-nav a.spend').addClass('active');
        initdApp();
    }

    $('body').on('DOMSubtreeModified', '.main-holder', function () {
        if (closeOnLoadLoader) {
            closeOnLoadLoader = false;
            setTimeout(function() {
                hideLoader();
            }, 1000)
        }

        if ($('.main-holder app-homepage').length && current_route != 'home') {
            current_route = 'home';
            getHomepageData();
            $('.nav-row .nav-link.home').addClass('active');
            $('.camp-for-fixed-mobile-nav a.home').addClass('active');
        } else if ($('.main-holder app-buy-page').length && current_route != 'buy') {
            current_route = 'buy';
            getBuyPageData();
            $('.nav-row .nav-link.buy').addClass('active');
            $('.camp-for-fixed-mobile-nav a.buy').addClass('active');
        } else if ($('.main-holder app-send-page').length && current_route != 'send') {
            current_route = 'send';
            getSendPageData();
            $('.nav-row .nav-link.send').addClass('active');
            $('.camp-for-fixed-mobile-nav a.send').addClass('active');
        } else if ($('.main-holder app-spend-page-pay-for-dental-services').length && current_route != 'pay-for-dental-services') {
            current_route = 'pay-for-dental-services';
            getSpendPageDentalServices();
            $('.nav-row .nav-link.spend').addClass('active');
            $('.camp-for-fixed-mobile-nav a.spend').addClass('active');
        }/* else if ($('.main-holder app-spend-page-gift-cards').length && current_route != 'gift-cards') {
            current_route = 'gift-cards';
            getSpendPageGiftCards();
        }*/ else if ($('.main-holder app-spend-page-exchanges').length && current_route != 'page-exchanges') {
            current_route = 'page-exchanges';
            getSpendPageExchanges();
            $('.nav-row .nav-link.spend').addClass('active');
            $('.camp-for-fixed-mobile-nav a.spend').addClass('active');
        } else if ($('.main-holder app-spend-page-pay-assurance-fees').length && current_route != 'pay-assurance-fees') {
            current_route = 'pay-assurance-fees';
            getSpendPageAssuranceFees();
            $('.nav-row .nav-link.spend').addClass('active');
            $('.camp-for-fixed-mobile-nav a.spend').addClass('active');
        }

        if (current_route != 'home' && !$('.camp-for-custom-popover').hasClass('hide')) {
            $('.camp-for-custom-popover').addClass('hide');
            clearInterval(custom_popover_interval);
        }

        updateExternalURLsForiOSDevice();
    });

    // on angular language change update the HTML inside the custom JS files
    document.addEventListener('languageChanged', function(e) {
        if (e.detail.currentLanguage == 'de') {
            setTimeout(function() {
                for (var i = 0, len = $('.renew-on-lang-switch').length; i < len; i+=1) {
                    $('.renew-on-lang-switch').eq(i).html($('.translates-holder').attr($('.renew-on-lang-switch').eq(i).attr('data-slug')));
                }
            }, 500);
        } else {
            setTimeout(function() {
                for (var i = 0, len = $('.renew-on-lang-switch').length; i < len; i+=1) {
                    $('.renew-on-lang-switch').eq(i).html($('.translates-holder').attr($('.renew-on-lang-switch').eq(i).attr('data-slug')));
                }
            }, 500);
        }
    });
}

router();

//Method that check if the device is mobile app and if the project is hybrid and then overwrite all _blank targets to _system. _blank is not working in iOS in WebView
function updateExternalURLsForiOSDevice() {
    /*if ($('.data-external-link').length && is_hybrid) {
        for(var i = 0, len = $('.data-external-link').length; i < len; i+=1) {
            if (!$('.data-external-link').eq(i).hasClass('passed')) {
                $('.data-external-link').eq(i).addClass('passed');
                $('.data-external-link').eq(i).attr('data-href', $('.data-external-link').eq(i).attr('href'));

                $('.data-external-link').eq(i).click(function() {
                    window.open($(this).attr('data-href'), '_system');
                    return false;
                });
                $('.data-external-link').eq(i).removeAttr('target');
                $('.data-external-link').eq(i).attr('href', '#');
            }
        }
    }*/
}

//fetching all get parameters from the URL into object
function getGETParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i += 1) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

function savePublicKeyToAssurance(address, key) {
    if (address.length == 40) {
        address = '0x' + address;
    }

    $.ajax({
        type: 'POST',
        url: 'https://assurance.dentacoin.com/save-public-key',
        data: {
            address: projectData.utils.checksumAddress(address),
            public_key: key
        },
        dataType: 'json',
        success: function (response) {
            //console.log(address, key);
        }
    });
}

//template to append ethereum transactions while build the transactions history
function buildEthereumHistoryTransaction(ethereum_data, value, to, from, timestamp, hash, pending) {
    var eth_amount_symbol;
    var other_address = '';
    var class_name = '';
    var label = '';
    if (projectData.utils.checksumAddress(to) == projectData.utils.checksumAddress(global_state.account)) {
        //IF THE CURRENT ACCOUNT IS RECEIVER
        other_address = from;
        label = $('.translates-holder').attr('received-from');
        class_name = 'received_from';
        eth_amount_symbol = '+';
    } else if (projectData.utils.checksumAddress(from) == projectData.utils.checksumAddress(global_state.account)) {
        //IF THE CURRENT ACCOUNT IS SENDER
        other_address = to;
        label = $('.translates-holder').attr('sent-to');
        class_name = 'sent_to';
        eth_amount_symbol = '-';
    }

    var usd_amount = (ethereum_data.market_data.current_price.usd * parseFloat(value)).toFixed(2);
    var timestamp_javascript = timestamp * 1000;
    var date_obj = new Date(timestamp_javascript);
    var minutes;
    var hours;

    if (new Date(timestamp_javascript).getMinutes() < 10) {
        minutes = '0' + new Date(timestamp_javascript).getMinutes();
    } else {
        minutes = new Date(timestamp_javascript).getMinutes();
    }

    if (new Date(timestamp_javascript).getHours() < 10) {
        hours = '0' + new Date(timestamp_javascript).getHours();
    } else {
        hours = new Date(timestamp_javascript).getHours();
    }

    if (basic.isMobile() || is_hybrid) {
        if ($(window).width() < 500) {
            other_address = projectData.utils.substr_replace(other_address, '...', -27);
        } else {
            other_address = projectData.utils.substr_replace(other_address, '...', -20);
        }
    }

    var transaction_id_label = 'Transaction ID';
    if (pending != undefined) {
        transaction_id_label += '<span class="pending-transaction">( Pending )</span>';
    }

    return '<tr class="' + class_name + ' single-transaction" onclick="window.open(\'https://etherscan.io/tx/' + hash + '\');"><td class="icon"></td><td><ul><li>' + (date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() + '</li><li>' + hours + ':' + minutes + '</li></ul></td><td><ul><li><span><strong>' + label + ': </strong>' + other_address + '</span></li><li><a href="https://etherscan.io/tx/' + hash + '" target="_blank" class="lato-bold color-white data-external-link">' + transaction_id_label + '</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5"><ul><li class="lato-bold dcn-amount">' + eth_amount_symbol + parseFloat(value).toFixed(6) + ' ETH</li><li>' + usd_amount + ' USD</li></ul></td></tr>';
}

//template to append dentacoin transactions while build the transactions history
function buildDentacoinHistoryTransaction(dentacoin_data, value, to, from, timestamp, transactionHash, pending) {
    var dcn_amount_symbol;
    var other_address = '';
    var class_name = '';
    var label = '';
    if (projectData.utils.checksumAddress(to) == projectData.utils.checksumAddress(global_state.account)) {
        //IF THE CURRENT ACCOUNT IS RECEIVER
        other_address = from;
        label = $('.translates-holder').attr('received-from');
        class_name = 'received_from';
        dcn_amount_symbol = '+';
    } else if (projectData.utils.checksumAddress(from) == projectData.utils.checksumAddress(global_state.account)) {
        //IF THE CURRENT ACCOUNT IS SENDER
        other_address = to;
        label = $('.translates-holder').attr('sent-to');
        class_name = 'sent_to';
        dcn_amount_symbol = '-';
    }

    var dcn_amount = dcn_amount_symbol + value + ' DCN';
    var timestamp_javascript = timestamp * 1000;
    var date_obj = new Date(timestamp_javascript);
    var minutes;
    var hours;

    if (new Date(timestamp_javascript).getMinutes() < 10) {
        minutes = '0' + new Date(timestamp_javascript).getMinutes();
    } else {
        minutes = new Date(timestamp_javascript).getMinutes();
    }

    if (new Date(timestamp_javascript).getHours() < 10) {
        hours = '0' + new Date(timestamp_javascript).getHours();
    } else {
        hours = new Date(timestamp_javascript).getHours();
    }

    if (basic.isMobile() || is_hybrid) {
        if ($(window).width() < 500) {
            other_address = projectData.utils.substr_replace(other_address, '...', -30);
        } else {
            other_address = projectData.utils.substr_replace(other_address, '...', -20);
        }
    }

    var transaction_id_label = 'Transaction ID';
    if (pending != undefined) {
        transaction_id_label += '<span class="pending-transaction">( Pending )</span>';
    }

    var pricesList = '';
    if (dentacoin_data != 0) {
        var usd_amount = (parseInt(value) * dentacoin_data).toFixed(2);
        pricesList = '<ul><li class="lato-bold dcn-amount">' + dcn_amount + '</li><li>' + usd_amount + ' USD</li></ul>';
    } else {
        pricesList = '<ul><li class="lato-bold dcn-amount">' + dcn_amount + '</li></ul>';
    }

    return '<tr class="' + class_name + ' single-transaction" onclick="window.open(\'https://etherscan.io/tx/' + transactionHash + '\');"><td class="icon"></td><td><ul><li>' + (date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() + '</li><li>' + hours + ':' + minutes + '</li></ul></td><td><ul><li><span><strong>' + label + ': </strong>' + other_address + '</span></li><li><a href="https://etherscan.io/tx/' + transactionHash + '" target="_blank" class="lato-bold color-white data-external-link">' + transaction_id_label + '</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5">' + pricesList + '</td></tr>';
}

function initScan(clicker, valueHolder, callback, warning, warningText) {
    if (clicker === undefined) {
        clicker = null;
    }
    if (valueHolder === undefined) {
        valueHolder = null;
    }
    if (callback === undefined) {
        callback = null;
    }
    if (warning === undefined) {
        warning = null;
    }
    if (warningText === undefined) {
        warningText = null;
    }

    clicker.click(function () {
        if (warning != null) {
            var initScanWarning = {};
            initScanWarning.callback = function (warningResult) {
                if (warningResult) {
                    proceedWithScanning();
                }
            };
            basic.showConfirm(warningText, '', initScanWarning, true);
        } else {
            proceedWithScanning();
        }

        function proceedWithScanning() {
            if (is_hybrid) {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (valueHolder != null) {
                            valueHolder.val(result.text).trigger('change');
                        }
                        if (callback != null) {
                            callback(result.text);
                        }
                    },
                    function (error) {
                        alert($('.translates-holder').attr('scanning-failed'));
                    }
                );
            } else {
                //BROWSER SCAN
                if (load_qr_code_lib) {
                    showLoader();
                    $.getScript('https://rawgit.com/schmich/instascan-builds/master/instascan.min.js', function () {
                        load_qr_code_lib = false;
                        hideLoader();

                        initQRCodePopupForSendingTransaction();
                    });
                } else {
                    initQRCodePopupForSendingTransaction();
                }

                function initQRCodePopupForSendingTransaction() {
                    basic.showDialog('<div class="video-container"><video id="qr-preview"></video></div>', 'popup-scan-qr-code', null, true);

                    var cameras_global;
                    var scanner = new Instascan.Scanner({video: document.getElementById('qr-preview')});
                    scanner.addListener('scan', function (content) {
                        if (valueHolder != null) {
                            valueHolder.val(content).trigger('change');
                        }
                        if (callback != null) {
                            callback(content);
                        }
                        $('.popup-scan-qr-code').modal('hide');
                        scanner.stop(cameras_global[0]);
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

                    $('.popup-scan-qr-code .bootbox-close-button').click(function () {
                        if (cameras_global.length > 0) {
                            scanner.stop(cameras_global[0]);
                        }
                    });
                }
            }
        }
    });
}

var assuranceTransactions = {
    approval: async function (gasPrice, key, callback) {
        var dentacoin_token_instance = await new dApp.web3_1_0_assurance.eth.Contract(assurance_config.dentacoin_token_abi, assurance_config.dentacoin_token_address);
        var approval_function_abi = await dentacoin_token_instance.methods.approve(assurance_config.assurance_state_address, assurance_config.dentacoins_to_approve).encodeABI();
        var gas_cost_for_approval = await dentacoin_token_instance.methods.approve(assurance_config.assurance_state_address, assurance_config.dentacoins_to_approve).estimateGas({gas: 500000});

        dApp.web3_1_0_assurance.eth.getTransactionCount(global_state.account, 'pending', function (err, nonce) {
            var approval_transaction_obj = {
                gasLimit: dApp.web3_1_0_assurance.utils.toHex(Math.round(gas_cost_for_approval + (gas_cost_for_approval * 10 / 100))),
                gasPrice: gasPrice,
                from: global_state.account,
                nonce: dApp.web3_1_0_assurance.utils.toHex(nonce),
                chainId: assurance_config.chain_id,
                data: approval_function_abi,
                to: assurance_config.dentacoin_token_address
            };

            const EthereumTx = require('ethereumjs-tx');
            const approval_transaction = new EthereumTx(approval_transaction_obj);
            //signing the transaction
            approval_transaction.sign(key);


            callback('0x' + approval_transaction.serialize().toString('hex'));

            //sending the transaction
            /*dApp.web3_1_0_assurance.eth.sendSignedTransaction('0x' + approval_transaction.serialize().toString('hex'), function (err, transactionHash) {
                if (!err) {
                    callback();
                } else {
                    basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                }
            });*/
        });
    },
    creation: async function (dentist, usd, dcn, next_transfer, ipfs_hash, gasPrice, key, callback, increaseNonce) {
        if (increaseNonce == undefined) {
            increaseNonce = null;
        }

        var assurance_proxy_instance = await new dApp.web3_1_0_assurance.eth.Contract(assurance_config.assurance_proxy_abi, assurance_config.assurance_proxy_address);
        var assurance_state_instance = await new dApp.web3_1_0_assurance.eth.Contract(assurance_config.assurance_state_abi, assurance_config.assurance_state_address);

        var period_to_withdraw = parseInt(await assurance_state_instance.methods.getPeriodToWithdraw().call());
        var contract_creation_function_abi = await assurance_proxy_instance.methods.registerContract(projectData.utils.checksumAddress(global_state.account), projectData.utils.checksumAddress(dentist), Math.floor(usd), dcn, parseInt(next_transfer) + period_to_withdraw, ipfs_hash).encodeABI();
        var gas_cost_for_contract_creation = await assurance_proxy_instance.methods.registerContract(assurance_config.dummy_address, projectData.utils.checksumAddress(dentist), Math.floor(usd), dcn, parseInt(next_transfer) + period_to_withdraw, ipfs_hash).estimateGas({
            from: assurance_config.dummy_address,
            gas: 1000000
        });

        dApp.web3_1_0_assurance.eth.getTransactionCount(global_state.account, 'pending', function (err, nonce) {
            // increase nonce + 1, because approval transaction is not sent yet.
            if (increaseNonce != null) {
                nonce += 1;
            }

            var contract_creation_transaction_obj = {
                gasLimit: dApp.web3_1_0_assurance.utils.toHex(Math.round(gas_cost_for_contract_creation + (gas_cost_for_contract_creation * 10 / 100))),
                gasPrice: gasPrice,
                from: global_state.account,
                nonce: dApp.web3_1_0_assurance.utils.toHex(nonce),
                chainId: assurance_config.chain_id,
                data: contract_creation_function_abi,
                to: assurance_config.assurance_proxy_address
            };

            const EthereumTx = require('ethereumjs-tx');
            const contract_creation_transaction = new EthereumTx(contract_creation_transaction_obj);
            //signing the transaction
            contract_creation_transaction.sign(key);


            callback('0x' + contract_creation_transaction.serialize().toString('hex'));
        });
    },
    dentist_approval: async function (patient, gasPrice, key, callback) {
        var assurance_proxy_instance = await new dApp.web3_1_0_assurance.eth.Contract(assurance_config.assurance_proxy_abi, assurance_config.assurance_proxy_address);

        var gas_cost_for_contract_approval = await assurance_proxy_instance.methods.dentistApproveContract(patient).estimateGas({
            from: global_state.account,
            gas: 500000
        });

        var contract_approval_function_abi = await assurance_proxy_instance.methods.dentistApproveContract(patient).encodeABI();

        const EthereumTx = require('ethereumjs-tx');
        var nonce = await dApp.web3_1_0_assurance.eth.getTransactionCount(global_state.account, 'pending');

        var contract_approval_transaction_obj = {
            gasLimit: dApp.web3_1_0_assurance.utils.toHex(Math.round(gas_cost_for_contract_approval + (gas_cost_for_contract_approval * 10 / 100))),
            gasPrice: gasPrice,
            from: global_state.account,
            nonce: dApp.web3_1_0_assurance.utils.toHex(nonce),
            chainId: assurance_config.chain_id,
            data: contract_approval_function_abi,
            to: assurance_config.assurance_proxy_address
        };

        const contract_approval_transaction = new EthereumTx(contract_approval_transaction_obj);
        //signing the transaction
        contract_approval_transaction.sign(key);

        callback('0x' + contract_approval_transaction.serialize().toString('hex'));

        //sending the transaction
        /*dApp.web3_1_0_assurance.eth.sendSignedTransaction('0x' + contract_approval_transaction.serialize().toString('hex'), function (err, transactionHash) {
            if (!err) {
                callback(transactionHash);
            } else {
                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
            }
        });*/
    },
    withdraw: async function (patient, gasPrice, key, callback) {
        var assurance_proxy_instance = await new dApp.web3_1_0_assurance.eth.Contract(assurance_config.assurance_proxy_abi, assurance_config.assurance_proxy_address);
        var gas_cost_for_withdraw = await assurance_proxy_instance.methods.singleWithdraw(patient).estimateGas({
            from: global_state.account,
            gas: 500000
        });

        var withdraw_function_abi = await assurance_proxy_instance.methods.singleWithdraw(patient).encodeABI();

        const EthereumTx = require('ethereumjs-tx');
        var nonce = await dApp.web3_1_0_assurance.eth.getTransactionCount(global_state.account, 'pending');

        var withdraw_transaction_obj = {
            gasLimit: dApp.web3_1_0_assurance.utils.toHex(Math.round(gas_cost_for_withdraw + (gas_cost_for_withdraw * 5 / 100))),
            gasPrice: gasPrice,
            from: global_state.account,
            nonce: dApp.web3_1_0_assurance.utils.toHex(nonce),
            chainId: assurance_config.chain_id,
            data: withdraw_function_abi,
            to: assurance_config.assurance_proxy_address
        };

        const withdraw_transaction = new EthereumTx(withdraw_transaction_obj);
        //signing the transaction
        withdraw_transaction.sign(key);

        callback('0x' + withdraw_transaction.serialize().toString('hex'));

        //sending the transaction
        /*dApp.web3_1_0_assurance.eth.sendSignedTransaction('0x' + withdraw_transaction.serialize().toString('hex'), function (err, transactionHash) {
            if (!err) {
                callback(transactionHash);
            } else {
                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
            }
        });*/
    },
    cancel: async function (patient, dentist, gasPrice, key, callback) {
        var assurance_proxy_instance = await new dApp.web3_1_0_assurance.eth.Contract(assurance_config.assurance_proxy_abi, assurance_config.assurance_proxy_address);

        var gas_cost_for_contract_cancellation = await assurance_proxy_instance.methods.breakContract(patient, dentist).estimateGas({
            from: global_state.account,
            gas: 500000
        });

        var contract_cancellation_function_abi = await assurance_proxy_instance.methods.breakContract(patient, dentist).encodeABI();

        const EthereumTx = require('ethereumjs-tx');
        var nonce = await dApp.web3_1_0_assurance.eth.getTransactionCount(global_state.account, 'pending');

        var contract_cancellation_transaction_obj = {
            gasLimit: dApp.web3_1_0_assurance.utils.toHex(Math.round(gas_cost_for_contract_cancellation + (gas_cost_for_contract_cancellation * 10 / 100))),
            gasPrice: gasPrice,
            from: global_state.account,
            nonce: dApp.web3_1_0_assurance.utils.toHex(nonce),
            chainId: assurance_config.chain_id,
            data: contract_cancellation_function_abi,
            to: assurance_config.assurance_proxy_address
        };

        const contract_cancellation_transaction = new EthereumTx(contract_cancellation_transaction_obj);
        //signing the transaction
        contract_cancellation_transaction.sign(key);

        callback('0x' + contract_cancellation_transaction.serialize().toString('hex'));

        //sending the transaction
        /*dApp.web3_1_0_assurance.eth.sendSignedTransaction('0x' + contract_cancellation_transaction.serialize().toString('hex'), function (err, transactionHash) {
            if (!err) {
                callback(transactionHash);
            } else {
                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
            }
        });*/
    }
};

function firePushNotification(title, text) {
    if (is_hybrid) {
        cordova.plugins.notification.local.schedule({
            title: title,
            text: text,
            foreground: true
        });
    }
}

function showMobileAppBannerForDesktopBrowsers() {
    if (!is_hybrid && !basic.isMobile()) {
        hideMobileAppBannerForDesktopBrowsers();
        setTimeout(function() {
            if ($('.mobile-app-banner').length) {
                $('.mobile-app-banner').remove();
            }
            $('footer').prepend('<div class="mobile-app-banner margin-bottom-25">' + mobileAppBannerForDesktopBrowsersHtml + '</div>');
            $('.mobile-app-banner-title').html($('.translates-holder').attr('also-available'));
        }, 1000);
    }
}

function hideMobileAppBannerForDesktopBrowsers() {
    $('footer .mobile-app-banner').remove();
}