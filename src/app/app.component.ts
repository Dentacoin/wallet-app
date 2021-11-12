import { Component, OnInit } from '@angular/core';
import { environment } from './../environments/environment';
import { LanguageService } from './_services/language.service';
import { TranslateService } from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {RedirectsService} from './_services/redirects.service';
import {Router} from '@angular/router';
import { NavigationStart, NavigationError, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    hybrid = environment.hybrid;
    network = environment.network;

    constructor(public languageService: LanguageService, public translate: TranslateService, public redirectsService: RedirectsService, private router: Router) {
        // camp route changing and scroll to top
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);
            }
        });
    }

    ngOnInit() {
        window.document.addEventListener('redirectToHomepage', (e: any) => {
            this.redirectsService.toHomepage();
        });
    }
}