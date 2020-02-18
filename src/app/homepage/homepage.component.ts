import { Component, AfterViewInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import {Router} from '@angular/router';

/*declare function getHomepageData(): any;*/

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html'
})

export class HomepageComponent implements AfterViewInit {
    constructor(private meta: Meta, private titleService: Title) {
        this.titleService.setTitle('Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens');
        this.meta.updateTag({type: 'description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.'});
        this.meta.updateTag({type: 'keywords', content: 'buy dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin'});
        this.meta.updateTag({type: 'og:title', content: 'Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens'});
        this.meta.updateTag({type: 'og:description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.'});
        this.meta.updateTag({type: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-wallet-dapp.png'});
    }

    ngAfterViewInit() {
        /*getHomepageData();*/
    }
}