import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class RedirectsService {
    constructor(private router: Router) {
    }

    toSend() {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('send');
    }

    toPayForDentalServices() {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('spend-pay-for-dental-services');
    }

    toPayAssuranceFees() {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('spend-pay-assurance-fees');
    }

    toExchanges() {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('spend-exchanges');
    }
}
