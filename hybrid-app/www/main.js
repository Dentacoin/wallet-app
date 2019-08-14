(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header>\n    <div class=\"container\">\n        <div class=\"row fs-0 logo-and-settings-row\">\n            <div class=\"col-xs-6 inline-block\">\n                <figure itemscope=\"\" itemtype=\"http://schema.org/Organization\" class=\"logo\">\n                    <a routerLink=\"/\" itemprop=\"url\">\n                        <img src=\"assets/images/logo.svg\" itemprop=\"logo\" alt=\"Dentacoin logo\"/>\n                    </a>\n                </figure>\n            </div>\n        </div>\n    </div>\n    <div class=\"nav-row\">\n        <nav class=\"container\">\n            <ul itemtype=\"http://schema.org/SiteNavigationElement\" class=\"row fs-0\">\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button\" routerLink=\"/\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\"><span itemprop=\"name\">WALLET</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button\" routerLink=\"buy\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\"><span itemprop=\"name\">BUY</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button\" routerLink=\"send\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\"><span itemprop=\"name\">SEND</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button spend\" routerLink=\"spend-pay-for-dental-services\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\"><span itemprop=\"name\">SPEND</span></a>\n                </li>\n            </ul>\n        </nav>\n    </div>\n    <div class=\"camping-currently-offline\"></div>\n</header>\n<main id=\"main-container\" [attr.hybrid]=\"hybrid ? 'true' : null\">\n    <div class=\"container padding-top-100 padding-top-xs-10 padding-bottom-70\">\n        <div class=\"row\">\n            <div class=\"col-xs-12 no-gutter\">\n                <router-outlet></router-outlet>\n            </div>\n        </div>\n    </div>\n    <div class=\"camping-transaction-history\"></div>\n</main>\n<footer>\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-xs-8 col-xs-offset-2 white-border\"></div>\n        </div>\n        <div class=\"row padding-bottom-xs-50\">\n            <ul class=\"col-12 no-gutter-xs\" itemtype=\"http://schema.org/SiteNavigationElement\">\n                <li class=\"inline-block-top\">\n                    <a routerLink=\"faq\" itemprop=\"url\">\n                        <figure><img src=\"assets/images/faq.svg\"/></figure>\n                        <span itemprop=\"name\">FAQ</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentacoin.com/privacy-policy\" target=\"_blank\" itemprop=\"url\">\n                        <figure><img src=\"assets/images/privacy-policy.svg\"/></figure>\n                        <span itemprop=\"name\">Privacy policy</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentavox.dentacoin.com/\" target=\"_blank\" itemprop=\"url\">\n                        <figure><img src=\"assets/images/dentavox.svg\"/></figure>\n                        <span itemprop=\"name\">DentaVox</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://reviews.dentacoin.com/\" target=\"_blank\" itemprop=\"url\">\n                        <figure><img src=\"assets/images/trusted-reviews.svg\"/></figure>\n                        <span itemprop=\"name\">Trusted Reviews</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentacare.dentacoin.com/\" target=\"_blank\" itemprop=\"url\">\n                        <figure><img src=\"assets/images/dentacare.svg\"/></figure>\n                        <span itemprop=\"name\">Dentacare</span>\n                    </a>\n                </li>\n            </ul>\n        </div>\n        <div class=\"row copyright\">\n            <div class=\"col-12 text-center\">\n                © 2019 Dentacoin Foundation. All rights reserved.\n                <div><a href=\"https://dentacoin.com/assets/uploads/dentacoin-foundation.pdf\" target=\"_blank\">Verify Dentacoin Foundation</a></div>\n            </div>\n        </div>\n    </div>\n</footer>\n<div class=\"camp-for-fixed-mobile-nav\">\n    <nav>\n        <ul itemtype=\"http://schema.org/SiteNavigationElement\" class=\"fs-0\">\n            <li class=\"inline-block-bottom\">\n                <a routerLink=\"/\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/Organization\">\n                        <img alt=\"Wallet icon\" itemprop=\"contentUrl\" src=\"assets/images/wallet-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">WALLET</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a routerLink=\"buy\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/Organization\">\n                        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/buy-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">BUY</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a routerLink=\"send\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/Organization\">\n                        <img alt=\"Send icon\" itemprop=\"contentUrl\" src=\"assets/images/send-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">SEND</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a routerLink=\"spend-pay-for-dental-services\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/Organization\">\n                        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">SPEND</span>\n                </a>\n            </li>\n        </ul>\n    </nav>\n</div>\n<div class=\"auth-popup-faq-link\"><a routerLink=\"faq\">?</a></div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/buy-page/buy-page.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/buy-page/buy-page.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/buy-icon.svg\"/>\n    </figure>\n    <div class=\"padding-top-50 padding-top-xs-40 padding-bottom-50\">\n        <section class=\"container-fluid ready-to-purchase-with-external-api padding-top-40 padding-bottom-10 padding-top-xs-0 padding-bottom-xs-0 no-gutter-xs\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-5 padding-bottom-xs-20\">\n                    <div class=\"custom-google-label-style module fs-0 flex\">\n                        <div class=\"inline-block left-side\">\n                            <label class=\"active-label\" for=\"usd-value\">Pay with:</label>\n                            <input type=\"number\" id=\"usd-value\" value=\"30\"/>\n                        </div>\n                        <span class=\"inline-block input-label padding-top-10\">USD</span>\n                    </div>\n                    <div class=\"fs-16 padding-left-15 padding-left-xs-0 calibri-light text-below-input\">Transaction limit: 30 - 6000 USD</div>\n                </div>\n                <div class=\"col-sm-2 text-center hide-this-xs\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Exchange icon\" itemprop=\"contentUrl\" src=\"assets/images/exchange-icon-light-blue.png\"/>\n                    </figure>\n                </div>\n                <div class=\"col-xs-12 col-sm-5 padding-bottom-xs-20\">\n                    <div class=\"custom-google-label-style module fs-0 flex\">\n                        <div class=\"inline-block left-side\">\n                            <label for=\"crypto-amount\" class=\"active-label\">You get:</label>\n                            <input type=\"number\" id=\"crypto-amount\"/>\n                        </div>\n                        <select class=\"inline-block crypto-label input-label\" id=\"active-crypto\">\n                            <option value=\"dcn\">DCN</option>\n                            <option value=\"eth\">ETH</option>\n                        </select>\n                    </div>\n                    <div class=\"fs-16 padding-left-15 padding-left-xs-0 calibri-light text-below-input\">The exchange rate may change in the process.</div>\n                </div>\n            </div>\n            <div class=\"row padding-top-50 padding-top-xs-0 padding-bottom-20\">\n                <div class=\"col-xs-12 col-sm-6 col-sm-offset-3\">\n                    <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\">\n                        <label for=\"dcn_address\">Address to receive DCN:</label>\n                        <input type=\"url\" id=\"dcn_address\" maxlength=\"42\" class=\"full-rounded\"/>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-6 col-sm-offset-3\">\n                    <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\">\n                        <label for=\"email\">Email:</label>\n                        <input type=\"email\" id=\"email\" maxlength=\"100\" class=\"full-rounded\"/>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 text-center\">\n                <div class=\"col-xs-12 col-sm-6 col-sm-offset-3\">\n                    <input type=\"checkbox\" id=\"privacy-policy-agree\" class=\"zoom-checkbox\"/>\n                    <label class=\"fs-16 calibri-light text-below-input padding-left-5 cursor-pointer privacy-policy-agree-label\" for=\"privacy-policy-agree\">I have read and accept the <a href=\"//dentacoin.com/privacy-policy\" target=\"_blank\" class=\"color-light-blue lato-bold\">Privacy Policy</a></label>\n                </div>\n            </div>\n        </section>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn light-blue-border buy-crypto-btn\">BUY</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/faq/faq.component.html":
/*!******************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/faq/faq.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"faq-container\">\r\n    <div class=\"container\">\r\n        <div class=\"row\">\r\n            <div class=\"col-12\">\r\n                <h1 class=\"fs-50 fs-xs-26\">Frequently Asked Questions</h1>\r\n            </div>\r\n        </div>\r\n        <div class=\"row list\">\r\n            <div class=\"col-12\">\r\n                <section class=\"section-row\">\r\n                    <div class=\"fs-30 fs-xs-22 section-title padding-top-30 padding-bottom-10\">General Information</div>\r\n                    <ul>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">01</span>What can Dentacoin Wallet do?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">\r\n                                <ul>\r\n                                    <li>Create a Dentacoin wallet easy and fast</li>\r\n                                    <li>Access your Dentacoin wallet with the generated Secret Key File</li>\r\n                                    <li>Send and receive Dentacoin tokens</li>\r\n                                    <li>Receive but not send Ether (ETH), to cover your transaction costs</li>\r\n                                    <li>Display the value of your stored Dentacoin in USD</li>\r\n                                    <li>Show details of all of your ingoing/outgoing transactions</li>\r\n                                    <li>Purchase Dentacoin with a card from our partners Indacoin, directly from the wallet</li>\r\n                                    <li>Use your device's camera to scan addresses via QR codes</li>\r\n                                    <li>Read address QR codes in the form of a screenshot, or a photo</li>\r\n                                    <li>Access your wallet with MetaMask, Trust Wallet </li>\r\n                                </ul>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">02</span>Which platforms support Dentacoin Wallet?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">Dentacoin Wallet is currently available on web and mobile, as well as via the following third parties: MetaMask, Trust Wallet and other wallet apps, with a built-in dApp browser.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">03</span>What information can I see in the transaction details?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">\r\n                                <ul>\r\n                                    <li>The amount sent or received both in crypto and USD</li>\r\n                                    <li>The date and time of the transaction</li>\r\n                                    <li>The send and receive address</li>\r\n                                    <li>The transaction hash (unique transaction identificator)</li>\r\n                                    <li>The link to your transaction on Etherscan.io</li>\r\n                                    <li>Confirmation status (via Etherscan link)</li>\r\n                                    <li>Any fees associated with the transaction (via Etherscan link)</li>\r\n                                </ul>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">04</span>What cryptocurrencies are supported in Dentacoin Wallet?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">\r\n                                Currently, we support the following list:\r\n                                <ul>\r\n                                    <li>Dentacoin (send & receive)</li>\r\n                                    <li>Ether (receive only)</li>\r\n                                </ul>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">05</span>Are you open-source?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">\r\n                                Yes, Dentacoin Wallet is open source. The code can be found in its dedicated GitHub repository at <a href=\"https://github.com/Dentacoin/wallet\" target=\"_blank\">https://github.com/Dentacoin/wallet</a>.\r\n                            </div>\r\n                        </li>\r\n                    </ul>\r\n                </section>\r\n                <section class=\"section-row\">\r\n                    <div class=\"fs-30 fs-xs-22 section-title padding-top-30 padding-bottom-10\">Getting Started</div>\r\n                    <ul>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">01</span>How do I create a Dentacoin Wallet?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">You can create a Dentacoin Wallet by simply generating a Secret Key File. To create a wallet type in your desired password in the create section, then click the “Create” button. You will be prompted to download a Keystore/Secret Key File. A Secret Key File contains all your login information, but its contents are encrypted with your password. Without either one you will not be able to access your wallet. Make sure you store the file in a safe and secure place - that’s the only way to access your wallet and only you are responsible for it. We do not store any user access details.\r\n                                <div class=\"container-fluid padding-top-15\">\r\n                                    <div class=\"row fs-0\">\r\n                                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"col-12 col-sm-6 inline-block-top\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/1-faq.png\" /></figure>\r\n                                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"col-12 col-sm-6 inline-block-top\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/2-faq.png\" /></figure>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">02</span>How do I log in a Dentacoin Wallet via the Secret Key File?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">Simply navigate to <a href=\"https://wallet.dentacoin.com/\" target=\"_blank\">https://wallet.dentacoin.com/</a> , click on the “Import” section and upload your Secret Key File. It should have a similar file name to “Dentacoin secret key - 0b77abd12b48d51a8a5d740d94b455b377886b72.” Once uploaded, input your password to successfully log in.\r\n                                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-15 text-center\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/3-faq.png\" /></figure>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">03</span>How do I receive coins in Dentacoin Wallet?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">In order to receive coins from any other address you should provide your Dentacoin address to the sender. To do so, you need to either copy and paste your address to the sender, or have them scan the QR code available in the “Wallet” section.\r\n                                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-15 text-center\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/4-faq.png\" /></figure>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">04</span>How do I send coins in Dentacoin Wallet?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">To send Dentacoin, navigate to the “Send” section. When you are there, you can either directly open the QR code scanner or paste the address where you would like to send your coins. Make sure to pay extra attention to the correctness of the receiving address, and never type it manually due to the high risk of making a mistake! Always double-check the address you are going to send Dentacoin to because you will not be able to cancel the transaction or request a refund.<br>\r\n                                Then you click “Next”. You will arrive at the screen where you can specify the amount you would like to send. You can type the amount of necessary Dentacoin in the “DCN” field you require or in USD (it will calculate the amount in chosen coin/token based on the current exchange rate).<br>\r\n                                The transaction fee is calculated automatically and is deducted from your Ethereum balance.\r\n                                Please double check if the “Send to” address is correct and if it is not, you can edit it by pressing the pencil button next to it. When you are ready clicking send will commit the transaction. There is no turning back at this point.\r\n                                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-15 text-center\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/5-faq.png\" /></figure>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">05</span>How do I purchase Dentacoin?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">To purchase Dentacoin directly from your wallet, please navigate to the “Buy” section. Inputting the amount of USD you are willing to commit on the left side will automatically calculate the amount of Dentacoin you will receive (including fees) under the “You get” field. The opposite works vice-versa - if you input the amount of Dentacoin you would like to receive the required amount of USD to make the purchase will automatically be calculated and shown in the “Pay with” field. Once you are satisfied with the amount you would like to commit/receive it is time to input the receiving address. If you would like to purchase Dentacoin for your own wallet, then the address field is automatically filled when you navigate to the “Buy” section, but you are free to edit the field if you’d like to receive it on another address. After that please input a valid email address, so you can begin the verification procedures needed to process your transaction. The final step before you can move forward is to read the Privacy Policy and tick the box, if you consent. Please double check that the information is correct and if you are certain it is, you can click the “Buy” button to begin the verification process.\r\n                                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-15 text-center\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/6-faq.png\" /></figure>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">06</span>How do I get verified to purchase Dentacoin with card?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">Once you have clicked the “Buy” button you will be taken to another page, where you can input a valid phone number. The phone number is needed to receive a 4 digit verification code. Keep in mind that the phone number should be associated with your card information. After you’ve input your phone number you will be taken to the next step, where you will be asked to provide a scan, or photo of your ID, Passport, or Driver’s License to complete the verification process. Additionally, you might be required to undergo video verification, where you record a video, by showing your face. These are all necessary steps for Indacoin to verify that you are the card holder and not someone using a stolen card. If you cannot record a video verification, you can open the same order page link from your mobile device and record it from there. If that is not possible, you can send the video over email to <a href=\"mailto:support@indacoin.com\">support@indacoin.com</a> , but make sure you include your order number as well. Fortunately, once your card is verified, you will not need to do so, during your next purchase.</div>\r\n                        </li>\r\n                    </ul>\r\n                </section>\r\n                <section class=\"section-row\">\r\n                    <div class=\"fs-30 fs-xs-22 section-title padding-top-30 padding-bottom-10\">Access & Security</div>\r\n                    <ul>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">01</span>What is a Dentacoin address? How can I get it?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">A Dentacoin address is a unique string of letters and numbers that indicate where your wallet is on the blockchain. Your Dentacoin address is automatically generated when you sign up to a new wallet. We recommend you keep it secure. It is the equivalent of your IBAN and must be provided in order to receive, or withdraw to your wallet.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">02</span>Can I have two or more wallets?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">You can have two or even more wallets registered on the platform. All you have to do to switch is to click the “Forget this account” link at the bottom of the page and use your preferred login method to access another wallet. To switch back, follow the same procedure.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">03</span>If I have another wallet can I import it to the Dentacoin Wallet?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">No, but you can still access the Dentacoin Wallet, from another wallet with a built-in dApp browser, like Trust wallet. A dApp browser allows direct interfacing with a blockchain network, without the necessity of running a full node and having a copy of the network. It is the equivalent of your web browser (Chrome, Firefox, Opera, Internet Explorer, Edge, etc.), but for blockchain applications.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">04</span>What password should I enter?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">You should use the password you created when you signed up with the Secret Key File.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">05</span>What should I do if i forget my password?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">If you created your wallet via the Secret Key File and forgot your password, there is no way to restore your wallet.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">06</span>What should I do if i lost my Secret Key File?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">If you created your wallet via the Secret Key File and misplaced your Secret Key File, there is no way to restore your wallet.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">07</span>Why can I not log in?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">\r\n                                There are two reasons for this problem:\r\n                                <ul>\r\n                                    <li>You tried to log in with the Secret Key File, but you forgot the password used to unlock it. If that’s the case it is not possible to recover your account.</li>\r\n                                    <li>You lost the Secret Key File, but even if you remember the password used to unlock it, it is not possible to recover your account.</li>\r\n                                </ul>\r\n                            </div>\r\n                        </li>\r\n                    </ul>\r\n                </section>\r\n                <section class=\"section-row\">\r\n                    <div class=\"fs-30 fs-xs-22 section-title padding-top-30 padding-bottom-10\">Transactions & Fees</div>\r\n                    <ul>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">01</span>What does a fee mean? Who do I pay to?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">Every time you send a transaction in Dentacoin you need to pay the network fee. This fee goes to miners who confirm your transaction. The fees are calculated automatically for Dentacoin Wallet transactions. Since Dentacoin is built on the Ethereum network, the transaction fees are paid with minute amounts of Ether called Ether gas. That is why in order to process a transaction you need to charge your Dentacoin wallet with Ether, beforehand.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">02</span>Can I cancel my transaction?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">If your transaction was sent to the blockchain and you see it on EtherScan, it means that it is waiting for a confirmation and cannot be cancelled. That is why we ask you to double check all information prior to committing a transaction.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">03</span>How long can a transaction be pending?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">It depends on the network load and different transactions require different amounts of time. Unless the network is overloaded most transactions are processed in a few minutes up to a few hours (medium load).</div>\r\n                        </li>\r\n                    </ul>\r\n                </section>\r\n                <section class=\"section-row\">\r\n                    <div class=\"fs-30 fs-xs-22 section-title padding-top-30 padding-bottom-10\">Alternative Access: MetaMask</div>\r\n                    <ul>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">01</span>How do I create a Dentacoin Wallet using MetaMask?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">First download the extension from the <a href=\"//metamask.io/\" target=\"_blank\">official site</a>. After successfully installing the extension, make sure it is turned on, then navigate to <a href=\"//wallet.dentacoin.com/\" target=\"_blank\">https://wallet.dentacoin.com/</a> . Click the little fox icon at the top right of your browser to open up the MetaMask extension and after agreeing to the Terms and Conditions, you will be prompted to create a new account. Make sure you have selected “Main Network” on the top left, type your desired password and click create to create your wallet.<br>\r\n                                To finalize the process, please write down, or save your seed phrase, as this is the only way to backup and restore your wallet, should you forget your password. If you forget your password and you lose your seed phrase you will lose all access to your account and it cannot be restored anymore. Make sure you keep it in a safe and secure place!\r\n                                <div class=\"container-fluid fs-0\">\r\n                                    <div class=\"row\">\r\n                                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-15 text-center col-12 col-sm-6 inline-block-top\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/7-faq.png\" /></figure>\r\n                                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-15 text-center col-12 col-sm-6 inline-block-top\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/8-faq.png\" /></figure>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">02</span>How do I log in a Dentacoin Wallet via MetaMask?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">Simply navigate to <a href=\"//wallet.dentacoin.com/\" target=\"_blank\">https://wallet.dentacoin.com/</a> , click on the MetaMask icon in the top left (little fox), input your password and refresh the wallet page. You have now successfully logged in.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">03</span>What password should I enter?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">You should use the password you created when you signed up for MetaMask.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">04</span>What should I do if i forget my password?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">In the case you’ve forgotten your MetaMask password, you can login with your seed phrase. Click the link “Import using account seed phrase,” and fill the gaps in the right order.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">05</span>What is a Seed Phrase?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">A seed phrase, or a mnemonic is a set of 12 words that serve as your backup password for MetaMask. Write a copy of each of these words carefully. You will then be required to retype all 12 words in the same order they appeared in to check the status and completeness of your backup. Store your copy of these 12 words (mnemonic) in a very safe and secure place, and never give it to anyone you don’t want to have access to your funds.<br>\r\n                                Never switch your wallet without having a Backup. The only way to get access to your funds is through your 12-word Backup Phrase. If you misplace your seed phrase, but still have access to your account, you can find them in the Metamask extension settings.\r\n                                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-15 text-center\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/9-faq.png\" /></figure>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">06</span>Why do I have to write down my Seed Phrase before switching wallets?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">We ask that you write down your 12-word seed phrase in the exact sequence it appeared before you exit your wallet as your funds and private key are tied to this unique Backup Phrase. Your 12-word seed Phrase allows you to restore your wallet and regain access to your funds at any time on any device that supports MetaMask. After switching wallets, you will not have any other way to access your funds except the 12-word backup phrase.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">07</span>I lost access to my wallet, and did not write down my Seed Phrase. Can I get my wallet back?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">No, you have completely lost access to your wallet. This is why we urge you to write it down.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">08</span>I forgot my password, what can I do?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">If you know your seed phrase, you can restore your account by clicking “Import using account seed phrase.” You will then be prompted to set a new password.\r\n                                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-15 text-center\"><img alt=\"\" itemprop=\"contentUrl\" src=\"assets/images/10-faq.png\" /></figure>\r\n                            </div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">09</span>Why can I not recover my account with my seed phrase?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">Please, check whether you wrote down all the words in the correct order.</div>\r\n                        </li>\r\n                        <li>\r\n                            <a href=\"javascript:void(0);\" class=\"fs-20 question\"><span class=\"lato-black fs-20\">10</span>Why can I not log in?</a>\r\n                            <div class=\"fs-18 fs-xs-16 calibri-light padding-bottom-30 padding-top-10 padding-left-20 padding-right-20 question-content\">You forgot your password and tried to enter the wrong one. Recover your account with your seed phrase and then change the password.</div>\r\n                        </li>\r\n                    </ul>\r\n                </section>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/homepage/homepage.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/homepage/homepage.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Wallet icon\" itemprop=\"contentUrl\" src=\"assets/images/wallet-icon.svg\"/>\n    </figure>\n    <div class=\"padding-top-50 padding-top-xs-20 padding-bottom-50\">\n        <div class=\"container-fluid padding-top-30 padding-bottom-50 padding-top-xs-0 padding-bottom-xs-0 no-gutter-xs text-center-xs\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-8 col-lg-7 col-lg-offset-1 inline-block-top\">\n                    <div class=\"fs-40 fs-xs-30 lato-bold fade-in-element\">\n                        <a href=\"javascript:void(0)\" class=\"refresh-account-data inline-block max-width-30 margin-right-10\"><svg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"sync-alt\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" class=\"inline-block width-100 svg-inline--fa fa-sync-alt fa-w-16 fa-3x\"><path style=\"fill: #333;\" fill=\"currentColor\" d=\"M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z\" class=\"\"></path></svg></a>\n                        <span class=\"inline-block dcn-amount\">0</span><span class=\"inline-block padding-left-10\">DCN</span></div>\n                    <div class=\"fs-30 fs-xs-20 padding-bottom-30 padding-bottom-xs-10 lato-bold fade-in-element\"><span class=\"inline-block padding-right-10\">=</span><span class=\"inline-block usd-amount\">0</span><span class=\"inline-block padding-left-10\">USD</span></div>\n                    <div class=\"fs-20 fs-xs-15 fade-in-element\"><span class=\"eth-amount inline-block\">0</span><span class=\"inline-block padding-left-10 padding-left-xs-5\">ETH for transaction fees</span><figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"inline-block margin-left-10 more-info\" data-toggle=\"popover\" data-placement=\"bottom\" data-content=\"Ether (ETH) is a currency that is used for covering your transaction costs. Don't have ETH? <a href='//wallet.dentacoin.com/buy'>Buy some with a card here</a>.\"><img alt=\"More info icon\" itemprop=\"contentUrl\" src=\"assets/images/more-info.svg\" class=\"width-100 max-width-20 cursor-pointer\"/></figure></div>\n                </div>\n                <div class=\"col-sm-4 col-lg-3 inline-block-top text-right hide-this-xs\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" id=\"qrcode\">\n                        <img src=\"assets/images/blurred-qr-code.jpg\" alt=\"Blurred qr code image\" class=\"width-100 max-width-180\" itemprop=\"contentUrl\"/>\n                    </figure>\n                </div>\n            </div>\n        </div>\n        <a href=\"javascript:void(0)\" class=\"eth-address-container copy-address fade-in-element color-white text-center\" data-toggle=\"tooltip\" title=\"Copied.\" data-clipboard-target=\"#copy-address\">\n            <h2 class=\"fs-20\">Your Dentacoin Address:</h2>\n            <div class=\"fs-0 fix-vertical-alignment-on-mobile\">\n                <figure class=\"inline-block copy-icon\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                    <img src=\"assets/images/copy-icon.svg\" class=\"max-width-30 width-100 margin-right-5\" alt=\"Copy address to clipboard icon\" itemprop=\"contentUrl\"/>\n                </figure>\n                <input type=\"text\" readonly class=\"address-value inline-block fs-18 fs-xs-12\" id=\"copy-address\"/>\n                <figure class=\"inline-block qr-code-icon\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                    <img src=\"assets/images/qr-code-icon.svg\" class=\"max-width-30 width-100 margin-left-5\" alt=\"QR code icon\" itemprop=\"contentUrl\"/>\n                </figure>\n            </div>\n        </a>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/send-page/send-page.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/send-page/send-page.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/send-icon.svg\"/>\n    </figure>\n    <section class=\"padding-top-100 padding-bottom-70 padding-top-xs-40 padding-bottom-xs-50 section-send\">\n        <div class=\"container-fluid no-gutter-xs\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-8 col-sm-offset-2 fs-0\">\n                    <select class=\"combobox clinics-input\">\n                        <option></option>\n                    </select>\n                    <div class=\"calibri-light fs-14 color-solid-gray padding-bottom-xs-20 padding-top-5 show-on-xs\">For payments to Dentacoin Partner Dentists, just type their name in the field above (Feature not supported yet).</div>\n                    <a href=\"javascript:void(0)\" class=\"inline-block max-width-80 scan-qr-code\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                            <img src=\"assets/images/scan-qr-code.svg\" class=\"width-100\" alt=\"Scan QR code icon\" itemprop=\"contentUrl\"/>\n                        </figure>\n                    </a>\n                </div>\n            </div>\n            <div class=\"row hide-xs\">\n                <div class=\"col-xs-12 text-center calibri-light fs-16 color-solid-gray padding-top-40\">For payments to Dentacoin Partner Dentists, just type their name in the field above (Feature not supported yet).</div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn disabled light-blue-border next-send\">NEXT</a>\n        </div>\n    </section>\n    <section class=\"padding-top-100 padding-bottom-100 padding-top-xs-0 padding-bottom-xs-50 section-amount-to\">\n        <div class=\"container-fluid no-gutter-xs\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-8 col-sm-offset-2 fs-0 mobile-background\">\n                    <a href=\"javascript:void(0)\" class=\"inline-block edit-address show-on-xs max-width-50 padding-right-10\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                            <img src=\"assets/images/edit-icon.png\" class=\"width-100 \" alt=\"Edit icon\" itemprop=\"contentUrl\"/>\n                        </figure>\n                    </a>\n                    <div class=\"send-to text-center padding-top-10 padding-bottom-10\">\n                        <span class=\"fs-16 lato-bold inline-block send-to-label\">SEND TO:</span>\n                        <span class=\"inline-block fs-16 fs-xs-13 address-cell padding-right-10 padding-left-10 padding-left-xs-0 padding-right-xs-0\"></span>\n                        <a href=\"javascript:void(0)\" class=\"inline-block edit-address hide-xs\">\n                            <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                                <img src=\"assets/images/edit-icon.png\" class=\"width-100 max-width-30\" alt=\"Edit icon\" itemprop=\"contentUrl\"/>\n                            </figure>\n                        </a>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row fs-0 padding-top-50 padding-top-xs-20\">\n                <div class=\"col-xs-12 col-sm-5 inline-block-top\">\n                    <div class=\"custom-google-label-style module fs-0 flex\">\n                        <div class=\"inline-block left-side\">\n                            <label for=\"crypto-amount\">Send amount:</label>\n                            <input type=\"number\" id=\"crypto-amount\"/>\n                        </div>\n                        <select class=\"inline-block crypto-label input-label\" id=\"active-crypto\">\n                            <option value=\"dcn\">DCN</option>\n                            <option value=\"eth\">ETH</option>\n                        </select>\n                    </div>\n                    <div class=\"fs-14 padding-left-15 padding-left-xs-0 calibri-light\">Enter the amount of Dentacoin / Ether tokens you want to send.</div>\n                </div>\n                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"col-xs-12 col-sm-2 inline-block-top padding-top-20 text-center hide-xs\">\n                    <img src=\"assets/images/equal-icon.svg\" class=\"width-100 max-width-30\" alt=\"Edit icon\" itemprop=\"contentUrl\"/>\n                </figure>\n                <div class=\"col-xs-12 col-sm-5 inline-block-top padding-top-xs-20\">\n                    <div class=\"custom-google-label-style module fs-0 flex\">\n                        <div class=\"inline-block left-side\">\n                            <label for=\"usd-val\">Equal to:</label>\n                            <input type=\"number\" id=\"usd-val\"/>\n                        </div>\n                        <span class=\"inline-block input-label padding-top-10\">USD</span>\n                    </div>\n                    <div class=\"fs-14 padding-left-15 padding-left-xs-0 calibri-light\">The exchange rate may change in the process.</div>\n                </div>\n            </div>\n            <div class=\"row padding-top-60 padding-top-xs-20 text-center checkbox-row\">\n                <div class=\"col-xs-12 fs-0\">\n                    <input type=\"checkbox\" id=\"verified-receiver-address\" class=\"zoom-checkbox inline-block\"/>\n                    <label class=\"fs-16 calibri-light padding-left-5 cursor-pointer inline-block\" for=\"verified-receiver-address\">I have verified the Receiver’s wallet address and the amount of tokens I want to send.</label>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn light-blue-border open-transaction-recipe\">SEND</a>\n        </div>\n    </section>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-exchanges/spend-page-exchanges.component.html":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-exchanges/spend-page-exchanges.component.html ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6\">\n                    <a (click)=\"toGiftCards()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">BUY GIFT CARDS</a>\n                </div>\n                <div class=\"col-xs-6 text-right\">\n                    <a (click)=\"toPayAssuranceFees()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">PAY DENTACOIN ASSURANCE FEES</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center\">\n                    <div class=\"mobile-nav padding-top-xs-20\">\n                        <a (click)=\"toGiftCards()\" class=\"prev cursor-pointer text-left\"><img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28\">TRADE ON EXCHANGES</h1>\n                        <a (click)=\"toPayAssuranceFees()\" class=\"next cursor-pointer text-right\"><img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-40 fs-16\">Dentacoin (DCN) is listed on numerous international exchange platforms that allow you to easily exchange it against hundreds of other crypto and traditional currencies.</div>\n                    <ul class=\"camping-for-exchanges text-left\"></ul>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a (click)=\"toSend()\" class=\"white-light-blue-btn light-blue-border cursor-pointer min-width-xs-300\">DEPOSIT TO EXCHANGE</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-gift-cards/spend-page-gift-cards.component.html":
/*!******************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-gift-cards/spend-page-gift-cards.component.html ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-70\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6\">\n                    <a (click)=\"toPayForDentalServices()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">PAY FOR DENTAL SERVICES</a>\n                </div>\n                <div class=\"col-xs-6 text-right\">\n                    <a (click)=\"toExchanges()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">TRADE ON EXCHANGES</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center\">\n                    <div class=\"mobile-nav padding-top-xs-20\">\n                        <a (click)=\"toPayForDentalServices()\" class=\"prev cursor-pointer text-left\"><img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28\">BUY GIFT CARDS</h1>\n                        <a (click)=\"toExchanges()\" class=\"next cursor-pointer text-right\"><img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-20 fs-16\">From toothbrush and coffee, through books and clothes, to flight and hotel bookings – thanks to Bidali now you can pay for various gift cards directly with Dentacoin (DCN).</div>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn buy-gift-cards light-blue-border min-width-xs-250\">BROWSE ALL CARDS</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.html ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6\">\n                    <a (click)=\"toExchanges()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">TRADE ON EXCHANGES</a>\n                </div>\n                <div class=\"col-xs-6 text-right\">\n                    <a (click)=\"toPayForDentalServices()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">PAY FOR DENTAL SERVICES</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center\">\n                    <div class=\"mobile-nav padding-top-xs-20\">\n                        <a (click)=\"toExchanges()\" class=\"prev cursor-pointer text-left\"><img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28\">PAY DENTACOIN ASSURANCE FEES</h1>\n                        <a (click)=\"toPayForDentalServices()\" class=\"next cursor-pointer text-right\"><img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-30 fs-16\">Dentacoin Assurance is first blockchain-based plan that entitles you to preventive care against affordable monthly fees in Dentacoin (DCN) cryptocurrency.</div>\n                    <div class=\"padding-bottom-20\">\n                        <video controls=\"\" height=\"350\" class=\"width-100 max-width-600 margin-0-auto\">\n                            <source src=\"https://dentacoin.com/assets/uploads/assurance-hub-video.mp4\" type=\"video/mp4\"> Your browser does not support HTML5 video. </video>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"//assurance.dentacoin.com\" target=\"_blank\" class=\"white-light-blue-btn light-blue-border min-width-xs-300\">GO TO DENTACOIN ASSURANCE</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.html":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.html ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6\">\n                    <a (click)=\"toPayAssuranceFees()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">PAY DENTACOIN ASSURANCE FEES</a>\n                </div>\n                <div class=\"col-xs-6 text-right\">\n                    <a (click)=\"toGiftCards()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">BUY GIFT CARDS</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center\">\n                    <div class=\"mobile-nav padding-top-xs-20\">\n                        <a (click)=\"toPayAssuranceFees()\" class=\"prev cursor-pointer text-left\"><img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28\">PAY FOR DENTAL SERVICES</h1>\n                        <a (click)=\"toGiftCards()\" class=\"next cursor-pointer text-right\"><img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-20 fs-16\">You can use the Dentacoin (DCN) tokens you’ve earned or bought to cover dental treatment costs at our growing network of partner dental practices.</div>\n                    <iframe src=\"https://dentacoin.com/google-map-iframe?hide-clinics=true\"></iframe>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a (click)=\"toSend()\" class=\"white-light-blue-btn light-blue-border cursor-pointer min-width-xs-250\">MAKE A PAYMENT</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule, routingComponents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routingComponents", function() { return routingComponents; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _homepage_homepage_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./homepage/homepage.component */ "./src/app/homepage/homepage.component.ts");
/* harmony import */ var _buy_page_buy_page_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./buy-page/buy-page.component */ "./src/app/buy-page/buy-page.component.ts");
/* harmony import */ var _send_page_send_page_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./send-page/send-page.component */ "./src/app/send-page/send-page.component.ts");
/* harmony import */ var _faq_faq_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./faq/faq.component */ "./src/app/faq/faq.component.ts");
/* harmony import */ var _spend_page_pay_for_dental_services_spend_page_pay_for_dental_services_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component */ "./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.ts");
/* harmony import */ var _spend_page_gift_cards_spend_page_gift_cards_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./spend-page-gift-cards/spend-page-gift-cards.component */ "./src/app/spend-page-gift-cards/spend-page-gift-cards.component.ts");
/* harmony import */ var _spend_page_exchanges_spend_page_exchanges_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./spend-page-exchanges/spend-page-exchanges.component */ "./src/app/spend-page-exchanges/spend-page-exchanges.component.ts");
/* harmony import */ var _spend_page_pay_assurance_fees_spend_page_pay_assurance_fees_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component */ "./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.ts");











var routes = [
    { path: '', component: _homepage_homepage_component__WEBPACK_IMPORTED_MODULE_3__["HomepageComponent"] },
    { path: 'buy', component: _buy_page_buy_page_component__WEBPACK_IMPORTED_MODULE_4__["BuyPageComponent"] },
    { path: 'send', component: _send_page_send_page_component__WEBPACK_IMPORTED_MODULE_5__["SendPageComponent"] },
    { path: 'faq', component: _faq_faq_component__WEBPACK_IMPORTED_MODULE_6__["FaqComponent"] },
    { path: 'spend-pay-for-dental-services', component: _spend_page_pay_for_dental_services_spend_page_pay_for_dental_services_component__WEBPACK_IMPORTED_MODULE_7__["SpendPagePayForDentalServicesComponent"] },
    { path: 'spend-gift-cards', component: _spend_page_gift_cards_spend_page_gift_cards_component__WEBPACK_IMPORTED_MODULE_8__["SpendPageGiftCardsComponent"] },
    { path: 'spend-exchanges', component: _spend_page_exchanges_spend_page_exchanges_component__WEBPACK_IMPORTED_MODULE_9__["SpendPageExchangesComponent"] },
    { path: 'spend-pay-assurance-fees', component: _spend_page_pay_assurance_fees_spend_page_pay_assurance_fees_component__WEBPACK_IMPORTED_MODULE_10__["SpendPagePayAssuranceFeesComponent"] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes, { onSameUrlNavigation: 'reload' })],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());

var routingComponents = [_homepage_homepage_component__WEBPACK_IMPORTED_MODULE_3__["HomepageComponent"], _buy_page_buy_page_component__WEBPACK_IMPORTED_MODULE_4__["BuyPageComponent"], _send_page_send_page_component__WEBPACK_IMPORTED_MODULE_5__["SendPageComponent"], _faq_faq_component__WEBPACK_IMPORTED_MODULE_6__["FaqComponent"], _spend_page_pay_for_dental_services_spend_page_pay_for_dental_services_component__WEBPACK_IMPORTED_MODULE_7__["SpendPagePayForDentalServicesComponent"], _spend_page_gift_cards_spend_page_gift_cards_component__WEBPACK_IMPORTED_MODULE_8__["SpendPageGiftCardsComponent"], _spend_page_exchanges_spend_page_exchanges_component__WEBPACK_IMPORTED_MODULE_9__["SpendPageExchangesComponent"], _spend_page_pay_assurance_fees_spend_page_pay_assurance_fees_component__WEBPACK_IMPORTED_MODULE_10__["SpendPagePayAssuranceFeesComponent"]];


/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../environments/environment */ "./src/environments/environment.ts");



var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.hybrid = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].hybrid;
    }
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html")
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _faq_faq_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./faq/faq.component */ "./src/app/faq/faq.component.ts");






var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["routingComponents"],
                _faq_faq_component__WEBPACK_IMPORTED_MODULE_5__["FaqComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/buy-page/buy-page.component.ts":
/*!************************************************!*\
  !*** ./src/app/buy-page/buy-page.component.ts ***!
  \************************************************/
/*! exports provided: BuyPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BuyPageComponent", function() { return BuyPageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");



var BuyPageComponent = /** @class */ (function () {
    function BuyPageComponent(meta, titleService) {
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Buy Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({ name: 'description', content: 'Dentacoin Wallet App allows users to easily and securely buy Dentacoin (DCN) with USD, Ether (ETH), Bitcoin (BTC) and 100+ other cryptocurrencies.' });
        this.meta.updateTag({ name: 'keywords', content: 'buy dentacoin, how to buy dentacoin, buy dentacoin with usd' });
        this.meta.updateTag({ name: 'og:title', content: 'Buy Dentacoin (DCN) via Dentacoin Wallet App' });
        this.meta.updateTag({ name: 'og:description', content: 'Dentacoin Wallet App allows users to easily and securely buy Dentacoin (DCN) with USD, Ether (ETH), Bitcoin (BTC) and 100+ other cryptocurrencies.' });
        this.meta.updateTag({ name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/buy-dentacoin-wallet-app.png' });
    }
    BuyPageComponent.prototype.ngAfterViewInit = function () {
        getBuyPageData();
    };
    BuyPageComponent.ctorParameters = function () { return [
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"] }
    ]; };
    BuyPageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-buy-page',
            template: __webpack_require__(/*! raw-loader!./buy-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/buy-page/buy-page.component.html")
        })
    ], BuyPageComponent);
    return BuyPageComponent;
}());



/***/ }),

/***/ "./src/app/faq/faq.component.ts":
/*!**************************************!*\
  !*** ./src/app/faq/faq.component.ts ***!
  \**************************************/
/*! exports provided: FaqComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FaqComponent", function() { return FaqComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");



var FaqComponent = /** @class */ (function () {
    function FaqComponent(meta, titleService) {
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Dentacoin Wallet dApp: Frequently Asked Questions');
        this.meta.updateTag({ name: 'description', content: 'Where to store Dentacoin tokens? How to create a Dentacoin Wallet? How to buy DCN? Find the answers to all your questions here.' });
        this.meta.updateTag({ name: 'keywords', content: 'dentacoin wallet, dcn wallet, how to buy dentacoin, how to buy dcn, store dentacoin, store dcn' });
        this.meta.updateTag({ name: 'og:title', content: 'Dentacoin Wallet dApp: Frequently Asked Questions' });
        this.meta.updateTag({ name: 'og:description', content: 'Where to store Dentacoin tokens? How to create a Dentacoin Wallet? How to buy DCN? Find the answers to all your questions here.' });
        this.meta.updateTag({ name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-wallet-frequently-asked-questions.png' });
    }
    FaqComponent.prototype.ngAfterViewInit = function () {
        getFaqPageData();
    };
    FaqComponent.ctorParameters = function () { return [
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"] }
    ]; };
    FaqComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-faq',
            template: __webpack_require__(/*! raw-loader!./faq.component.html */ "./node_modules/raw-loader/index.js!./src/app/faq/faq.component.html")
        })
    ], FaqComponent);
    return FaqComponent;
}());



/***/ }),

/***/ "./src/app/homepage/homepage.component.ts":
/*!************************************************!*\
  !*** ./src/app/homepage/homepage.component.ts ***!
  \************************************************/
/*! exports provided: HomepageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomepageComponent", function() { return HomepageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");



var HomepageComponent = /** @class */ (function () {
    function HomepageComponent(meta, titleService) {
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens');
        this.meta.updateTag({ name: 'description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.' });
        this.meta.updateTag({ name: 'keywords', content: 'buy dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin' });
        this.meta.updateTag({ name: 'og:title', content: 'Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens' });
        this.meta.updateTag({ name: 'og:description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.' });
        this.meta.updateTag({ name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-wallet-dapp.png' });
    }
    HomepageComponent.prototype.ngAfterViewInit = function () {
        getHomepageData();
    };
    HomepageComponent.ctorParameters = function () { return [
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"] }
    ]; };
    HomepageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-homepage',
            template: __webpack_require__(/*! raw-loader!./homepage.component.html */ "./node_modules/raw-loader/index.js!./src/app/homepage/homepage.component.html")
        })
    ], HomepageComponent);
    return HomepageComponent;
}());



/***/ }),

/***/ "./src/app/send-page/send-page.component.ts":
/*!**************************************************!*\
  !*** ./src/app/send-page/send-page.component.ts ***!
  \**************************************************/
/*! exports provided: SendPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendPageComponent", function() { return SendPageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");



var SendPageComponent = /** @class */ (function () {
    function SendPageComponent(meta, titleService) {
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Send Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({ name: 'description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!' });
        this.meta.updateTag({ name: 'keywords', content: 'send dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin' });
        this.meta.updateTag({ name: 'og:title', content: 'Send Dentacoin (DCN) via Dentacoin Wallet App' });
        this.meta.updateTag({ name: 'og:description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!' });
        this.meta.updateTag({ name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/send-dentacoin-wallet-app.png' });
    }
    SendPageComponent.prototype.ngAfterViewInit = function () {
        getSendPageData();
    };
    SendPageComponent.ctorParameters = function () { return [
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"] }
    ]; };
    SendPageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-send-page',
            template: __webpack_require__(/*! raw-loader!./send-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/send-page/send-page.component.html")
        })
    ], SendPageComponent);
    return SendPageComponent;
}());



/***/ }),

/***/ "./src/app/spend-page-exchanges/spend-page-exchanges.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/spend-page-exchanges/spend-page-exchanges.component.ts ***!
  \************************************************************************/
/*! exports provided: SpendPageExchangesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpendPageExchangesComponent", function() { return SpendPageExchangesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");




var SpendPageExchangesComponent = /** @class */ (function () {
    function SpendPageExchangesComponent(router, meta, titleService) {
        this.router = router;
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Dentacoin (DCN) trading exchanges list | Dentacoin Wallet DApp');
        this.meta.updateTag({ name: 'description', content: 'Find the full list of trusted exchange platforms which support Dentacoin (DCN) cryptocurrency.' });
        this.meta.updateTag({ name: 'keywords', content: 'dentacoin exchanges, trade dentacoin, dcn currency, dcn crypto' });
        this.meta.updateTag({ name: 'og:title', content: 'Dentacoin (DCN) trading exchanges list' });
        this.meta.updateTag({ name: 'og:description', content: 'Find the full list of trusted exchange platforms which support Dentacoin (DCN) cryptocurrency.' });
        this.meta.updateTag({ name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-exchanges-list.png' });
    }
    SpendPageExchangesComponent.prototype.ngAfterViewInit = function () {
        getSpendPageExchanges();
    };
    SpendPageExchangesComponent.prototype.toSend = function () {
        this.router.navigateByUrl('send');
    };
    SpendPageExchangesComponent.prototype.toGiftCards = function () {
        this.router.navigateByUrl('spend-gift-cards');
    };
    SpendPageExchangesComponent.prototype.toPayAssuranceFees = function () {
        this.router.navigateByUrl('spend-pay-assurance-fees');
    };
    SpendPageExchangesComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"] }
    ]; };
    SpendPageExchangesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-spend-page-exchanges',
            template: __webpack_require__(/*! raw-loader!./spend-page-exchanges.component.html */ "./node_modules/raw-loader/index.js!./src/app/spend-page-exchanges/spend-page-exchanges.component.html")
        })
    ], SpendPageExchangesComponent);
    return SpendPageExchangesComponent;
}());



/***/ }),

/***/ "./src/app/spend-page-gift-cards/spend-page-gift-cards.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/spend-page-gift-cards/spend-page-gift-cards.component.ts ***!
  \**************************************************************************/
/*! exports provided: SpendPageGiftCardsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpendPageGiftCardsComponent", function() { return SpendPageGiftCardsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");




var SpendPageGiftCardsComponent = /** @class */ (function () {
    function SpendPageGiftCardsComponent(router, meta, titleService) {
        this.router = router;
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Buy giftcards with Dentacoin | Dentacoin Wallet DApp');
        this.meta.updateTag({ name: 'description', content: 'From coffee to clothes, books and hotel bookings, you can purchase online gift cards for various major brands with Dentacoin (DCN).' });
        this.meta.updateTag({ name: 'keywords', content: 'spend dentacoin online, gift cards dentacoin, bidali gift cards, online gift cards' });
        this.meta.updateTag({ name: 'og:title', content: 'Buy giftcards online with Dentacoin' });
        this.meta.updateTag({ name: 'og:description', content: 'From coffee to clothes, books and hotel bookings, you can purchase online gift cards for various major brands with Dentacoin (DCN).' });
        this.meta.updateTag({ name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/gift-cards-dentacoin-wallet.png' });
    }
    SpendPageGiftCardsComponent.prototype.ngAfterViewInit = function () {
        getSpendPageGiftCards();
    };
    SpendPageGiftCardsComponent.prototype.toExchanges = function () {
        this.router.navigateByUrl('spend-exchanges');
    };
    SpendPageGiftCardsComponent.prototype.toPayForDentalServices = function () {
        this.router.navigateByUrl('spend-pay-for-dental-services');
    };
    SpendPageGiftCardsComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"] }
    ]; };
    SpendPageGiftCardsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-spend-page-gift-cards',
            template: __webpack_require__(/*! raw-loader!./spend-page-gift-cards.component.html */ "./node_modules/raw-loader/index.js!./src/app/spend-page-gift-cards/spend-page-gift-cards.component.html")
        })
    ], SpendPageGiftCardsComponent);
    return SpendPageGiftCardsComponent;
}());



/***/ }),

/***/ "./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.ts ***!
  \******************************************************************************************/
/*! exports provided: SpendPagePayAssuranceFeesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpendPagePayAssuranceFeesComponent", function() { return SpendPagePayAssuranceFeesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");




var SpendPagePayAssuranceFeesComponent = /** @class */ (function () {
    function SpendPagePayAssuranceFeesComponent(router, meta, titleService) {
        this.router = router;
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Pay Dentacoin Assurance fees | Dentacoin Wallet DApp');
        this.meta.updateTag({ name: 'description', content: 'Pay your Dentacoin Assurance monthly premium easily and securely and enjoy the benefits of a prevention-focused dental plan.' });
        this.meta.updateTag({ name: 'keywords', content: 'dental plan payment, dental insurance, dentacoin assurance fee' });
        this.meta.updateTag({ name: 'og:title', content: 'Pay Dentacoin Assurance fees' });
        this.meta.updateTag({ name: 'og:description', content: 'Pay your Dentacoin Assurance monthly premium easily and securely and enjoy the benefits of a prevention-focused dental plan.' });
        this.meta.updateTag({ name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/pay-dental-assurance-dentacoin.png' });
    }
    SpendPagePayAssuranceFeesComponent.prototype.ngAfterViewInit = function () {
        initdApp();
    };
    SpendPagePayAssuranceFeesComponent.prototype.toExchanges = function () {
        this.router.navigateByUrl('spend-exchanges');
    };
    SpendPagePayAssuranceFeesComponent.prototype.toPayForDentalServices = function () {
        this.router.navigateByUrl('spend-pay-for-dental-services');
    };
    SpendPagePayAssuranceFeesComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"] }
    ]; };
    SpendPagePayAssuranceFeesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-spend-page-pay-assurance-fees',
            template: __webpack_require__(/*! raw-loader!./spend-page-pay-assurance-fees.component.html */ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.html")
        })
    ], SpendPagePayAssuranceFeesComponent);
    return SpendPagePayAssuranceFeesComponent;
}());



/***/ }),

/***/ "./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.ts":
/*!****************************************************************************************************!*\
  !*** ./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.ts ***!
  \****************************************************************************************************/
/*! exports provided: SpendPagePayForDentalServicesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpendPagePayForDentalServicesComponent", function() { return SpendPagePayForDentalServicesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");




var SpendPagePayForDentalServicesComponent = /** @class */ (function () {
    function SpendPagePayForDentalServicesComponent(router, meta, titleService) {
        this.router = router;
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Pay for dental services in Dentacoin | Dentacoin Wallet DApp');
        this.meta.updateTag({ name: 'description', content: 'Cover your dental treatment in Dentacoin tokens at all partner dentists, accepting DCN. Pay directly with ease via Dentacoin Wallet DApp.' });
        this.meta.updateTag({ name: 'keywords', content: 'dentacoin accepted, dental currency, dental payment, spend dentacoin, pay with dentacoin' });
        this.meta.updateTag({ name: 'og:title', content: 'Pay for dental services with Dentacoin' });
        this.meta.updateTag({ name: 'og:description', content: 'Cover your dental treatment in Dentacoin tokens at all partner dentists and clinics, accepting DCN. Handle payments with ease via Dentacoin Wallet DApp.' });
        this.meta.updateTag({ name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentist-pay-with-dentacoin.png' });
    }
    SpendPagePayForDentalServicesComponent.prototype.ngAfterViewInit = function () {
        initdApp();
    };
    SpendPagePayForDentalServicesComponent.prototype.toSend = function () {
        this.router.navigateByUrl('send');
    };
    SpendPagePayForDentalServicesComponent.prototype.toGiftCards = function () {
        this.router.navigateByUrl('spend-gift-cards');
    };
    SpendPagePayForDentalServicesComponent.prototype.toPayAssuranceFees = function () {
        this.router.navigateByUrl('spend-pay-assurance-fees');
    };
    SpendPagePayForDentalServicesComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"] }
    ]; };
    SpendPagePayForDentalServicesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-spend-page-pay-for-dental-services',
            template: __webpack_require__(/*! raw-loader!./spend-page-pay-for-dental-services.component.html */ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.html")
        })
    ], SpendPagePayForDentalServicesComponent);
    return SpendPagePayForDentalServicesComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
var environment = {
    production: false,
    hybrid: true
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\wamp\www\wallet-v2\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map