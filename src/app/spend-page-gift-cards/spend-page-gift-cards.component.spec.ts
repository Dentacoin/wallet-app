import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendPageGiftCardsComponent } from './spend-page-gift-cards.component';

describe('SpendPageGiftCardsComponent', () => {
  let component: SpendPageGiftCardsComponent;
  let fixture: ComponentFixture<SpendPageGiftCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendPageGiftCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendPageGiftCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
