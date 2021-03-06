import {Component, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {RedirectsService} from '../_services/redirects.service';

/*declare function initdApp(): any;*/

@Component({
    selector: 'app-spend-page-pay-assurance-fees',
    templateUrl: './spend-page-pay-assurance-fees.component.html'
})

export class SpendPagePayAssuranceFeesComponent implements AfterViewInit {
    constructor(private router: Router, private meta: Meta, private titleService: Title, public redirectsService: RedirectsService) {
        this.titleService.setTitle('Pay Dentacoin Assurance fees | Dentacoin Wallet DApp');
        this.meta.updateTag({name: 'description', content: 'Pay your Dentacoin Assurance monthly premium easily and securely and enjoy the benefits of a prevention-focused dental plan.'});
        this.meta.updateTag({name: 'keywords', content: 'dental plan payment, dental insurance, dentacoin assurance fee'});
        this.meta.updateTag({property: 'og:title', content: 'Pay Dentacoin Assurance fees'});
        this.meta.updateTag({property: 'og:description', content: 'Pay your Dentacoin Assurance monthly premium easily and securely and enjoy the benefits of a prevention-focused dental plan.'});
        this.meta.updateTag({property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/pay-dental-assurance-dentacoin.png'});
        this.meta.updateTag({property: 'og:image:width', content: '1200'});
        this.meta.updateTag({property: 'og:image:height', content: '630'});
    }

    ngAfterViewInit() {

    }
}
