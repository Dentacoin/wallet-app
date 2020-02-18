import {AfterViewInit, Component} from '@angular/core';
import { Router } from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';

/*declare function getSpendPageGiftCards(): any;*/

@Component({
  selector: 'app-spend-page-gift-cards',
  templateUrl: './spend-page-gift-cards.component.html'
})

export class SpendPageGiftCardsComponent implements AfterViewInit {
  constructor(private router: Router, private meta: Meta, private titleService: Title) {
      this.titleService.setTitle('Buy giftcards with Dentacoin | Dentacoin Wallet DApp');
      this.meta.updateTag({name: 'description', content: 'From coffee to clothes, books and hotel bookings, you can purchase online gift cards for various major brands with Dentacoin (DCN).'});
      this.meta.updateTag({name: 'keywords', content: 'spend dentacoin online, gift cards dentacoin, bidali gift cards, online gift cards'});
      this.meta.updateTag({property: 'og:title', content: 'Buy giftcards online with Dentacoin'});
      this.meta.updateTag({property: 'og:description', content: 'From coffee to clothes, books and hotel bookings, you can purchase online gift cards for various major brands with Dentacoin (DCN).'});
      this.meta.updateTag({property: 'og:image', content: 'https://wallet.dentacoin.com/assets/images/gift-cards-dentacoin-wallet.png'});
      this.meta.updateTag({property: 'og:image:width', content: '1200'});
      this.meta.updateTag({property: 'og:image:height', content: '630'});
  }

  ngAfterViewInit() {
      //getSpendPageGiftCards();
  }

  toExchanges() {
    this.router.navigateByUrl('spend-exchanges');
  }

  toPayForDentalServices() {
    this.router.navigateByUrl('spend-pay-for-dental-services');
  }

}
