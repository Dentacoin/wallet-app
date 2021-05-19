import {Component} from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
    selector: 'app-redirect-to-home',
    template: '<router-outlet></router-outlet>'
})
export class RedirectToHomeComponent {

    constructor() {
        const currentLang = window.localStorage.getItem('currentLanguage') ? window.localStorage.getItem('currentLanguage') : environment.default_language;

        window.location.href = window.location.href + currentLang;
    }
}