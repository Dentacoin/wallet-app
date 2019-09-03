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
    href;
    constructor(private meta: Meta, private titleService: Title, private sanitizer: DomSanitizer, private router: Router) {
        this.titleService.setTitle('Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens');
        this.meta.updateTag({name: 'description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.'});
        this.meta.updateTag({name: 'keywords', content: 'buy dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin'});
        this.meta.updateTag({name: 'og:title', content: 'Dentacoin Wallet App: Buy, Store & Manage Your DCN Tokens'});
        this.meta.updateTag({name: 'og:description', content: 'Dentacoin Wallet allows users to easily and securely store, send, receive DCN tokens, as well as to buy DCN with credit card and other cryptocurrencies.'});
        this.meta.updateTag({name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-wallet-dapp.png'});


        const data = 'some text';
        const blob = new Blob([data], { type: 'application/octet-stream' });
        this.href = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
        this.href = this.href.changingThisBreaksApplicationSecurity;
    }

    ngAfterViewInit() {
        /*getHomepageData();*/
    }

    toExternalLink() {
        this.router.navigateByUrl(this.href);
    }
}