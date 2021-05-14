import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { LanguageService } from './_services/language.service';
import { TranslateService } from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {RedirectsService} from './_services/redirects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
    hybrid = environment.hybrid;
    network = environment.network;

    constructor(public languageService: LanguageService, public translate: TranslateService, public redirectsService: RedirectsService) {}
}