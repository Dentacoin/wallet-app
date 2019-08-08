import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendPageExchangesComponent } from './spend-page-exchanges.component';

describe('SpendPageExchangesComponent', () => {
  let component: SpendPageExchangesComponent;
  let fixture: ComponentFixture<SpendPageExchangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendPageExchangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendPageExchangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
