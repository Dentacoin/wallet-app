import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { SendPageComponent } from './send-page/send-page.component';
import { FaqComponent } from './faq/faq.component';
import { SpendPagePayForDentalServicesComponent } from './spend-page-pay-for-dental-services/spend-page-pay-for-dental-services.component';
import { SpendPageGiftCardsComponent } from './spend-page-gift-cards/spend-page-gift-cards.component';
import { SpendPageExchangesComponent } from './spend-page-exchanges/spend-page-exchanges.component';
import { SpendPagePayAssuranceFeesComponent } from './spend-page-pay-assurance-fees/spend-page-pay-assurance-fees.component';

const routes: Routes = [
    {path: '', component: HomepageComponent},
    {path: 'buy', component: BuyPageComponent},
    {path: 'send', component: SendPageComponent},
    {path: 'faq', component: FaqComponent},
    {path: 'spend-pay-for-dental-services', component: SpendPagePayForDentalServicesComponent},
    {path: 'spend-gift-cards', component: SpendPageGiftCardsComponent},
    {path: 'spend-exchanges', component: SpendPageExchangesComponent},
    {path: 'spend-pay-assurance-fees', component: SpendPagePayAssuranceFeesComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})

export class AppRoutingModule {}

export const routingComponents = [HomepageComponent, BuyPageComponent, SendPageComponent, FaqComponent, SpendPagePayForDentalServicesComponent, SpendPageGiftCardsComponent, SpendPageExchangesComponent, SpendPagePayAssuranceFeesComponent]