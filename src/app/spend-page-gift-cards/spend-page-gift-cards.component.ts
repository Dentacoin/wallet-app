import {AfterViewInit, Component} from '@angular/core';
import { Router } from '@angular/router';

declare function getSpendPageGiftCards(): any;

@Component({
  selector: 'app-spend-page-gift-cards',
  templateUrl: './spend-page-gift-cards.component.html'
})

export class SpendPageGiftCardsComponent implements AfterViewInit {
  constructor(private router: Router) { }

  ngAfterViewInit() {
      getSpendPageGiftCards();
  }

  toExchanges() {
    this.router.navigateByUrl('spend-exchanges');
  }

  toPayForDentalServices() {
    this.router.navigateByUrl('spend-pay-for-dental-services');
  }

}
