import { Component, OnInit, AfterViewInit } from '@angular/core';

declare function getHomepageData(): any;

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit {
    ngOnInit() {
    }
    ngAfterViewInit() {
        getHomepageData();
    }
}