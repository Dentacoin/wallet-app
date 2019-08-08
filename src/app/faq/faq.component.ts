import {AfterViewInit, Component} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

declare function getFaqPageData(): any;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})

export class FaqComponent implements AfterViewInit {
    constructor(private meta: Meta, private titleService: Title) {
        this.titleService.setTitle('Dentacoin Wallet dApp: Frequently Asked Questions');
        this.meta.updateTag({name: 'description', content: 'Where to store Dentacoin tokens? How to create a Dentacoin Wallet? How to buy DCN? Find the answers to all your questions here.'});
        this.meta.updateTag({name: 'keywords', content: 'dentacoin wallet, dcn wallet, how to buy dentacoin, how to buy dcn, store dentacoin, store dcn'});
        this.meta.updateTag({name: 'og:title', content: 'Dentacoin Wallet dApp: Frequently Asked Questions'});
        this.meta.updateTag({name: 'og:description', content: 'Where to store Dentacoin tokens? How to create a Dentacoin Wallet? How to buy DCN? Find the answers to all your questions here.'});
        this.meta.updateTag({name: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/faq-wallet.png'});
    }

    ngAfterViewInit() {
        getFaqPageData();
    }
}
