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

module.exports = "<header>\n    <div class=\"container\">\n        <div class=\"row fs-0 logo-and-settings-row\">\n            <div class=\"col-xs-6 inline-block\">\n                <figure itemscope=\"\" itemtype=\"http://schema.org/Organization\" class=\"logo\">\n                    <a routerLink=\"/\" itemprop=\"url\">\n                        <img src=\"assets/images/logo.svg\" itemprop=\"logo\" alt=\"Dentacoin logo\"/>\n                    </a>\n                </figure>\n            </div>\n        </div>\n    </div>\n    <div class=\"nav-row\">\n        <nav class=\"container\">\n            <ul itemtype=\"http://schema.org/SiteNavigationElement\" class=\"row fs-0\">\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button\" routerLink=\"/\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\"><span itemprop=\"name\">WALLET</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button\" routerLink=\"buy\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\"><span itemprop=\"name\">BUY</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button\" routerLink=\"send\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\"><span itemprop=\"name\">SEND</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button spend\" routerLink=\"spend-pay-for-dental-services\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\"><span itemprop=\"name\">SPEND</span></a>\n                </li>\n            </ul>\n        </nav>\n    </div>\n    <div class=\"camping-currently-offline\"></div>\n</header>\n<main id=\"main-container\" class=\"padding-bottom-xs-130\" [attr.hybrid]=\"hybrid ? 'true' : null\" [attr.network]=\"network == 'mainnet' ? 'mainnet' : 'rinkeby'\">\n    <div class=\"container padding-top-100 padding-top-xs-10 padding-bottom-70\">\n        <div class=\"row\">\n            <div class=\"col-xs-12 no-gutter main-holder\">\n                <router-outlet></router-outlet>\n            </div>\n        </div>\n    </div>\n    <div class=\"camping-transaction-history\"></div>\n</main>\n<footer>\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-xs-8 col-xs-offset-2 white-border\"></div>\n        </div>\n        <div class=\"row padding-bottom-xs-50\">\n            <ul class=\"col-12 no-gutter-xs\" itemtype=\"http://schema.org/SiteNavigationElement\">\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentacoin.com/how-to-create-wallet\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\"><img src=\"assets/images/faq.svg\" alt=\"FAQ icon\"/></figure>\n                        <span itemprop=\"name\">FAQ</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentacoin.com/privacy-policy\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\"><img src=\"assets/images/privacy-policy.svg\" alt=\"Privacy policy icon\"/></figure>\n                        <span itemprop=\"name\">Privacy policy</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentavox.dentacoin.com/\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\"><img src=\"assets/images/dentavox.svg\" alt=\"DentaVox logo\"/></figure>\n                        <span itemprop=\"name\">DentaVox</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://reviews.dentacoin.com/\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\"><img src=\"assets/images/trusted-reviews.svg\" alt=\"Trusted Reviews logo\"/></figure>\n                        <span itemprop=\"name\">Trusted Reviews</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentacare.dentacoin.com/\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\"><img src=\"assets/images/dentacare.svg\" alt=\"Dentacare logo\"/></figure>\n                        <span itemprop=\"name\">Dentacare</span>\n                    </a>\n                </li>\n            </ul>\n        </div>\n        <div class=\"row copyright\">\n            <div class=\"col-12 text-center\">\n                © 2019 Dentacoin Foundation. All rights reserved.\n                <div><a href=\"https://dentacoin.com/assets/uploads/dentacoin-foundation.pdf\" class=\"data-external-link\" target=\"_blank\">Verify Dentacoin Foundation</a></div>\n            </div>\n        </div>\n    </div>\n</footer>\n<div class=\"camp-for-fixed-mobile-nav\">\n    <nav>\n        <ul itemtype=\"http://schema.org/SiteNavigationElement\" class=\"fs-0\">\n            <li class=\"inline-block-bottom\">\n                <a routerLink=\"/\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Wallet icon\" itemprop=\"contentUrl\" src=\"assets/images/wallet-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">WALLET</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a routerLink=\"buy\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/buy-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">BUY</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a routerLink=\"send\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Send icon\" itemprop=\"contentUrl\" src=\"assets/images/send-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">SEND</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a routerLink=\"spend-pay-for-dental-services\" class=\"send\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">SPEND</span>\n                </a>\n            </li>\n        </ul>\n    </nav>\n</div>\n<div class=\"camp-for-custom-popover hide\"><div class=\"arrow\"></div>Ether (ETH) is a currency that is used for covering your transaction costs. Don't have ETH? <a routerLink=\"buy\" class=\"lato-bold color-light-blue\">Buy some with a card here</a>.</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/buy-page/buy-page.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/buy-page/buy-page.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/buy-icon.svg\"/>\n    </figure>\n    <div class=\"padding-top-50 padding-top-xs-40 padding-bottom-50\">\n        <section class=\"container-fluid ready-to-purchase-with-external-api padding-top-40 padding-bottom-10 padding-top-xs-0 padding-bottom-xs-0 no-gutter-xs\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-5 padding-bottom-xs-20\">\n                    <div class=\"custom-google-label-style module fs-0 flex\">\n                        <div class=\"inline-block left-side\">\n                            <label class=\"active-label\" for=\"usd-value\">Pay with:</label>\n                            <input type=\"number\" id=\"usd-value\" value=\"25\"/>\n                        </div>\n                        <span class=\"inline-block input-label padding-top-10 padding-top-xs-15\">USD</span>\n                    </div>\n                    <div class=\"fs-16 padding-left-15 padding-left-xs-0 calibri-light text-below-input\">First transaction: $25 to $6,000. Daily limit: $20,000</div>\n                </div>\n                <div class=\"col-sm-2 text-center hide-this-xs\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Exchange icon\" itemprop=\"contentUrl\" src=\"assets/images/exchange-icon-light-blue.png\"/>\n                    </figure>\n                </div>\n                <div class=\"col-xs-12 col-sm-5 padding-bottom-xs-20\">\n                    <div class=\"custom-google-label-style module fs-0 flex\">\n                        <div class=\"inline-block left-side\">\n                            <label for=\"crypto-amount\" class=\"active-label\">You get:</label>\n                            <input type=\"number\" id=\"crypto-amount\"/>\n                        </div>\n                        <select class=\"inline-block crypto-label input-label\" id=\"active-crypto\">\n                            <option value=\"dcn\">DCN</option>\n                            <option value=\"eth\">ETH</option>\n                        </select>\n                    </div>\n                    <div class=\"fs-16 padding-left-15 padding-left-xs-0 calibri-light text-below-input\">The exchange rate may change in the process.</div>\n                </div>\n            </div>\n            <div class=\"row padding-top-50 padding-top-xs-0 padding-bottom-20\">\n                <div class=\"col-xs-12 col-sm-6 col-sm-offset-3\">\n                    <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\">\n                        <label for=\"dcn_address\">Address to receive <span class=\"address-to-receive\">DCN</span>:</label>\n                        <input type=\"url\" id=\"dcn_address\" maxlength=\"42\" class=\"full-rounded\"/>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-6 col-sm-offset-3\">\n                    <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\">\n                        <label for=\"email\">Email:</label>\n                        <input type=\"email\" id=\"email\" maxlength=\"100\" class=\"full-rounded\"/>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 text-center\">\n                <div class=\"col-xs-12 col-sm-6 col-sm-offset-3\">\n                    <input type=\"checkbox\" id=\"privacy-policy-agree\" class=\"zoom-checkbox\"/>\n                    <label class=\"fs-16 calibri-light text-below-input padding-left-10 cursor-pointer privacy-policy-agree-label\" for=\"privacy-policy-agree\">I have read and accept the <a href=\"https://dentacoin.com/privacy-policy\" target=\"_blank\" class=\"color-light-blue lato-bold data-external-link\">Privacy Policy</a></label>\n                </div>\n            </div>\n            <div class=\"row padding-top-30 text-center\">\n                <div class=\"col-xs-12 fs-16\">\n                    Powered by\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-bottom-10\">\n                        <img alt=\"Indacoin logo\" itemprop=\"contentUrl\" src=\"assets/images/indacoin-logo.svg\" class=\"width-100 max-width-150\"/>\n                    </figure>\n                    <div>All transactions are solely handled by Indacoin Limited.</div>\n                    <a href=\"https://indacoin.com/\" target=\"_blank\" class=\"text-decoration-underline color-light-blue\">www.indacoin.com</a>\n                </div>\n            </div>\n        </section>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn light-blue-border buy-crypto-btn\">BUY</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/homepage/homepage.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/homepage/homepage.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Wallet icon\" itemprop=\"contentUrl\" src=\"assets/images/wallet-icon.svg\"/>\n    </figure>\n    <div class=\"padding-top-50 padding-top-xs-20 padding-bottom-50\">\n        <div class=\"container-fluid padding-top-30 padding-bottom-50 padding-top-xs-0 padding-bottom-xs-0 no-gutter-xs text-center-xs\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-8 col-lg-7 col-lg-offset-1 inline-block-top\">\n                    <div class=\"fs-40 fs-xs-30 lato-bold fade-in-element\">\n                        <a href=\"javascript:void(0)\" class=\"refresh-account-data inline-block max-width-30 margin-right-10\"><svg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"sync-alt\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" class=\"inline-block width-100 svg-inline--fa fa-sync-alt fa-w-16 fa-3x\"><path style=\"fill: #333;\" fill=\"currentColor\" d=\"M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z\" class=\"\"></path></svg></a>\n                        <span class=\"inline-block dcn-amount\">0</span><span class=\"inline-block padding-left-10\">DCN</span></div>\n                    <div class=\"fs-30 fs-xs-20 padding-bottom-30 padding-bottom-xs-10 lato-bold fade-in-element usd-amount-parent\"><span class=\"inline-block padding-right-10\">=</span><span class=\"inline-block usd-amount\">0</span><span class=\"inline-block padding-left-10\">USD</span></div>\n                    <div class=\"fs-20 fs-xs-15 fade-in-element\"><span class=\"eth-amount inline-block\">0</span><span class=\"inline-block padding-left-10 padding-left-xs-5\">ETH for transaction fees</span><figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"inline-block margin-left-10 more-info\"><img alt=\"More info icon\" itemprop=\"contentUrl\" src=\"assets/images/more-info.svg\" class=\"width-100 max-width-20 cursor-pointer\"/></figure></div>\n                </div>\n                <div class=\"col-sm-4 col-lg-3 inline-block-top text-right hide-this-xs\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" id=\"qrcode\">\n                        <img src=\"assets/images/blurred-qr-code.jpg\" alt=\"Blurred qr code image\" class=\"width-100 max-width-180\" itemprop=\"contentUrl\"/>\n                    </figure>\n                </div>\n            </div>\n        </div>\n        <a href=\"javascript:void(0)\" class=\"eth-address-container copy-address fade-in-element color-white text-center\" data-toggle=\"tooltip\" title=\"Copied.\" data-clipboard-target=\"#copy-address\">\n            <h2 class=\"fs-20\">Your Dentacoin Address:</h2>\n            <div class=\"fs-0 fix-vertical-alignment-on-mobile\">\n                <figure class=\"inline-block copy-icon\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                    <img src=\"assets/images/copy-icon.svg\" class=\"max-width-30 width-100 margin-right-5\" alt=\"Copy address to clipboard icon\" itemprop=\"contentUrl\"/>\n                </figure>\n                <input type=\"text\" readonly class=\"address-value inline-block fs-18 fs-xs-12\" id=\"copy-address\"/>\n                <figure class=\"inline-block qr-code-icon\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                    <img src=\"assets/images/qr-code-icon.svg\" class=\"max-width-30 width-100 margin-left-5\" alt=\"QR code icon\" itemprop=\"contentUrl\"/>\n                </figure>\n            </div>\n        </a>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/not-found-page/not-found-page.component.html":
/*!****************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/not-found-page/not-found-page.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-404\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <figure class=\"col-xs-12 inline-block col-sm-5 col-sm-offset-1\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                <img alt=\"404 page icon\" itemprop=\"contentUrl\" src=\"assets/images/404.svg\"/>\n            </figure>\n            <div class=\"col-xs-12 inline-block col-sm-5 num-404\">\n                404\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/send-page/send-page.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/send-page/send-page.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\r\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\r\n        <img alt=\"Send icon\" itemprop=\"contentUrl\" src=\"assets/images/send-icon.svg\"/>\r\n    </figure>\r\n    <section class=\"padding-top-100 padding-bottom-70 padding-top-xs-40 padding-bottom-xs-50 section-send\">\r\n        <div class=\"container-fluid no-gutter-xs\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 fs-0\">\r\n                    <div class=\"inline-block search-field\">\r\n                        <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\">\r\n                            <label for=\"search\" id=\"search-label\">Enter address/ clinic name or scan QR</label>\r\n                            <input type=\"text\" id=\"search\" maxlength=\"42\" autocomplete=\"off\"/>\r\n                        </div>\r\n                        <div class=\"search-result\">\r\n                            <div class=\"search-header\">\r\n                                <a class=\"inline-block active\" data-type=\"clinics\" href=\"javascript:void(0)\">Clinics/ dentists</a>\r\n                                <a class=\"inline-block\" data-type=\"address-book\" href=\"javascript:void(0)\">Address Book</a>\r\n                            </div>\r\n                            <div class=\"search-body\">\r\n                                <div class=\"clinics hideable-element\">\r\n                                    <ul class=\"clinics-list\" id=\"clinics-list\"></ul>\r\n                                </div>\r\n                                <div class=\"address-book hideable-element\"><i class=\"display-block-important padding-top-15 padding-left-15 padding-bottom-15 padding-right-15\">Empty Address Book</i></div>\r\n                            </div>\r\n                            <div class=\"search-footer\">\r\n                                <a href=\"javascript:void(0)\" class=\"add-to-address-book lato-bold\">+ Add to Address Book</a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"calibri-light fs-14 color-solid-gray padding-bottom-xs-20 padding-top-5 show-on-xs\">For payments to Dentacoin Partner Dentists, just type their name in the field above (Feature not supported yet).</div>\r\n                    <a href=\"javascript:void(0)\" class=\"inline-block max-width-80 scan-qr-code\">\r\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\r\n                            <img src=\"assets/images/scan-qr-code.svg\" class=\"width-100\" alt=\"Scan QR code icon\" itemprop=\"contentUrl\"/>\r\n                        </figure>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n            <div class=\"row hide-xs\">\r\n                <div class=\"col-xs-12 text-center calibri-light fs-16 color-solid-gray padding-top-40\">For payments to Dentacoin Partner Dentists, just type their name in the field above.</div>\r\n            </div>\r\n        </div>\r\n        <div class=\"bottom-absolute-btn text-center\">\r\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn disabled light-blue-border next-send\">NEXT</a>\r\n        </div>\r\n    </section>\r\n    <section class=\"padding-top-100 padding-bottom-100 padding-top-xs-0 padding-bottom-xs-50 section-amount-to\">\r\n        <div class=\"container-fluid no-gutter-xs\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-12 col-sm-8 col-sm-offset-2 fs-0 mobile-background padding-left-xs-10 padding-right-xs-10\">\r\n                    <a href=\"javascript:void(0)\" class=\"inline-block edit-address show-on-xs max-width-50 padding-right-10 padding-right-xs-5\">\r\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\r\n                            <img src=\"assets/images/edit-icon.png\" class=\"width-100 \" alt=\"Edit icon\" itemprop=\"contentUrl\"/>\r\n                        </figure>\r\n                    </a>\r\n                    <div class=\"send-to text-center padding-top-10 padding-bottom-10\">\r\n                        <span class=\"fs-16 lato-bold inline-block send-to-label\">SEND TO:</span>\r\n                        <span class=\"inline-block fs-16 fs-xs-11 address-cell padding-right-10 padding-left-10 padding-left-xs-0 padding-right-xs-0\"></span>\r\n                        <a href=\"javascript:void(0)\" class=\"inline-block edit-address hide-xs\">\r\n                            <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\r\n                                <img src=\"assets/images/edit-icon.png\" class=\"width-100 max-width-30\" alt=\"Edit icon\" itemprop=\"contentUrl\"/>\r\n                            </figure>\r\n                        </a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"container-fluid no-gutter-xs\">\r\n                <div class=\"row\">\r\n                    <div class=\"col-xs-12 col-sm-8 col-sm-offset-2\">\r\n                        <div class=\"spendable-amount fs-0\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row fs-0 padding-top-50 padding-top-xs-20\">\r\n                <div class=\"col-xs-12 col-sm-5 inline-block-top\">\r\n                    <div class=\"custom-google-label-style module fs-0 flex\">\r\n                        <div class=\"inline-block left-side\">\r\n                            <label for=\"crypto-amount\">Send amount:</label>\r\n                            <input type=\"number\" id=\"crypto-amount\"/>\r\n                        </div>\r\n                        <select class=\"inline-block crypto-label input-label\" id=\"active-crypto\">\r\n                            <option value=\"dcn\">DCN</option>\r\n                            <option value=\"eth\">ETH</option>\r\n                        </select>\r\n                    </div>\r\n                    <div class=\"fs-14 padding-left-15 padding-left-xs-0 calibri-light\">Enter the amount of Dentacoin / Ether tokens you want to send.</div>\r\n                </div>\r\n                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"col-xs-12 col-sm-2 inline-block-top padding-top-20 text-center hide-xs\">\r\n                    <img src=\"assets/images/equal-icon.svg\" class=\"width-100 max-width-30\" alt=\"Edit icon\" itemprop=\"contentUrl\"/>\r\n                </figure>\r\n                <div class=\"col-xs-12 col-sm-5 inline-block-top padding-top-xs-20\">\r\n                    <div class=\"custom-google-label-style module fs-0 flex\">\r\n                        <div class=\"inline-block left-side\">\r\n                            <label for=\"usd-val\">Equal to:</label>\r\n                            <input type=\"number\" id=\"usd-val\"/>\r\n                        </div>\r\n                        <span class=\"inline-block input-label padding-top-10 padding-top-xs-15\">USD</span>\r\n                    </div>\r\n                    <div class=\"fs-14 padding-left-15 padding-left-xs-0 calibri-light\">The exchange rate may change in the process.</div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row padding-top-60 padding-top-xs-20 text-center checkbox-row\">\r\n                <div class=\"col-xs-12 fs-0\">\r\n                    <input type=\"checkbox\" id=\"verified-receiver-address\" class=\"zoom-checkbox inline-block\"/>\r\n                    <label class=\"fs-16 calibri-light padding-left-5 cursor-pointer inline-block\" for=\"verified-receiver-address\">I have verified the Receiver’s wallet address and the amount of tokens I want to send.</label>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"bottom-absolute-btn text-center\">\r\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn light-blue-border open-transaction-recipe\">SEND</a>\r\n        </div>\r\n    </section>\r\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-exchanges/spend-page-exchanges.component.html":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-exchanges/spend-page-exchanges.component.html ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6\">\n                    <a (click)=\"redirectsService.toPayForDentalServices()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">PAY DENTAL SERVICES</a>\n                </div>\n                <div class=\"col-xs-6 text-right\">\n                    <a (click)=\"redirectsService.toPayAssuranceFees()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">GO TO DCN ASSURANCE</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center\">\n                    <div class=\"mobile-nav padding-top-xs-20\">\n                        <a (click)=\"redirectsService.toPayForDentalServices()\" class=\"prev cursor-pointer text-left\"><img alt=\"Left arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28 fs-xs-24\">TRADE ON EXCHANGES</h1>\n                        <a (click)=\"redirectsService.toPayAssuranceFees()\" class=\"next cursor-pointer text-right\"><img alt=\"Right arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-40 fs-16 max-width-600 margin-0-auto\">Dentacoin (DCN) is listed on numerous international exchange platforms that allow you to easily exchange it against hundreds of other crypto and traditional currencies.</div>\n                    <ul class=\"camping-for-exchanges text-left\"></ul>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a (click)=\"redirectsService.toSend()\" class=\"white-light-blue-btn light-blue-border cursor-pointer min-width-xs-300\">DEPOSIT TO EXCHANGE</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.html ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6\">\n                    <a (click)=\"redirectsService.toExchanges()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">TRADE ON EXCHANGES</a>\n                </div>\n                <div class=\"col-xs-6 text-right\">\n                    <a (click)=\"redirectsService.toPayForDentalServices()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">PAY DENTAL SERVICES</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center\">\n                    <div class=\"mobile-nav padding-top-xs-20\">\n                        <a (click)=\"redirectsService.toExchanges()\" class=\"prev cursor-pointer text-left\"><img alt=\"Left arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28 fs-xs-24\">MANAGE DCN ASSURANCE</h1>\n                        <a (click)=\"redirectsService.toPayForDentalServices()\" class=\"next cursor-pointer text-right\"><img alt=\"Right arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-10 fs-16 max-width-600 margin-0-auto\">Dentacoin Assurance is first blockchain-based plan that entitles you to preventive care against affordable monthly fees in Dentacoin (DCN) cryptocurrency.</div>\n                    <div class=\"camp-assurance-mobile-phone-scanning\"></div>\n                    <div class=\"padding-bottom-20 padding-top-20\">\n                        <video controls=\"\" height=\"350\" class=\"width-100 max-width-600 margin-0-auto\" poster=\"assets/images/dentacoin-assurance-intro.png\">\n                            <source src=\"https://dentacoin.com/assets/uploads/assurance-hub-video.mp4\" type=\"video/mp4\"> Your browser does not support HTML5 video. </video>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"https://assurance.dentacoin.com\" target=\"_blank\" class=\"white-light-blue-btn light-blue-border min-width-xs-300 data-external-link\">GO TO DENTACOIN ASSURANCE</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.html":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.html ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6 padding-left-65\">\n                    <a (click)=\"redirectsService.toPayAssuranceFees()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">GO TO DCN ASSURANCE</a>\n                </div>\n                <div class=\"col-xs-6 text-right padding-right-65\">\n                    <a (click)=\"redirectsService.toExchanges()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">TRADE ON EXCHANGES</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center padding-left-xs-0 padding-right-xs-0\">\n                    <div class=\"mobile-nav padding-top-xs-20 padding-left-xs-15 padding-right-xs-15\">\n                        <a (click)=\"redirectsService.toPayAssuranceFees()\" class=\"prev cursor-pointer text-left\"><img alt=\"Left arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28 fs-xs-24\">PAY DENTAL SERVICES</h1>\n                        <a (click)=\"redirectsService.toExchanges()\" class=\"next cursor-pointer text-right\"><img alt=\"Right arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-20 padding-left-xs-15 padding-right-xs-15 fs-16 max-width-600 margin-0-auto\">You can use the Dentacoin (DCN) tokens you’ve earned or bought to cover dental treatment costs at our growing network of partner dental practices.</div>\n                    <iframe src=\"https://dentacoin.com/google-map-iframe?hide-clinics=true&type=wallet\"></iframe>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a (click)=\"redirectsService.toSend()\" class=\"white-light-blue-btn light-blue-border cursor-pointer min-width-xs-250\">MAKE A PAYMENT</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/_services/redirects.service.ts":
/*!************************************************!*\
  !*** ./src/app/_services/redirects.service.ts ***!
  \************************************************/
/*! exports provided: RedirectsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedirectsService", function() { return RedirectsService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var RedirectsService = /** @class */ (function () {
    function RedirectsService(router) {
        this.router = router;
    }
    RedirectsService.prototype.toSend = function () {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('send');
    };
    RedirectsService.prototype.toPayForDentalServices = function () {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('spend-pay-for-dental-services');
    };
    RedirectsService.prototype.toPayAssuranceFees = function () {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('spend-pay-assurance-fees');
    };
    RedirectsService.prototype.toExchanges = function () {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('spend-exchanges');
    };
    RedirectsService.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
    ]; };
    RedirectsService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], RedirectsService);
    return RedirectsService;
}());



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
/* harmony import */ var _spend_page_pay_for_dental_services_spend_page_pay_for_dental_services_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component */ "./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.ts");
/* harmony import */ var _spend_page_exchanges_spend_page_exchanges_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./spend-page-exchanges/spend-page-exchanges.component */ "./src/app/spend-page-exchanges/spend-page-exchanges.component.ts");
/* harmony import */ var _spend_page_pay_assurance_fees_spend_page_pay_assurance_fees_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component */ "./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.ts");
/* harmony import */ var _not_found_page_not_found_page_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./not-found-page/not-found-page.component */ "./src/app/not-found-page/not-found-page.component.ts");










var routes = [
    { path: '', component: _homepage_homepage_component__WEBPACK_IMPORTED_MODULE_3__["HomepageComponent"] },
    { path: 'buy', component: _buy_page_buy_page_component__WEBPACK_IMPORTED_MODULE_4__["BuyPageComponent"] },
    { path: 'send', component: _send_page_send_page_component__WEBPACK_IMPORTED_MODULE_5__["SendPageComponent"] },
    { path: 'spend-pay-for-dental-services', component: _spend_page_pay_for_dental_services_spend_page_pay_for_dental_services_component__WEBPACK_IMPORTED_MODULE_6__["SpendPagePayForDentalServicesComponent"] },
    { path: 'spend-exchanges', component: _spend_page_exchanges_spend_page_exchanges_component__WEBPACK_IMPORTED_MODULE_7__["SpendPageExchangesComponent"] },
    { path: 'spend-pay-assurance-fees', component: _spend_page_pay_assurance_fees_spend_page_pay_assurance_fees_component__WEBPACK_IMPORTED_MODULE_8__["SpendPagePayAssuranceFeesComponent"] },
    { path: '**', component: _not_found_page_not_found_page_component__WEBPACK_IMPORTED_MODULE_9__["NotFoundPageComponent"] }
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

var routingComponents = [_homepage_homepage_component__WEBPACK_IMPORTED_MODULE_3__["HomepageComponent"], _buy_page_buy_page_component__WEBPACK_IMPORTED_MODULE_4__["BuyPageComponent"], _send_page_send_page_component__WEBPACK_IMPORTED_MODULE_5__["SendPageComponent"], _spend_page_pay_for_dental_services_spend_page_pay_for_dental_services_component__WEBPACK_IMPORTED_MODULE_6__["SpendPagePayForDentalServicesComponent"], _spend_page_exchanges_spend_page_exchanges_component__WEBPACK_IMPORTED_MODULE_7__["SpendPageExchangesComponent"], _spend_page_pay_assurance_fees_spend_page_pay_assurance_fees_component__WEBPACK_IMPORTED_MODULE_8__["SpendPagePayAssuranceFeesComponent"], _not_found_page_not_found_page_component__WEBPACK_IMPORTED_MODULE_9__["NotFoundPageComponent"]];


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
        this.network = _environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].network;
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





var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["routingComponents"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"].withServerTransition({ appId: 'serverApp' }),
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



/*declare function getBuyPageData(): any;*/
var BuyPageComponent = /** @class */ (function () {
    function BuyPageComponent(meta, titleService) {
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Buy Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({ name: 'description', content: 'Dentacoin Wallet App allows users to easily and securely buy Dentacoin (DCN) with USD, Ether (ETH), Bitcoin (BTC) and 100+ other cryptocurrencies.' });
        this.meta.updateTag({ name: 'keywords', content: 'buy dentacoin, how to buy dentacoin, buy dentacoin with usd' });
        this.meta.updateTag({ property: 'og:title', content: 'Buy Dentacoin (DCN) via Dentacoin Wallet App' });
        this.meta.updateTag({ property: 'og:description', content: 'Dentacoin Wallet App allows users to easily and securely buy Dentacoin (DCN) with USD, Ether (ETH), Bitcoin (BTC) and 100+ other cryptocurrencies.' });
        this.meta.updateTag({ property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/buy-dentacoin-wallet-app.png' });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    BuyPageComponent.prototype.ngAfterViewInit = function () {
        //getBuyPageData();
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



/*declare function getHomepageData(): any;*/
var HomepageComponent = /** @class */ (function () {
    function HomepageComponent(meta, titleService) {
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens');
        this.meta.updateTag({ name: 'description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.' });
        this.meta.updateTag({ name: 'keywords', content: 'buy dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin' });
        this.meta.updateTag({ property: 'og:title', content: 'Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens' });
        this.meta.updateTag({ property: 'og:description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.' });
        this.meta.updateTag({ property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-wallet-dapp.png' });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    HomepageComponent.prototype.ngAfterViewInit = function () {
        /*getHomepageData();*/
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

/***/ "./src/app/not-found-page/not-found-page.component.ts":
/*!************************************************************!*\
  !*** ./src/app/not-found-page/not-found-page.component.ts ***!
  \************************************************************/
/*! exports provided: NotFoundPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundPageComponent", function() { return NotFoundPageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var NotFoundPageComponent = /** @class */ (function () {
    function NotFoundPageComponent() {
    }
    NotFoundPageComponent.prototype.ngOnInit = function () {
    };
    NotFoundPageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-not-found-page',
            template: __webpack_require__(/*! raw-loader!./not-found-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/not-found-page/not-found-page.component.html")
        })
    ], NotFoundPageComponent);
    return NotFoundPageComponent;
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



/*declare function getSendPageData(): any;*/
var SendPageComponent = /** @class */ (function () {
    function SendPageComponent(meta, titleService) {
        this.meta = meta;
        this.titleService = titleService;
        this.titleService.setTitle('Send Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({ name: 'description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!' });
        this.meta.updateTag({ name: 'keywords', content: 'send dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin' });
        this.meta.updateTag({ property: 'og:title', content: 'Send Dentacoin (DCN) via Dentacoin Wallet App' });
        this.meta.updateTag({ property: 'og:description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!' });
        this.meta.updateTag({ property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/send-dentacoin-wallet-app.png' });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    SendPageComponent.prototype.ngAfterViewInit = function () {
        //getSendPageData();
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
/* harmony import */ var _services_redirects_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services/redirects.service */ "./src/app/_services/redirects.service.ts");





/*declare function getSpendPageExchanges(): any;*/
var SpendPageExchangesComponent = /** @class */ (function () {
    function SpendPageExchangesComponent(router, meta, titleService, redirectsService) {
        this.router = router;
        this.meta = meta;
        this.titleService = titleService;
        this.redirectsService = redirectsService;
        this.titleService.setTitle('Dentacoin (DCN) trading exchanges list | Dentacoin Wallet DApp');
        this.meta.updateTag({ name: 'description', content: 'Find the full list of trusted exchange platforms which support Dentacoin (DCN) cryptocurrency.' });
        this.meta.updateTag({ name: 'keywords', content: 'dentacoin exchanges, trade dentacoin, dcn currency, dcn crypto' });
        this.meta.updateTag({ property: 'og:title', content: 'Dentacoin (DCN) trading exchanges list' });
        this.meta.updateTag({ property: 'og:description', content: 'Find the full list of trusted exchange platforms which support Dentacoin (DCN) cryptocurrency.' });
        this.meta.updateTag({ property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-exchanges-list.png' });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    SpendPageExchangesComponent.prototype.ngAfterViewInit = function () {
    };
    SpendPageExchangesComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"] },
        { type: _services_redirects_service__WEBPACK_IMPORTED_MODULE_4__["RedirectsService"] }
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
/* harmony import */ var _services_redirects_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services/redirects.service */ "./src/app/_services/redirects.service.ts");





/*declare function initdApp(): any;*/
var SpendPagePayAssuranceFeesComponent = /** @class */ (function () {
    function SpendPagePayAssuranceFeesComponent(router, meta, titleService, redirectsService) {
        this.router = router;
        this.meta = meta;
        this.titleService = titleService;
        this.redirectsService = redirectsService;
        this.titleService.setTitle('Pay Dentacoin Assurance fees | Dentacoin Wallet DApp');
        this.meta.updateTag({ name: 'description', content: 'Pay your Dentacoin Assurance monthly premium easily and securely and enjoy the benefits of a prevention-focused dental plan.' });
        this.meta.updateTag({ name: 'keywords', content: 'dental plan payment, dental insurance, dentacoin assurance fee' });
        this.meta.updateTag({ property: 'og:title', content: 'Pay Dentacoin Assurance fees' });
        this.meta.updateTag({ property: 'og:description', content: 'Pay your Dentacoin Assurance monthly premium easily and securely and enjoy the benefits of a prevention-focused dental plan.' });
        this.meta.updateTag({ property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/pay-dental-assurance-dentacoin.png' });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    SpendPagePayAssuranceFeesComponent.prototype.ngAfterViewInit = function () {
    };
    SpendPagePayAssuranceFeesComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"] },
        { type: _services_redirects_service__WEBPACK_IMPORTED_MODULE_4__["RedirectsService"] }
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
/* harmony import */ var _services_redirects_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services/redirects.service */ "./src/app/_services/redirects.service.ts");





/*declare function initdApp(): any;*/
var SpendPagePayForDentalServicesComponent = /** @class */ (function () {
    function SpendPagePayForDentalServicesComponent(router, meta, titleService, redirectsService) {
        this.router = router;
        this.meta = meta;
        this.titleService = titleService;
        this.redirectsService = redirectsService;
        this.titleService.setTitle('Pay for dental services in Dentacoin | Dentacoin Wallet DApp');
        this.meta.updateTag({ name: 'description', content: 'Cover your dental treatment in Dentacoin tokens at all partner dentists, accepting DCN. Pay directly with ease via Dentacoin Wallet DApp.' });
        this.meta.updateTag({ name: 'keywords', content: 'dentacoin accepted, dental currency, dental payment, spend dentacoin, pay with dentacoin' });
        this.meta.updateTag({ property: 'og:title', content: 'Pay for dental services with Dentacoin' });
        this.meta.updateTag({ property: 'og:description', content: 'Cover your dental treatment in Dentacoin tokens at all partner dentists and clinics, accepting DCN. Handle payments with ease via Dentacoin Wallet DApp.' });
        this.meta.updateTag({ property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentist-pay-with-dentacoin.png' });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    SpendPagePayForDentalServicesComponent.prototype.ngAfterViewInit = function () {
    };
    SpendPagePayForDentalServicesComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Meta"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"] },
        { type: _services_redirects_service__WEBPACK_IMPORTED_MODULE_4__["RedirectsService"] }
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
    hybrid: true,
    network: 'mainnet'
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
document.addEventListener('DOMContentLoaded', function () {
    Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
        .catch(function (err) { return console.error(err); });
});


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