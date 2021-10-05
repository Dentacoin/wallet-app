import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class RedirectsService {
    constructor(private router: Router, private translate: TranslateService, private ngZone: NgZone) {
    }

    toHomepage() {
        window.scrollTo(0, 0);
        this.ngZone.run(() => this.router.navigateByUrl(this.translate.currentLang)).then();
    }

    toBuyPage() {
        window.scrollTo(0, 0);
        this.ngZone.run(() => this.router.navigateByUrl(this.translate.currentLang + '/buy')).then();
    }

    toSend() {
        window.scrollTo(0, 0);
        this.ngZone.run(() => this.router.navigateByUrl(this.translate.currentLang + '/send')).then();
    }

    toSwap() {
        window.scrollTo(0, 0);
        this.ngZone.run(() => this.router.navigateByUrl(this.translate.currentLang + '/swap')).then();
    }

    toPayForDentalServices() {
        window.scrollTo(0, 0);
        this.ngZone.run(() => this.router.navigateByUrl(this.translate.currentLang + '/spend-pay-for-dental-services')).then();
    }

    toPayAssuranceFees() {
        window.scrollTo(0, 0);
        this.ngZone.run(() => this.router.navigateByUrl(this.translate.currentLang + '/spend-pay-assurance-fees')).then();
    }

    toExchanges() {
        window.scrollTo(0, 0);
        this.ngZone.run(() => this.router.navigateByUrl(this.translate.currentLang + '/spend-exchanges')).then();
    }
}
