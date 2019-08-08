import { Component, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';

declare function getSpendPageExchanges(): any;

@Component({
  selector: 'app-spend-page-exchanges',
  templateUrl: './spend-page-exchanges.component.html'
})

export class SpendPageExchangesComponent implements AfterViewInit {
    constructor(private router: Router) { }

    ngAfterViewInit() {
        getSpendPageExchanges();
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
