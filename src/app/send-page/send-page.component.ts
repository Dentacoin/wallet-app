import { Component, AfterViewInit } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

declare function getSendPageData(): any;

@Component({
  selector: 'app-send-page',
  templateUrl: './send-page.component.html'
})

export class SendPageComponent implements AfterViewInit {
    constructor(private meta: Meta, private titleService: Title) {
        this.titleService.setTitle('Send Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({name: 'description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!'});
        this.meta.updateTag({name: 'keywords', content: 'send dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin'});
        this.meta.updateTag({name: 'og:title', content: 'Send Dentacoin (DCN) via Dentacoin Wallet App'});
        this.meta.updateTag({name: 'og:description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!'});
        this.meta.updateTag({name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/send-wallet.png'});
    }

    ngAfterViewInit() {
        getSendPageData();
    }
}
