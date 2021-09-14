var closeOnLoadLoader = true;
//importing methods for keystore import, export, decrypt
var {getWeb3, getContractInstance, generateKeystoreFile, importKeystoreFile, decryptKeystore, validatePrivateKey, generateKeystoreFromPrivateKey} = require('./helper');

var {config_variable} = require('./config');
var assurance_config;
var iframeHeightListenerInit = true;
var isDeviceReady = false;
var lastHybridScreen;
var inAppBrowserSettings = 'location=yes,zoom=no,toolbarposition=top,closebuttoncaption=Back,presentationstyle=fullscreen,fullscreen=yes';
if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
    inAppBrowserSettings = 'location=no,hardwareback=no,zoom=no,toolbarposition=top,closebuttoncaption=Back,presentationstyle=fullscreen,fullscreen=yes';
}

console.log("( ͡° ͜ʖ ͡°) I see you.");

$(document).ready(function () {
    loadMobileBottomFixedNav();
});

$(window).on('beforeunload', function () {

});

$(window).on('load', function () {

});

$(window).on('resize', function () {

});

$(window).on('scroll', function () {

});

window.addEventListener('load', function () {

});

// event called only on hybrid app
document.addEventListener('deviceready', async function () {
    console.log('================= deviceready ===================');
    isDeviceReady = true;

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

    // save firebase mobile ID
    if (basic.getMobileOperatingSystem() == 'Android') {
        window.FirebasePlugin.hasPermission(function(hasPermission) {
            console.log(hasPermission, 'hasPermission');
            if (basic.property_exists(hasPermission, 'isEnabled') && !hasPermission.isEnabled) {
                // ask for push notifications permission
                window.FirebasePlugin.grantPermission();
            } else{
                console.log('Permission already granted');
            }
        });

        window.FirebasePlugin.getToken(function(token) {
            // save this server-side and use it to push notifications to this device
            localStorage.setItem('mobile_device_id', token);
        }, function(error) {
            console.error(error);
        });

        // camp for push notifications when app is running in foreground
        window.FirebasePlugin.onNotificationOpen(function(notification) {
            console.log(notification, 'notification');
            if (basic.property_exists(notification, 'title') && basic.property_exists(notification, 'body')) {
                projectData.general_logic.firePushNotification(notification.title, notification.body);
            }
        }, function(error) {
            console.error(error, 'error');
        });
    } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
        const wasPermissionGiven = await FCM.requestPushPermission({
            ios9Support: {
                timeout: 10,  // How long it will wait for a decision from the user before returning `false`
                interval: 0.3 // How long between each permission verification
            }
        });

        console.log(wasPermissionGiven, 'wasPermissionGiven');
        var FCMToken = await FCM.getToken();
        localStorage.setItem('mobile_device_id', FCMToken);

        // camp for push notifications when app is running in foreground
        FCM.onNotification(function(notification){
            console.log(notification, 'notification');
            if (basic.property_exists(notification, 'google.c.sender.id') && basic.property_exists(notification, 'title') && basic.property_exists(notification, 'body')) {
                projectData.general_logic.firePushNotification(notification.title, notification.body);
            }
        });
    }
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
var getL1Instance;
var getL2Instance;
var L1DCNContract;
var L2DCNContract;
var L2OptimismGatewayProxyContract;
var L2OptimismL2StandardBridgeContract;
var core_db_clinics;
var core_db_clinics_time_to_request;
var block_number_of_dcn_creation = 3170000;
var load_qr_code_lib = true;
var indacoin_data = {};
var tx_history = [];

//dApp init
var dApp = {
    loaded: false,
    web3Provider: null,
    web3_l1: null,
    web3_l2: null,
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
                        dApp.web3_l1 = web3;
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
                dApp.web3_l1 = web3;

                continueWithContractInstanceInit();
            }
        } else {
            //NO METAMASK INSTALLED
            if (window.localStorage.getItem('current_account') != null && (typeof(web3) === 'undefined' || window.localStorage.getItem('custom_wallet_over_external_web3_provider') == 'true')) {
                global_state.account = window.localStorage.getItem('current_account');
            }

            dApp.web3_l1 = getWeb3(new Web3.providers.HttpProvider(config_variable.l1.provider));
            dApp.web3_l2 = getWeb3(new Web3.providers.HttpProvider(config_variable.l2.provider));
            dApp.web3_l1_assurance = getWeb3(new Web3.providers.HttpProvider(assurance_config.infura_node));

            continueWithContractInstanceInit();
        }

        function continueWithContractInstanceInit() {
            if ((typeof(global_state.account) == 'undefined' || !projectData.utils.innerAddressCheck(global_state.account)) && typeof(web3) !== 'undefined' && window.localStorage.getItem('custom_wallet_over_external_web3_provider') == null) {
                $('.logo-and-settings-row .open-settings-col').remove();
            }

            //init contract
            if (typeof(global_state.account) != 'undefined' && projectData.utils.innerAddressCheck(global_state.account)) {
                if ((typeof(web3) === 'undefined' || window.localStorage.getItem('custom_wallet_over_external_web3_provider') == 'true') && $('.logo-and-settings-row .open-settings-col').length == 0 && $('.logo-and-settings-row').length > 0) {
                    $('.logo-and-settings-row').append('<div class="col-xs-6 inline-block open-settings-col"><figure itemscope="" itemtype="http://schema.org/Organization" class="text-right"><a href="javascript:void(0)" itemprop="url" class="open-wallet-menu"><ul><li></li><li></li><li></li></ul></a></figure></div>');
                }

                // get the contract artifact file and use it to instantiate a truffle contract abstraction
                getL1Instance = getContractInstance(dApp.web3_l1);
                L1DCNContract = getL1Instance(config_variable.l1.dcn_contract_abi, config_variable.l1.dcn_contract_address);
                getL2Instance = getContractInstance(dApp.web3_l2);
                L2DCNContract = getL2Instance(config_variable.l2.dcn_contract_abi, config_variable.l2.dcn_contract_address);
                L2OptimismGatewayProxyContract = getL2Instance(config_variable.l2.optimism_eth_gateway_bridge_contract_abi, config_variable.l2.optimism_eth_gateway_bridge_contract_address);
                L2OptimismL2StandardBridgeContract = getL2Instance(config_variable.l2.optimism_L2StandardBridge_abi, config_variable.l2.optimism_L2StandardBridge_address);

                if (callback != undefined) {
                    callback();
                }

                projectData.general_logic.buildTransactionHistory();
            }
        }
    },
    methods: {
        getDCNBalance: function (contract, address, callback) {
            contract.methods.balanceOf(address).call({from: address}, function (err, response) {
                callback(err, response);
            });
        },
        transfer: function (send_addr, value) {
            return L1DCNContract.methods.transfer(send_addr, value).send({
                from: global_state.account,
                gas: 60000
            }).on('transactionHash', function (hash) {
                projectData.general_logic.displayMessageOnTransactionSend('Dentacoin tokens', hash);
            }).catch(function (err) {
                basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
            });
        }
    },
    helper: {
        getBlockNum: function () {
            return new Promise(function (resolve, reject) {
                dApp.web3_l1.eth.getBlockNumber(function (error, result) {
                    if (!error) {
                        global_state.curr_block = result;
                        resolve(global_state.curr_block);
                    }
                });
            });
        },
        addBlockTimestampToTransaction: function (blockNumber, object_key) {
            dApp.web3_l1.eth.getBlock(blockNumber, function (error, result) {
                if (error !== null) {

                }
                if (result != undefined && result != null) {
                    temporally_timestamps[object_key] = result.timestamp;
                }
            });
        },
        getAddressETHBalance: function (address) {
            return new Promise(function (resolve, reject) {
                resolve(dApp.web3_l1.eth.getBalance(address));
            });
        }
    }
};

//logic splitted by pages
var projectData = {
    pages: {
        homepage: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            if (typeof(global_state.account) != 'undefined') {
                projectData.general_logic.showLoader();
                projectData.general_logic.showMobileAppBannerForDesktopBrowsers();

                function refreshAccountDataButtonLogic() {
                    clearInterval(request_interval_for_rest_of_transaction_history);
                    projectData.general_logic.buildTransactionHistory();

                    setTimeout(async function () {
                        //show user ethereum address
                        $('.eth-address-container .address-value').val(projectData.utils.checksumAddress(global_state.account));

                        var l1_dcn_balance = parseInt(await L1DCNContract.methods.balanceOf(global_state.account).call());
                        var l2_dcn_balance = parseInt(await L2DCNContract.methods.balanceOf(global_state.account).call());
                        var l1_eth_balance = await dApp.web3_l1.eth.getBalance(global_state.account);
                        var l2_eth_balance = await dApp.web3_l2.eth.getBalance(global_state.account);
                        $('.main-wrapper .dcn-amount').html((l1_dcn_balance + l2_dcn_balance).toLocaleString());

                        projectData.requests.getDentacoinDataByCoingeckoProvider(function (dentacoin_data) {
                            if (l1_dcn_balance > 0) {
                                $('.single-currency.l1-dcn-currency .l1-dcn-balance').html(l1_dcn_balance.toLocaleString());
                                $('.single-currency.l1-dcn-currency .l1-dcn-balance-in-usd').html(parseFloat((l1_dcn_balance * dentacoin_data).toFixed(2)).toLocaleString());
                                $('.single-currency.l1-dcn-currency').removeClass('hide');
                            }

                            if (l2_dcn_balance > 0) {
                                $('.single-currency.l2-dcn-currency .l2-dcn-balance').html(l2_dcn_balance.toLocaleString());
                                $('.single-currency.l2-dcn-currency .l2-dcn-balance-in-usd').html(parseFloat((l2_dcn_balance * dentacoin_data).toFixed(2)).toLocaleString());
                            }

                            if (l1_eth_balance > 0) {
                                $('.single-currency.l1-eth-currency .l1-eth-balance').html(parseFloat(projectData.utils.fromWei(l1_eth_balance)).toFixedNoRounding(8));
                                $('.single-currency.l1-eth-currency').removeClass('hide');
                            }

                            if (l2_eth_balance > 0) {
                                $('.single-currency.l2-eth-currency .l2-eth-balance').html(parseFloat(projectData.utils.fromWei(l2_eth_balance)).toFixedNoRounding(8));
                            }

                            if ($('.bottom-side').hasClass('hide')) {
                                $('.bottom-side').removeClass('hide');
                            }

                            $('.refresh-account-data').unbind().click(function () {
                                projectData.general_logic.showLoader();
                                refreshAccountDataButtonLogic();
                            });

                            projectData.general_logic.hideLoader();
                        });

                        $('.more-info').popover({
                            trigger: 'click'
                        });


                        $('.join-the-future .close-btn').click(function() {
                            $('.join-the-future').remove();
                        });

                        if ($('.join-the-future .open-popup').length) {
                            $('.join-the-future .open-popup').click(function() {
                                projectData.general_logic.openL2InformationPopups('what-is-dcn2');
                            });
                        }
                    }, 1000);
                }
                refreshAccountDataButtonLogic();

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
                        left: $('.more-info').offset().left - 10
                    });
                }
            }
        },
        buy_page: function () {
            if (window.localStorage.getItem('hide_buy_page_notice') == null && !$('header .camping-buy-page-notice').hasClass('shown')) {
                $('header .camping-buy-page-notice').addClass('shown').html('<div class="wrapper fs-0"><figure itemscope="" itemtype="http://schema.org/ImageObject" class="inline-block icon"><img src="assets/images/attention-icon-white.svg" alt="Attention icon" itemprop="contentUrl"/></figure><div class="inline-block fs-20 fs-xs-16 description">For the moment, you can only buy DCN on the main Ethereum network (used for trading). If you want to stake it or use it for Assurance fees, use the SWAP to DCN2 function after purchase.</div><div class="inline-block close-btn"><a href="javascript:void(0);" class="close-notice fs-30 color-white">×</a></div></div>').fadeIn(500);
                $('header .camping-buy-page-notice .close-notice').click(function() {
                    window.localStorage.setItem('hide_buy_page_notice', 'true');
                    $('header .camping-buy-page-notice').html('').fadeOut(500);
                });
            }

            projectData.utils.saveHybridAppCurrentScreen();

            projectData.requests.getMinimumUsdValueFromIndacoin(function (minimumIndacoinUsdForTransaction) {
                // rounding to 5 or 0
                minimumIndacoinUsdForTransaction = Math.ceil(minimumIndacoinUsdForTransaction / 5) * 5;
                $('.min-usd-amount').html(minimumIndacoinUsdForTransaction);

                projectData.general_logic.showMobileAppBannerForDesktopBrowsers();

                if (typeof(global_state.account) != 'undefined') {
                    $('section.ready-to-purchase-with-external-api input#dcn_address').parent().find('label').addClass('active-label');
                    $('section.ready-to-purchase-with-external-api input#dcn_address').val(projectData.utils.checksumAddress(global_state.account));
                }

                //getting DCN data from Indacoin every 10 minutes
                if (!basic.property_exists(indacoin_data, 'dcn') || (basic.property_exists(indacoin_data, 'dcn') && indacoin_data.dcn.timestamp < Date.now())) {
                    projectData.general_logic.showLoader();
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
                        projectData.general_logic.showLoader();
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

                        projectData.general_logic.hideLoader();

                        // on currency switch from the dropdown
                        $('section.ready-to-purchase-with-external-api #active-crypto').unbind().on('change', function () {
                            var thisValue = $(this);

                            projectData.general_logic.showLoader();
                            setTimeout(function() {
                                projectData.requests.getMinimumUsdValueFromIndacoin(function (onChangeMinimumIndacoinUsdForTransaction) {
                                    // rounding to 5 or 0
                                    onChangeMinimumIndacoinUsdForTransaction = Math.ceil(onChangeMinimumIndacoinUsdForTransaction / 5) * 5;
                                    $('section.ready-to-purchase-with-external-api #usd-value').val(onChangeMinimumIndacoinUsdForTransaction);

                                    if (thisValue.val() == 'dcn') {
                                        projectData.requests.getCryptoDataByIndacoin('DCN', onChangeMinimumIndacoinUsdForTransaction, function (onChangeDcnData) {
                                            $('.ready-to-purchase-with-external-api .address-to-receive').html('DCN');
                                            $('section.ready-to-purchase-with-external-api #crypto-amount').val(parseInt(onChangeDcnData.dcn.value));

                                            projectData.general_logic.hideLoader();
                                        });
                                    } else if (thisValue.val() == 'eth') {
                                        projectData.requests.getCryptoDataByIndacoin('ETH', onChangeMinimumIndacoinUsdForTransaction, function (onChangeEthData) {
                                            $('.ready-to-purchase-with-external-api .address-to-receive').html('ETH');
                                            $('section.ready-to-purchase-with-external-api #crypto-amount').val(onChangeEthData.eth.value);

                                            projectData.general_logic.hideLoader();
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
                projectData.general_logic.showMobileAppBannerForDesktopBrowsers();

                //reading all clinics/ dentists from the CoreDB EVERY 1h
                projectData.general_logic.showLoader();

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

                    projectData.general_logic.initScan($('.scan-qr-code'), $('#search'));

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

                    async function ifCoreDBReturnsClinics() {
                        if (core_db_clinics.success) {
                            var clinics_select_html = '';
                            for (var i = 0, len = core_db_clinics.data.length; i < len; i += 1) {
                                if (core_db_clinics.data[i].dcn_address != null) {
                                    clinics_select_html += '<li><a href="javascript:void(0);" class="display-block-important" data-value="' + core_db_clinics.data[i].dcn_address + '">' + core_db_clinics.data[i].name + '</a></li>';
                                }
                            }

                            var clinicsRequest = await projectData.requests.getDentaprimeClinicAddresses();
                            if (clinicsRequest.success && clinicsRequest.data.length) {
                                for (var i = 0, len = clinicsRequest.data.length; i < len; i+=1) {
                                    clinics_select_html += '<li><a href="javascript:void(0);" class="display-block-important" data-value="' + clinicsRequest.data[i].dcn_address + '">' + clinicsRequest.data[i].dcn_address_label + ' <span>(' + clinicsRequest.data[i].dcn_address + ')</span></a></li>';
                                }
                            }

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
                                            projectData.general_logic.showLoader();
                                            $.getScript('https://rawgit.com/schmich/instascan-builds/master/instascan.min.js', function () {
                                                load_qr_code_lib = false;
                                                projectData.general_logic.hideLoader();

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
                    // var gasPrice = await dApp.web3_l1.eth.getGasPrice();

                    function bindSendPageElementsEvents() {
                        projectData.general_logic.hideLoader();

                        $('.section-send .next-send').click(function () {
                            if (!$(this).hasClass('disabled')) {
                                projectData.general_logic.fireGoogleAnalyticsEvent('Pay', 'Next', 'DCN Address');

                                projectData.general_logic.showLoader();
                                projectData.requests.getEthereumDataByCoingecko(function (request_response) {
                                    var ethereum_data = request_response;

                                    //getting dentacoin data by Coingecko
                                    projectData.requests.getDentacoinDataByCoingeckoProvider(async function (request_response) {
                                        $('.section-send').hide();
                                        $('.section-amount-to .address-cell').html($('.search-field #search').val().trim()).attr('data-receiver', $('.search-field #search').val().trim());
                                        window.scrollTo(0, 0);

                                        // remove loader from send page when all external requests are made
                                        projectData.general_logic.hideLoader();

                                        $('.section-amount-to').fadeIn(500);

                                        var dentacoin_data = request_response;

                                        // if user has enough dcn balance show maximum spending balance shortcut
                                        var l1_dcn_balance = parseInt(await L1DCNContract.methods.balanceOf(global_state.account).call());
                                        /*$('.spendable-amount').addClass('active').html('<div class="spendable-dcn-amount fs-18 fs-xs-16 lato-bold" data-value="' + l1_dcn_balance + '"><label class="color-light-blue renew-on-lang-switch" data-slug="spendable-amount">'+$('.translates-holder').attr('spendable-amount')+' </label><span></span></div>');
                                        $('.spendable-amount .spendable-dcn-amount span').html(l1_dcn_balance.toLocaleString() + ' DCN');*/
                                        $('.from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+l1_dcn_balance.toLocaleString()+'</span> DCN</span>');
                                        $('.section-amount-to #active-crypto').val('dcn-l1');

                                        $('.max-btn').click(function () {
                                            //$('.section-amount-to input#crypto-amount').val($('.spendable-dcn-amount').attr('data-value'));
                                            $('.section-amount-to input#crypto-amount').val($('.from-box .balance-line .balance-value .amount').html().replaceAll(',', ''));

                                            var to_fixed_num = 2;
                                            if ($('.section-amount-to #active-crypto').val() == 'dcn-l1' || $('.section-amount-to #active-crypto').val() == 'dcn-l2') {
                                                if (($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data).toFixed(to_fixed_num)).trigger('change');
                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth-l1' || $('.section-amount-to #active-crypto').val() == 'eth-l2') {
                                                if (($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
                                            }
                                        });

                                        //on input in dcn/ eth input change usd input
                                        $('.section-amount-to input#crypto-amount').unbind().on('input', function () {
                                            var to_fixed_num = 2;
                                            if ($('.section-amount-to #active-crypto').val() == 'dcn-l1' || $('.section-amount-to #active-crypto').val() == 'dcn-l2') {
                                                if (($(this).val().trim() * dentacoin_data) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($(this).val().trim() * dentacoin_data).toFixed(to_fixed_num)).trigger('change');
                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth-l1' || $('.section-amount-to #active-crypto').val() == 'eth-l2') {
                                                if (($(this).val().trim() * ethereum_data.market_data.current_price.usd) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($(this).val().trim() * ethereum_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
                                            }
                                        });

                                        //on input in usd input change dcn/ eth input
                                        $('.section-amount-to input#usd-val').unbind().on('input', function () {
                                            if ($('.section-amount-to #active-crypto').val() == 'dcn-l1' || $('.section-amount-to #active-crypto').val() == 'dcn-l2') {
                                                $('.section-amount-to input#crypto-amount').val(Math.floor($(this).val().trim() / dentacoin_data)).trigger('change');
                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth-l1' || $('.section-amount-to #active-crypto').val() == 'eth-l2') {
                                                $('.section-amount-to input#crypto-amount').val($(this).val().trim() / ethereum_data.market_data.current_price.usd).trigger('change');
                                            }
                                        });

                                        //on select with cryptocurrencies options change
                                        $('.section-amount-to #active-crypto').unbind().on('change', async function () {
                                            $('.section-amount-to input#crypto-amount').val('');
                                            $('.section-amount-to input#usd-val').val('');

                                            var to_fixed_num = 2;
                                            if ($(this).val() == 'dcn-l1' || $(this).val() == 'dcn-l2') {
                                                if ($(this).val() == 'dcn-l1') {
                                                    // LAYER1 BALANCE
                                                    var dcn_balance = parseInt(await L1DCNContract.methods.balanceOf(global_state.account).call());
                                                    $('.from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+dcn_balance.toLocaleString()+'</span> DCN</span>');
                                                    /*$('.spendable-dcn-amount').attr('data-value', dcn_balance);
                                                    $('.spendable-amount .spendable-dcn-amount span').html(dcn_balance.toLocaleString() + ' DCN');*/
                                                } else if($(this).val() == 'dcn-l2') {
                                                    // LAYER2 BALANCE
                                                    var dcn_balance = parseInt(await L2DCNContract.methods.balanceOf(global_state.account).call());
                                                    $('.from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+dcn_balance.toLocaleString()+'</span> DCN2.0</span>');
                                                    /*$('.spendable-dcn-amount').attr('data-value', dcn_balance);
                                                    $('.spendable-amount .spendable-dcn-amount span').html(dcn_balance.toLocaleString() + ' DCN2.0');*/
                                                }

                                                if (($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * dentacoin_data).toFixed(to_fixed_num)).trigger('change');
                                            } else if ($(this).val() == 'eth-l1' || $(this).val() == 'eth-l2') {
                                                var tokenLabel;
                                                if ($(this).val() == 'eth-l1') {
                                                    // LAYER1 BALANCE
                                                    var eth_balance = await dApp.web3_l1.eth.getBalance(global_state.account);

                                                    //calculating the fee from the gas price and the estimated gas price
                                                    var on_popup_load_gwei = gasPriceObject.result.SafeGasPrice;
                                                    //adding 10% of the outcome just in case transactions don't take so long
                                                    var on_popup_load_gas_price = on_popup_load_gwei * 1000000000 + ((on_popup_load_gwei * 1000000000) * 0.1);

                                                    var ethSendGasEstimation = await dApp.web3_l1.eth.estimateGas({
                                                        to: $('.section-amount-to .address-cell').attr('data-receiver')
                                                    });
                                                    tokenLabel = 'ETH';
                                                } else if($(this).val() == 'eth-l2') {
                                                    // LAYER2 BALANCE
                                                    var eth_balance = await dApp.web3_l2.eth.getBalance(global_state.account);
                                                    var on_popup_load_gas_price = parseInt(await dApp.web3_l2.eth.getGasPrice());

                                                    var ethSendGasEstimation = await dApp.web3_l2.eth.estimateGas({
                                                        to: $('.section-amount-to .address-cell').attr('data-receiver')
                                                    });
                                                    tokenLabel = 'ETH2.0';
                                                }

                                                var newDecimal = new Decimal(projectData.utils.fromWei(eth_balance));

                                                var ethSendGasEstimationNumber = new BigNumber(ethSendGasEstimation);
                                                var cost = ethSendGasEstimationNumber * on_popup_load_gas_price;

                                                var eth_fee = projectData.utils.fromWei(cost.toString(), 'ether');
                                                var correctSendAmount = newDecimal.minus(eth_fee).toString();
                                                if (parseInt(eth_balance) > parseInt(ethSendGasEstimation)) {
                                                    $('.from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+correctSendAmount+'</span> '+tokenLabel+'</span>');
                                                    /*$('.spendable-dcn-amount').attr('data-value', correctSendAmount);
                                                    $('.spendable-amount .spendable-dcn-amount span').html(correctSendAmount + ' ' + tokenLabel);*/
                                                } else {
                                                    $('.from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">0</span> '+tokenLabel+'</span>');
                                                    /*$('.spendable-dcn-amount').attr('data-value', 0);
                                                    $('.spendable-amount .spendable-dcn-amount span').html('0 ' + tokenLabel);*/
                                                }

                                                if (($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd) < 0.01) {
                                                    to_fixed_num = 4;
                                                }
                                                $('.section-amount-to input#usd-val').val(($('.section-amount-to input#crypto-amount').val().trim() * ethereum_data.market_data.current_price.usd).toFixed(to_fixed_num)).trigger('change');
                                            }
                                        });

                                        $('.section-amount-to .open-transaction-recipe').unbind().click(async function () {
                                            var amount = $('.section-amount-to input#crypto-amount').val().trim();
                                            var usd_val = $('.section-amount-to input#usd-val').val().trim();
                                            var sending_to_address = $('.section-amount-to .address-cell').attr('data-receiver');

                                            if (!projectData.utils.innerAddressCheck(sending_to_address)) {
                                                //checking if valid address
                                                basic.showAlert($('.translates-holder').attr('enter-valid-address'), '', true);
                                                return false;
                                            } else if (!$('.section-amount-to #verified-receiver-address').is(':checked')) {
                                                //checkbox
                                                basic.showAlert($('.translates-holder').attr('checkbox'), '', true);
                                                return false;
                                            } else if (isNaN(amount) || amount == '' || amount == 0 || ((isNaN(usd_val) || usd_val == '' || usd_val == 0) && dentacoin_data > 0)) {
                                                //checking if not a number or empty values
                                                basic.showAlert($('.translates-holder').attr('ly-numbers'), '', true);
                                                return false;
                                            }

                                            if (parseFloat(amount).countDecimals() > 17) {
                                                amount = parseFloat(amount).toFixedNoRounding(17).toString();
                                            }

                                            if (meta_mask_installed) {
                                                basic.showAlert('MetaMask currently not supported.', '', true);
                                                return false;
                                                /*if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                    dApp.methods.transfer(sending_to_address, crypto_val);
                                                } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                    dApp.web3_l1.eth.sendTransaction({
                                                        from: global_state.account,
                                                        to: sending_to_address,
                                                        value: projectData.utils.toWei(crypto_val)
                                                    }).on('transactionHash', function (hash) {
                                                        projectData.general_logic.displayMessageOnTransactionSend('Ethers', hash);
                                                    }).catch(function (err) {
                                                        basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                                    });
                                                }*/
                                            } else {
                                                if ($('select#active-crypto').val() == 'dcn-l1') {
                                                    projectData.general_logic.showLoader();
                                                    setTimeout(async function() {
                                                        var l1_dcn_balance = parseInt(await L1DCNContract.methods.balanceOf(global_state.account).call());
                                                        if (l1_dcn_balance < amount) {
                                                            projectData.general_logic.hideLoader();
                                                            basic.showAlert($('.translates-holder').attr('higher-than-balance'), '', true);
                                                        } else {
                                                            var gasLimit = await L1DCNContract.methods.transfer(sending_to_address, amount).estimateGas({
                                                                from: global_state.account
                                                            });

                                                            // adding 25 percent to the gas limit just in case
                                                            gasLimit = Math.round(gasLimit + (gasLimit * 0.25));

                                                            projectData.general_logic.openTxConfirmationPopup('Send confirmation', config_variable.l1.dcn_contract_address, amount, 'DCN', gasLimit, L1DCNContract.methods.transfer(sending_to_address, amount).encodeABI(), 'l1', 'transfer', null, null, sending_to_address);
                                                        }
                                                    }, 500);
                                                } else if ($('select#active-crypto').val() == 'eth-l1') {
                                                    projectData.general_logic.showLoader();
                                                    setTimeout(async function() {
                                                        var l1_eth_balance = await dApp.web3_l1.eth.getBalance(global_state.account);
                                                        if (l1_eth_balance < parseInt(projectData.utils.toWei(amount.toString()))) {
                                                            projectData.general_logic.hideLoader();
                                                            basic.showAlert($('.translates-holder').attr('higher-than-balance'), '', true);
                                                        } else {
                                                            var gasLimit = await dApp.web3_l1.eth.estimateGas({
                                                                to: sending_to_address
                                                            });

                                                            projectData.general_logic.openTxConfirmationPopup('Send confirmation', sending_to_address, amount, 'ETH', gasLimit, null, 'l1', 'transfer');
                                                        }
                                                    }, 500);
                                                } else if ($('select#active-crypto').val() == 'dcn-l2' ) {
                                                    basic.showDialog('<figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/attention-icon.svg" alt="Attention icon" itemprop="contentUrl" class="width-100 max-width-60"/></figure><div class="fs-30 fs-xs-22 calibri-bold padding-top-5 padding-bottom-5">Attention</div><div class="fs-20 fs-xs-16">Check if the sender\'s wallet supports <b>DCN2.0</b> before procceding. Sending <b>DCN2.0</b> to any wallet address or exchange which doesn\'t support <b>DCN2.0</b> will result in loss of your funds. <b>Currently, DCN2.0 is not traded on exchanges.</b><div class="padding-top-15"><b>If you still want to proceed,<br>type <span class="color-light-blue">CONFIRM</span> in the field below.</b></div></div><div class="margin-top-15 max-width-300 margin-0-auto confirm-container"><input type="text" class="confirm-text"/><a href="javascript:void(0);"><img src="assets/images/confirm-btn.png" alt="Confirm btn icon" itemprop="contentUrl"/></a></div>', 'sending-to-l2-wallet-confirmation-popup', true);

                                                    $('.sending-to-l2-wallet-confirmation-popup .confirm-container a').click(async function() {
                                                        if ($('.sending-to-l2-wallet-confirmation-popup .confirm-container .confirm-text').val().trim() == 'CONFIRM') {
                                                            basic.closeDialog();
                                                            projectData.general_logic.showLoader();
                                                            setTimeout(async function() {
                                                                var l2_dcn_balance = parseInt(await L2DCNContract.methods.balanceOf(global_state.account).call());
                                                                if (l2_dcn_balance < amount) {
                                                                    projectData.general_logic.hideLoader();
                                                                    basic.showAlert($('.translates-holder').attr('higher-than-balance'), '', true);
                                                                } else {
                                                                    var gasLimit = await L2DCNContract.methods.transfer(sending_to_address, amount).estimateGas({
                                                                        from: global_state.account
                                                                    });

                                                                    projectData.general_logic.openTxConfirmationPopup('Send confirmation', config_variable.l2.dcn_contract_address, amount, 'DCN2.0', gasLimit, L2DCNContract.methods.transfer(sending_to_address, amount).encodeABI(), 'l2', 'transfer', null, null, sending_to_address);
                                                                }
                                                            }, 500);
                                                        }
                                                    });
                                                } else if ($('select#active-crypto').val() == 'eth-l2') {
                                                    basic.showDialog('<figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/attention-icon.svg" alt="Attention icon" itemprop="contentUrl" class="width-100 max-width-60"/></figure><div class="fs-30 fs-xs-22 calibri-bold padding-top-5 padding-bottom-5">Attention</div><div class="fs-20 fs-xs-16">Check if the sender\'s wallet supports <b>ETH2.0</b> before procceding. Sending <b>ETH2.0</b> to any wallet address or exchange which doesn\'t support <b>ETH2.0</b> will result in loss of your funds. <b>Currently, ETH2.0 is not traded on exchanges.</b><div class="padding-top-15"><b>If you still want to proceed,<br>type <span class="color-light-blue">CONFIRM</span> in the field below.</b></div></div><div class="margin-top-15 max-width-300 margin-0-auto confirm-container"><input type="text" class="confirm-text"/><a href="javascript:void(0);"><img src="assets/images/confirm-btn.png" alt="Confirm btn icon" itemprop="contentUrl"/></a></div>', 'sending-to-l2-wallet-confirmation-popup', true);

                                                    $('.sending-to-l2-wallet-confirmation-popup .confirm-container a').click(async function() {
                                                        if ($('.sending-to-l2-wallet-confirmation-popup .confirm-container .confirm-text').val().trim() == 'CONFIRM') {
                                                            basic.closeDialog();
                                                            projectData.general_logic.showLoader();
                                                            setTimeout(async function() {
                                                                var l2_eth_balance = await dApp.web3_l2.eth.getBalance(global_state.account);
                                                                if (l2_eth_balance < parseInt(projectData.utils.toWei(amount.toString()))) {
                                                                    basic.showAlert($('.translates-holder').attr('higher-than-balance'), '', true);
                                                                    projectData.general_logic.hideLoader();
                                                                } else {
                                                                    var gasLimit = await dApp.web3_l2.eth.estimateGas({
                                                                        to: sending_to_address
                                                                    });

                                                                    projectData.general_logic.openTxConfirmationPopup('Send confirmation', sending_to_address, amount, 'ETH2.0', gasLimit, null, 'l2', 'transfer');
                                                                }
                                                            }, 500);
                                                        }
                                                    });
                                                }
                                            }

                                            /*dApp.methods.getDCNBalance(L1DCNContract, global_state.account, function (err, response) {
                                                var dcn_balance = parseInt(response);

                                                dApp.web3_l1.eth.getBalance(global_state.account, async function (error, eth_balance) {
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
                                                        }/!* else if (0.005 > parseFloat(projectData.utils.fromWei(eth_balance))) {
                                                            //checking if current balance is lower than the desired value to send
                                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                basic.showAlert('For sending Dentacoins you need at least 0.005 ETH. Please refill.', '', true);
                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                basic.showAlert('For sending Ethereum you need at least 0.005 ETH. Please refill.', '', true);
                                                            }
                                                            return false;
                                                        }*!/ else if ($('.section-amount-to #active-crypto').val() == 'dcn' && crypto_val > parseInt(dcn_balance)) {
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
                                                            basic.showAlert('MetaMask currently not supported.', '', true);
                                                            return false;
                                                            /!*if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                dApp.methods.transfer(sending_to_address, crypto_val);
                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                dApp.web3_l1.eth.sendTransaction({
                                                                    from: global_state.account,
                                                                    to: sending_to_address,
                                                                    value: projectData.utils.toWei(crypto_val)
                                                                }).on('transactionHash', function (hash) {
                                                                    projectData.general_logic.displayMessageOnTransactionSend('Ethers', hash);
                                                                }).catch(function (err) {
                                                                    basic.showAlert($('.translates-holder').attr('smth-went-wrong'), '', true);
                                                                });
                                                            }*!/
                                                        } else {





                                                            return false;
                                                            projectData.general_logic.showLoader();

                                                            var function_abi;
                                                            var token_symbol;
                                                            var gasLimit;
                                                            var on_popup_load_gwei;
                                                            var on_popup_load_gas_price;
                                                            var visibleGasPriceNumber;
                                                            var nonce = await dApp.web3_l1_assurance.eth.getTransactionCount(global_state.account);
                                                            var pendingNonce = await dApp.web3_l1_assurance.eth.getTransactionCount(global_state.account, 'pending');
                                                            sending_to_address = projectData.utils.checksumAddress(sending_to_address);

                                                            if ($('.section-amount-to #active-crypto').val() == 'dcn') {
                                                                token_symbol = 'DCN';
                                                                function_abi = L1DCNContract.methods.transfer(sending_to_address, crypto_val).encodeABI();

                                                                //gasLimit = 65000;
                                                                gasLimit = await L1DCNContract.methods.transfer(sending_to_address, crypto_val).estimateGas({
                                                                    from: global_state.account
                                                                });

                                                                // adding 10 percent to the gas limit just in case
                                                                gasLimit = Math.round(gasLimit + (gasLimit * 0.1));
                                                            } else if ($('.section-amount-to #active-crypto').val() == 'eth') {
                                                                token_symbol = 'ETH';
                                                                gasLimit = await dApp.web3_l1.eth.estimateGas({
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

                                                            dApp.web3_l1.eth.getBalance(global_state.account, function (error, eth_balance) {
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
                                                                                    projectData.general_logic.showLoader($('.translates-holder').attr('hold-on'));

                                                                                    setTimeout(function () {
                                                                                        decryptKeystore(window.localStorage.getItem('keystore_file'), $('.cached-keystore-file #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                                                                            if (success) {
                                                                                                submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, success);
                                                                                            } else if (error) {
                                                                                                basic.showAlert(error_message, '', true);
                                                                                                projectData.general_logic.hideLoader();
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
                                                                                        projectData.general_logic.showLoader($('.translates-holder').attr('hold-on'));

                                                                                        setTimeout(function () {
                                                                                            var validating_private_key = validatePrivateKey($('.proof-of-address #your-private-key').val().trim());
                                                                                            if (validating_private_key.success) {
                                                                                                if (projectData.utils.checksumAddress(validating_private_key.success.address) == projectData.utils.checksumAddress(global_state.account)) {
                                                                                                    submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, new Buffer($('.proof-of-address #your-private-key').val().trim(), 'hex'));
                                                                                                } else {
                                                                                                    basic.showAlert($('.translates-holder').attr('key-related'), '', true);
                                                                                                    projectData.general_logic.hideLoader();
                                                                                                }
                                                                                            } else if (validating_private_key.error) {
                                                                                                basic.showAlert(validating_private_key.message, '', true);
                                                                                                projectData.general_logic.hideLoader();
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
                                                                                projectData.general_logic.hideLoader();
                                                                            } else {
                                                                                submitTransactionToBlockchain(function_abi, token_symbol, crypto_val, sending_to_address, key);
                                                                            }
                                                                        });
                                                                    }
                                                                    projectData.general_logic.hideLoader();
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            });*/
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
        swap_page: async function () {
            projectData.general_logic.showLoader();
            $(document).on('click', '.latest-dcn-popup .close-btn', function() {
                $('.latest-dcn-popup').remove();
                $('app-swap-page h1').addClass('padding-top-30').removeClass('padding-top-10');
            });

            setTimeout(async function() {
                var l1_dcn_balance = parseInt(await L1DCNContract.methods.balanceOf(global_state.account).call());
                var l2_dcn_balance = parseInt(await L2DCNContract.methods.balanceOf(global_state.account).call());
                var l1_eth_balance = await dApp.web3_l1.eth.getBalance(global_state.account);
                var l2_eth_balance = await dApp.web3_l2.eth.getBalance(global_state.account);

                $('.swapping-section .from-box .balance-line .amount').html(l1_dcn_balance.toLocaleString());
                $('.swapping-section .to-box .balance-line .amount').html(l2_dcn_balance.toLocaleString());

                $('.swapping-section .from-box .max-btn').click(function() {
                    $('.swapping-section .from-box .inputable-line input[type="number"]').val($('.swapping-section .from-box .balance-line .amount').html().replaceAll(',', '')).focus();
                    $('.swapping-section .to-box .inputable-line .transfer-to-amount').html($('.swapping-section .from-box .balance-line .amount').html().replaceAll(',', ''));
                });

                if ($('.learn-more-btn').length) {
                    $('.learn-more-btn').click(function() {
                        projectData.general_logic.openL2InformationPopups('what-is-dcn2');
                    });
                }

                $('.inputable-amount').on('input paste change', function() {
                    var thisValue = $(this).val().trim();
                    if (thisValue < 0) {
                        $(this).val(0);
                    }

                    if (thisValue > 0) {
                        if ($('select.current-from').val() == 'eth-l1' && $('select.current-to').val() == 'dcn-l2') {
                            projectData.requests.getDentacoinDataByCoingeckoProvider(function(dentacoin_data) {
                                $('.swapping-section .to-box .inputable-line .transfer-to-amount').html(parseInt(thisValue / dentacoin_data.market_data.current_price.eth));
                            }, true);
                        } else {
                            $('.swapping-section .to-box .inputable-line .transfer-to-amount').html(thisValue);
                        }
                    }
                });

                $(document).on('change', 'select.current-to', function() {
                    if ($('select.current-from').val() == 'eth-l1' && $(this).val() == 'dcn-l2') {
                        projectData.requests.getDentacoinDataByCoingeckoProvider(function(dentacoin_data) {
                            $('.swapping-section .to-box .inputable-line .transfer-to-amount').html(parseInt($('.inputable-amount').val().trim() / dentacoin_data.market_data.current_price.eth));
                            $('.swapping-section .to-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+l2_dcn_balance.toLocaleString()+'</span> DCN2.0</span>');
                        }, true);
                    } else if ($('select.current-from').val() == 'eth-l1' && $(this).val() == 'eth-l2') {
                        $('.swapping-section .to-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+projectData.utils.fromWei(l2_eth_balance, 'ether')+'</span> ETH2.0</span>');
                        $('.swapping-section .to-box .inputable-line .transfer-to-amount').html($('.inputable-amount').val().trim());
                    } else {
                        $('.swapping-section .to-box .inputable-line .transfer-to-amount').html($('.inputable-amount').val().trim());
                    }
                });

                $(document).on('change', 'select.current-from', function() {
                    $('.inputable-amount').val('').trigger('change');
                    switch($(this).val()) {
                        case 'dcn-l1':
                            $('.swapping-section .from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+l1_dcn_balance.toLocaleString()+'</span> DCN</span>');
                            $('.swapping-section .to-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+l2_dcn_balance.toLocaleString()+'</span> DCN2.0</span>');
                            $('.swapping-section .to-box .inputable-line').html('<div class="transfer-to-amount inline-block">0.0</div><select class="inline-block fs-24 padding-left-10 current-to"><option selected value="dcn-l2">DCN2.0</option></select>');
                            break;
                        case 'eth-l1':
                            $('.swapping-section .from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+projectData.utils.fromWei(l1_eth_balance, 'ether')+'</span> ETH</span>');
                            $('.swapping-section .to-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+projectData.utils.fromWei(l2_eth_balance, 'ether')+'</span> ETH2.0</span>');
                            $('.swapping-section .to-box .inputable-line').html('<div class="transfer-to-amount inline-block">0.0</div><select class="inline-block fs-24 padding-left-10 current-to"><option selected value="eth-l2">ETH2.0</option><option value="dcn-l2">DCN2.0</option></select>');
                            break;
                        case 'dcn-l2':
                            $('.swapping-section .from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+l2_dcn_balance.toLocaleString()+'</span> DCN2.0</span>');
                            $('.swapping-section .to-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+l1_dcn_balance.toLocaleString()+'</span> DCN</span>');
                            $('.swapping-section .to-box .inputable-line').html('<div class="transfer-to-amount inline-block">0.0</div><select class="inline-block fs-24 padding-left-10 current-to"><option selected value="dcn-l1">DCN</option></select>');
                            break;
                        case 'eth-l2':
                            $('.swapping-section .from-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+projectData.utils.fromWei(l2_eth_balance, 'ether')+'</span> ETH2.0</span>');
                            $('.swapping-section .to-box .balance-line .balance-value').html('Balance: <span class="color-light-blue"><span class="amount">'+projectData.utils.fromWei(l1_eth_balance, 'ether')+'</span> ETH</span>');
                            $('.swapping-section .to-box .inputable-line').html('<div class="transfer-to-amount inline-block">0.0</div><select class="inline-block fs-24 padding-left-10 current-to"><option selected value="eth-l1">ETH</option></select>');
                            break;
                    }
                });

                $('.switch-layers-btn a').click(function() {
                    if ($('select.current-from').attr('data-current-layer') == 'l1') {
                        $('select.current-from').attr('data-current-layer', 'l2');
                        if ($('select.current-from').val() == 'eth-l1') {
                            $('select.current-from').html('<option value="dcn-l2">DCN2.0</option><option value="eth-l2" selected>ETH2.0</option>');
                        } else {
                            $('select.current-from').html('<option value="dcn-l2">DCN2.0</option><option value="eth-l2">ETH2.0</option>');
                        }
                    } else if ($('select.current-from').attr('data-current-layer') == 'l2') {
                        $('select.current-from').attr('data-current-layer', 'l1');
                        if ($('select.current-from').val() == 'eth-l2') {
                            $('select.current-from').html('<option value="dcn-l1">DCN</option><option value="eth-l1" selected>ETH</option>');
                        } else {
                            $('select.current-from').html('<option value="dcn-l1">DCN</option><option value="eth-l1">ETH</option>');
                        }
                    }
                    $('select.current-from').trigger('change');
                });

                $('.swap-btn').click(function() {
                    var amount = parseFloat($('.inputable-amount').val().trim());
                    if (!$('#checkbox-understand').is(':checked')) {
                        basic.showAlert('Please check the checkbox.', '', true);
                    } else if (amount <= 0 || Number.isNaN(amount)) {
                        basic.showAlert('Please enter correct swapping value.', '', true);
                    } else {
                        projectData.general_logic.showLoader();
                        setTimeout(async function() {
                            if ($('select.current-from').val() == 'dcn-l1' && $('select.current-to').val() == 'dcn-l2') {
                                if (l1_dcn_balance < amount) {
                                    projectData.general_logic.hideLoader();
                                    basic.showAlert('You don\'t have enough DCN balance to complete the swap.', '', true);
                                } else {
                                    var to = projectData.utils.checksumAddress('0xa4D508dC72f5ce2B688d05ACFfe8E1AeF326831C');
                                    var gasLimit = await L1DCNContract.methods.transfer(to, amount).estimateGas({
                                        from: global_state.account
                                    });

                                    // adding 25 percent to the gas limit just in case
                                    gasLimit = Math.round(gasLimit + (gasLimit * 0.25));
                                    projectData.general_logic.openTxConfirmationPopup('Swap confirmation', to, amount, 'DCN', gasLimit, L1DCNContract.methods.transfer(to, amount).encodeABI(), 'l1', 'swap', 'dcn-l1-to-dcn-l2');
                                }
                            } else if ($('select.current-from').val() == 'eth-l1' && $('select.current-to').val() == 'eth-l2') {
                                if (l1_eth_balance < parseInt(projectData.utils.toWei(amount.toString()))) {
                                    projectData.general_logic.hideLoader();
                                    basic.showAlert('You don\'t have enough ETH balance to complete the swap.', '', true);
                                } else {
                                    var to = projectData.utils.checksumAddress('0x7cFF2b3b3702ED7deCc57fAa32940DCf855D2d29');
                                    var gasLimit = await dApp.web3_l1.eth.estimateGas({
                                        to: to
                                    });
                                    projectData.general_logic.openTxConfirmationPopup('Swap confirmation', to, amount, 'ETH', gasLimit, null, 'l1', 'swap', 'eth-l1-to-eth-l2');
                                }
                            } else if ($('select.current-from').val() == 'eth-l1' && $('select.current-to').val() == 'dcn-l2') {
                                if (l1_eth_balance < parseInt(projectData.utils.toWei(amount.toString()))) {
                                    projectData.general_logic.hideLoader();
                                    basic.showAlert('You don\'t have enough ETH balance to complete the swap.', '', true);
                                } else {
                                    var to = projectData.utils.checksumAddress('0x1D611d469704b95525C96B5c4921a5b78807ae4e');
                                    var gasLimit = await dApp.web3_l1.eth.estimateGas({
                                        to: to
                                    });
                                    projectData.general_logic.openTxConfirmationPopup('Swap confirmation', to, amount, 'ETH', gasLimit, null, 'l1', 'swap', 'eth-l1-to-dcn-l2', $('.swapping-section .to-box .inputable-line .transfer-to-amount').html());
                                }
                            } else if ($('select.current-from').val() == 'dcn-l2' && $('select.current-to').val() == 'dcn-l1') {
                                if (l2_dcn_balance < amount) {
                                    basic.showAlert('You don\'t have enough DCN2.0 balance to complete the swap.', '', true);
                                    projectData.general_logic.hideLoader();
                                } else {
                                    var gasLimit = await L2DCNContract.methods.withdraw(amount).estimateGas({
                                        from: global_state.account
                                    });

                                    projectData.general_logic.openTxConfirmationPopup('Swap confirmation', config_variable.l2.dcn_contract_address, amount, 'DCN2.0', gasLimit, L2DCNContract.methods.withdraw(amount).encodeABI(), 'l2', 'swap', 'dcn-l2-to-dcn-l1', $('.swapping-section .to-box .inputable-line .transfer-to-amount').html());
                                }
                            } else if ($('select.current-from').val() == 'eth-l2' && $('select.current-to').val() == 'eth-l1') {
                                if (l2_eth_balance < parseInt(projectData.utils.toWei(amount.toString()))) {
                                    basic.showAlert('You don\'t have enough ETH2.0 balance to complete the swap.', '', true);
                                    projectData.general_logic.hideLoader();
                                } else {
                                    console.log(L2OptimismL2StandardBridgeContract.methods, 'L2OptimismL2StandardBridgeContract.methods');
                                    var gasLimit = await L2OptimismL2StandardBridgeContract.methods.withdraw(/*'0x4200000000000000000000000000000000000006', */projectData.utils.toWei(amount.toString())/*, '0x', '0x'*/).estimateGas({
                                        from: global_state.account
                                    });
                                    console.log(gasLimit, 'gasLimit');

                                    projectData.general_logic.openTxConfirmationPopup('Swap confirmation', '0x4200000000000000000000000000000000000010', amount, 'ETH2.0', gasLimit, L2OptimismL2StandardBridgeContract.methods.withdraw(/*'0x4200000000000000000000000000000000000006', */projectData.utils.toWei(amount.toString())/*, '0x', '0x'*/).encodeABI(), 'l2', 'swap', 'eth-l2-to-eth-l1', $('.swapping-section .to-box .inputable-line .transfer-to-amount').html());
                                }
                            }
                        }, 500);
                    }
                });

                projectData.general_logic.hideLoader();
            }, 500);
        },
        spend_page_dental_services: function () {
            projectData.utils.saveHybridAppCurrentScreen();
            if (iframeHeightListenerInit) {
                iframeHeightListenerInit = false;

                window.addEventListener('message', function(event) {
                    var height = event.data.data.height;
                    if(event.data.event_id === 'iframe_size_event' && (height != undefined && height > 0)){
                        $('.main-wrapper iframe').height(height + 50);
                    }
                });
            }

            projectData.general_logic.showMobileAppBannerForDesktopBrowsers();
        },
        spend_page_exchanges: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            projectData.general_logic.showMobileAppBannerForDesktopBrowsers();
            projectData.general_logic.showLoader();

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

                    projectData.general_logic.hideLoader();
                }
            });
        },
        spend_page_assurance_fees: function () {
            projectData.utils.saveHybridAppCurrentScreen();

            projectData.general_logic.showMobileAppBannerForDesktopBrowsers();

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
                    projectData.general_logic.initScan($('.open-transaction-scanner'), null, function (content) {
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
                                                                projectData.general_logic.hideLoader();
                                                                basic.closeDialog();
                                                                if (response.success) {
                                                                    basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                    projectData.general_logic.firePushNotification('Assurance transaction', 'Contract created successfully.');
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
                                                            projectData.general_logic.hideLoader();
                                                            basic.closeDialog();
                                                            if (response.success) {
                                                                basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                projectData.general_logic.firePushNotification('Assurance transaction', 'Contract created successfully.');
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
                                                            projectData.general_logic.hideLoader();
                                                            basic.closeDialog();
                                                            if (response.success) {
                                                                basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                projectData.general_logic.firePushNotification('Assurance transaction', 'Contract approved successfully.');
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
                                                            projectData.general_logic.hideLoader();
                                                            basic.closeDialog();
                                                            if (response.success) {
                                                                basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                projectData.general_logic.firePushNotification('Assurance transaction', 'Successful withdraw.');
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
                                                            projectData.general_logic.hideLoader();
                                                            basic.closeDialog();
                                                            if (response.success) {
                                                                basic.showAlert($('.translates-holder').attr('data-assurance-success'), '', true);
                                                                projectData.general_logic.firePushNotification('Assurance transaction', 'Contract cancelled successfully.');
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
                                                    projectData.general_logic.showLoader($('.translates-holder').attr('hold-on'));

                                                    setTimeout(function () {
                                                        decryptKeystore(window.localStorage.getItem('keystore_file'), $('.cached-keystore-file #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                                            if (success) {
                                                                scanningRouter(success);
                                                            } else if (error) {
                                                                basic.showAlert(error_message, '', true);
                                                                projectData.general_logic.hideLoader();
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
                                                        projectData.general_logic.showLoader($('.translates-holder').attr('hold-on'));

                                                        setTimeout(function () {
                                                            var validating_private_key = validatePrivateKey($('.proof-of-address #your-private-key').val().trim());
                                                            if (validating_private_key.success) {
                                                                if (projectData.utils.checksumAddress(validating_private_key.success.address) == projectData.utils.checksumAddress(global_state.account)) {
                                                                    scanningRouter(new Buffer($('.proof-of-address #your-private-key').val().trim(), 'hex'));
                                                                } else {
                                                                    basic.showAlert('Please enter private key related to your Wallet Address.', '', true);
                                                                    projectData.general_logic.hideLoader();
                                                                }
                                                            } else if (validating_private_key.error) {
                                                                basic.showAlert(validating_private_key.message, '', true);
                                                                projectData.general_logic.hideLoader();
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
        openL2InformationPopups: function(type) {
            var popupHtml;
            switch(type) {
                case 'what-is-dcn2':
                    popupHtml = '<div class="text-center"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/pop-up-img1.png" alt="What is DCN2.0"></figure><h2 class="fs-26 fs-xs-24 padding-top-15">What is DCN2?</h2><div class="fs-20 padding-bottom-50">DCN2 is the b(igg)est upgrade of Dentacoin so far! It allows you to send and receive DCN2 tokens faster and with much lower transaction costs. It also protects the value of DCN from high fluctuations.</div></div><div class="bottom-menu padding-top-10 padding-bottom-30 fs-20 calibri-bold"><a href="javascript:void(0);" class="how-to-get-and-use-dcn2">• How to get and use DCN2?<i class="fa fa-arrow-right" aria-hidden="true"></i></a><a href="javascript:void(0);" class="whats-with-dcn">• What’s with the original version of DCN?<i class="fa fa-arrow-right" aria-hidden="true"></i></a></div><div class="popup-bullets text-center"><ul><li class="active"></li><li></li><li></li></ul></div>';
                    break;
                case 'how-to-get-and-use-dcn2':
                    popupHtml = '<div class="text-center"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/pop-up-img2.png" alt="What is DCN2.0"></figure><h2 class="fs-26 fs-xs-24 padding-top-15">How to get and use DCN2?</h2><div class="fs-20 padding-bottom-50">DCN2 tokens are received as rewards from Dentacoin tools (eg. for writing a review on Dentacoin Trusted Reviews or taking DentaVox surveys). You can use them for staking to increase your savings, for payments at partner dentists, or for covering your Dentacoin Assurance fees. You can also easily swap DCN to DCN2 right here in your wallet.</div></div><div class="bottom-menu padding-top-10 padding-bottom-30 fs-20 calibri-bold"><a href="javascript:void(0);" class="whats-with-dcn">• What’s with the original version of DCN?<i class="fa fa-arrow-right" aria-hidden="true"></i></a><a href="javascript:void(0);" class="what-is-dcn2">• What is DCN2?<i class="fa fa-arrow-right" aria-hidden="true"></i></a></div><div class="popup-bullets text-center"><ul><li></li><li class="active"></li><li></li></ul></div>';
                    break;
                case 'whats-with-dcn':
                    popupHtml = '<div class="text-center"><figure itemscope="" itemtype="http://schema.org/ImageObject"><img src="assets/images/pop-up-img3.png" alt="What is DCN2.0"></figure><h2 class="fs-26 fs-xs-24 padding-top-15">What’s with the original version of DCN?</h2><div class="fs-20 padding-bottom-50">It is alive and flourishing :) But its main use case would be for trading on exchange platforms.</div></div><div class="bottom-menu padding-top-10 padding-bottom-30 fs-20 calibri-bold"><a href="javascript:void(0);" class="what-is-dcn2">• What is DCN2?<i class="fa fa-arrow-right" aria-hidden="true"></i></a><a href="javascript:void(0);" class="how-to-get-and-use-dcn2">• How to get and use DCN2?<i class="fa fa-arrow-right" aria-hidden="true"></i></a></div><div class="popup-bullets text-center"><ul><li></li><li></li><li class="active"></li></ul></div>';
                    break;
            }

            basic.showDialog(popupHtml, 'l2-information-popup', true);

            if ($('.l2-information-popup .how-to-get-and-use-dcn2').length) {
                $('.l2-information-popup .how-to-get-and-use-dcn2').click(function() {
                    basic.closeDialog();
                    projectData.general_logic.openL2InformationPopups('how-to-get-and-use-dcn2');
                });
            }

            if ($('.l2-information-popup .whats-with-dcn').length) {
                $('.l2-information-popup .whats-with-dcn').click(function() {
                    basic.closeDialog();
                    projectData.general_logic.openL2InformationPopups('whats-with-dcn');
                });
            }

            if ($('.l2-information-popup .what-is-dcn2').length) {
                $('.l2-information-popup .what-is-dcn2').click(function() {
                    basic.closeDialog();
                    projectData.general_logic.openL2InformationPopups('what-is-dcn2');
                });
            }
        },
        openTxConfirmationPopup: async function(popupTitle, to, amount, token_symbol, gasLimit, function_abi, layer, transactionType, swapType, swapToAmount, visible_to) {
            console.log(popupTitle, to, amount, token_symbol, gasLimit, function_abi, layer, transactionType, swapType, swapToAmount);

            var ethFeeLabel;
            var web3_provider;
            var currentGasPriceInGwei;
            var on_popup_load_gas_price;
            var visibleGasPriceNumber;
            if (layer == 'l1') {
                ethFeeLabel = 'ETH';
                web3_provider = dApp.web3_l1;
                nonce = await dApp.web3_l1.eth.getTransactionCount(global_state.account);
                pendingNonce = await dApp.web3_l1.eth.getTransactionCount(global_state.account, 'pending');
                var gasPriceObject = await projectData.requests.getGasPrice();
                currentGasPriceInGwei = parseInt(gasPriceObject.result.SafeGasPrice);
                //adding 10% of the outcome just in case transactions don't take too long
                on_popup_load_gas_price = currentGasPriceInGwei * 1000000000 + ((currentGasPriceInGwei * 1000000000) * 10 / 100);
                visibleGasPriceNumber = on_popup_load_gas_price / 1000000000;
            } else if (layer == 'l2') {
                ethFeeLabel = 'ETH2.0';
                web3_provider = dApp.web3_l2;
                currentGasPriceInGwei = parseInt(await dApp.web3_l2.eth.getGasPrice());
                on_popup_load_gas_price = currentGasPriceInGwei;
                visibleGasPriceNumber = on_popup_load_gas_price / 1000000000;
            }

            var nonce = await web3_provider.eth.getTransactionCount(global_state.account);
            var pendingNonce = await web3_provider.eth.getTransactionCount(global_state.account, 'pending');
            to = projectData.utils.checksumAddress(to);

            if (transactionType == 'transfer') {
                var txIcon = '<svg version="1.1" class="width-100 max-width-100 margin-bottom-10" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100.1 100" style="enable-background:new 0 0 100.1 100;" xml:space="preserve"><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="100" width="105.7" x="-7.2" y="-6.4"></sliceSourceBounds></sfw></metadata><circle style="fill:#FFFFFF;" cx="50" cy="50" r="50"/><g><g><g><path class="st1-recipe" d="M50.1,93.7c-18.7,0-36-12.4-41.3-31.3C2.4,39.6,15.8,16,38.5,9.6C48.9,6.7,60,7.8,69.6,12.8c1.2,0.6,1.6,2,1,3.2s-2,1.6-3.2,1c-8.6-4.4-18.4-5.4-27.7-2.8c-20.1,5.6-32,26.7-26.3,46.9s26.7,32.1,46.9,26.4s32.1-26.7,26.4-46.9c-1.1-3.9-2.8-7.6-5-10.9c-0.7-1.1-0.4-2.6,0.7-3.3c1.1-0.7,2.6-0.4,3.3,0.7c2.5,3.8,4.4,7.9,5.6,12.3c6.4,22.8-7,46.5-29.7,52.8C57.8,93.2,53.9,93.7,50.1,93.7z"/></g><g><path class="st1-recipe" d="M33.1,78.6c-0.5,0-1-0.2-1.5-0.5c-1-0.8-1.2-2.3-0.4-3.4l40.4-50.5c0.8-1,2.3-1.2,3.4-0.4c1,0.8,1.2,2.3,0.4,3.4L35,77.7C34.5,78.3,33.8,78.6,33.1,78.6z"/></g><g><g><path style="fill:none;stroke:#CA675A;stroke-width:2.8346;stroke-linecap:round;stroke-miterlimit:10;" d="M105.7,56.9"/></g></g></g><g><path class="st1-recipe" d="M73.7,54.2c-0.1,0-0.2,0-0.2,0c-1.3-0.2-2.3-1.4-2.2-2.7L74,23.9L47.6,39.8c-1.1,0.7-2.6,0.3-3.3-0.8c-0.7-1.1-0.3-2.6,0.8-3.3l34.5-20.8L76.1,52C76,53.2,74.9,54.2,73.7,54.2z"/></g></g></svg>';
                if (token_symbol == 'DCN' || token_symbol == 'DCN2.0') {
                    projectData.requests.getDentacoinDataByCoingeckoProvider(function(usdPrice) {
                        proceedWithTxConfirmationPopupInitialization(txIcon, '<div class="dcn-amount">-' + parseInt(amount).toLocaleString() + ' ' + token_symbol + '</div>', '<div class="usd-amount">=$' + (amount * usdPrice).toFixed(2) + '</div>');
                    });
                } else if (token_symbol == 'ETH' || token_symbol == 'ETH2.0') {
                    projectData.requests.getEthereumDataByCoingecko(function(ethereum_data) {
                        proceedWithTxConfirmationPopupInitialization(txIcon, '<div class="dcn-amount">-' + amount + ' ' + token_symbol + '</div>', '<div class="usd-amount">=$' + (amount * ethereum_data.market_data.current_price.usd).toFixed(2) + '</div>');
                    });
                }
            } else if (transactionType == 'swap') {
                var txIcon = '<svg version="1.1" class="width-100 max-width-100 margin-bottom-10" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100.1 100" style="enable-background:new 0 0 100.1 100;" xml:space="preserve"><path style="fill:#FFF" d="M50,0C22.4,0,0,22.4,0,50c0,27.6,22.4,50,50,50s50-22.4,50-50C100,22.4,77.6,0,50,0z M17.8,79.2 c0.2-0.1,0.3-0.3,0.4-0.5c0,0.6,0.2,1.1,0.5,1.5C18.4,79.9,18.1,79.5,17.8,79.2z"/> <g> <g> <g> <g> <path style="fill:none;stroke:#5CCB92;stroke-width:2.8346;stroke-linecap:round;stroke-miterlimit:10" d="M105.7,57"/> </g> </g> </g> <g> <g> <path style="fill:#57D3D9" d="M36.3,83.5L41.3,56c0.2-1,1.1-1.6,2.1-1.5c1,0.2,1.6,1.1,1.5,2.1l-3.7,20.5l20.7-10.3c0.9-0.5,2-0.1,2.4,0.8 c0.5,0.9,0.1,2-0.8,2.4L36.3,83.5z"/> </g> <g> <path style="fill:#57D3D9" d="M64.1,19.4l-6,27.3c-0.2,1-1.2,1.6-2.1,1.4c-1-0.2-1.6-1.2-1.4-2.1L59,25.7l-21.1,9.5c-0.9,0.4-2,0-2.4-0.9 c-0.4-0.9,0-2,0.9-2.4L64.1,19.4z"/> </g> <g> <path style="fill:#57D3D9" d="M42.4,77.8c-0.5,0-1-0.2-1.5-0.5c-1-0.8-1.2-2.3-0.4-3.5l41-51.3c0.8-1,2.3-1.2,3.4-0.4 c1,0.8,1.2,2.3,0.4,3.5l-41,51.3C43.8,77.5,43.1,77.8,42.4,77.8z"/> </g> <g> <g> <path style="fill:#57D3D9" d="M81.3,29c0.2,0.3,0.4,0.6,0.6,0.9L44.3,76.9c-0.5,0.6-1.2,0.9-1.9,0.9c-0.5,0-1-0.2-1.5-0.5 c-1-0.8-1.2-2.3-0.4-3.5l38.3-48.1c0.2,0.2,0.4,0.5,0.7,0.8C80.1,27.4,80.7,28.1,81.3,29z"/> </g> </g> </g> </g> <g> <g> <g> <path style="fill:#57D3D9" d="M15.3,78.4c-0.5,0-1-0.2-1.5-0.6c-1-0.8-1.1-2.3-0.3-3.4l42.3-48.9c0.8-1,2.3-1.1,3.4-0.3 c1,0.8,1.1,2.3,0.3,3.4L17.2,77.6C16.7,78.2,16,78.5,15.3,78.4z"/> </g> <g> <g> <path style="fill:none;stroke:#CA675A;stroke-width:2.8346;stroke-linecap:round;stroke-miterlimit:10" d="M219.1,57.2"/> </g> </g> </g> </g> <path style="fill:#57D3D9" d="M79.7,19.7C79.7,19.7,79.7,19.7,79.7,19.7c-0.2-0.2-0.3-0.3-0.5-0.5c0,0,0,0,0,0c-7.6-7-17.9-11.3-29.1-11.3 c-23.8,0-43,19.3-43,43c0,7,1.7,13.5,4.6,19.3c0.6,1.2,2.3,1.4,3.1,0.4l0.7-0.8c0.5-0.6,0.6-1.5,0.3-2.2c-2.4-5-3.8-10.7-3.8-16.6 c0-21,17-38.1,38.1-38.1c10,0,19.1,3.9,26,10.2c0.4,0.5,1.1,0.7,1.8,0.7c1.4,0,2.5-1.1,2.5-2.5C80.3,20.7,80.1,20.2,79.7,19.7z M87.8,30.1C87.8,30.1,87.8,30.1,87.8,30.1c-0.1-0.2-0.2-0.4-0.3-0.5c0-0.1-0.1-0.1-0.1-0.2c0,0,0,0,0,0c-0.2-0.2-0.3-0.3-0.5-0.4 c0,0,0,0,0,0c-0.4-0.3-0.9-0.4-1.4-0.4c-0.8,0-1.4,0.3-1.9,0.9c-0.1,0.1-0.1,0.2-0.2,0.2c-0.3,0.4-0.4,0.9-0.4,1.4 c0,0.3,0.1,0.6,0.2,0.9c0,0,0,0,0,0c0.1,0.2,0.2,0.4,0.3,0.6c3,5.5,4.8,11.8,4.8,18.5c0,21-17,38.1-38.1,38.1 c-10.8,0-20.5-4.5-27.4-11.6c0,0,0,0,0,0c-0.1-0.1-0.3-0.3-0.4-0.4c-0.7-0.8-1.9-0.7-2.6,0.1l-1.4,1.6c0,0-0.1,0.1-0.1,0.1v0 c0,0.6,0.2,1.1,0.5,1.5c0.1,0.1,0.1,0.2,0.2,0.2c7.8,8.3,18.9,13.5,31.2,13.5c23.8,0,43-19.2,43-43C93.2,43.4,91.2,36.3,87.8,30.1z" /> <circle style="fill:#57D3D9" cx="13.8" cy="69" r="2.4"/> <path style="fill:#57D3D9" d="M80.3,21.3c0,1.4-1.1,2.5-2.5,2.5c-0.7,0-1.3-0.3-1.8-0.7c-0.5-0.4-0.7-1.1-0.7-1.7c0-1.4,1.1-2.5,2.5-2.5 c0.5,0,1,0.2,1.4,0.4c0,0,0,0,0,0c0.2,0.1,0.3,0.3,0.5,0.4c0,0,0,0,0,0C80.1,20.2,80.3,20.7,80.3,21.3z"/> <path style="fill:#57D3D9" d="M87.9,30.9c0,1.4-1.1,2.5-2.5,2.5c-0.7,0-1.3-0.3-1.8-0.7c-0.1-0.1-0.2-0.2-0.2-0.3c-0.1-0.2-0.2-0.4-0.3-0.6 c0,0,0,0,0,0c-0.1-0.3-0.2-0.6-0.2-0.9c0-0.5,0.2-1,0.4-1.4c0.1-0.1,0.1-0.2,0.2-0.2c0.5-0.5,1.1-0.9,1.9-0.9c0.5,0,1,0.2,1.4,0.4 c0,0,0,0,0,0c0.2,0.1,0.3,0.3,0.5,0.4c0,0,0,0,0,0c0.1,0.1,0.1,0.1,0.1,0.2c0.1,0.2,0.2,0.3,0.3,0.5c0,0,0,0,0,0 C87.9,30.4,87.9,30.6,87.9,30.9z"/> <path style="fill:#57D3D9" d="M23.1,78.7c0,1.4-1.1,2.4-2.4,2.4c-0.7,0-1.3-0.3-1.7-0.7c-0.1-0.1-0.1-0.2-0.2-0.2c-0.3-0.4-0.5-1-0.5-1.5v0 c0-1.3,1.1-2.4,2.4-2.4c0.5,0,0.9,0.2,1.3,0.4c0,0,0,0,0.1,0c0.3,0.2,0.5,0.4,0.6,0.6c0,0,0,0,0,0C23,77.7,23.1,78.2,23.1,78.7z"/></svg>';

                var belowTxIconHtml;
                switch(swapType) {
                    case 'dcn-l1-to-dcn-l2':
                        belowTxIconHtml = parseInt(amount).toLocaleString() + 'DCN <=> ' + parseInt(amount).toLocaleString() + 'DCN2.0';
                        break;
                    case 'eth-l1-to-eth-l2':
                        belowTxIconHtml = amount + 'ETH <=> ' + amount + 'ETH2.0';
                        break;
                    case 'eth-l1-to-dcn-l2':
                        belowTxIconHtml = amount + 'ETH <=> ' + parseInt(swapToAmount).toLocaleString() + 'DCN2.0';
                        break;
                    case 'dcn-l2-to-dcn-l1':
                        belowTxIconHtml = parseInt(amount).toLocaleString() + 'DCN2.0 <=> ' + parseInt(amount).toLocaleString() + 'DCN';
                        break;
                    case 'eth-l2-to-eth-l1':
                        belowTxIconHtml = amount + 'ETH2.0 <=> ' + amount + 'ETH';
                        break;
                }

                proceedWithTxConfirmationPopupInitialization(txIcon, '', '<div class="dcn-amount">'+belowTxIconHtml+'</div>');
            }

            async function proceedWithTxConfirmationPopupInitialization(txIcon, belowTxIconHtml, usdHtml) {
                var visibleToAddress = projectData.utils.checksumAddress(to);
                if (visible_to != undefined) {
                    visibleToAddress = projectData.utils.checksumAddress(visible_to);
                }
                var eth_fee = projectData.utils.fromWei((on_popup_load_gas_price * gasLimit).toString(), 'ether');
                var transaction_popup_html = '<div class="tx-data-holder" data-visibleGasPriceNumber="'+visibleGasPriceNumber+'" data-initial-visibleGasPriceNumber="'+visibleGasPriceNumber+'" data-gasLimit="'+gasLimit+'" data-nonce="'+pendingNonce+'" data-initial-nonce="'+pendingNonce+'" data-on_popup_load_gas_price="'+on_popup_load_gas_price+'"></div><div class="title">'+popupTitle+'</div><div class="pictogram-and-dcn-usd-price">' + txIcon + belowTxIconHtml + usdHtml + '</div><div class="confirm-row to"> <div class="label inline-block">'+$('.translates-holder').attr('to-label')+'</div><div class="value inline-block">' + visibleToAddress + '</div></div><div class="confirm-row from"> <div class="label inline-block">'+$('.translates-holder').attr('from-label')+'</div><div class="value inline-block">' + global_state.account + '</div></div><div class="confirm-row nonce"> <div class="label inline-block">'+$('.translates-holder').attr('nonce')+'</div><div class="value inline-block">' + pendingNonce + '</div></div><div class="confirm-row fee"> <div class="label inline-block">'+ethFeeLabel+$('.translates-holder').attr('eth-fee')+'</div><div class="value inline-block"><div class="inline-block eth-value">' + parseFloat(eth_fee).toFixed(8) + '</div><div class="inline-block tx-settings-icon"><a href="javascript:void(0);"><svg id="e68760ed-3659-43b9-ad7b-73b5b189fe7a" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 56.81 61"><defs><clipPath id="f9d5df6d-58de-4fe9-baeb-2948a9aeab40"><rect class="bb542d8f-936a-4524-831e-8152ec1848dd" x="-3.59" y="-1.5" width="64" height="64"/></clipPath></defs><g class="e20091d8-5cd8-4fc6-97bc-34f6a53a9fd6"><path style="fill:#888;" d="M28.29,61a25,25,0,0,1-4.05-.3,2.46,2.46,0,0,1-1.83-1.63L20.8,53.51a2.8,2.8,0,0,0-1.06-1.36l-5.86-3.38a2.67,2.67,0,0,0-1.69-.22L6.67,50a2.48,2.48,0,0,1-2.33-.73A28,28,0,0,1,.16,42.1a2.47,2.47,0,0,1,.5-2.39l4.15-4.33a2.76,2.76,0,0,0,.64-1.6V27a2.6,2.6,0,0,0-.65-1.57L.66,21.31a2.43,2.43,0,0,1-.52-2.38A31.86,31.86,0,0,1,2,15.27a30.47,30.47,0,0,1,2.33-3.49A2.48,2.48,0,0,1,6.61,11l5.9,1.45a2.69,2.69,0,0,0,1.7-.24l5.86-3.38a2.67,2.67,0,0,0,1-1.35L22.6,1.93A2.4,2.4,0,0,1,24.4.29a27.62,27.62,0,0,1,8.22,0A2.42,2.42,0,0,1,34.41,2L35.89,7.5a2.67,2.67,0,0,0,1,1.35l5.86,3.38a2.63,2.63,0,0,0,1.68.22L50,11a2.44,2.44,0,0,1,2.33.73,27.84,27.84,0,0,1,4.3,7.48,2.46,2.46,0,0,1-.54,2.39L52.2,25.45A2.66,2.66,0,0,0,51.55,27v6.76a2.72,2.72,0,0,0,.65,1.58l3.94,3.94a2.46,2.46,0,0,1,.54,2.38,29.28,29.28,0,0,1-2,4,29,29,0,0,1-2.32,3.5,2.44,2.44,0,0,1-2.33.73l-5.24-1.4a2.67,2.67,0,0,0-1.69.22l-5.86,3.38a2.71,2.71,0,0,0-1,1.35l-1.46,5.44A2.48,2.48,0,0,1,33,60.61h0A25.92,25.92,0,0,1,28.29,61ZM12.68,47.49a3.62,3.62,0,0,1,1.7.41l5.86,3.39a3.67,3.67,0,0,1,1.52,1.94l1.61,5.56a1.48,1.48,0,0,0,1,.92,27.08,27.08,0,0,0,8.38-.08h0a1.49,1.49,0,0,0,1-.94l1.46-5.45a3.65,3.65,0,0,1,1.5-2l5.86-3.39a3.64,3.64,0,0,1,2.45-.32L50.31,49a1.42,1.42,0,0,0,1.3-.41,29.64,29.64,0,0,0,2.23-3.36,30,30,0,0,0,1.9-3.87,1.5,1.5,0,0,0-.3-1.35l-3.95-3.94a3.6,3.6,0,0,1-.94-2.28V27a3.64,3.64,0,0,1,.94-2.28l3.89-3.88a1.48,1.48,0,0,0,.3-1.34,26.75,26.75,0,0,0-4.12-7.17,1.45,1.45,0,0,0-1.31-.41l-5.52,1.48a3.57,3.57,0,0,1-2.44-.33L36.43,9.71a3.59,3.59,0,0,1-1.5-2L33.45,2.24a1.43,1.43,0,0,0-1-.93,26.61,26.61,0,0,0-7.87,0,1.4,1.4,0,0,0-1,.92l-1.5,5.56a3.54,3.54,0,0,1-1.5,2l-5.86,3.38a3.68,3.68,0,0,1-2.44.35L6.37,12a1.5,1.5,0,0,0-1.32.43,31.07,31.07,0,0,0-2.22,3.35,29.61,29.61,0,0,0-1.75,3.51,1.41,1.41,0,0,0,.29,1.32l4.14,4.14A3.64,3.64,0,0,1,6.45,27v6.76a3.73,3.73,0,0,1-.92,2.29L1.38,40.4a1.47,1.47,0,0,0-.28,1.35,26.44,26.44,0,0,0,4,6.9,1.41,1.41,0,0,0,1.3.41l5.52-1.48A3,3,0,0,1,12.68,47.49Zm15.72-3a14,14,0,1,1,14-14A14,14,0,0,1,28.4,44.53Zm0-27.06a13,13,0,1,0,13,13A13,13,0,0,0,28.4,17.47Z"/><path style="fill:#888;" d="M28.29,60.87a25.85,25.85,0,0,1-4.11-.31,4.3,4.3,0,0,1-3.29-3l-1.51-5.17s-.07-.07-.12-.11l-5.37-3.1s0,0-.09,0L8.74,50.61A4.27,4.27,0,0,1,4.5,49.27,27.7,27.7,0,0,1,.26,42a4.32,4.32,0,0,1,.9-4.33l3.86-4s0-.1,0-.16V27.27s0,0-.06-.08L1.2,23.4a4.23,4.23,0,0,1-1-4.35,29.26,29.26,0,0,1,1.84-3.71A31.23,31.23,0,0,1,4.44,11.8a4.32,4.32,0,0,1,4.21-1.37l5.48,1.35s.1,0,.15,0l5.3-3.07a.41.41,0,0,0,.1-.13l1.37-5.1a4.24,4.24,0,0,1,3.3-3,27.69,27.69,0,0,1,8.33,0,4.26,4.26,0,0,1,3.27,3l1.36,5a.6.6,0,0,0,.09.13l5.32,3.07.16,0,5-1.36a4.28,4.28,0,0,1,4.24,1.33,28.05,28.05,0,0,1,4.36,7.58,4.31,4.31,0,0,1-1,4.34L52,27.19a.67.67,0,0,0-.07.18v6.18s0,0,.06.07l3.61,3.61a4.29,4.29,0,0,1,1,4.33,30.43,30.43,0,0,1-2,4.1,31.86,31.86,0,0,1-2.36,3.53A4.28,4.28,0,0,1,48,50.54l-4.8-1.29-.18,0-5.3,3.06-.1.15-1.33,5a4.31,4.31,0,0,1-3.23,3h0A26.57,26.57,0,0,1,28.29,60.87Zm-2.88-4a25.3,25.3,0,0,0,6.33-.07L33,52.05a5.63,5.63,0,0,1,2.46-3.2l5.69-3.28a5.59,5.59,0,0,1,4-.53l4.51,1.21c.39-.54,1-1.48,1.61-2.51a29.91,29.91,0,0,0,1.48-2.91l-3.42-3.42a5.61,5.61,0,0,1-1.54-3.72V27.12a5.61,5.61,0,0,1,1.54-3.72L52.7,20a25.27,25.27,0,0,0-3.08-5.36L44.82,16a5.6,5.6,0,0,1-4-.53l-5.69-3.29A5.61,5.61,0,0,1,32.68,9L31.4,4.15a24.46,24.46,0,0,0-5.8,0L24.31,9a5.64,5.64,0,0,1-2.45,3.2l-5.69,3.28a5.71,5.71,0,0,1-4,.56L7,14.72A28.64,28.64,0,0,0,5.4,17.26c-.57,1-1.05,2-1.33,2.55L7.66,23.4A5.59,5.59,0,0,1,9.2,27.12v6.57a5.77,5.77,0,0,1-1.48,3.7l-3.65,3.8a24.17,24.17,0,0,0,3,5.14L11.85,45a5.65,5.65,0,0,1,4,.53l5.69,3.28A5.7,5.7,0,0,1,24,52ZM25,55.63h0Zm12.64-3.26h0ZM7.45,15.28h0ZM8.27,15ZM19.65,8.62h0Zm0,0h0Zm17.66,0h0ZM28.4,44.85A14.35,14.35,0,1,1,42.75,30.5,14.37,14.37,0,0,1,28.4,44.85Zm0-24.42A10.07,10.07,0,1,0,38.47,30.5,10.08,10.08,0,0,0,28.4,20.43Z"/></g></svg></a></div></div></div>';

                web3_provider.eth.getBalance(global_state.account, function (error, eth_balance) {
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
                                if (token_symbol == 'DCN' || token_symbol == 'DCN2.0') {
                                    eth_fee_check = parseFloat(eth_fee).toFixed(8);
                                } else if (token_symbol == 'ETH' || token_symbol == 'ETH2.0') {
                                    var amount_decimal = new Decimal(amount);
                                    eth_fee_check = amount_decimal.plus(parseFloat(eth_fee).toFixed(8));
                                }

                                if (eth_balance.lessThan(eth_fee_check)) {
                                    basic.showAlert($('.translates-holder').attr('no-balance'), '', true);
                                    $('.transaction-confirmation-popup .on-change-result').html('');
                                } else {
                                    if ($('.cached-keystore-file #your-secret-key-password').val().trim() == '') {
                                        basic.showAlert($('.translates-holder').attr('valid-password'), '', true);
                                    } else {
                                        projectData.general_logic.showLoader($('.translates-holder').attr('hold-on'));

                                        setTimeout(function () {
                                            decryptKeystore(window.localStorage.getItem('keystore_file'), $('.cached-keystore-file #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                                if (success) {
                                                    submitTransactionToBlockchain(web3_provider, transactionType, function_abi, token_symbol, amount, to, success);
                                                } else if (error) {
                                                    basic.showAlert(error_message, '', true);
                                                    projectData.general_logic.hideLoader();
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
                                if (token_symbol == 'DCN' || token_symbol == 'DCN2.0') {
                                    eth_fee_check = parseFloat(eth_fee).toFixed(8);
                                } else if (token_symbol == 'ETH' || token_symbol == 'ETH2.0') {
                                    var amount_decimal = new Decimal(amount);
                                    eth_fee_check = amount_decimal.plus(parseFloat(eth_fee).toFixed(8));
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
                                            projectData.general_logic.showLoader($('.translates-holder').attr('hold-on'));

                                            setTimeout(function () {
                                                var validating_private_key = validatePrivateKey($('.proof-of-address #your-private-key').val().trim());
                                                if (validating_private_key.success) {
                                                    if (projectData.utils.checksumAddress(validating_private_key.success.address) == projectData.utils.checksumAddress(global_state.account)) {
                                                        submitTransactionToBlockchain(web3_provider, transactionType, function_abi, token_symbol, amount, to, new Buffer($('.proof-of-address #your-private-key').val().trim(), 'hex'));
                                                    } else {
                                                        basic.showAlert($('.translates-holder').attr('key-related'), '', true);
                                                        projectData.general_logic.hideLoader();
                                                    }
                                                } else if (validating_private_key.error) {
                                                    basic.showAlert(validating_private_key.message, '', true);
                                                    projectData.general_logic.hideLoader();
                                                }
                                            }, 2000);
                                        }
                                    });
                                }
                            });

                            //init keystore btn logic
                            styleKeystoreUploadBtnForTx(function (key) {
                                var eth_fee_check;
                                if (token_symbol == 'DCN' || token_symbol == 'DCN2.0') {
                                    eth_fee_check = parseFloat(eth_fee).toFixed(8);
                                } else if (token_symbol == 'ETH' || token_symbol == 'ETH2.0') {
                                    var amount_decimal = new Decimal(amount);
                                    eth_fee_check = amount_decimal.plus(parseFloat(eth_fee).toFixed(8));
                                }

                                if (eth_balance.lessThan(eth_fee_check)) {
                                    basic.showAlert($('.translates-holder').attr('no-balance'), '', true);
                                    $('.transaction-confirmation-popup .on-change-result').html('');
                                    projectData.general_logic.hideLoader();
                                } else {
                                    submitTransactionToBlockchain(web3_provider, transactionType, function_abi, token_symbol, amount, to, key);
                                }
                            });
                        }
                        projectData.general_logic.hideLoader();
                    }
                });
            }
        },
        getEthereumTransactionHistory: async function(url, layer) {
            var etherscan_transactions = await $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json'
            });

            var ethereum_transactions_arr = [];
            if (etherscan_transactions.result) {
                for (var i = 0, len = etherscan_transactions.result.length; i < len; i+=1) {
                    if (etherscan_transactions.result[i].txreceipt_status == '1' && etherscan_transactions.result[i].input == '0x') {
                        etherscan_transactions.result[i].type = 'eth_transaction';
                        etherscan_transactions.result[i].layer = layer;
                        ethereum_transactions_arr.push(etherscan_transactions.result[i]);
                    }
                }
            }

            return ethereum_transactions_arr;
        },
        getDentacoinTransactionHistory: async function(contract_instance, block_number, callback) {
            //getting blockchain events where the logged user was the sender of the transaction
            contract_instance.getPastEvents('Transfer', {
                filter: {_from: global_state.account},
                fromBlock: block_number,
                toBlock: 'latest'
            }, function (events_from_user_err, events_from_user) {
                if (!events_from_user_err) {
                    //getting blockchain events where the logged user was the receiver of the transaction
                    contract_instance.getPastEvents('Transfer', {
                        filter: {_to: global_state.account},
                        fromBlock: block_number,
                        toBlock: 'latest'
                    }, async function (events_to_user_err, events_to_user) {
                        if (!events_from_user_err && !events_to_user_err) {
                            callback(events_from_user.concat(events_to_user));
                        }
                    });
                }
            });
        },
        buildTransactionHistory: async function () {
            tx_history = [];
            if (window.localStorage.getItem('tx_history') != null) {
                var tx_history_storage = JSON.parse(window.localStorage.getItem('tx_history'));
                var starting_l1_block = tx_history_storage.covered_l1_block + 1;
                var starting_l2_block = tx_history_storage.covered_l2_block + 1;
            } else {
                var starting_l1_block = block_number_of_dcn_creation;
                var starting_l2_block = config_variable.L2blockOfL1L2Integration;
            }

            //getting transactions data by etherscan
            var l1_etherscan_transactions = await projectData.general_logic.getEthereumTransactionHistory(config_variable.etherscan_api_domain + '/api?module=account&action=txlist&address=' + global_state.account + '&startblock=' + starting_l1_block + '&apikey=' + config_variable.etherscan_api_key, 'L1');
            var l2_etherscan_transactions = await projectData.general_logic.getEthereumTransactionHistory(config_variable.optimism_etherscan_api_domain + '/api?module=account&action=txlist&address=' + global_state.account + '&startblock=' + starting_l2_block + '&apikey=' + config_variable.etherscan_api_key, 'L2');

            projectData.general_logic.getDentacoinTransactionHistory(L1DCNContract, starting_l1_block, function(l1_events) {
                for (var i = 0, len = l1_events.length; i < len; i+=1) {
                    l1_events[i].layer = 'L1';
                }
                projectData.general_logic.getDentacoinTransactionHistory(L2DCNContract, starting_l2_block, function(l2_events) {
                    //var l1_transactions = l1_etherscan_transactions.concat(l1_events);

                    var merged_events_arr = [];
                    //if (l2_events.length) {
                        for (var i = 0, len = l2_events.length; i < len; i+=1) {
                            l2_events[i].layer = 'L2';
                        }

                        //if (l2_etherscan_transactions.length) {
                            merged_events_arr = l1_etherscan_transactions.concat(l1_events, l2_events, l2_etherscan_transactions);
                        /*} else {
                            merged_events_arr = merged_events_arr.concat(l1_transactions);
                        }*/
                        proceedWithMixedL1L2TransactionHistoryBuilding();
                    /*} else {
                        merged_events_arr = l1_transactions;
                        if (l2_etherscan_transactions.length) {
                            merged_events_arr = merged_events_arr.concat(l2_etherscan_transactions);
                        }

                        proceedWithOnlyL1TransactionHistoryBuilding();
                    }*/

                    async function proceedWithMixedL1L2TransactionHistoryBuilding() {
                        if (merged_events_arr.length || window.localStorage.getItem('tx_history') != null) {
                            $('.camping-transaction-history').html('<h2 class="lato-bold fs-25 text-center white-crossed-label color-white"><span class="renew-on-lang-switch" data-slug="tx-history">'+$('.translates-holder').attr('tx-history')+'</span></h2><div class="transaction-history container"><div class="row"><div class="col-xs-12 no-gutter-xs col-md-10 col-md-offset-1 padding-top-20 tx-history-scroll-parent"><table class="color-white"><tbody><tr class="loading-tr"><td class="text-center" colspan="5"><figure class="inline-block rotate-animation"><img src="assets/images/exchange.png" alt="Exchange icon"/></figure></td></tr></tbody></table></div></div><div class="row camping-show-more"></div></div>');

                            var counter = 0;
                            async function iterateEvents(counter) {
                                if (counter < merged_events_arr.length) {
                                    if (basic.property_exists(merged_events_arr[counter], 'type') && merged_events_arr[counter].type == 'eth_transaction') {
                                        counter+=1;
                                        iterateEvents(counter);
                                    } else {
                                        if (basic.property_exists(merged_events_arr[counter], 'layer') && merged_events_arr[counter].layer == 'L2') {
                                            var blockData = await dApp.web3_l2.eth.getBlock(merged_events_arr[counter].blockNumber);
                                        } else {
                                            var blockData = await dApp.web3_l1.eth.getBlock(merged_events_arr[counter].blockNumber);
                                        }
                                        merged_events_arr[counter].timeStamp = blockData.timestamp;
                                        counter+=1;
                                        iterateEvents(counter);
                                    }
                                } else {
                                    projectData.utils.sortByKey(merged_events_arr, 'timeStamp');
                                    merged_events_arr = merged_events_arr.reverse();

                                    projectData.requests.getEthereumDataByCoingecko(function (ethereumResponse) {
                                        var ethereum_data = ethereumResponse;
                                        projectData.requests.getDentacoinDataByCoingeckoProvider(async function (dentacoinResponse) {
                                            var dentacoin_data = dentacoinResponse;
                                            var mixed_L1L2_transacton_history_html;

                                            if (window.localStorage.getItem('tx_history') != null) {
                                                merged_events_arr = merged_events_arr.concat(JSON.parse(window.localStorage.getItem('tx_history')).merged_events_arr);
                                            }

                                            window.localStorage.setItem('tx_history', JSON.stringify({
                                                covered_l1_block: await dApp.web3_l1.eth.getBlockNumber(),
                                                covered_l2_block: await dApp.web3_l2.eth.getBlockNumber(),
                                                merged_events_arr: merged_events_arr
                                            }));

                                            for (var i = 0, len = merged_events_arr.length; i < len; i+=1) {
                                                if (basic.property_exists(merged_events_arr[i], 'type') && merged_events_arr[i].type == 'eth_transaction') {
                                                    //eth transaction
                                                    mixed_L1L2_transacton_history_html += projectData.general_logic.buildEthereumHistoryTransaction(ethereum_data, projectData.utils.fromWei(merged_events_arr[i].value, 'ether'), merged_events_arr[i].to, merged_events_arr[i].from, merged_events_arr[i].timeStamp, merged_events_arr[i].hash, undefined, merged_events_arr[i].layer);
                                                } else {
                                                    //dcn transaction
                                                    mixed_L1L2_transacton_history_html += projectData.general_logic.buildDentacoinHistoryTransaction(dentacoin_data, merged_events_arr[i].returnValues._value, merged_events_arr[i].returnValues._to, merged_events_arr[i].returnValues._from, merged_events_arr[i].timeStamp, merged_events_arr[i].transactionHash, undefined, merged_events_arr[i].layer);
                                                }
                                            }

                                            $('.camping-transaction-history table tbody').append(mixed_L1L2_transacton_history_html);
                                            $('.camping-transaction-history table tbody tr.loading-tr').remove();
                                            $('.camping-transaction-history table tr').addClass('show-this');
                                        });
                                    });
                                }
                            }
                            iterateEvents(counter);
                        }
                    }

                    function proceedWithOnlyL1TransactionHistoryBuilding() {
                        if (merged_events_arr.length || window.localStorage.getItem('tx_history') != null) {
                            //sorting the mixed array by blockNumber
                            projectData.utils.sortByKey(merged_events_arr, 'blockNumber');
                            merged_events_arr = merged_events_arr.reverse();

                            projectData.requests.getEthereumDataByCoingecko(function (ethereumResponse) {
                                var ethereum_data = ethereumResponse;
                                projectData.requests.getDentacoinDataByCoingeckoProvider(function (dentacoinResponse) {
                                    var dentacoin_data = dentacoinResponse;

                                    $('.camping-transaction-history').html('<h2 class="lato-bold fs-25 text-center white-crossed-label color-white"><span class="renew-on-lang-switch" data-slug="tx-history">'+$('.translates-holder').attr('tx-history')+'</span></h2><div class="transaction-history container"><div class="row"><div class="col-xs-12 no-gutter-xs col-md-10 col-md-offset-1 padding-top-20 tx-history-scroll-parent"><table class="color-white"><tbody></tbody></table></div></div><div class="row camping-show-more"></div></div>');

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
                                                transaction_history_html += projectData.general_logic.buildEthereumHistoryTransaction(ethereum_data, projectData.utils.fromWei(merged_events_arr[custom_iterator].value, 'ether'), merged_events_arr[custom_iterator].to, merged_events_arr[custom_iterator].from, merged_events_arr[custom_iterator].timeStamp, merged_events_arr[custom_iterator].hash, undefined, merged_events_arr[custom_iterator].layer);

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

                                                            transaction_history_html += projectData.general_logic.buildDentacoinHistoryTransaction(dentacoin_data, merged_events_arr[custom_iterator].returnValues._value, merged_events_arr[custom_iterator].returnValues._to, merged_events_arr[custom_iterator].returnValues._from, temporally_timestamps[custom_iterator], merged_events_arr[custom_iterator].transactionHash, undefined, merged_events_arr[custom_iterator].layer);

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

                                                if ($('.camping-transaction-history .show-more').attr('show-all-transactions') == 'true') {
                                                    $('.camping-transaction-history table tr').addClass('show-this');
                                                }
                                            }

                                            if (basic.property_exists(merged_events_arr[custom_iterator], 'type') && merged_events_arr[custom_iterator].type == 'eth_transaction') {
                                                //eth transaction
                                                next_transaction_history_html += projectData.general_logic.buildEthereumHistoryTransaction(ethereum_data, projectData.utils.fromWei(merged_events_arr[custom_iterator].value, 'ether'), merged_events_arr[custom_iterator].to, merged_events_arr[custom_iterator].from, merged_events_arr[custom_iterator].timeStamp, merged_events_arr[custom_iterator].hash, undefined, merged_events_arr[custom_iterator].layer);

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

                                                            next_transaction_history_html += projectData.general_logic.buildDentacoinHistoryTransaction(dentacoin_data, merged_events_arr[custom_iterator].returnValues._value, merged_events_arr[custom_iterator].returnValues._to, merged_events_arr[custom_iterator].returnValues._from, temporally_timestamps[custom_iterator], merged_events_arr[custom_iterator].transactionHash, undefined, merged_events_arr[custom_iterator].layer);

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

                                            if ($('.camping-transaction-history .show-more').attr('show-all-transactions') == 'true') {
                                                $('.camping-transaction-history table tr').addClass('show-this');
                                            }

                                            //updating transaction history every 10 minutes, because the project is SPA and pages are not really refreshed on route change, routes are dynamicly loaded with AngularJS
                                            setTimeout(function () {
                                                projectData.general_logic.buildTransactionHistory();
                                            }, 300000);
                                        }
                                    }
                                });
                            });
                        } else {
                            $('.camping-transaction-history').html('<h2 class="lato-bold fs-16 text-center color-white"><span class="renew-on-lang-switch" data-slug="no-tx">'+$('.translates-holder').attr('no-tx')+'</span></h2>');
                        }
                    }
                });
            });
        },
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
                            projectData.general_logic.customWarningHandle($('.tx-settings-popup #edit-gas-price').closest('.form-row'), $('.translates-holder').attr('low-gas'))
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
                        projectData.general_logic.customErrorHandle($('.tx-settings-popup #gas-price').closest('.form-row'), $('.translates-holder').attr('enter-gas'));
                    } else if (parseInt($('.tx-settings-popup #edit-nonce').val().trim()) < parseInt($('.tx-settings-popup #edit-nonce').attr('data-min-value'))) {
                        projectData.general_logic.customErrorHandle($('.tx-settings-popup #edit-nonce').closest('.form-row'), $('.translates-holder').attr('cant-submit'));
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

                        proceedWithPrinting('assets/images/private-key-background.png');
                    } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
                        borderImage = 'src="https://dentacoin.com/assets/uploads/private-key-background.png"';
                        borderStyle = 'width: 100%';

                        printingHtml = '<html><head><style>body, html {margin: 0; padding: 0;text-align: center;color: black;font-family: “Helvetica Neue”,Helvetica,Arial,sans-serif;} .border-parent{text-align: left;position:relative; display: inline-block;} img {'+borderStyle+'} .absolute-content{position: absolute;z-index: 100;width: 80%;height: 80%;top: 0;left: 0;padding: 10%;}</style></head><body><div class="border-parent"><img '+borderImage+' id="border-image"/><div class="absolute-content"><div style="text-align:center;"><i>'+$('.translates-holder').attr('confidential')+'</i><h1 style="margin-top: 15px;font-weight:bold;color: black; margin-bottom: 10px;">DENTACOIN</h1><div style="font-size: 18px;color: #2a3575;padding-bottom: 15px;"><b>'+$('.translates-holder').attr('unlock-funds')+'</b></div><div style="background-color: white;padding: 20px 10px;text-align: left;"><div style="color: #888888;padding-bottom: 5px;font-weight: bold;">'+$('.translates-holder').attr('pk-label')+':</div><div style="font-size: 14px;">'+privateKey+'</div></div><div style="font-size: 22px;padding: 30px 0 10px;"><b>'+$('.translates-holder').attr('pk-as-qr')+'</b></div><div>'+qrCodeBase64Data+'</div><div style=" text-align: left; "><div style="font-size: 20px;color: #2a3575;padding-bottom: 15px;padding-top: 20px;font-weight: bold;">'+$('.translates-holder').attr('important')+'</div><div style=" padding-bottom: 15px;"><b>1.</b> '+$('.translates-holder').attr('provides')+'<div></div>'+projectData.utils.checksumAddress(window.localStorage.getItem('current_account'))+'</div><div style=" padding-bottom: 15px;"><b>2.</b> '+$('.translates-holder').attr('secure-place')+'</div><div style=" padding-bottom: 15px;"><b>3. '+$('.translates-holder').attr('never-share')+'</div><div><b>4.</b> '+$('.translates-holder').attr('to-unlock')+'</div></div></div></div></div></body></html>';

                        proceedWithPrinting('/assets/images/private-key-background.png');
                    }
                } else {
                    borderImage = 'src="assets/images/private-key-background.png"';
                    borderStyle = 'height: 97.5vh';
                    printingHtml = '<html><head><style>body, html {margin: 0; padding: 0;text-align: center;color: black;font-family: “Helvetica Neue”,Helvetica,Arial,sans-serif;} .border-parent{text-align: left;position:relative; display: inline-block;} img {'+borderStyle+'} .absolute-content{position: absolute;z-index: 100;width: 80%;height: 80%;top: 0;left: 0;padding: 10%;}</style></head><body><div class="border-parent"><img '+borderImage+' id="border-image"/><div class="absolute-content"><div style="text-align:center;"><i>'+$('.translates-holder').attr('confidential')+'</i><h1 style="margin-top: 15px;font-weight:bold;color: black; margin-bottom: 10px;">DENTACOIN</h1><div style="font-size: 18px;color: #2a3575;padding-bottom: 15px;"><b>'+$('.translates-holder').attr('unlock-funds')+'</b></div><div style="background-color: white;padding: 20px 10px;text-align: left;"><div style="color: #888888;padding-bottom: 5px;font-weight: bold;">'+$('.translates-holder').attr('pk-label')+':</div><div style="font-size: 14px;">'+privateKey+'</div></div><div style="font-size: 22px;padding: 30px 0 10px;"><b>'+$('.translates-holder').attr('pk-as-qr')+'</b></div><div>'+qrCodeBase64Data+'</div><div style=" text-align: left; "><div style="font-size: 20px;color: #2a3575;padding-bottom: 15px;padding-top: 20px;font-weight: bold;">'+$('.translates-holder').attr('important')+'</div><div style=" padding-bottom: 15px;"><b>1.</b> '+$('.translates-holder').attr('provides')+'<div></div>'+projectData.utils.checksumAddress(window.localStorage.getItem('current_account'))+'</div><div style=" padding-bottom: 15px;"><b>2.</b> '+$('.translates-holder').attr('secure-place')+'</div><div style=" padding-bottom: 15px;"><b>3. '+$('.translates-holder').attr('never-share')+'</div><div><b>4.</b> '+$('.translates-holder').attr('to-unlock')+'</div></div></div></div></div></body></html>';

                    proceedWithPrinting('/assets/images/private-key-background.png');
                }

                function proceedWithPrinting(imgSrc) {
                    if (is_hybrid) {
                        var newImg = new Image;
                        newImg.onload = function() {
                            console.log('loaded image');
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
                                });
                            }, 1000);
                        };
                        newImg.src = imgSrc;
                    } else {
                        var mywindow = window.open('', 'PRINT');
                        mywindow.document.write(printingHtml);

                        var imgTag = mywindow.document.getElementById('border-image');
                        var newImg = new Image;
                        newImg.onload = function() {
                            console.log('loaded image');
                            imgTag.src = this.src;

                            setTimeout(function() {
                                mywindow.document.close(); // necessary for IE >= 10
                                mywindow.focus(); // necessary for IE >= 10*/

                                mywindow.print();
                                mywindow.close();

                                return true;
                            }, 1000);
                        };
                        newImg.src = imgSrc;
                    }
                }
            }
        },
        fireGoogleAnalyticsEvent: function(category, action, label, value) {
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
        },
        customWarningHandle: function(el, string) {
            //method that appends front end warnings
            el.append('<div class="warning-handle">' + string + '</div>');
        },
        customErrorHandle: function(el, string) {
            //method that appends front end errors
            el.append('<div class="error-handle">' + string + '</div>');
        },
        removeAccountChecker: function() {
            $('.account-checker-container').addClass('hide').removeClass('visible');
        },
        displayMessageOnTransactionSend: function(message) {
            window.scrollTo(0, 0);
            $('.section-amount-to #crypto-amount').val('').trigger('change');
            $('.section-amount-to #usd-val').val('').trigger('change');
            $('.section-amount-to #verified-receiver-address').prop('checked', false);

            basic.showAlert(message, '', true);
        },
        iOSFileUpload: function(callback) {
            //opening filepicker for iOS
            FilePicker.pickFile(function (path) {
                var fileDir = cordova.file.tempDirectory.replace('file://', '');
                var fileName = path.replace(fileDir, '');

                window.resolveLocalFileSystemURL(cordova.file.tempDirectory, function (rootEntry) {
                    rootEntry.getFile(fileName, {create: false}, function (fileEntry) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function () {
                                var keystore_string = this.result;
                                callback(keystore_string, fileEntry.name);
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
        },
        initCustomInputFileAnimation: function(this_btn, file_name) {
            //animation of the button which uploads keystore file
            var btn = $(this_btn);
            if (btn.parent().find('.file-name').length) {
                btn.parent().find('.file-name').remove();
            }
            if (file_name != undefined) {
                btn.parent().append('<span class="file-name fs-14 fs-xs-13" style="padding: 5px 10px 15px;display: block;max-width: 400px;margin: 0 auto;text-decoration: underline;color: #888;">'+file_name+'</span>');
            }
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
        },
        androidFileUpload: function(file_uri, callback) {
            //opening filepicker for Android
            window.FilePath.resolveNativePath(file_uri, successNative, function(e) {
                console.log(e);
                alert('Something went wrong with uploading your Backup file. Please contact admin@dentacoin.com.');
            });

            function successNative(finalPath) {
                window.resolveLocalFileSystemURL(finalPath, function (entry) {
                    entry.file(function (file) {
                        callback(file, file.name);
                    }, function (err) {
                        alert('Something went wrong with uploading your Backup file. Please contact admin@dentacoin.com.');
                    });
                });
            }
        },
        hybridAppFileDownload: function(file_name, file_content, callback, location, download_folder) {
            //method to download files in Download folder in Android device
            window.resolveLocalFileSystemURL(location, function (fileSystem) {
                if (download_folder) {
                    fileSystem.getDirectory('Download', {create: true, exclusive: false}, function (dirEntry) {
                        proceedWithDownload(dirEntry, file_name);
                    }, function (err) {
                        console.log(err, 'err');
                        projectData.general_logic.hideLoader();
                        alert('Something went wrong with downloading your file (Core error 5). Please contact admin@dentacoin.com.');
                    });
                } else {
                    proceedWithDownload(fileSystem, file_name);
                }

                function proceedWithDownload(dirEntry, file_name) {
                    dirEntry.getFile(file_name, {create: true, exclusive: true}, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.onwriteend = function (e) {
                                console.log('file saved');

                                callback();
                            };

                            fileWriter.onerror = function (e) {
                                console.log(e, 'error');
                                projectData.general_logic.hideLoader();
                                alert('Something went wrong with caching your file (Core error 3). Please contact admin@dentacoin.com.');
                            };

                            // Create a new Blob and write they keystore content inside of it
                            var blob = new Blob([file_content], {type: 'text/plain'});
                            fileWriter.write(blob);
                        }, function (err) {
                            console.log(err, 'err');
                            projectData.general_logic.hideLoader();
                            alert('Something went wrong with downloading your file (Core error 4). Please contact admin@dentacoin.com.');
                        });
                    }, function (err) {
                        // if download fails, try to download again, but with new unique name
                        console.log(err, 'err');
                        proceedWithDownload(dirEntry, file_name + ' (' + Math.floor(Date.now() / 1000) + ')');
                    });
                }
            });
        },
        initScan: function(clicker, valueHolder, callback, warning, warningText) {
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
                            projectData.general_logic.showLoader();
                            $.getScript('https://rawgit.com/schmich/instascan-builds/master/instascan.min.js', function () {
                                load_qr_code_lib = false;
                                projectData.general_logic.hideLoader();

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
        },
        buildDentacoinHistoryTransaction: function(dentacoin_data, value, to, from, timestamp, transactionHash, pending, layer) {
            //template to append dentacoin transactions while build the transactions history
            var dcn_amount_symbol;
            var other_address = '';
            var class_name = '';
            var label = '';
            if (projectData.utils.checksumAddress(to) == projectData.utils.checksumAddress(global_state.account) && !tx_history.includes(transactionHash)) {
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

            tx_history.push(transactionHash);

            var dcn_amount = dcn_amount_symbol + value + ' DCN';
            var etherscan_domain = config_variable.etherscan_domain;
            if (layer == 'L2') {
                dcn_amount+='2.0';
                etherscan_domain = config_variable.optimism_etherscan_domain;
            }
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

            return '<tr class="' + class_name + ' single-transaction" onclick="window.open(\''+etherscan_domain+'/tx/' + transactionHash + '\');"><td class="icon"></td><td><ul><li>' + (date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() + '</li><li>' + hours + ':' + minutes + '</li></ul></td><td><ul><li><span><strong>' + label + ': </strong>' + other_address + '</span></li><li><a href="'+etherscan_domain+'/tx/' + transactionHash + '" target="_blank" class="lato-bold color-white data-external-link">' + transaction_id_label + '</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5">' + pricesList + '</td></tr>';
        },
        buildEthereumHistoryTransaction: function(ethereum_data, value, to, from, timestamp, hash, pending, layer) {
            //template to append ethereum transactions while build the transactions history
            var eth_amount_symbol;
            var other_address = '';
            var class_name = '';
            var label = '';
            if (projectData.utils.checksumAddress(to) == projectData.utils.checksumAddress(global_state.account) && !tx_history.includes(hash)) {
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

            tx_history.push(hash);

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

            var etherscan_domain = config_variable.etherscan_domain;
            var currency_label = 'ETH';
            if (layer == 'L2') {
                currency_label+='2.0';
                etherscan_domain = config_variable.optimism_etherscan_domain;
            }

            return '<tr class="' + class_name + ' single-transaction" onclick="window.open(\''+etherscan_domain+'/tx/' + hash + '\');"><td class="icon"></td><td><ul><li>' + (date_obj.getMonth() + 1) + '/' + date_obj.getDate() + '/' + date_obj.getFullYear() + '</li><li>' + hours + ':' + minutes + '</li></ul></td><td><ul><li><span><strong>' + label + ': </strong>' + other_address + '</span></li><li><a href='+etherscan_domain+'"/tx/' + hash + '" target="_blank" class="lato-bold color-white data-external-link">' + transaction_id_label + '</a></li></ul></td><td class="text-right padding-right-15 padding-right-xs-5"><ul><li class="lato-bold dcn-amount">' + eth_amount_symbol + parseFloat(value).toFixed(6) + ' '+currency_label+'</li><li>' + usd_amount + ' USD</li></ul></td></tr>';
        },
        savePublicKey: function(address, key) {
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
        },
        addMobileDeviceId: function (callback, id) {
            $.ajax({
                type: 'POST',
                url: 'https://assurance.dentacoin.com/save-mobile-id',
                dataType: 'json',
                data: {
                    address: projectData.utils.checksumAddress(window.localStorage.getItem('current_account')),
                    mobile_device_id: id
                },
                success: function(response) {
                    callback(response);
                }
            });
        },
        hideMobileAppBannerForDesktopBrowsers: function() {
            $('footer .mobile-app-banner').remove();
        },
        showMobileAppBannerForDesktopBrowsers: function() {
            if (!is_hybrid && !basic.isMobile()) {
                projectData.general_logic.hideMobileAppBannerForDesktopBrowsers();
                setTimeout(function() {
                    if ($('.mobile-app-banner').length) {
                        $('.mobile-app-banner').remove();
                    }
                    $('footer').prepend('<div class="mobile-app-banner margin-bottom-25">' + mobileAppBannerForDesktopBrowsersHtml + '</div>');
                    $('.mobile-app-banner-title').html($('.translates-holder').attr('also-available'));
                }, 1000);
            }
        },
        downloadFile: function(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.setAttribute('target', '_blank');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },
        buildKeystoreFileName: function(address) {
            if (address.length == 40) {
                address = '0x' + address;
            }
            return 'Dentacoin secret key - ' + projectData.utils.checksumAddress(address);
        },
        hideLoader: function() {
            //hiding front end loader
            $('.camping-loader').html('');
        },
        showLoader: function(message) {
            //showing front end loader
            if (message === undefined) {
                message = '<div class="calibri-bold fs-24">Loading ...</div>';
            }
            $('.camping-loader').html('<div class="response-layer"><div class="wrapper"><figure itemscope="" itemtype="http://schema.org/ImageObject" class="circle-image"><img src="assets/images/circle-for-wallet-logo.png" class="width-100" alt="Loader"><div class="absolute-content text-center"><img src="assets/images/wallet-loading.png" class="width-100 max-width-150 max-width-xs-70" alt="Logo"/><div class="message fs-18">' + message + '</div></div></figure></div></div>');
            $('.response-layer').show();
        },
        firePushNotification: function(title, text) {
            if (is_hybrid) {
                cordova.plugins.notification.local.schedule({
                    title: title,
                    text: text,
                    foreground: true
                });
            }
        }
    },
    requests: {
        getGasPrice: async function () {
            return await $.getJSON('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=' + config_variable.etherscan_api_key);
        },
        getDentacoinDataByCoingeckoProvider: async function (callback, fullResponse) {
            $.ajax({
                type: 'GET',
                url: 'https://api.coingecko.com/api/v3/coins/dentacoin',
                dataType: 'json',
                success: function (response) {
                    if (fullResponse) {
                        callback(response);
                    } else {
                        callback(response.market_data.current_price.usd);
                    }
                },
                error: function() {
                    projectData.general_logic.hideLoader();
                    alert($('.translates-holder').attr('smth-went-wrong') + ' (Code error 10.0).');
                }
            });
        },
        getDentaprimeClinicAddresses: async function () {
            return await $.ajax({
                type: 'GET',
                url: 'https://api.dentacoin.com/api/wallet-addresses/72716',
                dataType: 'json'
            });
        },
        getEthereumDataByCoingecko: function(callback) {
            $.ajax({
                type: 'GET',
                url: 'https://api.coingecko.com/api/v3/coins/ethereum',
                dataType: 'json',
                success: function (response) {
                    callback(response);
                },
                error: function() {
                    projectData.general_logic.hideLoader();
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
                    projectData.general_logic.hideLoader();
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
                    projectData.general_logic.hideLoader();
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
            return dApp.web3_l1.utils.isAddress(address);
        },
        fromWei: function (wei_amount, type) {
            if (type != undefined) {
                return dApp.web3_l1.utils.fromWei(wei_amount, type);
            } else {
                return dApp.web3_l1.utils.fromWei(wei_amount);
            }
        },
        toWei: function (eth_amount, unit) {
            if (unit == undefined) {
                unit = 'ether';
            }
            return dApp.web3_l1.utils.toWei(eth_amount, unit);
        },
        checksumAddress: function (address) {
            if (address.length == 40) {
                address = '0x' + address;
            }
            return dApp.web3_l1.utils.toChecksumAddress(address);
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
                        projectData.general_logic.androidFileUpload(file_uri, function (file) {
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
                } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
                    projectData.general_logic.iOSFileUpload(function (keystore_string, fileName) {
                        proceedWithTransactionFiringAfterHavingTheKeystoreFile(keystore_string, fileName);
                    });
                }
            });

            function proceedWithTransactionFiringAfterHavingTheKeystoreFile(keystore_string, fileName) {
                if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address') && projectData.utils.checksumAddress(JSON.parse(keystore_string).address) == projectData.utils.checksumAddress(global_state.account)) {
                    var fileNameHtml = '';
                    if (fileName != undefined) {
                        fileNameHtml = '<div class="fs-14 light-gray-color text-center padding-bottom-10 padding-top-15 file-name">' + fileName + '</div>';
                    }

                    $('.proof-of-address .on-change-result').html('<div class="col-xs-12 col-sm-8 col-sm-offset-2 padding-top-5">'+fileNameHtml+'<div class="custom-google-label-style module" data-input-light-blue-border="true"><label for="your-secret-key-password">'+$('.translates-holder').attr('password-label')+'</label><input type="password" id="your-secret-key-password" maxlength="100" class="full-rounded"/></div></div><div class="col-xs-12"><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-tx-sign" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-tx-sign"><span class="padding-left-5 padding-right-5 inline-block">'+$('.translates-holder').attr('remember-file')+'</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block tx-sign-more-info-keystore-remember fs-0" data-content="'+$('.translates-holder').attr('remembering-file')+'"><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div></div><div class="btn-container col-xs-12 padding-top-25"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border confirm-transaction keystore-file">'+$('.translates-holder').attr('confirm')+'</a></div>');

                    $('.tx-sign-more-info-keystore-remember').popover({
                        trigger: 'click'
                    });

                    $('.confirm-transaction.keystore-file').click(function () {
                        if ($('.proof-of-address #your-secret-key-password').val().trim() == '') {
                            basic.showAlert($('.translates-holder').attr('valid-password'), '', true);
                        } else {
                            projectData.general_logic.showLoader($('.translates-holder').attr('hold-on'));

                            setTimeout(function () {
                                decryptKeystore(keystore_string, $('.proof-of-address #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                    if (success) {
                                        if ($('.proof-of-address #agree-to-cache-tx-sign').is(':checked')) {
                                            window.localStorage.setItem('keystore_file', keystore_string);
                                        }

                                        callback(success);
                                    } else if (error) {
                                        basic.showAlert(error_message, '', true);
                                        projectData.general_logic.hideLoader();
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
                                    projectData.general_logic.showLoader($('.translates-holder').attr('hold-on'));

                                    setTimeout(function () {
                                        decryptKeystore(keystore_string, $('.proof-of-address #your-secret-key-password').val().trim(), function (success, to_string, error, error_message) {
                                            if (success) {
                                                if ($('.proof-of-address #agree-to-cache-tx-sign').is(':checked')) {
                                                    window.localStorage.setItem('keystore_file', keystore_string);
                                                }

                                                callback(success);
                                            } else if (error) {
                                                basic.showAlert(error_message, '', true);
                                                projectData.general_logic.hideLoader();
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
function submitTransactionToBlockchain(web3_provider, transactionType, function_abi, symbol, token_val, to, key) {
    const EthereumTx = require('ethereumjs-tx');
    var transaction_obj = {
        gasLimit: web3_provider.utils.toHex($('.tx-data-holder').attr('data-gasLimit')),
        gasPrice: web3_provider.utils.toHex($('.tx-data-holder').attr('data-on_popup_load_gas_price')),
        from: global_state.account,
        nonce: web3_provider.utils.toHex($('.tx-data-holder').attr('data-nonce')),
    };

    //function_abi is when we want to add logic into our transaction (mostly when iteracting with contracts)
    if (function_abi != null) {
        transaction_obj.data = function_abi;
    }

    var token_label;
    var layer;
    var etherscanDomain;
    if (symbol == 'DCN') {
        transaction_obj.to = config_variable.l1.dcn_contract_address;
        transaction_obj.chainId = config_variable.l1.chain_id;
        layer = 'L1';
        token_label = 'Dentacoin tokens';
        etherscanDomain = config_variable.etherscan_domain;
    } else if (symbol == 'DCN2.0') {
        transaction_obj.to = config_variable.l2.dcn_contract_address;
        transaction_obj.chainId = config_variable.l2.chain_id;
        layer = 'L2';
        token_label = 'Dentacoin 2.0 tokens';
        etherscanDomain = config_variable.optimism_etherscan_domain;
    } else if (symbol == 'ETH') {
        transaction_obj.to = to;
        transaction_obj.chainId = config_variable.l1.chain_id;
        transaction_obj.value = web3_provider.utils.toHex(projectData.utils.toWei(token_val.toString()));
        layer = 'L1';
        token_label = 'Ethers';
        etherscanDomain = config_variable.etherscan_domain;
    } else if (symbol == 'ETH2.0') {
        transaction_obj.to = to;
        transaction_obj.chainId = config_variable.l2.chain_id;
        transaction_obj.value = web3_provider.utils.toHex(projectData.utils.toWei(token_val.toString()));
        layer = 'L2';
        token_label = 'Ethers 2.0';
        etherscanDomain = config_variable.optimism_etherscan_domain;
    }

    const tx = new EthereumTx(transaction_obj);
    //signing the transaction
    tx.sign(key);
    //submit the transaction
    web3_provider.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function (err, transactionHash) {
        projectData.general_logic.hideLoader();
        basic.closeDialog();

        var pending_history_transaction;
        if (symbol == 'DCN' || symbol == 'DCN2.0') {
            projectData.requests.getDentacoinDataByCoingeckoProvider(async function (request_response) {
                pending_history_transaction += projectData.general_logic.buildDentacoinHistoryTransaction(request_response, token_val, to, global_state.account, Math.round((new Date()).getTime() / 1000), transactionHash, true, layer);

                projectData.general_logic.fireGoogleAnalyticsEvent('Pay', 'Next', token_label, token_val);

                if (transactionType == 'swap') {
                    if (symbol == 'DCN2.0' || symbol == 'ETH2.0') {
                        projectData.general_logic.displayMessageOnTransactionSend('<div class="padding-top-15 padding-bottom-10 fs-16">While communication from Layer 1 to Layer 2 only takes a few minutes, communication from Layer 2 to Layer 1 on the Optimistic Ethereum mainnet takes about a week. This means that you must wait one week before you can claim a withdrawal on the Optimistic Ethereum mainnet. You can check if you\'re ready to claim your asset at <a href="' + etherscanDomain + '/messagerelayer?search=' + transactionHash + '" target="_blank" class="lato-bold color-light-blue data-external-link">Etherscan</a>. One you see your transaction with status <b>Ready for relay</b> then you are all set to proceed with the claiming transaction.</div>');
                    } else if (symbol == 'DCN' || symbol == 'ETH') {
                        projectData.general_logic.displayMessageOnTransactionSend('<div class="padding-top-15 padding-bottom-10 fs-16">' + $('.translates-holder').attr('your') + ' L2 tokens are on their way to your wallet. Check transaction status at <a href="' + etherscanDomain + '/tx/' + transactionHash + '" target="_blank" class="lato-bold color-light-blue data-external-link">Etherscan</a>.</div>');
                    }
                } else if (transactionType == 'transfer') {
                    projectData.general_logic.displayMessageOnTransactionSend('<div class="padding-top-15 padding-bottom-10 fs-16">' + $('.translates-holder').attr('your') + token_label + $('.translates-holder').attr('the-way') + ' <a href="' + etherscanDomain + '/tx/' + transactionHash + '" target="_blank" class="lato-bold color-light-blue data-external-link">Etherscan</a>.</div>');
                }

                $('.transaction-history tbody').prepend(pending_history_transaction);
                if (current_route == 'send') {
                    $('.search-field #search').val('');
                    $('.section-amount-to').hide();
                    $('.section-send').fadeIn(500);
                    $('#search').val('');
                } else if (current_route == 'swap') {
                    $('.swapping-section .inputable-amount').val('');
                    $('.swapping-section .to-box .inputable-line .transfer-to-amount').html('');
                    $('#checkbox-understand').prop('checked', false);
                }

                var formattedTo = to.substr(0, 5) + '...' + to.substr(to.length -5, 5);
                projectData.general_logic.firePushNotification('Sent: ' + token_val + ' ' + symbol, 'To: ' + formattedTo);
            });
        } else if (symbol == 'ETH' || symbol == 'ETH2.0') {
            projectData.requests.getEthereumDataByCoingecko(async function (request_response) {
                pending_history_transaction += projectData.general_logic.buildEthereumHistoryTransaction(request_response, token_val, to, global_state.account, Math.round((new Date()).getTime() / 1000), transactionHash, true, layer);

                projectData.general_logic.fireGoogleAnalyticsEvent('Pay', 'Next', token_label + 'in USD', Math.floor(parseFloat(token_val) * request_response.market_data.current_price.usd));
                if (transactionType == 'swap') {
                    projectData.general_logic.displayMessageOnTransactionSend('<div class="padding-top-15 padding-bottom-10 fs-16">While communication from Layer 1 to Layer 2 only takes a few minutes, communication from Layer 2 to Layer 1 on the Optimistic Ethereum mainnet takes about a week. This means that you must wait one week before you can claim a withdrawal on the Optimistic Ethereum mainnet. You can check if you\'re ready to claim your asset at <a href="' + etherscanDomain + '/messagerelayer?search=' + transactionHash + '" target="_blank" class="lato-bold color-light-blue data-external-link">Etherscan</a>. One you see your transaction with status <b>Ready for relay</b> then you are all set to proceed with the claiming transaction.</div>');
                } else if (transactionType == 'transfer') {
                    projectData.general_logic.displayMessageOnTransactionSend('<div class="padding-top-15 padding-bottom-10 fs-16">' + $('.translates-holder').attr('your') + token_label + $('.translates-holder').attr('the-way') + ' <a href="' + etherscanDomain + '/tx/' + transactionHash + '" target="_blank" class="lato-bold color-light-blue data-external-link">Etherscan</a>.</div>');
                }

                $('.transaction-history tbody').prepend(pending_history_transaction);
                if (current_route == 'send') {
                    $('.search-field #search').val('');
                    $('.section-amount-to').hide();
                    $('.section-send').fadeIn(500);
                    $('#search').val('');
                } else if (current_route == 'swap') {
                    $('.swapping-section .inputable-amount').val('');
                    $('.swapping-section .to-box .inputable-line .transfer-to-amount').html('');
                    $('#checkbox-understand').prop('checked', false);
                }

                var formattedTo = to.substr(0, 5) + '...' + to.substr(to.length -5, 5);
                projectData.general_logic.firePushNotification('Sent: ' + token_val + ' ' + symbol, 'To: ' + formattedTo);
            });
        }
    });
}

//method for 'refreshing' the mobile app
window.refreshApp = function () {
    $('.account-checker-container').addClass('hide').removeClass('visible');
    basic.closeDialog();
    projectData.general_logic.hideLoader();

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
    L1DCNContract = undefined;
    getL1Instance = undefined;
    L2DCNContract = undefined;
    L2OptimismGatewayProxyContract = undefined;
    L2OptimismL2StandardBridgeContract = undefined;
    getL2Instance = undefined;
    tx_history = [];

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
    projectData.general_logic.removeAccountChecker();

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

window.getSwapPageData = function () {
    executeGlobalLogic();
    initAccountChecker();

    if (!dApp.loaded) {
        dApp.init(function () {
            loadSwapPageData();
        });
    } else {
        loadSwapPageData();
    }

    function loadSwapPageData() {
        if ($.isReady) {
            //called on route change
            projectData.pages.swap_page();
        } else {
            //called on page init
            $(document).ready(function () {
                projectData.pages.swap_page();
            });
        }
    }
};

window.getSpendPageDentalServices = function () {
    executeGlobalLogic();
    projectData.general_logic.removeAccountChecker();

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

window.getSpendPageExchanges = function () {
    executeGlobalLogic();
    projectData.general_logic.removeAccountChecker();

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
    projectData.general_logic.removeAccountChecker();

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
        if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
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
                projectData.general_logic.showLoader($('.translates-holder').attr('hold-on-decrypt'));

                setTimeout(function () {
                    importKeystoreFile(window.localStorage.getItem('keystore_file'), $('.ios-camper #ios-camper-download-keystore-password').val().trim(), function (success, public_key, address, error, error_message) {
                        if (success) {
                            projectData.general_logic.hideLoader();
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
                            projectData.general_logic.hideLoader();
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

        projectData.general_logic.hideMobileAppBannerForDesktopBrowsers();

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
                    $('.mobile-app-banner-title').html($('.translates-holder').attr('also-available'));
                }
            }

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

                projectData.general_logic.initScan($('.scan-qr-code-importing-priv-key'), $('#import-private-key'), function () {
                    $('#import-private-key').focus();
                    $('label[for="import-private-key"]').addClass('active-label');
                });

                $('.continue-btn-priv-key > a').unbind().click(function () {
                    $('.import-private-key-row .error-handle').remove();

                    projectData.general_logic.showLoader();
                    setTimeout(function () {
                        var validate_private_key = validatePrivateKey($('#import-private-key').val().trim());
                        if (validate_private_key.success) {
                            var internet = navigator.onLine;
                            if (internet) {
                                projectData.general_logic.savePublicKey(validate_private_key.success.address, validate_private_key.success.public_key);
                            }
                            setTimeout(function () {
                                window.localStorage.setItem('current_account', validate_private_key.success.address);
                                projectData.general_logic.fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

                                if (is_hybrid) {
                                    if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
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
                            projectData.general_logic.hideLoader();

                            projectData.general_logic.customErrorHandle($('#import-private-key').closest('.field-parent'), validate_private_key.message);
                        }
                    }, 500);
                });
            });

            //importing with keystore file
            styleKeystoreUploadBtn();

            // ================================= /IMPORTING ==========================================

            // ================================= CREATING ==========================================
            var tempPrivKey;
            var tempAddress;
            $('.custom-auth-popup .popup-left .download-login-file').unbind().click(function () {
                var login_errors = false;
                $('.popup-left .error-handle').remove();
                var login_fields = $('.popup-left .required-field');

                for (var i = 0, len = login_fields.length; i < len; i += 1) {
                    if (login_fields.eq(i).val().trim() == '') {
                        projectData.general_logic.customErrorHandle(login_fields.eq(i).closest('.field-parent'), $('.translates-holder').attr('enter-pass'));
                        login_errors = true;
                    } else if (login_fields.eq(i).val().trim().length < 8 || login_fields.eq(i).val().trim().length > 30) {
                        projectData.general_logic.customErrorHandle(login_fields.eq(i).closest('.field-parent'), $('.translates-holder').attr('min-pass-error'));
                        login_errors = true;
                    }
                }

                if ($('.custom-auth-popup .keystore-file-pass').val().trim() != $('.custom-auth-popup .second-pass').val().trim()) {
                    projectData.general_logic.customErrorHandle($('.custom-auth-popup .second-pass').closest('.field-parent'), $('.translates-holder').attr('def-pass-error'));
                    login_errors = true;
                }

                if (!login_errors) {
                    if (is_hybrid) {
                        //MOBILE APP
                        if (basic.getMobileOperatingSystem() == 'Android') {
                            projectData.general_logic.showLoader($('.translates-holder').attr('few-mins'));
                        }/* else if (basic.getMobileOperatingSystem() == 'iOS') {
                        projectData.general_logic.showLoader($('.translates-holder').attr('few-mins-two'));
                    }*/
                    } else {
                        projectData.general_logic.showLoader($('.translates-holder').attr('few-mins'));
                    }

                    setTimeout(function () {
                        generateKeystoreFile($('.custom-auth-popup .keystore-file-pass').val().trim(), function (public_key, keystore, private_key) {
                            var keystore_file_name = projectData.general_logic.buildKeystoreFileName(keystore.address);
                            tempPrivKey = private_key;
                            tempAddress = '0x' + keystore.address;

                            // if internet connection save the public key to assurance
                            var internet = navigator.onLine;
                            if (internet) {
                                projectData.general_logic.savePublicKey(keystore.address, public_key);
                            }

                            if (is_hybrid) {
                                //MOBILE APP
                                if (basic.getMobileOperatingSystem() == 'Android') {
                                    //saving keystore file to Downloads folder
                                    projectData.general_logic.hybridAppFileDownload(keystore_file_name, JSON.stringify(keystore), function () {
                                        //saving keystore file to App folder
                                        projectData.general_logic.hybridAppFileDownload(keystore_file_name, JSON.stringify(keystore), function () {
                                            projectData.general_logic.fireGoogleAnalyticsEvent('Register', 'Download', 'Download Keystore');
                                            loginIntoWallet();

                                            basic.showAlert($('.translates-holder').attr('file') + keystore_file_name + $('.translates-holder').attr('has-been-stored'), 'overlap-loading-popup', true);
                                            setTimeout(function () {
                                                projectData.general_logic.fireGoogleAnalyticsEvent('Register', 'Create', 'Wallet');
                                                basic.closeDialog();
                                                projectData.general_logic.hideLoader();
                                                clearCreation();
                                            }, 6000);

                                        }, cordova.file.externalDataDirectory, false);
                                    }, cordova.file.externalRootDirectory, true);
                                } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
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
                                if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
                                    //mobile browser from iPhone
                                    basic.showAlert($('.translates-holder').attr('opened-new-tab'), 'mobile-safari-keystore-creation overlap-loading-popup', true);

                                    //mobile safari
                                    projectData.general_logic.downloadFile(keystore_file_name, JSON.stringify(keystore));

                                    $('.mobile-safari-keystore-creation .modal-footer .btn.btn-primary, .mobile-safari-keystore-creation .bootbox-close-button.close').click(function () {
                                        projectData.general_logic.fireGoogleAnalyticsEvent('Register', 'Create', 'Wallet');
                                        basic.closeDialog();
                                        loginIntoWallet();
                                        projectData.general_logic.hideLoader();
                                        clearCreation();
                                    });
                                } else {
                                    //BROWSER
                                    projectData.general_logic.downloadFile(keystore_file_name, JSON.stringify(keystore));
                                    projectData.general_logic.fireGoogleAnalyticsEvent('Register', 'Download', 'Download Keystore');
                                    loginIntoWallet();

                                    basic.showAlert($('.translates-holder').attr('file') +keystore_file_name + $('.translates-holder').attr('has-been-stored'), 'overlap-loading-popup', true);
                                    setTimeout(function () {
                                        projectData.general_logic.fireGoogleAnalyticsEvent('Register', 'Create', 'Wallet');
                                        basic.closeDialog();
                                        projectData.general_logic.hideLoader();
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

                                if (is_hybrid && (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel')) {
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

//styling input type file for importing keystore file
function styleKeystoreUploadBtn() {
    function proceedWithImportingAfterKeystoreUploading(keystore_string) {
        if (basic.isJsonString(keystore_string) && basic.property_exists(JSON.parse(keystore_string), 'address')) {
            $('.or-label').hide();
            $('.import-private-key-row').hide();

            //show continue button next step button
            $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('<div class="enter-pass-label"><label class="renew-on-lang-switch" data-slug="enter-pass-secret">'+$('.translates-holder').attr('enter-pass-secret')+'</label></div><div class="field-parent margin-bottom-15 max-width-300 margin-left-right-auto"><div class="custom-google-label-style module text-left" data-input-light-blue-border="true"><label for="import-keystore-password" class="renew-on-lang-switch" data-slug="enter-pass-label">'+$('.translates-holder').attr('enter-pass-label')+'</label><input type="password" id="import-keystore-password" class="full-rounded import-keystore-password"/></div></div><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-import" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-import"><span class="padding-left-5 padding-right-5 inline-block renew-on-lang-switch" data-slug="remember-file">'+$('.translates-holder').attr('remember-file')+'</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block import-more-info-keystore-remember fs-0" data-content="'+$('.translates-holder').attr('remembering-file')+'"><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border renew-on-lang-switch" data-slug="CONTINUE-btn">'+$('.translates-holder').attr('CONTINUE-btn')+'</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block renew-on-lang-switch" data-slug="go-back">'+$('.translates-holder').attr('go-back')+'</span></a></div>');

            $('.import-more-info-keystore-remember').popover({
                trigger: 'click'
            });

            $('#import-keystore-password').focus();
            $('label[for="import-keystore-password"]').addClass('active-label');

            $('.custom-auth-popup .popup-right .popup-body .continue-btn > a').click(function () {
                $('.custom-auth-popup .popup-right .error-handle').remove();
                var keystore_password = $('.custom-auth-popup .popup-right .popup-body .import-keystore-password').val().trim();
                if (keystore_password == '') {
                    projectData.general_logic.customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), $('.translates-holder').attr('enter-pass-secret'));
                } else {
                    projectData.general_logic.showLoader($('.translates-holder').attr('hold-decrypt'));

                    setTimeout(function () {
                        importKeystoreFile(keystore_string, keystore_password, function (success, public_key, address, error, error_message) {
                            if (success) {
                                var internet = navigator.onLine;
                                if (internet) {
                                    projectData.general_logic.savePublicKey(address, public_key);
                                }

                                var keystore_file_name = projectData.general_logic.buildKeystoreFileName(address);
                                setTimeout(function () {
                                    //saving keystore file to App folder
                                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
                                        dirEntry.getFile(keystore_file_name, {
                                            create: true,
                                            exclusive: false
                                        }, function (fileEntry) {
                                            fileEntry.createWriter(function (fileWriter) {
                                                fileWriter.onwriteend = function (e) {
                                                    projectData.general_logic.fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

                                                    if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
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
                                                    projectData.general_logic.hideLoader();
                                                    alert('Something went wrong with caching your file (Core error 2). Please contact admin@dentacoin.com.');
                                                };

                                                // Create a new Blob and write they keystore content inside of it
                                                var blob = new Blob([keystore_string], {type: 'text/plain'});
                                                fileWriter.write(blob);
                                            }, function (err) {
                                                console.log(err, 'err');
                                                projectData.general_logic.hideLoader();
                                                alert('Something went wrong with downloading your file (Core error 3). Please contact admin@dentacoin.com.');
                                            });
                                        }, function (err) {
                                            console.log(err, 'err');
                                            projectData.general_logic.hideLoader();
                                            alert('Something went wrong with downloading your file (Core error 4). Please contact admin@dentacoin.com.');
                                        });
                                    });
                                }, 500);
                            } else if (error) {
                                projectData.general_logic.hideLoader();
                                projectData.general_logic.customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), error_message);
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
                    projectData.general_logic.androidFileUpload(file_uri, function (file, fileName) {
                        var reader = new FileReader();

                        if (this_btn != undefined) {
                            projectData.general_logic.initCustomInputFileAnimation(this_btn, fileName);
                        }

                        reader.onloadend = function () {
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
        } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
            //iOS
            $('.custom-upload-button').click(function () {
                var this_btn = $(this);
                projectData.general_logic.iOSFileUpload(function (keystore_string, fileName) {
                    if (this_btn != undefined) {
                        projectData.general_logic.initCustomInputFileAnimation(this_btn, fileName);
                    }

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
                        projectData.general_logic.initCustomInputFileAnimation(label, myFile.name);

                        $('.or-label').hide();
                        $('.import-private-key-row').hide();

                        setTimeout(function () {
                            //show continue button next step button
                            $('.custom-auth-popup .popup-right .popup-body .camping-for-action').html('<div class="enter-pass-label"><label class="renew-on-lang-switch" data-slug="enter-pass-secret">'+$('.translates-holder').attr('enter-pass-secret')+'</label></div><div class="field-parent margin-bottom-15 max-width-300 margin-left-right-auto"><div class="custom-google-label-style module text-left" data-input-light-blue-border="true"><label for="import-keystore-password" class="renew-on-lang-switch" data-slug="enter-pass-label">'+$('.translates-holder').attr('enter-pass-label')+'</label><input type="password" id="import-keystore-password" class="full-rounded import-keystore-password"/></div></div><div class="text-center padding-top-10"><input type="checkbox" checked id="agree-to-cache-import" class="inline-block zoom-checkbox"/><label class="inline-block cursor-pointer" for="agree-to-cache-import"><span class="padding-left-5 padding-right-5 inline-block renew-on-lang-switch" data-slug="remember-file">'+$('.translates-holder').attr('remember-file')+'</span></label><a href="javascript:void(0)" data-toggle="tooltip" data-placement="top" class="inline-block import-more-info-keystore-remember fs-0" data-content="'+$('.translates-holder').attr('remembering-file')+'"><svg class="max-width-20 width-100" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" style="enable-background:new 0 0 20 20;" xml:space="preserve"><style type="text/css">.st0{fill:#939DA8 !important;}</style><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="20" width="20" x="2" y="8"></sliceSourceBounds></sfw></metadata><g><path class="st0" d="M10,0C4.5,0,0,4.5,0,10c0,5.5,4.5,10,10,10s10-4.5,10-10C20,4.5,15.5,0,10,0z M9,4h2v2H9V4z M12,15H8v-2h1v-3H8V8h3v5h1V15z"/></g></svg></a></div><div class="continue-btn padding-bottom-10 btn-container text-center"><a href="javascript:void(0)" class="white-light-blue-btn light-blue-border renew-on-lang-switch" data-slug="CONTINUE-btn">'+$('.translates-holder').attr('CONTINUE-btn')+'</a></div><div class="text-left padding-bottom-30"><a href="javascript:void(0)" class="fs-16 inline-block refresh-import-init-page"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="long-arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block margin-right-5 max-width-20 width-100"><path fill="currentColor" d="M152.485 396.284l19.626-19.626c4.753-4.753 4.675-12.484-.173-17.14L91.22 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H91.22l80.717-77.518c4.849-4.656 4.927-12.387.173-17.14l-19.626-19.626c-4.686-4.686-12.284-4.686-16.971 0L3.716 247.515c-4.686 4.686-4.686 12.284 0 16.971l131.799 131.799c4.686 4.685 12.284 4.685 16.97-.001z"></path></svg><span class="inline-block renew-on-lang-switch" data-slug="go-back">'+$('.translates-holder').attr('go-back')+'</span></a></div>');

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
                                    projectData.general_logic.customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), $('.translates-holder').attr('enter-pass-secret'));
                                } else {
                                    projectData.general_logic.showLoader($('.translates-holder').attr('hold-decrypt'));

                                    setTimeout(function () {
                                        importKeystoreFile(keystore_string, keystore_password, function (success, public_key, address, error, error_message) {
                                            if (success) {
                                                var internet = navigator.onLine;
                                                if (internet) {
                                                    projectData.general_logic.savePublicKey(address, public_key);
                                                }

                                                setTimeout(function () {
                                                    projectData.general_logic.fireGoogleAnalyticsEvent('Login', 'Upload', 'SK');

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
                                                projectData.general_logic.hideLoader();
                                                projectData.general_logic.customErrorHandle($('.custom-auth-popup .popup-right .popup-body .import-keystore-password').closest('.field-parent'), error_message);
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

//opening WALLET menu
$(document).on('click', 'header .open-wallet-menu', function () {
    $('nav.sidenav').addClass('active');
});

//logging out of the application
$(document).on('click', 'nav.sidenav .log-out', function () {
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

$(document).on('click', 'nav.sidenav .close-btn, nav.sidenav ul li a', function () {
    $('nav.sidenav').removeClass('active');
});

$(document).on('click', 'nav.sidenav ul li a', function () {
    window.scrollTo(0, 0);
});

//opening WALLET SETTINGS
var forgetWalletLogicInitiated = false;
$(document).on('click', '.open-settings', function () {
    basic.closeDialog();
    var settings_html = '';

    if (is_hybrid && (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel')) {
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
                            projectData.general_logic.androidFileUpload(file_uri, function (file) {
                                var reader = new FileReader();
                                projectData.general_logic.initCustomInputFileAnimation(this_btn);

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
                } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
                    //iOS
                    $('.remember-keystore-upload').click(function () {
                        this_row.find('.error-handle').remove();

                        var this_btn = $(this);
                        projectData.general_logic.iOSFileUpload(function (keystore_string) {
                            projectData.general_logic.initCustomInputFileAnimation(this_btn);

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
                                projectData.general_logic.initCustomInputFileAnimation(label);

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
                    projectData.general_logic.showLoader($('.translates-holder').attr('hold-on-caching'));
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
                        projectData.general_logic.hideLoader();
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

    //shop Help center menu element (FAQ) only on mobile
    if (basic.isMobile()) {
        settings_html += '<div class="option-row"><a href="https://dentacoin.com/how-to-create-wallet" target="_blank" class="display-block-important data-external-link"><svg class="margin-right-5 inline-block max-width-30" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 73.9 73.9" style="enable-background:new 0 0 73.9 73.9;" xml:space="preserve"><metadata><sfw xmlns="&ns_sfw;"><slices></slices><sliceSourceBounds bottomLeftOrigin="true" height="74" width="74" x="0" y="-0.1"></sliceSourceBounds></sfw></metadata><circle style="fill:none;stroke:#00B7E2;stroke-width:3;stroke-miterlimit:10;" cx="37" cy="37" r="35.5"/><path d="M46,38.6"/><path style="fill:#00B7E2;" d="M36.8,17.1c-5.8,0-11.4,3.8-11.4,11c0,1.9,1.6,3.4,3.4,3.4c1.9,0,3.4-1.6,3.4-3.4c0-3.8,4.1-3.9,4.5-3.9s4.5,0.2,4.5,3.9v0.8c0,1.6-0.8,2.8-2.2,3.6l-3,1.7c-1.7,0.9-2.7,2.7-2.7,4.5v2.8c0,1.9,1.6,3.4,3.4,3.4s3.4-1.6,3.4-3.4v-1.7l2.2-1.1c3.6-1.9,5.8-5.6,5.8-9.7v-0.9C48.2,20.9,42.4,17.1,36.8,17.1z"/><path style="fill:#00B7E2;" d="M36.8,48.9c-5.6,0-5.6,8.8,0,8.8S42.4,48.9,36.8,48.9z"/></svg><span class="inline-block color-light-blue fs-18 lato-bold renew-on-lang-switch" data-slug="help-center">'+$('.translates-holder').attr('help-center')+'</span></a><div class="fs-14 option-description renew-on-lang-switch" data-slug="having-diff">'+$('.translates-holder').attr('having-diff')+' <a href="mailto:admin@dentacoin.com" class="color-light-blue">admin@dentacoin.com</a>.</div></div>';
    }

    $('.settings-popup .popup-body').html(settings_html);
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
            if (is_hybrid && (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel')) {
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
                projectData.general_logic.showLoader($('.translates-holder').attr('hold-on-decrypt'));
                this_row.find('.error-handle').remove();

                setTimeout(function () {
                    importKeystoreFile(window.localStorage.getItem('keystore_file'), $('#download-keystore-password').val().trim(), function (success, public_key, address, error, error_message) {
                        if (success) {
                            if (is_hybrid) {
                                //MOBILE APP
                                if (basic.getMobileOperatingSystem() == 'Android') {
                                    //getting the file content by it path saved in localstorage
                                    projectData.general_logic.showLoader($('.translates-holder').attr('downloading'));

                                    setTimeout(function () {
                                        var keystore_file_name = projectData.general_logic.buildKeystoreFileName(global_state.account);
                                        //downloading the file in mobile device file system
                                        projectData.general_logic.hybridAppFileDownload(keystore_file_name, window.localStorage.getItem('keystore_file'), function () {
                                            basic.closeDialog();
                                            basic.showAlert($('.translates-holder').attr('file') +keystore_file_name + $('.translates-holder').attr('has-been-downloaded'), '', true);

                                            $('body').removeClass('overflow-hidden');
                                            $('.settings-popup').addClass('hide');

                                            $('#download-keystore-password').val('');
                                            projectData.general_logic.hideLoader();
                                        }, cordova.file.externalRootDirectory, true);
                                    }, 500);
                                } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
                                    projectData.general_logic.hideLoader();
                                    window.plugins.socialsharing.share(window.localStorage.getItem('keystore_file'));
                                    $('#download-keystore-password').val('');
                                }
                            } else {
                                projectData.general_logic.hideLoader();
                                basic.closeDialog();

                                $('body').removeClass('overflow-hidden');
                                $('.settings-popup').addClass('hide');

                                if (basic.getMobileOperatingSystem() == 'iOS' && basic.isMobile()) {
                                    // mobile ios device
                                    basic.showAlert($('.translates-holder').attr('opened-new-tab'), '', true);
                                } else {
                                    // BROWSER
                                    basic.showAlert($('.translates-holder').attr('file') +projectData.general_logic.buildKeystoreFileName(global_state.account) + $('.translates-holder').attr('has-been-downloaded'), '', true);
                                }
                                projectData.general_logic.downloadFile(projectData.general_logic.buildKeystoreFileName(global_state.account), window.localStorage.getItem('keystore_file'));
                                $('#download-keystore-password').val('');
                            }
                        } else if (error) {
                            projectData.general_logic.hideLoader();
                            $('<div class="error-handle">' + error_message + '</div>').insertAfter(this_camping_row);
                        }
                    });
                }, 2000);
            });
        });
    }

    $('.settings-popup .custom-close-settings-popup').click(function () {
        $('body').removeClass('overflow-hidden');
        $('.settings-popup').addClass('hide');
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
                    projectData.general_logic.showLoader($('.translates-holder').attr('hold-decrypt'));

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

                            projectData.general_logic.hideLoader();
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
                        projectData.general_logic.showLoader($('.translates-holder').attr('hold-decrypt'));
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

                                projectData.general_logic.hideLoader();
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
                            projectData.general_logic.androidFileUpload(file_uri, function (file) {
                                var reader = new FileReader();

                                projectData.general_logic.initCustomInputFileAnimation(this_btn);

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
                } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
                    //iOS
                    $('.show-private-key-keystore-upload').click(function () {
                        this_row.find('.error-handle').remove();
                        var this_btn = $(this);
                        projectData.general_logic.iOSFileUpload(function (keystore_string) {
                            projectData.general_logic.initCustomInputFileAnimation(this_btn);

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
                                projectData.general_logic.initCustomInputFileAnimation(label);

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
                projectData.general_logic.showLoader('Hold on...<br>Your Backup File is being generated.');

                setTimeout(function () {
                    generateKeystoreFromPrivateKey($('#generate-keystore-private-key').val().trim(), $('#generate-keystore-password').val().trim(), function (generating_response, address, keystore_file) {
                        if (generating_response) {
                            var keystore_file_name = projectData.general_logic.buildKeystoreFileName(address);
                            if (is_hybrid) {
                                //MOBILE APP
                                if (basic.getMobileOperatingSystem() == 'Android') {
                                    //downloading the file in mobile device file system
                                    projectData.general_logic.hybridAppFileDownload(keystore_file_name, keystore_file, function () {
                                        basic.closeDialog();

                                        $('body').removeClass('overflow-hidden');
                                        $('.settings-popup').addClass('hide');
                                        basic.showAlert($('.translates-holder').attr('file') +keystore_file_name + $('.translates-holder').attr('has-been-downloaded'), '', true);
                                        projectData.general_logic.hideLoader();
                                    }, cordova.file.externalRootDirectory, true);
                                } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
                                    //using export plugin, because in iOS there is no such thing as direct file download
                                    window.plugins.socialsharing.share(keystore_file);

                                    basic.closeDialog();
                                    $('body').removeClass('overflow-hidden');
                                    $('.settings-popup').addClass('hide');
                                    projectData.general_logic.hideLoader();
                                }
                            } else {
                                //BROWSER
                                projectData.general_logic.hideLoader();

                                projectData.general_logic.downloadFile(projectData.general_logic.buildKeystoreFileName(address), keystore_file);
                                basic.closeDialog();

                                $('body').removeClass('overflow-hidden');
                                $('.settings-popup').addClass('hide');
                                basic.showAlert($('.translates-holder').attr('file') +projectData.general_logic.buildKeystoreFileName(address) + $('.translates-holder').attr('has-been-downloaded'), '', true);
                            }
                        } else if (!generating_response) {
                            projectData.general_logic.hideLoader();
                            $('<div class="error-handle renew-on-lang-switch" data-slug="wrong-key-length">'+$('.translates-holder').attr('wrong-key-length')+'</div>').insertAfter(this_camping_row);
                        }
                    });
                }, 2000);
            }
        });
    });
});

//promote mobile app when user load wallet.dentacoin.com via mobile browser
function checkIfLoadingFromMobileBrowser() {
    if (!is_hybrid && basic.isMobile() && basic.cookies.get('show-download-mobile-app') != '1') {
        basic.cookies.set('show-download-mobile-app', 1);
        if (basic.getMobileOperatingSystem() == 'Android') {
            basic.showDialog('<div><h2 class="fs-24 lato-bold text-center padding-top-15 padding-bottom-25">'+$('.translates-holder').attr('wallet-app-here')+'<br>'+$('.translates-holder').attr('free-download')+'</h2><figure itemscope="" itemtype="http://schema.org/Organization" class="text-center phone-container"><img src="assets/images/download-android-app.png" class="max-width-300 width-100" itemprop="logo" alt="Phone"/><a class="inline-block max-width-150 absolute-content" href="https://play.google.com/store/apps/details?id=wallet.dentacoin.com" target="_blank" itemprop="url"><img src="assets/images/google-play-badge.svg" class="width-100" itemprop="logo" alt="Google play icon"/></a></figure></div>', 'download-mobile-app', null, null);
        } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
            basic.showDialog('<div><h2 class="fs-24 lato-bold text-center padding-top-15 padding-bottom-25">'+$('.translates-holder').attr('wallet-app-here')+'<br>'+$('.translates-holder').attr('free-download')+'</h2><figure itemscope="" itemtype="http://schema.org/Organization" class="text-center phone-container"><img src="assets/images/download-ios-app.png" class="max-width-300 width-100" itemprop="logo" alt="Phone"/><a class="inline-block max-width-150 absolute-content" href="https://apps.apple.com/us/app/dentacoin-wallet/id1478732657" target="_blank" itemprop="url"><img src="assets/images/app-store.svg" class="width-100" itemprop="logo" alt="App store icon"/></a></figure></div>', 'download-mobile-app', null, null);
        }
    }
}

//custom router camping for html changes, because old Android versions do not recognize Angular router
var current_route;
function router() {
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
    } else if ($('.main-holder app-swap-page').length) {
        current_route = 'swap';
        getSwapPageData();
        $('.nav-row .nav-link.swap').addClass('active');
        $('.camp-for-fixed-mobile-nav a.swap').addClass('active');
    } else if ($('.main-holder app-spend-page-pay-for-dental-services').length) {
        current_route = 'pay-for-dental-services';
        getSpendPageDentalServices();
        $('.nav-row .nav-link.spend').addClass('active');
        $('.camp-for-fixed-mobile-nav a.spend').addClass('active');
    } else if ($('.main-holder app-spend-page-exchanges').length) {
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

    $('body').on('DOMSubtreeModified', '.main-holder', async function () {
        if ((closeOnLoadLoader && current_route != 'home' && current_route != 'swap') || window.localStorage.getItem('current_account') == null) {
            closeOnLoadLoader = false;
            setTimeout(function() {
                projectData.general_logic.hideLoader();
            }, 1000)
        }

        if ($('.main-holder app-homepage').length && current_route != 'home') {
            current_route = 'home';
            getHomepageData();
            $('.nav-row .nav-link.home').addClass('active');
            $('.camp-for-fixed-mobile-nav a.home').addClass('active');

            if ($('header .camping-buy-page-notice').hasClass('shown')) {
                $('header .camping-buy-page-notice').html('').fadeOut(500);
            }
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

            if ($('header .camping-buy-page-notice').hasClass('shown')) {
                $('header .camping-buy-page-notice').html('').fadeOut(500);
            }
        } else if ($('.main-holder app-swap-page').length && current_route != 'swap') {
            current_route = 'swap';
            getSwapPageData();
            $('.nav-row .nav-link.swap').addClass('active');
            $('.camp-for-fixed-mobile-nav a.swap').addClass('active');

            if ($('header .camping-buy-page-notice').hasClass('shown')) {
                $('header .camping-buy-page-notice').html('').fadeOut(500);
            }
        } else if ($('.main-holder app-spend-page-pay-for-dental-services').length && current_route != 'pay-for-dental-services') {
            current_route = 'pay-for-dental-services';
            getSpendPageDentalServices();
            $('.nav-row .nav-link.spend').addClass('active');
            $('.camp-for-fixed-mobile-nav a.spend').addClass('active');

            if ($('header .camping-buy-page-notice').hasClass('shown')) {
                $('header .camping-buy-page-notice').html('').fadeOut(500);
            }
        } else if ($('.main-holder app-spend-page-exchanges').length && current_route != 'page-exchanges') {
            current_route = 'page-exchanges';
            getSpendPageExchanges();
            $('.nav-row .nav-link.spend').addClass('active');
            $('.camp-for-fixed-mobile-nav a.spend').addClass('active');

            if ($('header .camping-buy-page-notice').hasClass('shown')) {
                $('header .camping-buy-page-notice').html('').fadeOut(500);
            }
        } else if ($('.main-holder app-spend-page-pay-assurance-fees').length && current_route != 'pay-assurance-fees') {
            current_route = 'pay-assurance-fees';
            getSpendPageAssuranceFees();
            $('.nav-row .nav-link.spend').addClass('active');
            $('.camp-for-fixed-mobile-nav a.spend').addClass('active');

            if ($('header .camping-buy-page-notice').hasClass('shown')) {
                $('header .camping-buy-page-notice').html('').fadeOut(500);
            }
        }

        if (current_route != 'home' && !$('.camp-for-custom-popover').hasClass('hide')) {
            $('.camp-for-custom-popover').addClass('hide');
            clearInterval(custom_popover_interval);
        }

        // saving mobile_device_id to send push notifications
        if (window.localStorage.getItem('current_account') != null && window.localStorage.getItem('saved_mobile_id') == null && is_hybrid) {
            if (basic.getMobileOperatingSystem() == 'Android') {
                window.localStorage.setItem('saved_mobile_id', true);
                window.FirebasePlugin.hasPermission(function(hasPermission) {
                    if (basic.property_exists(hasPermission, 'isEnabled') && hasPermission.isEnabled) {
                        // if permission is given save the firebase mobile device id
                        projectData.general_logic.addMobileDeviceId(function(response) {
                            if (response.success) {
                                console.log('Mobile device id saved.');
                            } else {
                                window.localStorage.removeItem('saved_mobile_id');
                            }
                        }, window.localStorage.getItem('mobile_device_id'))
                    } else {
                        window.localStorage.removeItem('saved_mobile_id');
                    }
                });
            } else if (basic.getMobileOperatingSystem() == 'iOS' || navigator.platform == 'MacIntel') {
                window.localStorage.setItem('saved_mobile_id', true);
                if (await FCM.hasPermission()) {
                    // if permission is given save the firebase mobile device id
                    projectData.general_logic.addMobileDeviceId(function(response) {
                        if (response.success) {
                            console.log('Mobile device id saved.');
                        } else {
                            window.localStorage.removeItem('saved_mobile_id');
                        }
                    }, window.localStorage.getItem('mobile_device_id'))
                } else {
                    window.localStorage.removeItem('saved_mobile_id');
                }
            }
        }
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

var assuranceTransactions = {
    approval: async function (gasPrice, key, callback) {
        var dentacoin_token_instance = await new dApp.web3_l1_assurance.eth.Contract(assurance_config.dentacoin_token_abi, assurance_config.dentacoin_token_address);
        var approval_function_abi = await dentacoin_token_instance.methods.approve(assurance_config.assurance_state_address, assurance_config.dentacoins_to_approve).encodeABI();
        var gas_cost_for_approval = await dentacoin_token_instance.methods.approve(assurance_config.assurance_state_address, assurance_config.dentacoins_to_approve).estimateGas({gas: 500000});

        dApp.web3_l1_assurance.eth.getTransactionCount(global_state.account, 'pending', function (err, nonce) {
            var approval_transaction_obj = {
                gasLimit: dApp.web3_l1_assurance.utils.toHex(Math.round(gas_cost_for_approval + (gas_cost_for_approval * 10 / 100))),
                gasPrice: gasPrice,
                from: global_state.account,
                nonce: dApp.web3_l1_assurance.utils.toHex(nonce),
                chainId: assurance_config.chain_id,
                data: approval_function_abi,
                to: assurance_config.dentacoin_token_address
            };

            const EthereumTx = require('ethereumjs-tx');
            const approval_transaction = new EthereumTx(approval_transaction_obj);
            //signing the transaction
            approval_transaction.sign(key);

            callback('0x' + approval_transaction.serialize().toString('hex'));
        });
    },
    creation: async function (dentist, usd, dcn, next_transfer, ipfs_hash, gasPrice, key, callback, increaseNonce) {
        if (increaseNonce == undefined) {
            increaseNonce = null;
        }

        var assurance_proxy_instance = await new dApp.web3_l1_assurance.eth.Contract(assurance_config.assurance_proxy_abi, assurance_config.assurance_proxy_address);
        var assurance_state_instance = await new dApp.web3_l1_assurance.eth.Contract(assurance_config.assurance_state_abi, assurance_config.assurance_state_address);

        var period_to_withdraw = parseInt(await assurance_state_instance.methods.getPeriodToWithdraw().call());
        var contract_creation_function_abi = await assurance_proxy_instance.methods.registerContract(projectData.utils.checksumAddress(global_state.account), projectData.utils.checksumAddress(dentist), Math.floor(usd), dcn, parseInt(next_transfer) + period_to_withdraw, ipfs_hash).encodeABI();
        var gas_cost_for_contract_creation = await assurance_proxy_instance.methods.registerContract(assurance_config.dummy_address, projectData.utils.checksumAddress(dentist), Math.floor(usd), dcn, parseInt(next_transfer) + period_to_withdraw, ipfs_hash).estimateGas({
            from: assurance_config.dummy_address,
            gas: 1000000
        });

        dApp.web3_l1_assurance.eth.getTransactionCount(global_state.account, 'pending', function (err, nonce) {
            // increase nonce + 1, because approval transaction is not sent yet.
            if (increaseNonce != null) {
                nonce += 1;
            }

            var contract_creation_transaction_obj = {
                gasLimit: dApp.web3_l1_assurance.utils.toHex(Math.round(gas_cost_for_contract_creation + (gas_cost_for_contract_creation * 10 / 100))),
                gasPrice: gasPrice,
                from: global_state.account,
                nonce: dApp.web3_l1_assurance.utils.toHex(nonce),
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
        var assurance_proxy_instance = await new dApp.web3_l1_assurance.eth.Contract(assurance_config.assurance_proxy_abi, assurance_config.assurance_proxy_address);

        var gas_cost_for_contract_approval = await assurance_proxy_instance.methods.dentistApproveContract(patient).estimateGas({
            from: global_state.account,
            gas: 500000
        });

        var contract_approval_function_abi = await assurance_proxy_instance.methods.dentistApproveContract(patient).encodeABI();

        const EthereumTx = require('ethereumjs-tx');
        var nonce = await dApp.web3_l1_assurance.eth.getTransactionCount(global_state.account, 'pending');

        var contract_approval_transaction_obj = {
            gasLimit: dApp.web3_l1_assurance.utils.toHex(Math.round(gas_cost_for_contract_approval + (gas_cost_for_contract_approval * 10 / 100))),
            gasPrice: gasPrice,
            from: global_state.account,
            nonce: dApp.web3_l1_assurance.utils.toHex(nonce),
            chainId: assurance_config.chain_id,
            data: contract_approval_function_abi,
            to: assurance_config.assurance_proxy_address
        };

        const contract_approval_transaction = new EthereumTx(contract_approval_transaction_obj);
        //signing the transaction
        contract_approval_transaction.sign(key);

        callback('0x' + contract_approval_transaction.serialize().toString('hex'));
    },
    withdraw: async function (patient, gasPrice, key, callback) {
        var assurance_proxy_instance = await new dApp.web3_l1_assurance.eth.Contract(assurance_config.assurance_proxy_abi, assurance_config.assurance_proxy_address);
        var gas_cost_for_withdraw = await assurance_proxy_instance.methods.singleWithdraw(patient).estimateGas({
            from: global_state.account,
            gas: 500000
        });

        var withdraw_function_abi = await assurance_proxy_instance.methods.singleWithdraw(patient).encodeABI();

        const EthereumTx = require('ethereumjs-tx');
        var nonce = await dApp.web3_l1_assurance.eth.getTransactionCount(global_state.account, 'pending');

        var withdraw_transaction_obj = {
            gasLimit: dApp.web3_l1_assurance.utils.toHex(Math.round(gas_cost_for_withdraw + (gas_cost_for_withdraw * 5 / 100))),
            gasPrice: gasPrice,
            from: global_state.account,
            nonce: dApp.web3_l1_assurance.utils.toHex(nonce),
            chainId: assurance_config.chain_id,
            data: withdraw_function_abi,
            to: assurance_config.assurance_proxy_address
        };

        const withdraw_transaction = new EthereumTx(withdraw_transaction_obj);
        //signing the transaction
        withdraw_transaction.sign(key);

        callback('0x' + withdraw_transaction.serialize().toString('hex'));
    },
    cancel: async function (patient, dentist, gasPrice, key, callback) {
        var assurance_proxy_instance = await new dApp.web3_l1_assurance.eth.Contract(assurance_config.assurance_proxy_abi, assurance_config.assurance_proxy_address);

        var gas_cost_for_contract_cancellation = await assurance_proxy_instance.methods.breakContract(patient, dentist).estimateGas({
            from: global_state.account,
            gas: 500000
        });

        var contract_cancellation_function_abi = await assurance_proxy_instance.methods.breakContract(patient, dentist).encodeABI();

        const EthereumTx = require('ethereumjs-tx');
        var nonce = await dApp.web3_l1_assurance.eth.getTransactionCount(global_state.account, 'pending');

        var contract_cancellation_transaction_obj = {
            gasLimit: dApp.web3_l1_assurance.utils.toHex(Math.round(gas_cost_for_contract_cancellation + (gas_cost_for_contract_cancellation * 10 / 100))),
            gasPrice: gasPrice,
            from: global_state.account,
            nonce: dApp.web3_l1_assurance.utils.toHex(nonce),
            chainId: assurance_config.chain_id,
            data: contract_cancellation_function_abi,
            to: assurance_config.assurance_proxy_address
        };

        const contract_cancellation_transaction = new EthereumTx(contract_cancellation_transaction_obj);
        //signing the transaction
        contract_cancellation_transaction.sign(key);

        callback('0x' + contract_cancellation_transaction.serialize().toString('hex'));
    }
};