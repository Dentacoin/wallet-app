import { Component, OnInit } from '@angular/core';
import {LanguageService} from '../_services/language.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-swap-page',
  templateUrl: './swap-page.component.html'
})
export class SwapPageComponent implements OnInit {

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
