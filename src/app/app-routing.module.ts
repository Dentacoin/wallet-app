import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { SendPageComponent } from './send-page/send-page.component';
import { SpendPageComponent } from './spend-page/spend-page.component';

const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'buy', component: BuyPageComponent },
    { path: 'send', component: SendPageComponent },
    { path: 'spend', component: SpendPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})

export class AppRoutingModule {}

export const routingComponents = [HomepageComponent, BuyPageComponent, SendPageComponent, SpendPageComponent]