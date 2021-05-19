import {Component, NgZone} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {environment} from './../../environments/environment.prod';
import {RedirectsService} from '../_services/redirects.service';

@Component({
    selector: 'app-front-end-language',
    template: '<router-outlet></router-outlet>'
})
export class FrontEndLanguageComponent {
    channelArray: Array<string> = ['de', 'en'];

    constructor(public activatedRoute: ActivatedRoute, public translate: TranslateService, public router: Router, public redirectsService: RedirectsService, private ngZone: NgZone) {
        this.activatedRoute.params.subscribe( (params : Params) => {
            if (this.channelArray.indexOf(params['lang']) > -1) {
                if (window.localStorage.getItem('currentLanguage') != null && params['lang'] != window.localStorage.getItem('currentLanguage')) {
                    window.localStorage.setItem('currentLanguage', params['lang']);
                }
                this.translate.use(params['lang']);
            } else {
                this.translate.use(environment.default_language);
                if (params.hasOwnProperty('lang')) {
                    this.ngZone.run(() => this.router.navigateByUrl(this.translate.currentLang + '/' + params['lang'])).then();
                } else {
                    this.router.navigateByUrl(environment.default_language);
                }
            }
        });
    }
}