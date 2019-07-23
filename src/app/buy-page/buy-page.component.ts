import {Component, AfterViewInit} from '@angular/core';

declare function getBuyPageData(): any;

@Component({
    selector: 'app-buy-page',
    templateUrl: './buy-page.component.html',
    styleUrls: ['./buy-page.component.css']
})

export class BuyPageComponent implements AfterViewInit {
    ngAfterViewInit() {
        getBuyPageData();
    }
}
