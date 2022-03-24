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

module.exports = "<header>\n    <div class=\"container\">\n        <div class=\"row fs-0 logo-and-settings-row\">\n            <div class=\"col-xs-6 inline-block\">\n                <figure itemscope=\"\" itemtype=\"http://schema.org/Organization\" class=\"logo\">\n                    <a [routerLink]=\"translate.currentLang\" itemprop=\"url\">\n                        <img src=\"assets/images/logo.svg\" itemprop=\"logo\" alt=\"Dentacoin logo\"/>\n                    </a>\n                </figure>\n            </div>\n            <div class=\"col-xs-6 inline-block open-settings-col\"><figure itemscope=\"\" itemtype=\"http://schema.org/Organization\" class=\"text-right\"><a href=\"javascript:void(0)\" itemprop=\"url\" class=\"open-wallet-menu\"><ul><li></li><li></li><li></li></ul></a></figure></div>\n        </div>\n    </div>\n    <div class=\"nav-row\">\n        <nav class=\"container\">\n            <ul itemtype=\"http://schema.org/SiteNavigationElement\" class=\"row fs-0\">\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button home\" [routerLink]=\"translate.currentLang\" itemprop=\"url\"><span itemprop=\"name\">{{'menu-wallet' | translate}}</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button buy\" [routerLink]=\"translate.currentLang + '/buy'\" itemprop=\"url\"><span itemprop=\"name\">{{'menu-buy' | translate}}</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button send\" [routerLink]=\"translate.currentLang + '/send'\" itemprop=\"url\"><span itemprop=\"name\">{{'menu-send' | translate}}</span></a>\n                </li>\n                <li class=\"col-xs-3 inline-block\">\n                    <a class=\"nav-link nav-button swap\" [routerLink]=\"translate.currentLang + '/swap'\" itemprop=\"url\"><span itemprop=\"name\">{{'menu-swap' | translate}}</span></a>\n                </li>\n            </ul>\n        </nav>\n    </div>\n    <div class=\"camping-currently-offline\"></div>\n</header>\n<main id=\"main-container\" class=\"padding-bottom-xs-130\" [attr.data-lang]=\"translate.currentLang\" [attr.network]=\"network == 'mainnet' ? 'mainnet' : 'rinkeby'\">\n    <div class=\"container padding-top-100 padding-top-xs-10 padding-bottom-100\">\n        <div class=\"row\">\n            <div class=\"col-xs-12 main-holder\">\n                <router-outlet></router-outlet>\n            </div>\n        </div>\n    </div>\n    <div class=\"transaction-and-withdraw-history-btns\"></div>\n    <div class=\"camping-transaction-history\"></div>\n    <div class=\"ios-camper\"></div>\n    <div class=\"camping-withdraw-history hide\">{{'withdraw-history' | translate}}</div>\n</main>\n<footer>\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-xs-8 col-xs-offset-2 white-border\"></div>\n        </div>\n        <div class=\"row padding-bottom-xs-50\">\n            <ul class=\"col-12 no-gutter-xs\" itemtype=\"http://schema.org/SiteNavigationElement\">\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentacoin.com/how-to-create-wallet\" class=\"data-external-link\" target=\"_blank\"\n                       itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                            <img src=\"assets/images/faq.svg\" alt=\"FAQ icon\" itemprop=\"contentUrl\"/>\n                        </figure>\n                        <span itemprop=\"name\">{{'menu-faq' | translate}}</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentacoin.com/privacy-policy\" class=\"data-external-link\" target=\"_blank\"\n                       itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                            <img src=\"assets/images/privacy-policy.svg\" alt=\"Privacy policy icon\" itemprop=\"contentUrl\"/>\n                        </figure>\n                        <span itemprop=\"name\">{{'menu-privacy-policy' | translate}}</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentavox.dentacoin.com/\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                            <img src=\"assets/images/dentavox.svg\" alt=\"DentaVox logo\" itemprop=\"contentUrl\"/>\n                        </figure>\n                        <span itemprop=\"name\">DentaVox</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://reviews.dentacoin.com/\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                            <img src=\"assets/images/trusted-reviews.svg\" alt=\"Trusted Reviews logo\" itemprop=\"contentUrl\"/>\n                        </figure>\n                        <span itemprop=\"name\">Trusted Reviews</span>\n                    </a>\n                </li>\n                <li class=\"inline-block-top\">\n                    <a href=\"https://dentacare.dentacoin.com/\" class=\"data-external-link\" target=\"_blank\"\n                       itemprop=\"url\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                            <img src=\"assets/images/dentacare.svg\" alt=\"Dentacare logo\" itemprop=\"contentUrl\"/>\n                        </figure>\n                        <span itemprop=\"name\">Dentacare</span>\n                    </a>\n                </li>\n            </ul>\n        </div>\n        <div class=\"row copyright\">\n            <div class=\"col-12 text-center\">\n                {{'dcn-foundation' | translate}}\n                <div><a href=\"https://dentacoin.com/assets/uploads/dentacoin-foundation.pdf\" class=\"data-external-link\" target=\"_blank\">{{'verify-dcn' | translate}}</a></div>\n            </div>\n        </div>\n    </div>\n</footer>\n<div class=\"camp-for-fixed-mobile-nav\">\n    <nav>\n        <ul itemtype=\"http://schema.org/SiteNavigationElement\" class=\"fs-0\">\n            <li class=\"inline-block-bottom\">\n                <a [routerLink]=\"translate.currentLang\" class=\"home\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Wallet icon\" class=\"on-not-active\" itemprop=\"contentUrl\" src=\"assets/images/wallet-icon.svg\"/>\n                        <img alt=\"Wallet icon\" class=\"on-active\" itemprop=\"contentUrl\" src=\"assets/images/wallet-blue-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">{{'menu-wallet' | translate}}</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a [routerLink]=\"translate.currentLang + '/buy'\" class=\"buy\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Buy icon\" class=\"on-not-active\" itemprop=\"contentUrl\" src=\"assets/images/buy-icon.svg\"/>\n                        <img alt=\"Buy icon\" class=\"on-active\" itemprop=\"contentUrl\" src=\"assets/images/buy-blue-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">{{'menu-buy' | translate}}</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a [routerLink]=\"translate.currentLang + '/send'\" class=\"send\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Send icon\" class=\"on-not-active\" itemprop=\"contentUrl\" src=\"assets/images/send-icon.svg\"/>\n                        <img alt=\"Send icon\" class=\"on-active\" itemprop=\"contentUrl\" src=\"assets/images/send-blue-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">{{'menu-send' | translate}}</span>\n                </a>\n            </li>\n            <li class=\"inline-block-bottom\">\n                <a [routerLink]=\"translate.currentLang + '/swap'\" class=\"swap\" itemprop=\"url\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Swap icon\" class=\"on-not-active\" itemprop=\"contentUrl\" src=\"assets/images/swap-icon.svg\"/>\n                        <img alt=\"Swap icon\" class=\"on-active\" itemprop=\"contentUrl\" src=\"assets/images/swap-blue-icon.svg\"/>\n                    </figure>\n                    <span itemprop=\"name\">{{'menu-swap' | translate}}</span>\n                </a>\n            </li>\n        </ul>\n    </nav>\n</div>\n<div class=\"camp-for-custom-popover hide\">\n    <div class=\"arrow\"></div>\n    {{'eth-currency' | translate}} <a (click)=\"redirectsService.toBuyPage()\" class=\"lato-bold color-light-blue\">{{'card-buy' | translate}}</a>.\n</div>\n<div class=\"account-checker-container hide\">\n    <div class=\"account-checker-wrapper\">\n        <div class=\"custom-auth-popup\">\n            <div class=\"popup-header padding-bottom-10 text-center\">\n                <div class=\"above-header\">\n                    <div class=\"inline-block on-option-selected custom-hide text-left\">\n                        <a href=\"javascript:void(0);\" class=\"lato-bold fs-18 color-light-blue go-back-to-main-menu\"><\n                            {{'back' | translate}}</a>\n                    </div>\n                    <div class=\"inline-block text-center nav-steps first-step custom-hide\">\n                        <div class=\"inline-block first\"></div>\n                        <div class=\"inline-block second\"></div>\n                        <div class=\"inline-block third\"></div>\n                    </div>\n                    <div class=\"inline-block text-right lang-container\">\n                        <select (change)=\"this.languageService.onLangSwitcherChange($event.target.value)\" class=\"fix-selects-for-ios lang-switcher blue-color padding-right-20\">\n                            <option value=\"en\" *ngIf=\"(translate.currentLang === 'en')\" selected>EN</option>\n                            <option value=\"de\" *ngIf=\"(translate.currentLang === 'en')\">DE</option>\n                            <option value=\"en\" *ngIf=\"(translate.currentLang === 'de')\">EN</option>\n                            <option value=\"de\" *ngIf=\"(translate.currentLang === 'de')\" selected>DE</option>\n                        </select>\n                    </div>\n                </div>\n                <div class=\"on-page-load\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-top-20\">\n                        <img src=\"assets/images/wallet-loading.png\" class=\"max-width-80 width-100\" alt=\"Dentacoin wallet logo\" itemprop=\"contentUrl\">\n                    </figure>\n                    <div class=\"text-center color-black padding-top-15 padding-bottom-10\">\n                        <div class=\"calibri-bold color-black fs-30 line-height-34 padding-bottom-10\" [innerHTML]=\"'welcome-to-wallet' | translate\"></div>\n                        <div class=\"lato-bold fs-18 fs-xs-16 padding-bottom-15\">{{'the-easy-way' | translate}}</div>\n                    </div>\n                    <div class=\"navigation-link fs-0 padding-bottom-50 padding-top-xs-15\">\n                        <div class=\"inline-block-top padding-right-10 padding-right-xs-0 text-right text-center-xs nav-btn-container padding-bottom-xs-15\">\n                            <a href=\"javascript:void(0)\" data-slug=\"first\" class=\"inline-block text-left\">\n                                <img src=\"assets/images/create-wallet-icon.svg\"\n                                     class=\"max-width-50 width-100 inline-block\" alt=\"Create icon\">\n                                <div class=\"inline-block padding-left-15 fs-18\">\n                                    <div class=\"lato-bold\">{{'create-btn-text' | translate}}</div>\n                                    {{'new-wallet' | translate}}\n                                </div>\n                            </a>\n                        </div>\n                        <div class=\"inline-block-top padding-left-10 padding-left-xs-0 text-left text-center-xs nav-btn-container\">\n                            <a href=\"javascript:void(0)\" data-slug=\"second\" class=\"inline-block text-left\">\n                                <img src=\"assets/images/import-wallet.svg\" class=\"max-width-50 width-100 inline-block\"\n                                     alt=\"Import icon\">\n                                <div class=\"inline-block padding-left-15 fs-18\">\n                                    <div class=\"lato-bold\">{{'import-btn-text' | translate}}</div>\n                                    {{'existing-wallet' | translate}}\n                                </div>\n                            </a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"html-content\">\n                <div class=\"left-right-side-holder fs-0\">\n                    <div class=\"popup-left inline-block-top\" data-step=\"first\">\n                        <div class=\"popup-body first hide\">\n                            <div class=\"popup-element first text-center\">\n                                <div class=\"padding-top-20 padding-top-xs-10 padding-bottom-30 fs-xs-14 fs-16 lato-bold\">\n                                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-bottom-15\">\n                                        <img src=\"assets/images/create-wallet-icon-step-1.png\" alt=\"Step one\" class=\"width-100 max-width-160 max-width-xs-130\" itemprop=\"contentUrl\"/>\n                                    </figure>\n                                    <div class=\"fs-24 line-height-28 color-light-blue\" [innerHTML]=\"'future-funds' | translate\"></div>\n                                    <div [innerHTML]=\"'lets-store' | translate\"></div>\n                                </div>\n                                <div class=\"field-parent margin-bottom-15 max-width-300 margin-left-right-auto text-left\">\n                                    <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\"><label for=\"keystore-file-pass\">{{'enter-pass-label' | translate}}</label><input type=\"password\" maxlength=\"30\" id=\"keystore-file-pass\" class=\"full-rounded keystore-file-pass required-field\"/>\n                                    </div>\n                                </div>\n                                <div class=\"field-parent max-width-300 margin-left-right-auto text-left\">\n                                    <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\"><label for=\"second-pass\">{{'repeat-pass-label' | translate}}</label><input type=\"password\" maxlength=\"30\" id=\"second-pass\" class=\"full-rounded second-pass required-field\"/>\n                                    </div>\n                                </div>\n                                <div class=\"fs-14 color-warning-red padding-top-15\"><img src=\"assets/images/red-icon-note.svg\" class=\"width-100 max-width-20\" alt=\"Warning icon\"/> {{'you-will-need' | translate}}</div>\n                                <div class=\"btn-container padding-top-20 padding-bottom-15\">\n                                    <a href=\"javascript:void(0)\" class=\"white-light-blue-btn nowrap no-hover light-blue-border download-login-file min-width-180\"><img src=\"assets/images/download-icon.svg\" class=\"width-100 max-width-30\" alt=\"Download icon\"/> <span class=\"btn-text\"></span></a>\n                                    <div class=\"text-center fs-18 hidden-checkbox hide\">\n                                        <input type=\"checkbox\" id=\"keystore-downloaded-verifier\">\n                                        <label for=\"keystore-downloaded-verifier\" class=\"padding-left-5 lato-bold blinking-animation\">{{'i-verify' | translate}}</label>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"popup-element second hide text-center\">\n                                <div class=\"padding-top-20 padding-top-xs-10 padding-bottom-30 padding-bottom-xs-15 fs-xs-14 fs-16 lato-bold\">\n                                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"text-center padding-bottom-15\">\n                                        <img src=\"assets/images/create-wallet-icon-step-2.png\" alt=\"Step two\" class=\"width-100 max-width-160 max-width-xs-130\" itemprop=\"contentUrl\"/>\n                                    </figure>\n                                    <div class=\"fs-24 color-light-blue\">{{'additional-security' | translate}}</div>\n                                    <div [innerHTML]=\"'print-pk-desc' | translate\"></div>\n                                </div>\n                                <div class=\"btn-container padding-top-15 padding-bottom-15\">\n                                    <a href=\"javascript:void(0)\" class=\"white-light-blue-btn nowrap no-hover light-blue-border print-pk min-width-180\"><img src=\"assets/images/print-icon.svg\" class=\"width-100 max-width-30\" alt=\"Print icon\"/> {{'print-pk' | translate}}</a>\n                                    <div class=\"padding-top-5 fs-14 color-light-blue text-center\">{{'use-a4' | translate}}</div>\n                                </div>\n                                <div class=\"padding-bottom-xs-50\">\n                                    <a href=\"javascript:void(0);\" class=\"remind-me-later text-decoration-underline\">{{'remind-me-later' | translate}}</a>\n                                </div>\n                            </div>\n                            <div class=\"popup-element third hide text-center\">\n                                <div class=\"padding-top-20 padding-top-xs-10 padding-bottom-30 padding-bottom-xs-15 fs-xs-14 fs-16 lato-bold\">\n                                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"text-center padding-bottom-15\">\n                                        <img src=\"assets/images/create-wallet-icon-step-3.png\" alt=\"Step three\" class=\"width-100 max-width-160 max-width-xs-130\" itemprop=\"contentUrl\"/>\n                                    </figure>\n                                    <div class=\"fs-24 color-light-blue\">{{'well-done' | translate}}</div>\n                                    {{'rdy-wallet' | translate}}\n                                </div>\n                                <div class=\"btn-container padding-top-15 padding-bottom-70\">\n                                    <a href=\"javascript:void(0)\" class=\"white-light-blue-btn nowrap no-hover light-blue-border login-into-wallet min-width-180\">{{'start-now' | translate}}</a>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"popup-right inline-block-top\">\n                        <div class=\"popup-body second hide\">\n                            <div class=\"padding-top-20 padding-bottom-30 fs-0 row-with-image-and-text text-center max-width-xs-400\">\n                                <img src=\"assets/images/key-holder.png\" alt=\"Key holder\" class=\"max-width-80 margin-0-auto width-100 display-block inline-block-xs\"/>\n                                <div class=\"inline-block padding-left-10 fs-16 fs-xs-14 text\">\n                                    <div class=\"lato-black padding-top-10 fs-20 fs-xs-18\">{{'welcome-back' | translate}}</div>\n                                    {{'to-import' | translate}}\n                                </div>\n                            </div>\n                            <div class=\"text-center import-keystore-file-row\">\n                                <label class=\"button custom-upload-button\" *ngIf=\"(hybrid == true)\">\n                                    <a>\n                                        <span class=\"custom-button fs-0\">\n                                            <img src=\"assets/images/import-backup-file-icon.svg\" alt=\"Upload file icon\"/>\n                                            <span class=\"inline-block text-left padding-left-10 btn-text fs-16\" [innerHTML]=\"'upload-backup-file-splitted' | translate\"></span>\n                                        </span>\n                                        <img src=\"assets/images/loader-circle.png\" alt=\"Loader\" class=\"load width-100 max-width-30\"/>\n                                        <img src=\"assets/images/check.png\" alt=\"Check\" class=\"check width-100 max-width-30\"/>\n                                    </a>\n                                    <div><span></span></div>\n                                </label>\n                                <input type=\"file\" id=\"upload-keystore\" class=\"hide-input upload-keystore\" *ngIf=\"(hybrid == false)\"/>\n                                <label for=\"upload-keystore\" class=\"button custom-upload-button\" *ngIf=\"(hybrid == false)\">\n                                    <a>\n                                        <span class=\"custom-button fs-0\">\n                                            <img src=\"assets/images/import-backup-file-icon.svg\" alt=\"Upload file icon\"/>\n                                            <span class=\"inline-block text-left padding-left-10 btn-text fs-16\" [innerHTML]=\"'upload-backup-file-splitted' | translate\"></span>\n                                        </span>\n                                        <img src=\"assets/images/loader-circle.png\" alt=\"Loader\" class=\"load width-100 max-width-30\"/>\n                                        <img src=\"assets/images/check.png\" alt=\"Check\" class=\"check width-100 max-width-30\"/>\n                                    </a>\n                                    <div><span></span></div>\n                                </label>\n                            </div>\n                            <div class=\"camping-for-action\"></div>\n                            <div class=\"padding-top-10 text-center fs-14 lato-bold or-label\">{{'OR-label' | translate}}</div>\n                            <div class=\"padding-top-10 text-center import-private-key-row\">\n                                <a href=\"javascript:void(0);\" class=\"import-private-key light-blue-white-btn fs-16 fs-xs-14\">{{'import-key' | translate}}</a>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"auth-popup-faq-link padding-top-20 text-center\"><a href=\"https://dentacoin.com/how-to-create-wallet\" target=\"_blank\" class=\"data-external-link\">?</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<nav class=\"sidenav\">\n    <div class=\"wrapper\">\n        <a href=\"javascript:void(0)\" class=\"close-btn\">×</a>\n        <ul itemscope=\"\" itemtype=\"http://schema.org/SiteNavigationElement\" class=\"padding-top-50\">\n            <li>\n                <a class=\"open-settings\" href=\"javascript:void(0);\" itemprop=\"url\"><img src=\"assets/images/settings-icon.svg\" alt=\"Settings icon\" class=\"width-100 inline-block\" itemprop=\"contentUrl\"/><span itemprop=\"name\">{{'settings-menu' | translate}}</span></a>\n            </li>\n            <li>\n                <a [routerLink]=\"translate.currentLang + '/spend-pay-for-dental-services'\" itemprop=\"url\"><img src=\"assets/images/pay-icon.svg\" alt=\"Pay icon\" class=\"width-100 inline-block\" itemprop=\"contentUrl\"/><span itemprop=\"name\">{{'where-to-pay' | translate}}</span></a>\n            </li>\n            <li>\n                <a [routerLink]=\"translate.currentLang + '/spend-exchanges'\" itemprop=\"url\"><img src=\"assets/images/trade-icon.svg\" alt=\"Trade icon\" class=\"width-100 inline-block\" itemprop=\"contentUrl\"/><span itemprop=\"name\">{{'where-to-trade' | translate}}</span></a>\n            </li>\n            <li>\n                <a [routerLink]=\"translate.currentLang + '/spend-pay-assurance-fees'\" itemprop=\"url\"><img src=\"assets/images/assurance-icon.svg\" alt=\"Assurance icon\" class=\"width-100 inline-block\" itemprop=\"contentUrl\"/><span itemprop=\"name\">Dentacoin Assurance</span></a>\n            </li>\n        </ul>\n        <ul itemscope=\"\" itemtype=\"http://schema.org/SiteNavigationElement\">\n            <li>\n                <a href=\"mailto:admin@dentacoin.com\" itemprop=\"url\"><span itemprop=\"name\">{{'contact-us' | translate}}</span></a>\n            </li>\n            <li>\n                <a href=\"https://dentacoin.com/how-to-create-wallet\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\"><span itemprop=\"name\"><span itemprop=\"name\">{{'menu-faq' | translate}}</span></span></a>\n            </li>\n            <li>\n                <a href=\"https://dentacoin.com/privacy-policy\" class=\"data-external-link\" target=\"_blank\" itemprop=\"url\"><span itemprop=\"name\"><span itemprop=\"name\">{{'menu-privacy-policy' | translate}}</span></span></a>\n            </li>\n        </ul>\n        <div class=\"padding-top-150 padding-bottom-15 fs-0 border-bottom\">\n            <div class=\"inline-block width-50\">\n                <a href=\"javascript:void(0)\" class=\"log-out fs-22 color-white\">\n                    <img src=\"assets/images/power.svg\" alt=\"Power button icon\" class=\"width-100 max-width-20 margin-right-10\"/><span class=\"inline-block\">{{'log-out' | translate}}</span></a>\n            </div>\n            <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"inline-block width-50 text-right\">\n                <img src=\"assets/images/one-line-logo-white.svg\" alt=\"Dentacoin one line logo\" class=\"width-100 max-width-110\" itemprop=\"contentUrl\"/>\n            </figure>\n        </div>\n        <div class=\"fs-14 padding-top-10 padding-bottom-20\">{{'dont-forget' | translate}}</div>\n    </div>\n</nav>\n\n<div class=\"settings-popup hide\">\n    <div class=\"settings-popup-wrapper\">\n        <div class=\"settings-popup-inner-wrapper\">\n            <div class=\"text-center fs-0 color-white lato-bold popup-header\">\n                <a href=\"javascript:void(0)\" class=\"custom-close-settings-popup inline-block margin-right-5\">\n                    <img src=\"assets/images/left-arrow.svg\" alt=\"Left arrow\" class=\"check width-100 max-width-20\"/>\n                </a>\n                <span class=\"inline-block text-center fs-28 fs-xs-15\">{{'wallet-settings' | translate}}</span>\n                <div class=\"inline-block text-right lang-container margin-left-5 padding-left-10\">\n                    <select (change)=\"this.languageService.onLangSwitcherChange($event.target.value)\" class=\"fix-selects-for-ios lang-switcher white-color padding-right-20 fs-xs-18\">\n                        <option value=\"en\" *ngIf=\"(translate.currentLang === 'en')\" selected>EN</option>\n                        <option value=\"de\" *ngIf=\"(translate.currentLang === 'en')\">DE</option>\n                        <option value=\"en\" *ngIf=\"(translate.currentLang === 'de')\">EN</option>\n                        <option value=\"de\" *ngIf=\"(translate.currentLang === 'de')\" selected>DE</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"popup-body\"></div>\n        </div>\n    </div>\n</div>\n\n<div class=\"translates-holder hide\" [attr.confidential]=\"this.translate.instant('confidential')\" [attr.unlock-funds]=\"this.translate.instant('unlock-funds')\" [attr.pk-label]=\"this.translate.instant('pk-label')\" [attr.pk-as-qr]=\"this.translate.instant('pk-as-qr')\" [attr.important]=\"this.translate.instant('important')\" [attr.provides]=\"this.translate.instant('provides')\" [attr.secure-place]=\"this.translate.instant('secure-place')\" [attr.never-share]=\"this.translate.instant('never-share')\" [attr.to-unlock]=\"this.translate.instant('to-unlock')\" [attr.print-pk-text]=\"this.translate.instant('print-pk-text')\" [attr.forget-file-succ]=\"this.translate.instant('forget-file-succ')\" [attr.priv-key]=\"this.translate.instant('priv-key')\" [attr.remembering-file]=\"this.translate.instant('remembering-file')\" [attr.no-balance]=\"this.translate.instant('no-balance')\" [attr.menu-wallet]=\"this.translate.instant('menu-wallet')\" [attr.menu-buy]=\"this.translate.instant('menu-buy')\" [attr.menu-send]=\"this.translate.instant('menu-send')\" [attr.menu-spend]=\"this.translate.instant('menu-spend')\" [attr.menu-faq]=\"this.translate.instant('menu-faq')\" [attr.menu-privacy-policy]=\"this.translate.instant('menu-privacy-policy')\" [attr.dcn-foundation]=\"this.translate.instant('dcn-foundation')\" [attr.verify-dcn]=\"this.translate.instant('verify-dcn')\" [attr.eth-currency]=\"this.translate.instant('eth-currency')\" [attr.card-buy]=\"this.translate.instant('card-buy')\" [attr.pay-with]=\"this.translate.instant('pay-with')\" [attr.first-tx]=\"this.translate.instant('first-tx')\" [attr.daily-limit]=\"this.translate.instant('daily-limit')\" [attr.you-get]=\"this.translate.instant('you-get')\" [attr.determined]=\"this.translate.instant('determined')\" [attr.exchange-rate]=\"this.translate.instant('exchange-rate')\" [attr.address-to-receive]=\"this.translate.instant('address-to-receive')\" [attr.read-and-accept]=\"this.translate.instant('read-and-accept')\" [attr.powered]=\"this.translate.instant('powered')\" [attr.all-txs]=\"this.translate.instant('all-txs')\" [attr.buy-btn]=\"this.translate.instant('buy-btn')\" [attr.eth-for-fees]=\"this.translate.instant('eth-for-fees')\" [attr.your-dcn-address]=\"this.translate.instant('your-dcn-address')\" [attr.enter-or-scan]=\"this.translate.instant('enter-or-scan')\" [attr.clinics-dentists]=\"this.translate.instant('clinics-dentists')\" [attr.address-book]=\"this.translate.instant('address-book')\" [attr.add-to]=\"this.translate.instant('add-to')\" [attr.empty-book]=\"this.translate.instant('empty-book')\" [attr.for-payments]=\"this.translate.instant('for-payments')\" [attr.for-partner-payments]=\"this.translate.instant('for-partner-payments')\" [attr.next]=\"this.translate.instant('next')\" [attr.send-to]=\"this.translate.instant('send-to')\" [attr.send-amount]=\"this.translate.instant('send-amount')\" [attr.enter-amount]=\"this.translate.instant('enter-amount')\" [attr.equal-to]=\"this.translate.instant('equal-to')\" [attr.the-exchange]=\"this.translate.instant('the-exchange')\" [attr.i-verified]=\"this.translate.instant('i-verified')\" [attr.send-btn]=\"this.translate.instant('send-btn')\" [attr.spend-menu-pay-dental]=\"this.translate.instant('spend-menu-pay-dental')\" [attr.spend-menu-assurance]=\"this.translate.instant('spend-menu-assurance')\" [attr.spend-menu-trade]=\"this.translate.instant('spend-menu-trade')\" [attr.dcn-listed]=\"this.translate.instant('dcn-listed')\" [attr.deposit-btn]=\"this.translate.instant('deposit-btn')\" [attr.dcn-assurance]=\"this.translate.instant('dcn-assurance')\" [attr.go-to-dcn-assurance]=\"this.translate.instant('go-to-dcn-assurance')\" [attr.can-use]=\"this.translate.instant('can-use')\" [attr.make-a-payment]=\"this.translate.instant('make-a-payment')\" [attr.data-offline]=\"this.translate.instant('data-offline')\" [attr.metamask-sign-in]=\"this.translate.instant('metamask-sign-in')\" [attr.metamask-browser]=\"this.translate.instant('metamask-browser')\" [attr.proceed]=\"this.translate.instant('proceed')\" [attr.tx-history]=\"this.translate.instant('tx-history')\" [attr.show-more]=\"this.translate.instant('show-more')\" [attr.no-tx]=\"this.translate.instant('no-tx')\" [attr.dcn-address]=\"this.translate.instant('dcn-address')\" [attr.smth-wrong]=\"this.translate.instant('smth-wrong')\" [attr.min-tx-limit]=\"this.translate.instant('min-tx-limit')\" [attr.select-token]=\"this.translate.instant('select-token')\" [attr.max-tx-limit]=\"this.translate.instant('max-tx-limit')\" [attr.valid-wallet]=\"this.translate.instant('valid-wallet')\" [attr.valid-email]=\"this.translate.instant('valid-email')\" [attr.agree-policy]=\"this.translate.instant('agree-policy')\" [attr.address-clinic-name]=\"this.translate.instant('address-clinic-name')\" [attr.wallet-address]=\"this.translate.instant('wallet-address')\" [attr.save-address-book]=\"this.translate.instant('save-address-book')\" [attr.name-field]=\"this.translate.instant('name-field')\" [attr.wallet-address-field]=\"this.translate.instant('wallet-address-field')\" [attr.save]=\"this.translate.instant('save')\" [attr.scanning-failed]=\"this.translate.instant('scanning-failed')\" [attr.name-error]=\"this.translate.instant('name-error')\" [attr.wallet-error]=\"this.translate.instant('wallet-error')\" [attr.address-book-response]=\"this.translate.instant('address-book-response')\" [attr.spendable-amount]=\"this.translate.instant('spendable-amount')\" [attr.max]=\"this.translate.instant('max')\" [attr.ly-numbers]=\"this.translate.instant('ly-numbers')\" [attr.greater-than-zero]=\"this.translate.instant('greater-than-zero')\" [attr.greater-dcn-value]=\"this.translate.instant('greater-dcn-value')\" [attr.min-eth-for-tx]=\"this.translate.instant('min-eth-for-tx')\" [attr.min-eth-for-dcn-tx]=\"this.translate.instant('min-eth-for-dcn-tx')\" [attr.higher-than-balance]=\"this.translate.instant('higher-than-balance')\" [attr.enter-valid-address]=\"this.translate.instant('enter-valid-address')\" [attr.checkbox]=\"this.translate.instant('checkbox')\" [attr.sending-conf]=\"this.translate.instant('sending-conf')\" [attr.to-label]=\"this.translate.instant('to-label')\" [attr.from-label]=\"this.translate.instant('from-label')\" [attr.nonce]=\"this.translate.instant('nonce')\" [attr.eth-fee]=\"this.translate.instant('eth-fee')\" [attr.password-label]=\"this.translate.instant('password-label')\" [attr.confirm]=\"this.translate.instant('confirm')\" [attr.not-enough-balance]=\"this.translate.instant('not-enough-balance')\" [attr.valid-password]=\"this.translate.instant('valid-password')\" [attr.hold-on]=\"this.translate.instant('hold-on')\" [attr.enter-priv-key]=\"this.translate.instant('enter-priv-key')\" [attr.pr]=\"this.translate.instant('pr')\" [attr.not-recommended]=\"this.translate.instant('not-recommended')\" [attr.your-priv-key]=\"this.translate.instant('your-priv-key')\" [attr.confirm-btn]=\"this.translate.instant('confirm-btn')\" [attr.enter-priv-key-error]=\"this.translate.instant('enter-priv-key-error')\" [attr.assurance-desc]=\"this.translate.instant('assurance-desc')\" [attr.scan-btn]=\"this.translate.instant('scan-btn')\" [attr.false-trying]=\"this.translate.instant('false-trying')\" [attr.activate-autopayments]=\"this.translate.instant('activate-autopayments')\" [attr.approve]=\"this.translate.instant('approve')\" [attr.withdraw]=\"this.translate.instant('withdraw')\" [attr.cancel]=\"this.translate.instant('cancel')\" [attr.key-related]=\"this.translate.instant('key-related')\" [attr.advanced-settings]=\"this.translate.instant('advanced-settings')\" [attr.gas-price]=\"this.translate.instant('gas-price')\" [attr.max-fee]=\"this.translate.instant('max-fee')\" [attr.reset]=\"this.translate.instant('reset')\" [attr.save-btn]=\"this.translate.instant('save-btn')\" [attr.low-gas]=\"this.translate.instant('low-gas')\" [attr.enter-gas]=\"this.translate.instant('enter-gas')\" [attr.cant-submit]=\"this.translate.instant('cant-submit')\" [attr.dcn-token]=\"this.translate.instant('dcn-token')\" [attr.user-dont-want]=\"this.translate.instant('user-dont-want')\" [attr.upload-backup]=\"this.translate.instant('upload-backup')\" [attr.recommended]=\"this.translate.instant('recommended')\" [attr.upload-failed]=\"this.translate.instant('upload-failed')\" [attr.remember-file]=\"this.translate.instant('remember-file')\" [attr.valid-backup]=\"this.translate.instant('valid-backup')\" [attr.backup-for-wallet]=\"this.translate.instant('backup-for-wallet')\" [attr.dcn-tokens]=\"this.translate.instant('dcn-tokens')\" [attr.ethers]=\"this.translate.instant('ethers')\" [attr.dcn-tx]=\"this.translate.instant('dcn-tx')\" [attr.dcn-sent]=\"this.translate.instant('dcn-sent')\" [attr.eth-tx]=\"this.translate.instant('eth-tx')\" [attr.sent-eth]=\"this.translate.instant('sent-eth')\" [attr.your]=\"this.translate.instant('your')\" [attr.the-way]=\"this.translate.instant('the-way')\" [attr.also-available]=\"this.translate.instant('also-available')\" [attr.export]=\"this.translate.instant('export')\" [attr.pass-label]=\"this.translate.instant('pass-label')\" [attr.export-btn]=\"this.translate.instant('export-btn')\" [attr.i-verify]=\"this.translate.instant('i-verify')\" [attr.hold-on-decrypt]=\"this.translate.instant('hold-on-decrypt')\" [attr.import-btn]=\"this.translate.instant('import-btn')\" [attr.create-btn]=\"this.translate.instant('create-btn')\" [attr.lets-create]=\"this.translate.instant('lets-create')\" [attr.set-secure]=\"this.translate.instant('set-secure')\" [attr.enter-pass-label]=\"this.translate.instant('enter-pass-label')\" [attr.repeat-pass-label]=\"this.translate.instant('repeat-pass-label')\" [attr.welcome-back]=\"this.translate.instant('welcome-back')\" [attr.to-import]=\"this.translate.instant('to-import')\" [attr.upload-backup-file]=\"this.translate.instant('upload-backup-file')\" [attr.OR-label]=\"this.translate.instant('OR-label')\" [attr.import-key]=\"this.translate.instant('import-key')\" [attr.CONTINUE-btn]=\"this.translate.instant('CONTINUE-btn')\" [attr.go-back]=\"this.translate.instant('go-back')\" [attr.keep-file-safe]=\"this.translate.instant('keep-file-safe')\" [attr.access-wallet-error]=\"this.translate.instant('access-wallet-error')\" [attr.access-wallet-error-two]=\"this.translate.instant('access-wallet-error-two')\" [attr.enter-pass]=\"this.translate.instant('enter-pass')\" [attr.min-pass-error]=\"this.translate.instant('min-pass-error')\" [attr.def-pass-error]=\"this.translate.instant('def-pass-error')\" [attr.few-mins]=\"this.translate.instant('few-mins')\" [attr.few-mins-two]=\"this.translate.instant('few-mins-two')\" [attr.opened-new-tab]=\"this.translate.instant('opened-new-tab')\" [attr.file]=\"this.translate.instant('file')\" [attr.has-been-stored]=\"this.translate.instant('has-been-stored')\" [attr.enter-pass-secret]=\"this.translate.instant('enter-pass-secret')\" [attr.wallet-settings]=\"this.translate.instant('wallet-settings')\" [attr.download]=\"this.translate.instant('download')\" [attr.download-two]=\"this.translate.instant('download-two')\" [attr.very-important]=\"this.translate.instant('very-important')\" [attr.backupfile]=\"this.translate.instant('backupfile')\" [attr.by-doing-so]=\"this.translate.instant('by-doing-so')\" [attr.upload-backup-file-label]=\"this.translate.instant('upload-backup-file-label')\" [attr.backup-pass]=\"this.translate.instant('backup-pass')\" [attr.enter-backup-pass]=\"this.translate.instant('enter-backup-pass')\" [attr.hold-on-caching]=\"this.translate.instant('hold-on-caching')\" [attr.your-backup]=\"this.translate.instant('your-backup')\" [attr.generate-backup]=\"this.translate.instant('generate-backup')\" [attr.easy-to-easy]=\"this.translate.instant('easy-to-easy')\" [attr.display-key]=\"this.translate.instant('display-key')\" [attr.upload-to-show]=\"this.translate.instant('upload-to-show')\" [attr.upload-to-show-second-option]=\"this.translate.instant('upload-to-show-second-option')\" [attr.forget-file]=\"this.translate.instant('forget-file')\" [attr.you-will-be-asked]=\"this.translate.instant('you-will-be-asked')\" [attr.are-you-sure]=\"this.translate.instant('are-you-sure')\" [attr.dont-forget]=\"this.translate.instant('dont-forget')\" [attr.having-diff]=\"this.translate.instant('having-diff')\" [attr.all-rights]=\"this.translate.instant('all-rights')\" [attr.log-out]=\"this.translate.instant('log-out')\" [attr.help-center]=\"this.translate.instant('help-center')\" [attr.downloading]=\"this.translate.instant('downloading')\" [attr.has-been-downloaded]=\"this.translate.instant('has-been-downloaded')\" [attr.are-you-downloaded]=\"this.translate.instant('are-you-downloaded')\" [attr.display-priv-key]=\"this.translate.instant('display-priv-key')\" [attr.hold-decrypt]=\"this.translate.instant('hold-decrypt')\" [attr.not-recomm]=\"this.translate.instant('not-recomm')\" [attr.dont-lose-it]=\"this.translate.instant('dont-lose-it')\" [attr.make-backup]=\"this.translate.instant('make-backup')\" [attr.generate-file]=\"this.translate.instant('generate-file')\" [attr.please-enter-both-password]=\"this.translate.instant('please-enter-both-password')\" [attr.the-pass]=\"this.translate.instant('the-pass')\" [attr.make-sure]=\"this.translate.instant('make-sure')\" [attr.wrong-key-length]=\"this.translate.instant('wrong-key-length')\" [attr.hold-on-generating]=\"this.translate.instant('hold-on-generating')\" [attr.wallet-app-here]=\"this.translate.instant('wallet-app-here')\" [attr.free-download]=\"this.translate.instant('free-download')\" [attr.received-from]=\"this.translate.instant('received-from')\" [attr.sent-to]=\"this.translate.instant('sent-to')\" [attr.transaction-id]=\"this.translate.instant('transaction-id')\" [attr.welcome-to-wallet]=\"this.translate.instant('welcome-to-wallet')\" [attr.the-easy-way]=\"this.translate.instant('the-easy-way')\" [attr.create-btn-text]=\"this.translate.instant('create-btn-text')\" [attr.new-wallet]=\"this.translate.instant('new-wallet')\" [attr.import-btn-text]=\"this.translate.instant('import-btn-text')\" [attr.existing-wallet]=\"this.translate.instant('existing-wallet')\" [attr.future-funds]=\"this.translate.instant('future-funds')\" [attr.lets-store]=\"this.translate.instant('lets-store')\" [attr.you-will-need]=\"this.translate.instant('you-will-need')\" [attr.download-login-file]=\"this.translate.instant('download-login-file')\" [attr.export-login-file]=\"this.translate.instant('export-login-file')\" [attr.additional-security]=\"this.translate.instant('additional-security')\" [attr.print-pk-desc]=\"this.translate.instant('print-pk-desc')\" [attr.print-pk]=\"this.translate.instant('print-pk')\" [attr.remind-me-later]=\"this.translate.instant('remind-me-later')\" [attr.well-done]=\"this.translate.instant('well-done')\" [attr.rdy-wallet]=\"this.translate.instant('rdy-wallet')\" [attr.start-now]=\"this.translate.instant('start-now')\" [attr.smth-went-wrong]=\"this.translate.instant('smth-went-wrong')\" [attr.data-assurance-success]=\"this.translate.instant('data-assurance-success')\" [attr.data-valid-keytore]=\"this.translate.instant('data-valid-keytore')\" [attr.data-wrong-chain]=\"this.translate.instant('data-wrong-chain')\" [attr.use-a4]=\"this.translate.instant('use-a4')\" [attr.menu-swap]=\"this.translate.instant('menu-swap')\" [attr.latest-dcn]=\"this.translate.instant('latest-dcn')\" [attr.learn-more-btn]=\"this.translate.instant('learn-more-btn')\" [attr.swap-tokens-title]=\"this.translate.instant('swap-tokens-title')\" [attr.swap-btn]=\"this.translate.instant('swap-btn')\" [attr.you-get-swap]=\"this.translate.instant('you-get-swap')\" [attr.swapping-dcn]=\"this.translate.instant('swapping-dcn')\" [attr.swapping-dcn2]=\"this.translate.instant('swapping-dcn2')\" [attr.swapping-eth]=\"this.translate.instant('swapping-eth')\" [attr.swapping-eth2]=\"this.translate.instant('swapping-eth2')\" [attr.dcn-swap-understand]=\"this.translate.instant('dcn-swap-understand')\" [attr.dcn2-swap-understand]=\"this.translate.instant('dcn2-swap-understand')\" [attr.eth-swap-understand]=\"this.translate.instant('eth-swap-understand')\" [attr.eth2-swap-understand]=\"this.translate.instant('eth2-swap-understand')\" [attr.for-the-moment]=\"this.translate.instant('for-the-moment')\" [attr.no-decimals]=\"this.translate.instant('no-decimals')\" [attr.attention]=\"this.translate.instant('attention')\" [attr.join-the-future]=\"this.translate.instant('join-the-future')\" [attr.the-latest-dcn]=\"this.translate.instant('the-latest-dcn')\" [attr.what-is-dcn]=\"this.translate.instant('what-is-dcn')\" [attr.what-is-dcn-description]=\"this.translate.instant('what-is-dcn-description')\" [attr.how-to-get-dcn]=\"this.translate.instant('how-to-get-dcn')\" [attr.how-to-get-dcn-description]=\"this.translate.instant('how-to-get-dcn-description')\" [attr.original-dcn]=\"this.translate.instant('original-dcn')\" [attr.original-dcn-description]=\"this.translate.instant('original-dcn-description')\" [attr.pending-swaps]=\"this.translate.instant('pending-swaps')\" [attr.not-yet]=\"this.translate.instant('not-yet')\" [attr.failed-tx]=\"this.translate.instant('failed-tx')\" [attr.pending]=\"this.translate.instant('pending')\" [attr.swapping-dcn-2]=\"this.translate.instant('swapping-dcn-2')\" [attr.swapping-dcn-2-1]=\"this.translate.instant('swapping-dcn-2-1')\" [attr.success]=\"this.translate.instant('success')\" [attr.your-tokens]=\"this.translate.instant('your-tokens')\" [attr.successfully-sent]=\"this.translate.instant('successfully-sent')\" [attr.your-l2-tokens]=\"this.translate.instant('your-l2-tokens')\" [attr.your-l1-tokens]=\"this.translate.instant('your-l1-tokens')\" [attr.swapping-l2-eth]=\"this.translate.instant('swapping-l2-eth')\" [attr.swapping-l2-eth-1]=\"this.translate.instant('swapping-l2-eth-1')\" [attr.your-eth-tokens]=\"this.translate.instant('your-eth-tokens')\" [attr.your-eth-tokens-sent]=\"this.translate.instant('your-eth-tokens-sent')\" [attr.successfully-swapped]=\"this.translate.instant('successfully-swapped')\" [attr.check-tx-at]=\"this.translate.instant('check-tx-at')\" [attr.when-file-cannot-be-saved-in-downloads]=\"this.translate.instant('when-file-cannot-be-saved-in-downloads')\" [attr.file-already-existing]=\"this.translate.instant('file-already-existing')\" [attr.check-if-sender-support-l2]=\"this.translate.instant('check-if-sender-support-l2')\" [attr.check-if-sender-support-l2-eth]=\"this.translate.instant('check-if-sender-support-l2-eth')\" [attr.for-rewards]=\"this.translate.instant('for-rewards')\" [attr.for-trading]=\"this.translate.instant('for-trading')\" [attr.for-fees]=\"this.translate.instant('for-fees')\" [attr.currently-unavailable]=\"this.translate.instant('currently-unavailable')\" [attr.the-amount-exceeds]=\"this.translate.instant('the-amount-exceeds')\" [attr.dcn-swap-limit-reached]=\"this.translate.instant('dcn-swap-limit-reached')\" [attr.eth-swap-limit-reached]=\"this.translate.instant('eth-swap-limit-reached')\" [attr.not-enough-l1-dcn-balance]=\"this.translate.instant('not-enough-l1-dcn-balance')\" [attr.not-enough-l1-eth-balance]=\"this.translate.instant('not-enough-l1-eth-balance')\" [attr.not-enough-l2-dcn-balance]=\"this.translate.instant('not-enough-l2-dcn-balance')\" [attr.not-enough-l2-eth-balance]=\"this.translate.instant('not-enough-l2-eth-balance')\" [attr.settings-menu]=\"this.translate.instant('settings-menu')\" [attr.where-to-pay]=\"this.translate.instant('where-to-pay')\" [attr.where-to-trade]=\"this.translate.instant('where-to-trade')\" [attr.contact-us]=\"this.translate.instant('contact-us')\" [attr.withdraw-history]=\"this.translate.instant('withdraw-history')\" [attr.swap]=\"this.translate.instant('swap')\" [attr.transaction]=\"this.translate.instant('transaction')\" [attr.ready]=\"this.translate.instant('ready')\" [attr.seven-days]=\"this.translate.instant('seven-days')\" [attr.pending-tx-id]=\"this.translate.instant('pending-tx-id')\" [attr.withdraw-btn]=\"this.translate.instant('withdraw-btn')\" [attr.successfully-approved]=\"this.translate.instant('successfully-approved')\" [attr.successfully-approved-text]=\"this.translate.instant('successfully-approved-text')\" [attr.swap-requested]=\"this.translate.instant('swap-requested')\"></div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/buy-page/buy-page.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/buy-page/buy-page.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Buy icon\" itemprop=\"contentUrl\" src=\"assets/images/buy-icon.svg\"/>\n    </figure>\n    <div class=\"padding-top-50 padding-top-xs-40 padding-bottom-50\">\n        <section class=\"container-fluid ready-to-purchase-with-external-api padding-top-40 padding-bottom-10 padding-top-xs-0 padding-bottom-xs-0 no-gutter-xs\">\n            <div class=\"row camping-for-issue-with-the-external-provider\"></div>\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-md-5 padding-bottom-xs-20 padding-bottom-sm-20\">\n                    <div class=\"from-box module inline-block\">\n                        <div class=\"padding-bottom-10 fs-20 color-light-blue\">{{'pay-with' | translate}}</div>\n                        <div class=\"inputable-line\">\n                            <input type=\"number\" autocomplete=\"off\" class=\"inputable-amount inline-block\" id=\"usd-value\" placeholder=\"0.0\"/>\n                            <div class=\"inline-block token-label fs-24 fs-xs-22\">$ USD</div>\n                        </div>\n                    </div>\n                    <div class=\"fs-16 padding-left-15 padding-left-xs-0 calibri-light text-below-input\">{{'first-tx' | translate}}<span class=\"min-usd-amount\"></span> {{'daily-limit' | translate}}</div>\n                </div>\n                <div class=\"col-md-2 text-center hide-this-sm hide-this-xs inline-block padding-bottom-20\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                        <img alt=\"Exchange icon\" itemprop=\"contentUrl\" src=\"assets/images/exchange-icon-light-blue.png\"/>\n                    </figure>\n                </div>\n                <div class=\"col-xs-12 col-md-5 padding-bottom-xs-20 inline-block\">\n                    <div class=\"to-box module\">\n                        <div class=\"padding-bottom-10 fs-20 color-light-blue\">{{'you-get' | translate}}</div>\n                        <div class=\"inputable-line\">\n                            <input type=\"number\" autocomplete=\"off\" class=\"inputable-amount inline-block\" id=\"crypto-amount\" readonly placeholder=\"0.0\"/>\n                            <select class=\"inline-block fs-22 padding-left-10\" id=\"active-crypto\">\n                                <option selected disabled>Select</option>\n                                <option value=\"dcn-l2\">DCN (Optimism)</option>\n                                <option value=\"dcn\">DCN</option>\n                                <option value=\"eth\">ETH</option>\n                            </select>\n                        </div>\n                        <div class=\"text-right padding-top-5 fs-18 fs-xs-14 l1-network hide\">\n                            <div class=\"inline-block cursor-pointer\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('eth-network-desc')\">Network: <img src=\"assets/images/eth-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                        </div>\n                        <div class=\"text-right padding-top-5 fs-18 fs-xs-14 l2-network hide\">\n                            <div class=\"inline-block cursor-pointer\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('l2-eth-network-desc')\">Network: <img src=\"assets/images/eth-2-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                        </div>\n                    </div>\n                    <div class=\"fs-16 padding-left-15 padding-left-xs-0 calibri-light text-below-input\"><figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"inline-block margin-left-10 more-info\" data-trigger=\"click\" data-toggle=\"tooltip\" data-placement=\"top\" [attr.data-title]=\"this.translate.instant('determined')\"><img alt=\"More info icon\" itemprop=\"contentUrl\" src=\"assets/images/more-info.svg\" class=\"width-100 max-width-20 cursor-pointer\"/></figure> {{'exchange-rate' | translate}}</div>\n                </div>\n            </div>\n            <div class=\"row padding-top-25\">\n                <div class=\"col-xs-12\">\n                    <div class=\"alert alert-info currency-description hide fs-0 padding-left-30 padding-right-30 padding-left-xs-15 padding-right-xs-15\">\n                        <img alt=\"Indacoin logo\" itemprop=\"contentUrl\" src=\"assets/images/eye-icon.svg\" class=\"width-100 max-width-40 inline-block margin-right-10\"/>\n                        <div class=\"inline-block description-content fs-16\" [attr.data-dcn-l2-description]=\"this.translate.instant('data-dcn-l2-description')\" [attr.data-dcn-description]=\"this.translate.instant('data-dcn-description')\" [attr.data-eth-description]=\"this.translate.instant('data-eth-description')\"></div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0 padding-bottom-20\">\n                <div class=\"col-xs-12 col-md-6 col-md-offset-3\">\n                    <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\">\n                        <label for=\"dcn_address\">{{'address-to-receive' | translate}}</label>\n                        <input type=\"url\" autocomplete=\"off\" id=\"dcn_address\" maxlength=\"42\" class=\"full-rounded\"/>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-md-6 col-md-offset-3\">\n                    <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\">\n                        <label for=\"email\">Email:</label>\n                        <input type=\"email\" autocomplete=\"off\" id=\"email\" maxlength=\"100\" class=\"full-rounded\"/>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 text-center checkbox-row\">\n                <div class=\"col-xs-12 col-md-6 col-md-offset-3\">\n                    <input type=\"checkbox\" id=\"privacy-policy-agree\" class=\"zoom-checkbox\"/>\n                    <label class=\"fs-16 calibri-bold text-below-input padding-left-10 cursor-pointer privacy-policy-agree-label\" for=\"privacy-policy-agree\">{{'read-and-accept' | translate}} <a href=\"https://dentacoin.com/privacy-policy\" target=\"_blank\" class=\"color-light-blue lato-bold data-external-link\">{{'menu-privacy-policy' | translate}}</a> {{'read-and-accept-two' | translate}}</label>\n                </div>\n            </div>\n            <div class=\"row padding-top-30 text-center\">\n                <div class=\"col-xs-12 fs-16\">\n                    {{'powered' | translate}}\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"padding-bottom-10\">\n                        <img alt=\"Indacoin logo\" itemprop=\"contentUrl\" src=\"assets/images/indacoin-logo.svg\" class=\"width-100 max-width-150\"/>\n                    </figure>\n                    <div>{{'all-txs' | translate}}</div>\n                    <a href=\"https://indacoin.com/\" target=\"_blank\" class=\"text-decoration-underline color-light-blue\">www.indacoin.com</a>\n                </div>\n            </div>\n        </section>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn light-blue-border buy-crypto-btn\">{{'buy-btn' | translate}}</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/homepage/homepage.component.html":
/*!****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/homepage/homepage.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Wallet icon\" itemprop=\"contentUrl\" src=\"assets/images/wallet-icon.svg\"/>\n    </figure>\n    <div class=\"padding-top-50 padding-top-xs-20 padding-bottom-40 padding-bottom-xs-20 padding-left-50 padding-right-50 padding-left-xs-10 padding-right-xs-10 top-side\">\n        <div class=\"container-fluid padding-top-30 padding-top-xs-0 no-gutter-xs text-center-xs\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-8 col-lg-7 col-lg-offset-1 inline-block\">\n                    <div class=\"fs-40 fs-xs-26 lato-bold fade-in-element\">\n                        <a href=\"javascript:void(0)\" class=\"refresh-account-data inline-block margin-right-10\"><svg aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"sync-alt\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path style=\"fill: white;\" fill=\"currentColor\" d=\"M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z\" class=\"\"></path></svg></a>\n                        <span class=\"inline-block dcn-amount\">0</span>\n                        <span class=\"inline-block padding-left-10 fs-0\"><svg class=\"width-100 max-width-20\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 283.1 389.1\" style=\"enable-background:new 0 0 283.1 389.1;\" xml:space=\"preserve\"><path fill=\"white\" d=\"M45.3,264.2L0,340.8c0,0,18,25,70.4,45.3l25.8-70.4l17.2-46.9l18-52.4l6.3-17.2l0.8-1.6c0,0,0-0.8,0.8-0.8 l0.8-0.8l0,0c0,0,0,0,0.8,0h0.8h0.8l0.8,1.6l1.6,4.7l3.1,10.2l12.5,37.5l10.9,32.8l16.4,50.8l12.5,36l7,19.5 c0,0,41.4-11.7,75.8-46.1l-25-37.5l-16.4-28.1l-16.6-32.8L211,215.7l-10.9-25.8l-9.4-25.8l-8.6-25l-8.6-29.7l-8.6-30.5l-7.8-29.7 l-8.6-32.8L142.2,0l-9.4,31.3l-13.3,43.8l-10.8,33.5l-12.5,37.5l-11,30.5l-12.5,29.7l-13.3,28.2L45.3,264.2z\"/> </svg></span>\n                    </div>\n                </div>\n                <div class=\"col-sm-4 col-lg-3 inline-block text-right hide-this-xs\">\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" id=\"qrcode\">\n                        <img src=\"assets/images/blurred-qr-code.jpg\" alt=\"Blurred qr code image\" class=\"width-100 max-width-180\" itemprop=\"contentUrl\"/>\n                    </figure>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"custom-background\">\n        <div class=\"blue-side\"></div>\n        <div class=\"white-side\"></div>\n        <a href=\"javascript:void(0)\" class=\"eth-address-container copy-address fade-in-element color-white text-center\">\n            <h2 class=\"fs-18 calibr-bold\">{{'your-dcn-address' | translate}}</h2>\n            <div class=\"fs-0 fix-vertical-alignment-on-mobile\">\n                <figure class=\"inline-block copy-icon\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                    <img src=\"assets/images/copy-icon.svg\" class=\"max-width-30 width-100 margin-right-5\" alt=\"Copy address to clipboard icon\" itemprop=\"contentUrl\"/>\n                </figure>\n                <input type=\"text\" readonly class=\"address-value inline-block fs-18 fs-xs-12 cursor-pointer\" id=\"copy-address\"/>\n                <figure class=\"inline-block qr-code-icon\" itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\n                    <img src=\"assets/images/qr-code-icon.svg\" class=\"max-width-30 width-100 margin-left-5\" alt=\"QR code icon\" itemprop=\"contentUrl\"/>\n                </figure>\n            </div>\n        </a>\n    </div>\n    <div class=\"padding-top-20 padding-bottom-40 padding-left-50 padding-right-50 padding-top-xs-10 padding-bottom-xs-25 padding-left-xs-0 padding-right-xs-0 bottom-side hide\">\n        <div class=\"container-fluid\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-lg-10 col-lg-offset-1 single-currency l2-dcn-currency padding-top-10 padding-bottom-10\">\n                    <div class=\"fs-0\">\n                        <div class=\"inline-block width-50 fs-20 fs-xs-14 color-solid-gray\">{{'for-rewards' | translate}}</div>\n                        <div class=\"inline-block width-50 text-right\">\n                            <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-left-5 padding-right-5 padding-top-5 padding-bottom-5 custom-tooltip\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('l2-eth-network-desc')\">Network: <img src=\"assets/images/eth-2-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                        </div>\n                    </div>\n                    <div class=\"fs-0\">\n                        <div class=\"inline-block currency-info\">\n                            <img src=\"assets/images/dcn-l2-logo.svg\" alt=\"Dentacoin (L2) logo\" class=\"width-100 max-width-30\"/>\n                            <span class=\"inline-block fs-20 fs-xs-14 padding-left-5\">Dentacoin (L2)</span>\n                        </div>\n                        <div class=\"inline-block currency-values fs-22 fs-xs-16 text-right\">\n                            <div><span class=\"l2-dcn-balance calibri-bold\">0</span> DCN</div>\n                            <div class=\"color-solid-gray\">$<span class=\"l2-dcn-balance-in-usd\">0</span></div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-xs-12 col-lg-10 col-lg-offset-1 single-currency l1-dcn-currency hide padding-top-10 padding-bottom-10\">\n                    <div class=\"fs-0\">\n                        <div class=\"inline-block width-50 fs-20 fs-xs-14 color-solid-gray\">{{'for-trading' | translate}}</div>\n                        <div class=\"inline-block width-50 text-right\">\n                            <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-left-5 padding-right-5 padding-top-5 padding-bottom-5 custom-tooltip\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('eth-network-desc')\">Network: <img src=\"assets/images/eth-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                        </div>\n                    </div>\n                    <div class=\"fs-0\">\n                        <div class=\"inline-block currency-info\">\n                            <img src=\"assets/images/dentacoin-logo.svg\" alt=\"Dentacoin logo\" class=\"width-100 max-width-30\"/>\n                            <span class=\"inline-block fs-20 fs-xs-14 padding-left-5\">Dentacoin</span>\n                        </div>\n                        <div class=\"inline-block currency-values fs-22 fs-xs-16 text-right\">\n                            <div><span class=\"l1-dcn-balance calibri-bold\">0</span> DCN</div>\n                            <div class=\"color-solid-gray\">$<span class=\"l1-dcn-balance-in-usd\">0</span></div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-xs-12 col-lg-10 col-lg-offset-1 eth-currencies padding-top-10 padding-bottom-10 for-fees\">\n                    <div class=\"fs-0\">\n                        <div class=\"inline-block width-60 fs-20 fs-xs-14 color-solid-gray\">{{'for-fees' | translate}} <img src=\"assets/images/more-info.svg\" class=\"max-width-20 cursor-pointer width-100 margin-left-5 more-info\" alt=\"Info icon\" itemprop=\"contentUrl\"/></div>\n                        <div class=\"hide l1-network inline-block width-40 text-right\">\n                            <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-left-5 padding-right-5 padding-top-5 padding-bottom-5 custom-tooltip\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('eth-network-desc')\">Network: <img src=\"assets/images/eth-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                        </div>\n                        <div class=\"hide l2-network inline-block width-40 text-right\">\n                            <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-left-5 padding-right-5 padding-top-5 padding-bottom-5 custom-tooltip\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('l2-eth-network-desc')\">Network: <img src=\"assets/images/eth-2-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                        </div>\n                    </div>\n                    <div class=\"fs-0 single-currency l2-eth-currency padding-top-5 padding-bottom-5\">\n                        <div class=\"inline-block currency-info\">\n                            <img src=\"assets/images/eth-2-icon.svg\" alt=\"Optimistic Ethereum logo\" class=\"width-100 eth-logo margin-right-5\"/>\n                            <span class=\"inline-block fs-20 fs-xs-14 padding-left-5 color-solid-gray\">Optimistic Ethereum</span>\n                        </div>\n                        <div class=\"inline-block currency-values fs-22 fs-xs-16 text-right color-solid-gray\">\n                            <div><span class=\"l2-eth-balance calibri-bold\">0</span> ETH</div>\n                        </div>\n                    </div>\n                    <div class=\"fs-0 single-currency l1-eth-currency hide padding-top-5 padding-bottom-5\">\n                        <div class=\"inline-block currency-info\">\n                            <img src=\"assets/images/eth-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 eth-logo margin-right-5\"/>\n                            <span class=\"inline-block fs-20 fs-xs-14 padding-left-5 color-solid-gray\">Ethereum</span>\n                        </div>\n                        <div class=\"inline-block currency-values fs-22 fs-xs-16 text-right color-solid-gray\">\n                            <div><span class=\"l1-eth-balance calibri-bold\">0</span> ETH</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"join-the-future hide color-white background-light-blue-gradient padding-top-15 padding-bottom-15 padding-top-xs-10 padding-bottom-xs-10\">\n            <a href=\"javascript:void(0);\" class=\"close-btn fs-34 line-height-26 color-white\">×</a>\n            <div class=\"container-fluid\">\n                <div class=\"row\">\n                    <div class=\"col-xs-12 col-sm-10 col-sm-offset-1\">\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"inline-block width-100 max-width-140 padding-right-20 max-width-xs-100 padding-right-xs-10\">\n                            <img alt=\"Coin icon\" itemprop=\"contentUrl\" src=\"assets/images/fast-coins.png\"/>\n                        </figure>\n                        <div class=\"center-content inline-block fs-20 fs-xs-16 padding-top-xs-10 padding-bottom-xs-10 padding-left-xs-15 padding-right-xs-15 padding-left-30 padding-right-30\">\n                            <div class=\"lato-black\">{{'join-the-future' | translate}}</div>\n                            <div>{{'the-latest-dcn' | translate}}</div>\n                        </div>\n                        <div class=\"inline-block learn-more-btn\">\n                            <a href=\"javascript:void(0);\" class=\"black-white-btn fs-16 fs-xs-14 padding-left-10 padding-right-10 open-popup\">{{'learn-more-btn' | translate}}</a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>"

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

module.exports = "<div class=\"main-wrapper\">\r\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\r\n        <img alt=\"Send icon\" itemprop=\"contentUrl\" src=\"assets/images/send-icon.svg\"/>\r\n    </figure>\r\n    <section class=\"padding-top-100 padding-bottom-70 padding-top-xs-40 padding-bottom-xs-50 section-send\">\r\n        <div class=\"container-fluid no-gutter-xs\">\r\n            <div class=\"row\">\r\n                <div class=\"col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 fs-0\">\r\n                    <div class=\"inline-block search-field\">\r\n                        <div class=\"custom-google-label-style module\" data-input-light-blue-border=\"true\">\r\n                            <label for=\"search\" id=\"search-label\">{{'enter-or-scan' | translate}}</label>\r\n                            <input type=\"text\" id=\"search\" maxlength=\"42\" autocomplete=\"off\"/>\r\n                        </div>\r\n                        <div class=\"search-result\">\r\n                            <div class=\"search-header\">\r\n                                <a class=\"inline-block active\" data-type=\"clinics\" href=\"javascript:void(0)\">{{'clinics-dentists' | translate}}</a>\r\n                                <a class=\"inline-block\" data-type=\"address-book\" href=\"javascript:void(0)\">{{'address-book' | translate}}</a>\r\n                            </div>\r\n                            <div class=\"search-body\">\r\n                                <div class=\"clinics hideable-element\">\r\n                                    <ul class=\"clinics-list\" id=\"clinics-list\"></ul>\r\n                                </div>\r\n                                <div class=\"address-book hideable-element\"><i class=\"display-block-important padding-top-15 padding-left-15 padding-bottom-15 padding-right-15\">{{'empty-book' | translate}}</i></div>\r\n                            </div>\r\n                            <div class=\"search-footer\">\r\n                                <a href=\"javascript:void(0)\" class=\"add-to-address-book lato-bold\">{{'add-to' | translate}}</a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"calibri-light fs-14 color-solid-gray padding-bottom-xs-20 padding-top-5 show-on-xs\">{{'for-payments' | translate}}</div>\r\n                    <a href=\"javascript:void(0)\" class=\"inline-block max-width-80 scan-qr-code\">\r\n                        <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\r\n                            <img src=\"assets/images/scan-qr-code.svg\" class=\"width-100\" alt=\"Scan QR code icon\" itemprop=\"contentUrl\"/>\r\n                        </figure>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n            <div class=\"row hide-xs\">\r\n                <div class=\"col-xs-12 text-center calibri-light fs-16 color-solid-gray padding-top-40\">{{'for-partner-payments' | translate}}</div>\r\n            </div>\r\n        </div>\r\n        <div class=\"bottom-absolute-btn text-center\">\r\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn disabled light-blue-border next-send\">{{'next' | translate}}</a>\r\n        </div>\r\n    </section>\r\n    <section class=\"padding-top-85 padding-bottom-100 padding-top-xs-0 padding-bottom-xs-50 section-amount-to\">\r\n        <div class=\"send-to text-center padding-top-15 padding-bottom-15\">\r\n            <div class=\"wrapper padding-left-15 padding-right-15 fs-0\">\r\n                <div class=\"inline-block text-part\">\r\n                    <span class=\"inline-block fs-16 lato-black send-to-label\">{{'send-to' | translate}}</span>\r\n                    <span class=\"inline-block fs-16 fs-xs-12 address-cell padding-right-10 padding-left-10 padding-left-xs-0 padding-right-xs-0\"></span>\r\n                </div>\r\n                <a href=\"javascript:void(0)\" class=\"inline-block edit-address\">\r\n                    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\">\r\n                        <img src=\"assets/images/edit-icon.png\" class=\"width-100 max-width-40\" alt=\"Edit icon\" itemprop=\"contentUrl\"/>\r\n                    </figure>\r\n                </a>\r\n            </div>\r\n        </div>\r\n        <div class=\"container-fluid no-gutter-xs\">\r\n            <div class=\"row fs-0 padding-top-40 padding-top-xs-25\">\r\n                <div class=\"balance-line padding-bottom-40 padding-bottom-xs-15 fs-0 col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3\">\r\n                    <div class=\"inline-block balance-value fs-20\">\r\n                        <span class=\"inline-block display-block-xs color-light-blue fs-xs-16 padding-right-10\">Balance:</span> <span class=\"color-black inline-block max-amount\"><span class=\"amount\"></span> DCN</span>\r\n                    </div>\r\n                    <a href=\"javascript:void(0);\" class=\"inline-block line-height-30 white-light-blue-btn padding-top-0 padding-bottom-0 fs-16 fs-xs-14 light-blue-border max-btn\">MAX</a>\r\n                </div>\r\n                <div class=\"col-xs-12 col-md-5 inline-block padding-bottom-sm-20 padding-bottom-xs-20\">\r\n                    <div class=\"from-box module padding-top-10 padding-bottom-10 padding-left-20 padding-right-20 padding-left-xs-10 padding-right-xs-10\">\r\n                        <div class=\"fs-0\">\r\n                            <div class=\"inline-block width-50 padding-bottom-5 padding-bottom-xs-0 fs-20 color-light-blue\">{{'send-amount' | translate}}</div>\r\n                            <div class=\"inline-block width-50 padding-bottom-5 padding-bottom-xs-0 text-right hide l1-network\">\r\n                                <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-top-5 padding-bottom-5\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('eth-network-desc')\">Network: <img src=\"assets/images/eth-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\r\n                            </div>\r\n                            <div class=\"inline-block width-50 padding-bottom-5 padding-bottom-xs-0 text-right l2-network\">\r\n                                <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-top-5 padding-bottom-5\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('l2-eth-network-desc')\">Network: <img src=\"assets/images/eth-2-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"inputable-line\">\r\n                            <input type=\"number\" autocomplete=\"off\" class=\"inputable-amount inline-block\" id=\"crypto-amount\" placeholder=\"0.0\"/>\r\n                            <select class=\"inline-block fs-22 padding-left-10 crypto-label input-label red-color\" id=\"active-crypto\">\r\n                                <option value=\"dcn-l2\" selected>DCN (Optimism)</option>\r\n                                <option value=\"dcn-l1\">DCN</option>\r\n                                <option value=\"eth-l1\">ETH</option>\r\n                                <option value=\"eth-l2\">ETH (Optimism)</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"fs-14 padding-left-30 padding-left-xs-0 calibri-light\">{{'enter-amount' | translate}}</div>\r\n                </div>\r\n                <!--<div class=\"col-xs-12 col-sm-5 inline-block-top\">\r\n                    <div class=\"custom-google-label-style module fs-0 flex\">\r\n                        <div class=\"inline-block left-side\">\r\n                            <label for=\"crypto-amount\">{{'send-amount' | translate}}</label>\r\n                            <input type=\"number\" id=\"crypto-amount\"/>\r\n                        </div>\r\n                        <select class=\"inline-block crypto-label input-label\" id=\"active-crypto\">\r\n                            <option value=\"dcn-l1\">DCN</option>\r\n                            <option value=\"dcn-l2\">DCN</option>\r\n                            <option value=\"eth-l1\">ETH</option>\r\n                            <option value=\"eth-l2\">ETH</option>\r\n                        </select>\r\n                    </div>\r\n                </div>-->\r\n                <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"col-xs-12 col-md-2 inline-block text-center hide-xs hide-this-sm\">\r\n                    <img src=\"assets/images/equal-icon.svg\" class=\"width-100 max-width-30\" alt=\"Edit icon\" itemprop=\"contentUrl\"/>\r\n                </figure>\r\n                <div class=\"col-xs-12 col-md-5 inline-block\">\r\n                    <div class=\"to-box module padding-top-10 padding-bottom-10 padding-left-20 padding-right-20 padding-left-xs-10 padding-right-xs-10\">\r\n                        <div class=\"padding-bottom-5 padding-bottom-xs-0 fs-20 color-light-blue\">{{'equal-to' | translate}}</div>\r\n                        <div class=\"inputable-line\">\r\n                            <input type=\"number\" autocomplete=\"off\" class=\"inline-block\" id=\"usd-val\" placeholder=\"0.0\"/>\r\n                            <div class=\"inline-block token-label fs-24 fs-xs-22\">$ USD</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"fs-14 padding-left-30 padding-left-xs-0 calibri-light\">{{'the-exchange' | translate}}</div>\r\n                </div>\r\n                <!--<div class=\"col-xs-12 col-sm-5 inline-block-top padding-top-xs-20\">\r\n                    <div class=\"custom-google-label-style module fs-0 flex\">\r\n                        <div class=\"inline-block left-side\">\r\n                            <label for=\"usd-val\">{{'equal-to' | translate}}</label>\r\n                            <input type=\"number\" id=\"usd-val\"/>\r\n                        </div>\r\n                        <span class=\"inline-block input-label padding-top-10 padding-top-xs-15\">USD</span>\r\n                    </div>\r\n                </div>-->\r\n            </div>\r\n            <div class=\"row padding-top-60 padding-top-xs-20 text-center checkbox-row\">\r\n                <div class=\"col-xs-12 fs-0\">\r\n                    <input type=\"checkbox\" id=\"verified-receiver-address\" class=\"zoom-checkbox inline-block\"/>\r\n                    <label class=\"fs-16 calibri-bold padding-left-5 inline-block\" for=\"verified-receiver-address\">{{'i-verified' | translate}}</label>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"bottom-absolute-btn text-center\">\r\n            <a href=\"javascript:void(0)\" class=\"white-light-blue-btn light-blue-border open-transaction-recipe\">{{'send-btn' | translate}}</a>\r\n        </div>\r\n    </section>\r\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-exchanges/spend-page-exchanges.component.html":
/*!****************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-exchanges/spend-page-exchanges.component.html ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6\">\n                    <a (click)=\"redirectsService.toPayForDentalServices()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">{{'spend-menu-pay-dental' | translate}}</a>\n                </div>\n                <div class=\"col-xs-6 text-right\">\n                    <a (click)=\"redirectsService.toPayAssuranceFees()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">{{'spend-menu-assurance' | translate}}</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center\">\n                    <div class=\"mobile-nav padding-top-xs-20\">\n                        <a (click)=\"redirectsService.toPayForDentalServices()\" class=\"prev cursor-pointer text-left\"><img alt=\"Left arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28 fs-xs-24\">{{'spend-menu-trade' | translate}}</h1>\n                        <a (click)=\"redirectsService.toPayAssuranceFees()\" class=\"next cursor-pointer text-right\"><img alt=\"Right arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-40 fs-16 max-width-600 margin-0-auto\">{{'dcn-listed' | translate}}</div>\n                    <ul class=\"camping-for-exchanges text-left\"></ul>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a (click)=\"redirectsService.toSend()\" class=\"white-light-blue-btn light-blue-border cursor-pointer min-width-xs-300\">{{'deposit-btn' | translate}}</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.html":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.html ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6\">\n                    <a (click)=\"redirectsService.toExchanges()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">{{'spend-menu-trade' | translate}}</a>\n                </div>\n                <div class=\"col-xs-6 text-right\">\n                    <a (click)=\"redirectsService.toPayForDentalServices()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">{{'spend-menu-pay-dental' | translate}}</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center\">\n                    <div class=\"mobile-nav padding-top-xs-20\">\n                        <a (click)=\"redirectsService.toExchanges()\" class=\"prev cursor-pointer text-left\"><img alt=\"Left arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28 fs-xs-24\">{{'spend-menu-assurance' | translate}}</h1>\n                        <a (click)=\"redirectsService.toPayForDentalServices()\" class=\"next cursor-pointer text-right\"><img alt=\"Right arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-10 fs-16 max-width-600 margin-0-auto\">{{'dcn-assurance' | translate}}</div>\n                    <div class=\"camp-assurance-mobile-phone-scanning\"></div>\n                    <div class=\"padding-bottom-20 padding-top-20\">\n                        <video controls=\"\" height=\"350\" class=\"width-100 max-width-600 margin-0-auto\" poster=\"assets/images/dentacoin-assurance-intro.png\">\n                            <source src=\"https://dentacoin.com/assets/uploads/assurance-hub-video.mp4\" type=\"video/mp4\"> Your browser does not support HTML5 video. </video>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a href=\"https://assurance.dentacoin.com\" target=\"_blank\" class=\"white-light-blue-btn light-blue-border min-width-xs-300 data-external-link\">{{'go-to-dcn-assurance' | translate}}</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.html":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.html ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/spend-icon.svg\"/>\n    </figure>\n    <div class=\"padding-bottom-50\">\n        <div class=\"container-fluid no-gutter\">\n            <div class=\"row spend-navigation module\">\n                <div class=\"col-xs-6 padding-left-65\">\n                    <a (click)=\"redirectsService.toPayAssuranceFees()\" class=\"fs-16 calibri-bold color-light-blue prev cursor-pointer\">{{'spend-menu-assurance' | translate}}</a>\n                </div>\n                <div class=\"col-xs-6 text-right padding-right-65\">\n                    <a (click)=\"redirectsService.toExchanges()\" class=\"fs-16 calibri-bold color-light-blue next cursor-pointer\">{{'spend-menu-trade' | translate}}</a>\n                </div>\n            </div>\n            <div class=\"row padding-top-20 padding-top-xs-0\">\n                <div class=\"col-xs-12 text-center padding-left-xs-0 padding-right-xs-0\">\n                    <div class=\"mobile-nav padding-top-xs-20 padding-left-xs-15 padding-right-xs-15\">\n                        <a (click)=\"redirectsService.toPayAssuranceFees()\" class=\"prev cursor-pointer text-left\"><img alt=\"Left arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-left.svg\"/></a>\n                        <h1 class=\"calibri-bold fs-28 fs-xs-24\">{{'spend-menu-pay-dental' | translate}}</h1>\n                        <a (click)=\"redirectsService.toExchanges()\" class=\"next cursor-pointer text-right\"><img alt=\"Right arrow icon\" itemprop=\"contentUrl\" src=\"assets/images/gray-arrow-right.svg\"/></a>\n                    </div>\n                    <div class=\"padding-top-15 padding-top-xs-40 padding-bottom-20 padding-left-xs-15 padding-right-xs-15 fs-16 max-width-600 margin-0-auto\">{{'can-use' | translate}}</div>\n                    <iframe src=\"https://dentacoin.com/google-map-iframe?hide-clinics=true&type=wallet\"></iframe>\n                </div>\n            </div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a (click)=\"redirectsService.toSend()\" class=\"white-light-blue-btn light-blue-border cursor-pointer min-width-xs-250\">{{'make-a-payment' | translate}}</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/swap-page/swap-page.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/swap-page/swap-page.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-wrapper\">\n    <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"page-absolute-icon\">\n        <img alt=\"Spend icon\" itemprop=\"contentUrl\" src=\"assets/images/swap-icon.svg\"/>\n    </figure>\n    <div class=\"padding-top-50 padding-top-xs-20 padding-bottom-50\">\n        <div class=\"latest-dcn-popup color-white background-light-blue-gradient padding-top-15 padding-bottom-15 text-center\">\n            <figure itemscope=\"\" itemtype=\"http://schema.org/ImageObject\" class=\"inline-block width-100 max-width-120\">\n                <img alt=\"Coin icon\" itemprop=\"contentUrl\" src=\"assets/images/fast-coins.png\"/>\n            </figure>\n            <div class=\"inline-block fs-20 fs-xs-16 padding-top-xs-10 padding-bottom-xs-10 padding-left-xs-15 padding-right-xs-15 padding-left-30 padding-right-30\">{{'latest-dcn' | translate}}</div>\n            <div class=\"inline-block\">\n                <a href=\"javascript:void(0);\" class=\"black-white-btn fs-18 learn-more-btn\">{{'learn-more-btn' | translate}}</a>\n            </div>\n            <a href=\"javascript:void(0);\" class=\"close-btn fs-34 line-height-26 color-white\">×</a>\n        </div>\n        <h1 class=\"padding-top-10 padding-top-xs-20 padding-bottom-15 text-center fs-30 color-black\">{{'swap-tokens-title' | translate}}</h1>\n        <div class=\"swapping-section\">\n            <div class=\"from-box module\">\n                <div class=\"balance-line\">\n                    <a href=\"javascript:void(0);\" class=\"inline-block line-height-26 white-light-blue-btn padding-top-0 padding-left-5 padding-bottom-0 padding-right-5 fs-14 fs-xs-12 light-blue-border max-btn\">MAX</a>\n                    <div class=\"inline-block balance-value fs-20\">Balance: <span class=\"color-light-blue\"><span class=\"amount\"></span> DCN</span></div>\n                </div>\n                <div class=\"padding-top-20 inputable-line\">\n                    <input type=\"number\" class=\"inputable-amount inline-block\" data-type=\"dcn-l1\" placeholder=\"0.0\"/>\n                    <select class=\"inline-block fs-22 padding-left-10 current-from\" data-current-layer=\"l1\">\n                        <option value=\"dcn-l1\">DCN</option>\n                        <option value=\"eth-l1\">ETH</option>\n                        <option value=\"dcn-l2\">DCN (Optimism)</option>\n                        <option value=\"eth-l2\">ETH (Optimism)</option>\n                    </select>\n                </div>\n                <div class=\"fs-0\">\n                    <div class=\"inline-block text-right l1-network\">\n                        <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-top-5 padding-bottom-5\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('eth-network-desc')\">Network: <img src=\"assets/images/eth-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                    </div>\n                    <div class=\"inline-block text-right hide l2-network\">\n                        <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-top-5 padding-bottom-5\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('l2-eth-network-desc')\">Network: <img src=\"assets/images/eth-2-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"padding-top-15 padding-bottom-15 text-center switch-layers-btn\">\n                <a href=\"javascript:void(0);\" class=\"inline-block padding-top-5 padding-bottom-5 padding-left-40 padding-right-40 background-light-blue-gradient\"><img alt=\"Switch icon\" itemprop=\"contentUrl\" src=\"assets/images/change-swapping-layers-icon.svg\" class=\"width-100 max-width-30\"/></a>\n            </div>\n            <div class=\"to-box module\">\n                <div class=\"balance-line\">\n                    <span class=\"inline-block you-get-label fs-20\">{{'you-get-swap' | translate}}</span>\n                    <div class=\"inline-block you-get-balance balance-value fs-20\">Balance: <span class=\"color-light-blue\"><span class=\"amount\"></span> DCN</span></div>\n                </div>\n                <div class=\"padding-top-20 inputable-line\">\n                    <div class=\"transfer-to-amount inline-block\">0.0</div>\n                    <select class=\"inline-block fs-22 padding-left-10 current-to red-color\">\n                        <option value=\"dcn-l2\">DCN (Optimism)</option>\n                    </select>\n                </div>\n                <div class=\"fs-0\">\n                    <div class=\"inline-block text-right hide l1-network\">\n                        <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-top-5 padding-bottom-5\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('eth-network-desc')\">Network: <img src=\"assets/images/eth-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                    </div>\n                    <div class=\"inline-block text-right l2-network\">\n                        <div class=\"inline-block fs-18 fs-xs-14 color-solid-gray cursor-pointer padding-top-5 padding-bottom-5\" data-placement=\"top\" data-toggle=\"tooltip\" data-trigger=\"click\" [attr.data-title]=\"this.translate.instant('l2-eth-network-desc')\">Network: <img src=\"assets/images/eth-2-icon.svg\" alt=\"Ethereum logo\" class=\"width-100 max-width-20 margin-left-5\"/></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"padding-top-25 padding-bottom-40 text-center\">\n            <div class=\"fs-18 padding-bottom-5 current-currency-explanation\" [attr.swap-dcn]=\"this.translate.instant('swapping-dcn')\" [attr.swap-dcn2]=\"this.translate.instant('swapping-dcn2')\" [attr.swap-eth2]=\"this.translate.instant('swapping-eth2')\" [attr.approve-dcn2]=\"this.translate.instant('approving-dcn2')\" [attr.swap-eth]=\"this.translate.instant('swapping-eth')\">{{'swapping-dcn' | translate}}</div>\n            <div class=\"fs-16 checkbox-row calibri-bold padding-top-20\"><input type=\"checkbox\" class=\"zoom-checkbox\" id=\"checkbox-understand\"/> <label class=\"padding-left-10\" for=\"checkbox-understand\" [attr.swap-dcn]=\"this.translate.instant('dcn-swap-understand')\" [attr.swap-dcn2]=\"this.translate.instant('dcn2-swap-understand')\" [attr.swap-eth]=\"this.translate.instant('eth-swap-understand')\">{{'dcn-swap-understand' | translate}}</label></div>\n        </div>\n        <div class=\"bottom-absolute-btn text-center\">\n            <a class=\"white-light-blue-btn light-blue-border swap-btn\" href=\"javascript:void(0)\">{{'swap-btn' | translate}}</a>\n            <a class=\"white-light-blue-btn light-blue-border approve-withdraw-btn hide\" href=\"javascript:void(0)\">{{'approve-btn' | translate}}</a>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/_services/language.service.ts":
/*!***********************************************!*\
  !*** ./src/app/_services/language.service.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var router_1 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var LanguageService = /** @class */ (function () {
    function LanguageService(translate, activatedRoute, router) {
        this.translate = translate;
        this.activatedRoute = activatedRoute;
        this.router = router;
    }
    LanguageService.prototype.onLangSwitcherChange = function (lang) {
        window.localStorage.setItem('currentLanguage', lang);
        this.router.navigateByUrl(this.router.url.substring(0, 1) + lang + this.router.url.substring(3));
        var event = new CustomEvent('languageChanged', {
            detail: {
                currentLanguage: lang,
                time: new Date()
            }
        });
        window.document.dispatchEvent(event);
    };
    LanguageService.ctorParameters = function () { return [
        { type: core_2.TranslateService },
        { type: router_1.ActivatedRoute },
        { type: router_1.Router }
    ]; };
    LanguageService = tslib_1.__decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], LanguageService);
    return LanguageService;
}());
exports.LanguageService = LanguageService;


/***/ }),

/***/ "./src/app/_services/redirects.service.ts":
/*!************************************************!*\
  !*** ./src/app/_services/redirects.service.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var router_1 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var RedirectsService = /** @class */ (function () {
    function RedirectsService(router, translate, ngZone) {
        this.router = router;
        this.translate = translate;
        this.ngZone = ngZone;
    }
    RedirectsService.prototype.toHomepage = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.ngZone.run(function () { return _this.router.navigateByUrl(_this.translate.currentLang); }).then();
    };
    RedirectsService.prototype.toBuyPage = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.ngZone.run(function () { return _this.router.navigateByUrl(_this.translate.currentLang + '/buy'); }).then();
    };
    RedirectsService.prototype.toSend = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.ngZone.run(function () { return _this.router.navigateByUrl(_this.translate.currentLang + '/send'); }).then();
    };
    RedirectsService.prototype.toSwap = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.ngZone.run(function () { return _this.router.navigateByUrl(_this.translate.currentLang + '/swap'); }).then();
    };
    RedirectsService.prototype.toPayForDentalServices = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.ngZone.run(function () { return _this.router.navigateByUrl(_this.translate.currentLang + '/spend-pay-for-dental-services'); }).then();
    };
    RedirectsService.prototype.toPayAssuranceFees = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.ngZone.run(function () { return _this.router.navigateByUrl(_this.translate.currentLang + '/spend-pay-assurance-fees'); }).then();
    };
    RedirectsService.prototype.toExchanges = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.ngZone.run(function () { return _this.router.navigateByUrl(_this.translate.currentLang + '/spend-exchanges'); }).then();
    };
    RedirectsService.ctorParameters = function () { return [
        { type: router_1.Router },
        { type: core_2.TranslateService },
        { type: core_1.NgZone }
    ]; };
    RedirectsService = tslib_1.__decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], RedirectsService);
    return RedirectsService;
}());
exports.RedirectsService = RedirectsService;


/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var router_1 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var homepage_component_1 = __webpack_require__(/*! ./homepage/homepage.component */ "./src/app/homepage/homepage.component.ts");
var buy_page_component_1 = __webpack_require__(/*! ./buy-page/buy-page.component */ "./src/app/buy-page/buy-page.component.ts");
var send_page_component_1 = __webpack_require__(/*! ./send-page/send-page.component */ "./src/app/send-page/send-page.component.ts");
var swap_page_component_1 = __webpack_require__(/*! ./swap-page/swap-page.component */ "./src/app/swap-page/swap-page.component.ts");
var spend_page_pay_for_dental_services_component_1 = __webpack_require__(/*! ./spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component */ "./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.ts");
var spend_page_exchanges_component_1 = __webpack_require__(/*! ./spend-page-exchanges/spend-page-exchanges.component */ "./src/app/spend-page-exchanges/spend-page-exchanges.component.ts");
var spend_page_pay_assurance_fees_component_1 = __webpack_require__(/*! ./spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component */ "./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.ts");
var not_found_page_component_1 = __webpack_require__(/*! ./not-found-page/not-found-page.component */ "./src/app/not-found-page/not-found-page.component.ts");
var front_end_language_component_1 = __webpack_require__(/*! ./front-end-language/front-end-language.component */ "./src/app/front-end-language/front-end-language.component.ts");
var redirect_to_home_component_1 = __webpack_require__(/*! ./redirect-to-home/redirect-to-home.component */ "./src/app/redirect-to-home/redirect-to-home.component.ts");
var environment_1 = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
var routes = environment_1.environment.hybrid ? [
    { path: '', pathMatch: 'full', redirectTo: '/' + (window.localStorage.getItem('currentLanguage') ? window.localStorage.getItem('currentLanguage') : environment_1.environment.default_language) },
    { path: ':lang', component: front_end_language_component_1.FrontEndLanguageComponent, children: [
            { path: '', component: homepage_component_1.HomepageComponent },
            { path: 'buy', component: buy_page_component_1.BuyPageComponent },
            { path: 'send', component: send_page_component_1.SendPageComponent },
            { path: 'swap', component: swap_page_component_1.SwapPageComponent },
            { path: 'spend-pay-for-dental-services', component: spend_page_pay_for_dental_services_component_1.SpendPagePayForDentalServicesComponent },
            { path: 'spend-exchanges', component: spend_page_exchanges_component_1.SpendPageExchangesComponent },
            { path: 'spend-pay-assurance-fees', component: spend_page_pay_assurance_fees_component_1.SpendPagePayAssuranceFeesComponent },
        ] },
    { path: '**', component: not_found_page_component_1.NotFoundPageComponent }
] : [
    { path: '', component: redirect_to_home_component_1.RedirectToHomeComponent },
    { path: ':lang', component: front_end_language_component_1.FrontEndLanguageComponent, children: [
            { path: '', component: homepage_component_1.HomepageComponent },
            { path: 'buy', component: buy_page_component_1.BuyPageComponent },
            { path: 'send', component: send_page_component_1.SendPageComponent },
            { path: 'swap', component: swap_page_component_1.SwapPageComponent },
            { path: 'spend-pay-for-dental-services', component: spend_page_pay_for_dental_services_component_1.SpendPagePayForDentalServicesComponent },
            { path: 'spend-exchanges', component: spend_page_exchanges_component_1.SpendPageExchangesComponent },
            { path: 'spend-pay-assurance-fees', component: spend_page_pay_assurance_fees_component_1.SpendPagePayAssuranceFeesComponent },
        ] },
    { path: '**', component: not_found_page_component_1.NotFoundPageComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
exports.routingComponents = [homepage_component_1.HomepageComponent, buy_page_component_1.BuyPageComponent, send_page_component_1.SendPageComponent, swap_page_component_1.SwapPageComponent, spend_page_pay_for_dental_services_component_1.SpendPagePayForDentalServicesComponent, spend_page_exchanges_component_1.SpendPageExchangesComponent, spend_page_pay_assurance_fees_component_1.SpendPagePayAssuranceFeesComponent, not_found_page_component_1.NotFoundPageComponent, front_end_language_component_1.FrontEndLanguageComponent, redirect_to_home_component_1.RedirectToHomeComponent];


/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var environment_1 = __webpack_require__(/*! ./../environments/environment */ "./src/environments/environment.ts");
var language_service_1 = __webpack_require__(/*! ./_services/language.service */ "./src/app/_services/language.service.ts");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var redirects_service_1 = __webpack_require__(/*! ./_services/redirects.service */ "./src/app/_services/redirects.service.ts");
var router_1 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var router_2 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var AppComponent = /** @class */ (function () {
    function AppComponent(languageService, translate, redirectsService, router) {
        this.languageService = languageService;
        this.translate = translate;
        this.redirectsService = redirectsService;
        this.router = router;
        this.hybrid = environment_1.environment.hybrid;
        this.network = environment_1.environment.network;
        // camp route changing and scroll to top
        this.router.events.subscribe(function (event) {
            if (event instanceof router_2.NavigationEnd) {
                window.scrollTo(0, 0);
            }
        });
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.document.addEventListener('redirectToHomepage', function (e) {
            _this.redirectsService.toHomepage();
        });
    };
    AppComponent.ctorParameters = function () { return [
        { type: language_service_1.LanguageService },
        { type: core_2.TranslateService },
        { type: redirects_service_1.RedirectsService },
        { type: router_1.Router }
    ]; };
    AppComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-root',
            template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html")
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;


/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var platform_browser_1 = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var app_routing_module_1 = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
var http_1 = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var http_loader_1 = __webpack_require__(/*! @ngx-translate/http-loader */ "./node_modules/@ngx-translate/http-loader/fesm5/ngx-translate-http-loader.js");
var app_component_1 = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib_1.__decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                app_routing_module_1.routingComponents
            ],
            imports: [
                platform_browser_1.BrowserModule.withServerTransition({ appId: 'serverApp' }),
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                // ngx-translate and the loader module
                core_2.TranslateModule.forRoot({
                    loader: {
                        provide: core_2.TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [http_1.HttpClient]
                    }
                })
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
// required for AOT compilation
function HttpLoaderFactory(http) {
    return new http_loader_1.TranslateHttpLoader(http, 'assets/jsons/');
}
exports.HttpLoaderFactory = HttpLoaderFactory;


/***/ }),

/***/ "./src/app/buy-page/buy-page.component.ts":
/*!************************************************!*\
  !*** ./src/app/buy-page/buy-page.component.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var platform_browser_1 = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/*declare function getBuyPageData(): any;*/
var BuyPageComponent = /** @class */ (function () {
    function BuyPageComponent(meta, titleService, translate) {
        this.meta = meta;
        this.titleService = titleService;
        this.translate = translate;
        this.titleService.setTitle('Buy Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({ name: 'description', content: 'Dentacoin Wallet App allows users to easily and securely buy Dentacoin (DCN) with USD, Ether (ETH), Bitcoin (BTC) and 100+ other cryptocurrencies.' });
        this.meta.updateTag({ name: 'keywords', content: 'buy dentacoin, how to buy dentacoin, buy dentacoin with usd' });
        this.meta.updateTag({ property: 'og:title', content: 'Buy Dentacoin (DCN) via Dentacoin Wallet App' });
        this.meta.updateTag({ property: 'og:description', content: 'Dentacoin Wallet App allows users to easily and securely buy Dentacoin (DCN) with USD, Ether (ETH), Bitcoin (BTC) and 100+ other cryptocurrencies.' });
        this.meta.updateTag({ property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/buy-dentacoin-wallet-app.png' });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    BuyPageComponent.ctorParameters = function () { return [
        { type: platform_browser_1.Meta },
        { type: platform_browser_1.Title },
        { type: core_2.TranslateService }
    ]; };
    BuyPageComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-buy-page',
            template: __webpack_require__(/*! raw-loader!./buy-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/buy-page/buy-page.component.html")
        })
    ], BuyPageComponent);
    return BuyPageComponent;
}());
exports.BuyPageComponent = BuyPageComponent;


/***/ }),

/***/ "./src/app/front-end-language/front-end-language.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/front-end-language/front-end-language.component.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var router_1 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var router_2 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var environment_prod_1 = __webpack_require__(/*! ./../../environments/environment.prod */ "./src/environments/environment.prod.ts");
var redirects_service_1 = __webpack_require__(/*! ../_services/redirects.service */ "./src/app/_services/redirects.service.ts");
var FrontEndLanguageComponent = /** @class */ (function () {
    function FrontEndLanguageComponent(activatedRoute, translate, router, redirectsService, ngZone) {
        var _this = this;
        this.activatedRoute = activatedRoute;
        this.translate = translate;
        this.router = router;
        this.redirectsService = redirectsService;
        this.ngZone = ngZone;
        this.channelArray = ['de', 'en'];
        this.activatedRoute.params.subscribe(function (params) {
            if (_this.channelArray.indexOf(params['lang']) > -1) {
                if (window.localStorage.getItem('currentLanguage') != null && params['lang'] != window.localStorage.getItem('currentLanguage')) {
                    window.localStorage.setItem('currentLanguage', params['lang']);
                }
                _this.translate.use(params['lang']);
            }
            else {
                _this.translate.use(environment_prod_1.environment.default_language);
                if (params.hasOwnProperty('lang')) {
                    _this.ngZone.run(function () { return _this.router.navigateByUrl(_this.translate.currentLang + '/' + params['lang']); }).then();
                }
                else {
                    _this.router.navigateByUrl(environment_prod_1.environment.default_language);
                }
            }
        });
    }
    FrontEndLanguageComponent.ctorParameters = function () { return [
        { type: router_1.ActivatedRoute },
        { type: core_2.TranslateService },
        { type: router_2.Router },
        { type: redirects_service_1.RedirectsService },
        { type: core_1.NgZone }
    ]; };
    FrontEndLanguageComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-front-end-language',
            template: '<router-outlet></router-outlet>'
        })
    ], FrontEndLanguageComponent);
    return FrontEndLanguageComponent;
}());
exports.FrontEndLanguageComponent = FrontEndLanguageComponent;


/***/ }),

/***/ "./src/app/homepage/homepage.component.ts":
/*!************************************************!*\
  !*** ./src/app/homepage/homepage.component.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var platform_browser_1 = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/*declare function getHomepageData(): any;*/
var HomepageComponent = /** @class */ (function () {
    function HomepageComponent(meta, titleService, translate) {
        this.meta = meta;
        this.titleService = titleService;
        this.translate = translate;
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
        { type: platform_browser_1.Meta },
        { type: platform_browser_1.Title },
        { type: core_2.TranslateService }
    ]; };
    HomepageComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-homepage',
            template: __webpack_require__(/*! raw-loader!./homepage.component.html */ "./node_modules/raw-loader/index.js!./src/app/homepage/homepage.component.html")
        })
    ], HomepageComponent);
    return HomepageComponent;
}());
exports.HomepageComponent = HomepageComponent;


/***/ }),

/***/ "./src/app/not-found-page/not-found-page.component.ts":
/*!************************************************************!*\
  !*** ./src/app/not-found-page/not-found-page.component.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var NotFoundPageComponent = /** @class */ (function () {
    function NotFoundPageComponent() {
    }
    NotFoundPageComponent.prototype.ngOnInit = function () {
    };
    NotFoundPageComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-not-found-page',
            template: __webpack_require__(/*! raw-loader!./not-found-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/not-found-page/not-found-page.component.html")
        })
    ], NotFoundPageComponent);
    return NotFoundPageComponent;
}());
exports.NotFoundPageComponent = NotFoundPageComponent;


/***/ }),

/***/ "./src/app/redirect-to-home/redirect-to-home.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/redirect-to-home/redirect-to-home.component.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var environment_1 = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
var RedirectToHomeComponent = /** @class */ (function () {
    function RedirectToHomeComponent() {
        var currentLang = window.localStorage.getItem('currentLanguage') ? window.localStorage.getItem('currentLanguage') : environment_1.environment.default_language;
        window.location.href = window.location.href + currentLang;
    }
    RedirectToHomeComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-redirect-to-home',
            template: '<router-outlet></router-outlet>'
        })
    ], RedirectToHomeComponent);
    return RedirectToHomeComponent;
}());
exports.RedirectToHomeComponent = RedirectToHomeComponent;


/***/ }),

/***/ "./src/app/send-page/send-page.component.ts":
/*!**************************************************!*\
  !*** ./src/app/send-page/send-page.component.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var platform_browser_1 = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/*declare function getSendPageData(): any;*/
var SendPageComponent = /** @class */ (function () {
    function SendPageComponent(meta, titleService, translate) {
        this.meta = meta;
        this.titleService = titleService;
        this.translate = translate;
        this.titleService.setTitle('Send Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({ name: 'description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!' });
        this.meta.updateTag({ name: 'keywords', content: 'send dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin' });
        this.meta.updateTag({ property: 'og:title', content: 'Send Dentacoin (DCN) via Dentacoin Wallet App' });
        this.meta.updateTag({ property: 'og:description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!' });
        this.meta.updateTag({ property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/send-dentacoin-wallet-app.png' });
        this.meta.updateTag({ property: 'og:image:width', content: '1200' });
        this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    SendPageComponent.ctorParameters = function () { return [
        { type: platform_browser_1.Meta },
        { type: platform_browser_1.Title },
        { type: core_2.TranslateService }
    ]; };
    SendPageComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-send-page',
            template: __webpack_require__(/*! raw-loader!./send-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/send-page/send-page.component.html")
        })
    ], SendPageComponent);
    return SendPageComponent;
}());
exports.SendPageComponent = SendPageComponent;


/***/ }),

/***/ "./src/app/spend-page-exchanges/spend-page-exchanges.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/spend-page-exchanges/spend-page-exchanges.component.ts ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var router_1 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var platform_browser_1 = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var redirects_service_1 = __webpack_require__(/*! ../_services/redirects.service */ "./src/app/_services/redirects.service.ts");
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
        { type: router_1.Router },
        { type: platform_browser_1.Meta },
        { type: platform_browser_1.Title },
        { type: redirects_service_1.RedirectsService }
    ]; };
    SpendPageExchangesComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-spend-page-exchanges',
            template: __webpack_require__(/*! raw-loader!./spend-page-exchanges.component.html */ "./node_modules/raw-loader/index.js!./src/app/spend-page-exchanges/spend-page-exchanges.component.html")
        })
    ], SpendPageExchangesComponent);
    return SpendPageExchangesComponent;
}());
exports.SpendPageExchangesComponent = SpendPageExchangesComponent;


/***/ }),

/***/ "./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.ts ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var router_1 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var platform_browser_1 = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var redirects_service_1 = __webpack_require__(/*! ../_services/redirects.service */ "./src/app/_services/redirects.service.ts");
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
        { type: router_1.Router },
        { type: platform_browser_1.Meta },
        { type: platform_browser_1.Title },
        { type: redirects_service_1.RedirectsService }
    ]; };
    SpendPagePayAssuranceFeesComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-spend-page-pay-assurance-fees',
            template: __webpack_require__(/*! raw-loader!./spend-page-pay-assurance-fees.component.html */ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component.html")
        })
    ], SpendPagePayAssuranceFeesComponent);
    return SpendPagePayAssuranceFeesComponent;
}());
exports.SpendPagePayAssuranceFeesComponent = SpendPagePayAssuranceFeesComponent;


/***/ }),

/***/ "./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.ts":
/*!****************************************************************************************************!*\
  !*** ./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.ts ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var router_1 = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var platform_browser_1 = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var redirects_service_1 = __webpack_require__(/*! ../_services/redirects.service */ "./src/app/_services/redirects.service.ts");
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
        { type: router_1.Router },
        { type: platform_browser_1.Meta },
        { type: platform_browser_1.Title },
        { type: redirects_service_1.RedirectsService }
    ]; };
    SpendPagePayForDentalServicesComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-spend-page-pay-for-dental-services',
            template: __webpack_require__(/*! raw-loader!./spend-page-pay-for-dental-services.component.html */ "./node_modules/raw-loader/index.js!./src/app/spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component.html")
        })
    ], SpendPagePayForDentalServicesComponent);
    return SpendPagePayForDentalServicesComponent;
}());
exports.SpendPagePayForDentalServicesComponent = SpendPagePayForDentalServicesComponent;


/***/ }),

/***/ "./src/app/swap-page/swap-page.component.ts":
/*!**************************************************!*\
  !*** ./src/app/swap-page/swap-page.component.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var core_2 = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var SwapPageComponent = /** @class */ (function () {
    function SwapPageComponent(translate) {
        this.translate = translate;
    }
    SwapPageComponent.prototype.ngOnInit = function () {
    };
    SwapPageComponent.ctorParameters = function () { return [
        { type: core_2.TranslateService }
    ]; };
    SwapPageComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-swap-page',
            template: __webpack_require__(/*! raw-loader!./swap-page.component.html */ "./node_modules/raw-loader/index.js!./src/app/swap-page/swap-page.component.html")
        })
    ], SwapPageComponent);
    return SwapPageComponent;
}());
exports.SwapPageComponent = SwapPageComponent;


/***/ }),

/***/ "./src/environments/environment.prod.ts":
/*!**********************************************!*\
  !*** ./src/environments/environment.prod.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: true,
    hybrid: false,
    default_language: 'en',
    network: 'mainnet'
};


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false,
    hybrid: true,
    default_language: 'en',
    network: 'mainnet'
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var platform_browser_dynamic_1 = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
var app_module_1 = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
var environment_1 = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
document.addEventListener('DOMContentLoaded', function () {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
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