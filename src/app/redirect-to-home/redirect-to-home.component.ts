import {Component, NgZone, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Component({
    selector: 'app-redirect-to-home',
    template: '<router-outlet></router-outlet>'
})
export class RedirectToHomeComponent implements OnInit {

    constructor(private router: Router, private ngZone: NgZone) {
    }

    ngOnInit() {
        const currentLang = window.localStorage.getItem('currentLanguage') ? window.localStorage.getItem('currentLanguage') : environment.default_language;

        window.scrollTo(0, 0);
        this.ngZone.run(() => this.router.navigateByUrl(currentLang)).then();
    }
}
