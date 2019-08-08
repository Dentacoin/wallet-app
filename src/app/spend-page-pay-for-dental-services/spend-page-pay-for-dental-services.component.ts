import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

declare function initdApp(): any;

@Component({
  selector: 'app-spend-page-pay-for-dental-services',
  templateUrl: './spend-page-pay-for-dental-services.component.html'
})

export class SpendPagePayForDentalServicesComponent implements AfterViewInit {
    constructor(private router: Router) { }

    ngAfterViewInit() {
        initdApp();
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
