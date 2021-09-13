import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { SendPageComponent } from './send-page/send-page.component';
import { SwapPageComponent } from './swap-page/swap-page.component';
import { SpendPagePayForDentalServicesComponent } from './spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component';
import { SpendPageExchangesComponent } from './spend-page-exchanges/spend-page-exchanges.component';
import { SpendPagePayAssuranceFeesComponent } from './spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FrontEndLanguageComponent } from './front-end-language/front-end-language.component';
import { RedirectToHomeComponent } from './redirect-to-home/redirect-to-home.component';
import {environment} from '../environments/environment';

const routes: Routes = environment.hybrid ? [
    {path: '', pathMatch: 'full', redirectTo: '/' + (window.localStorage.getItem('currentLanguage') ? window.localStorage.getItem('currentLanguage') : environment.default_language)},
    {path: ':lang', component: FrontEndLanguageComponent, children: [
            {path: '', component: HomepageComponent},
            {path: 'buy', component: BuyPageComponent},
            {path: 'send', component: SendPageComponent},
            {path: 'swap', component: SwapPageComponent},
            {path: 'spend-pay-for-dental-services', component: SpendPagePayForDentalServicesComponent},
            {path: 'spend-exchanges', component: SpendPageExchangesComponent},
            {path: 'spend-pay-assurance-fees', component: SpendPagePayAssuranceFeesComponent},
        ]},
    {path: '**', component: NotFoundPageComponent}
] : [
    {path: '', component: RedirectToHomeComponent},
    {path: ':lang', component: FrontEndLanguageComponent, children: [
            {path: '', component: HomepageComponent},
            {path: 'buy', component: BuyPageComponent},
            {path: 'send', component: SendPageComponent},
            {path: 'swap', component: SwapPageComponent},
            {path: 'spend-pay-for-dental-services', component: SpendPagePayForDentalServicesComponent},
            {path: 'spend-exchanges', component: SpendPageExchangesComponent},
            {path: 'spend-pay-assurance-fees', component: SpendPagePayAssuranceFeesComponent},
        ]},
    {path: '**', component: NotFoundPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})

export class AppRoutingModule {}

export const routingComponents = [HomepageComponent, BuyPageComponent, SendPageComponent, SwapPageComponent, SpendPagePayForDentalServicesComponent, SpendPageExchangesComponent, SpendPagePayAssuranceFeesComponent, NotFoundPageComponent, FrontEndLanguageComponent, RedirectToHomeComponent];