import { Component, AfterViewInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

/*declare function getHomepageData(): any;*/

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html'
})

export class HomepageComponent implements AfterViewInit {
    constructor(private meta: Meta, private titleService: Title, public translate: TranslateService) {
        this.titleService.setTitle('Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens');
        this.meta.updateTag({name: 'description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.'});
        this.meta.updateTag({name: 'keywords', content: 'buy dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin'});
        this.meta.updateTag({property: 'og:title', content: 'Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens'});
        this.meta.updateTag({property: 'og:description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.'});
        this.meta.updateTag({property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-wallet-dapp.png'});
        this.meta.updateTag({property: 'og:image:width', content: '1200'});
        this.meta.updateTag({property: 'og:image:height', content: '630'});
    }

    ngAfterViewInit() {
        /*getHomepageData();*/
    }
}