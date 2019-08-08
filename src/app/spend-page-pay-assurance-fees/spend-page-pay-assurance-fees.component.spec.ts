import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendPagePayAssuranceFeesComponent } from './spend-page-pay-assurance-fees.component';

describe('SpendPagePayAssuranceFeesComponent', () => {
  let component: SpendPagePayAssuranceFeesComponent;
  let fixture: ComponentFixture<SpendPagePayAssuranceFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendPagePayAssuranceFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendPagePayAssuranceFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
