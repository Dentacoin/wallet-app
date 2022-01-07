import { Component } from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

/*declare function getSendPageData(): any;*/

@Component({
  selector: 'app-send-page',
  templateUrl: './send-page.component.html'
})

export class SendPageComponent {
    constructor(private meta: Meta, private titleService: Title, public translate: TranslateService) {
        this.titleService.setTitle('Send Dentacoin (DCN) via Dentacoin Wallet App');
        this.meta.updateTag({name: 'description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!'});
        this.meta.updateTag({name: 'keywords', content: 'send dentacoin, store dentacoin, dentacoin wallet, pay with dentacoin'});
        this.meta.updateTag({property: 'og:title', content: 'Send Dentacoin (DCN) via Dentacoin Wallet App'});
        this.meta.updateTag({property: 'og:description', content: 'Dentacoin Wallet App enables sending DCN tokens to any valid Ethereum address. Fast, secure and easier than ever!'});
        this.meta.updateTag({property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/send-dentacoin-wallet-app.png'});
        this.meta.updateTag({property: 'og:image:width', content: '1200'});
        this.meta.updateTag({property: 'og:image:height', content: '630'});
    }
}
