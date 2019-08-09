import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { FaqComponent } from './faq/faq.component';

@NgModule({
    declarations: [
        AppComponent,
        routingComponents,
        FaqComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap: [AppComponent]
})

export class AppModule { }