import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlikPaymentComponent } from './blik-payment.component';

describe('BlikPaymentComponent', () => {
  let component: BlikPaymentComponent;
  let fixture: ComponentFixture<BlikPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlikPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlikPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
