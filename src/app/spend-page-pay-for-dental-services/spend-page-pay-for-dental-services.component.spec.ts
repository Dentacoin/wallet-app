import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendPagePayForDentalServicesComponent } from './spend-page-pay-for-dental-services.component';

describe('SpendPagePayForDentalServicesComponent', () => {
  let component: SpendPagePayForDentalServicesComponent;
  let fixture: ComponentFixture<SpendPagePayForDentalServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendPagePayForDentalServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendPagePayForDentalServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
