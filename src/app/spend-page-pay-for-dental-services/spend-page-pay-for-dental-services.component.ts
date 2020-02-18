import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

/*declare function initdApp(): any;*/

@Component({
  selector: 'app-spend-page-pay-for-dental-services',
  templateUrl: './spend-page-pay-for-dental-services.component.html'
})

export class SpendPagePayForDentalServicesComponent implements AfterViewInit {
    constructor(private router: Router, private meta: Meta, private titleService: Title) {
        this.titleService.setTitle('Pay for dental services in Dentacoin | Dentacoin Wallet DApp');
        this.meta.updateTag({name: 'description', content: 'Cover your dental treatment in Dentacoin tokens at all partner dentists, accepting DCN. Pay directly with ease via Dentacoin Wallet DApp.'});
        this.meta.updateTag({name: 'keywords', content: 'dentacoin accepted, dental currency, dental payment, spend dentacoin, pay with dentacoin'});
        this.meta.updateTag({property: 'og:title', content: 'Pay for dental services with Dentacoin'});
        this.meta.updateTag({property: 'og:description', content: 'Cover your dental treatment in Dentacoin tokens at all partner dentists and clinics, accepting DCN. Handle payments with ease via Dentacoin Wallet DApp.'});
        this.meta.updateTag({property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/dentist-pay-with-dentacoin.png'});
        this.meta.updateTag({property: 'og:image:width', content: '1200'});
        this.meta.updateTag({property: 'og:image:height', content: '630'});
    }

    ngAfterViewInit() {
        //initdApp();
    }

    toSend() {
        this.router.navigateByUrl('send');
    }

    toGiftCards() {
        this.router.navigateByUrl('spend-gift-cards');
    }

    toPayAssuranceFees() {
        this.router.navigateByUrl('spend-pay-assurance-fees');
    }
}
