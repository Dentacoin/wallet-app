import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendPageComponent } from './spend-page.component';

describe('SpendPageComponent', () => {
  let component: SpendPageComponent;
  let fixture: ComponentFixture<SpendPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
