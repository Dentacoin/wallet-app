import {Component} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

/*declare function getBuyPageData(): any;*/

@Component({
    selector: 'app-buy-page',
    templateUrl: './buy-page.component.html'
})

export class BuyPageComponent {
    constructor(private meta: Meta, private titleService: Title, public translate: TranslateService) {
        this.titleService.setTitle('Buy Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({name: 'description', content: 'Dentacoin Wallet App allows users to easily and securely buy Dentacoin (DCN) with USD, Ether (ETH), Bitcoin (BTC) and 100+ other cryptocurrencies.'});
        this.meta.updateTag({name: 'keywords', content: 'buy dentacoin, how to buy dentacoin, buy dentacoin with usd'});
        this.meta.updateTag({property: 'og:title', content: 'Buy Dentacoin (DCN) via Dentacoin Wallet App'});
        this.meta.updateTag({property: 'og:description', content: 'Dentacoin Wallet App allows users to easily and securely buy Dentacoin (DCN) with USD, Ether (ETH), Bitcoin (BTC) and 100+ other cryptocurrencies.'});
        this.meta.updateTag({property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/buy-dentacoin-wallet-app.png'});
        this.meta.updateTag({property: 'og:image:width', content: '1200'});
        this.meta.updateTag({property: 'og:image:height', content: '630'});
    }
}