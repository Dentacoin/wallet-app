import { Component, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {RedirectsService} from '../_services/redirects.service';

/*declare function getSpendPageExchanges(): any;*/

@Component({
  selector: 'app-spend-page-exchanges',
  templateUrl: './spend-page-exchanges.component.html'
})

export class SpendPageExchangesComponent implements AfterViewInit {
    constructor(private router: Router, private meta: Meta, private titleService: Title, public redirectsService: RedirectsService) {
        this.titleService.setTitle('Dentacoin (DCN) trading exchanges list | Dentacoin Wallet DApp');
        this.meta.updateTag({name: 'description', content: 'Find the full list of trusted exchange platforms which support Dentacoin (DCN) cryptocurrency.'});
        this.meta.updateTag({name: 'keywords', content: 'dentacoin exchanges, trade dentacoin, dcn currency, dcn crypto'});
        this.meta.updateTag({property: 'og:title', content: 'Dentacoin (DCN) trading exchanges list'});
        this.meta.updateTag({property: 'og:description', content: 'Find the full list of trusted exchange platforms which support Dentacoin (DCN) cryptocurrency.'});
        this.meta.updateTag({property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentacoin-exchanges-list.png'});
        this.meta.updateTag({property: 'og:image:width', content: '1200'});
        this.meta.updateTag({property: 'og:image:height', content: '630'});
    }

    ngAfterViewInit() {

    }
}
