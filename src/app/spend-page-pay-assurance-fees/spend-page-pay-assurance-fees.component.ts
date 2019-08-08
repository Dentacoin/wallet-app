import {Component, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';

declare function initdApp(): any;

@Component({
    selector: 'app-spend-page-pay-assurance-fees',
    templateUrl: './spend-page-pay-assurance-fees.component.html'
})

export class SpendPagePayAssuranceFeesComponent implements AfterViewInit {
    constructor(private router: Router) { }

    ngAfterViewInit() {
        initdApp();
    }

    toExchanges() {
        this.router.navigateByUrl('spend-exchanges');
    }

    toPayForDentalServices() {
        this.router.navigateByUrl('spend-pay-for-dental-services');
    }

}
