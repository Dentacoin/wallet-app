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
                        console.log(borderImage, 'borderImage');
                        borderStyle = 'width: 100%';

                        printingHtml = '<html><head><style>body, html {margin: 0; padding: 0;text-align: center;color: black;font-family: “Helvetica Neue”,Helvetica,Arial,sans-serif;} .border-parent{text-align: left;position:relative; display: inline-block;} img {'+borderStyle+'} .absolute-content{position: absolute;z-index: 100;width: 80%;height: 80%;top: 0;left: 0;padding: 10%;}</style></head><body><div class="border-parent"><img '+borderImage+' id="border-image"/><div class="absolute-content"><div style="text-align:center;"><i>'+$('.translates-holder').attr('confidential')+'</i><h1 style="margin-top: 15px;font-weight:bold;color: black; margin-bottom: 10px;">DENTACOIN</h1><div style="font-size: 18px;color: #2a3575;padding-bottom: 15px;"><b>'+$('.translates-holder').attr('unlock-funds')+'</b></div><div style="background-color: white;padding: 20px 10px;text-align: left;"><div style="color: #888888;padding-bottom: 5px;font-weight: bold;">'+$('.translates-holder').attr('pk-label')+':</div><div style="font-size: 14px;">'+privateKey+'</div></div><div style="font-size: 22px;padding: 30px 0 10px;"><b>'+$('.translates-holder').attr('pk-as-qr')+'</b></div><div>'+qrCodeBase64Data+'</div><div style=" text-align: left; "><div style="font-size: 20px;color: #2a3575;padding-bottom: 15px;padding-top: 20px;font-weight: bold;">'+$('.translates-holder').attr('important')+'</div><div style=" padding-bottom: 15px;"><b>1.</b> '+$('.translates-holder').attr('provides')+'<div></div>'+projectData.utils.checksumAddress(window.localStorage.getItem('current_account'))+'</div><div style=" padding-bottom: 15px;"><b>2.</b> '+$('.translates-holder').attr('secure-place')+'</div><div style=" padding-bottom: 15px;"><b>3. '+$('.translates-holder').attr('never-share')+'</div><div><b>4.</b> '+$('.translates-holder').attr('to-unlock')+'</div></div></div></div></div></body></html>';
                    }
                }

                if (is_hybrid) {
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

                            if (basic.getMobileOperatingSystem() == 'iOS') {
                                hideLoader();
                            }

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