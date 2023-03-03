import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CouponCode, CouponCodesService } from './coupon-codes.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('CouponCodesService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [CouponCodesService],
      imports: [HttpClientTestingModule],
    });
  });

  const defaultState = {
    name: '',
    discount: 0,
    active: false,
  };

  it('initial state', (done) => {
    const state = TestBed.inject(EnvironmentInjector).get(CouponCodesService);

    state.couponCodeState$.subscribe((coupon) => {
      expect(coupon).toEqual(defaultState);
      done();
    });
  });

  it('add coupon with patch', (done) => {
    const state = TestBed.inject(EnvironmentInjector).get(CouponCodesService);

    const newCouponState: CouponCode = {
      id: 1,
      name: 'new-coupon',
      discount: 0.2,
      active: false,
    };
    state['patchState'](newCouponState);

    state.couponCodeState$.subscribe((coupon) => {
      expect(coupon.id).toEqual(newCouponState.id);
      expect(coupon.discount).toEqual(newCouponState.discount);
      expect(coupon.active).toEqual(newCouponState.active);
      done();
    });
  });

  it('set coupon code', (done) => {
    const expectedUrl = '/couponCodes?name=new-coupon';
    const service = TestBed.inject(EnvironmentInjector).get(CouponCodesService);
    const httpController = TestBed.inject(HttpTestingController);

    const newCouponState: CouponCode = {
      id: 1,
      name: 'new-coupon',
      discount: 0.2,
      active: false,
    };
    service.setCouponCodeDiscount('new-coupon').subscribe({
      next: ([res]) => {
        expect(res).toEqual(newCouponState);
      },
    });

    const req = httpController.expectOne(expectedUrl);

    req.flush([newCouponState]);

    service.couponCodeState$.subscribe((coupon) => {
      expect(coupon.id).toEqual(newCouponState.id);
      expect(coupon.discount).toEqual(newCouponState.discount);
      expect(coupon.active).toEqual(newCouponState.active);
      done();
    });
  });

  it('reset coupon state', (done) => {
    const state = TestBed.inject(EnvironmentInjector).get(CouponCodesService);

    const defaultCouponState: CouponCode = {
      name: '',
      discount: 0,
      active: false,
    };

    state.resetCouponState();

    state.couponCodeState$.subscribe((coupon) => {
      expect(coupon.id).toEqual(defaultCouponState.id);
      expect(coupon.discount).toEqual(defaultCouponState.discount);
      expect(coupon.active).toEqual(defaultCouponState.active);
      done();
    });
  });

  it('check if coupon code is valid', (done) => {
    const expectedUrl = '/couponCodes';
    const service = TestBed.inject(EnvironmentInjector).get(CouponCodesService);
    const httpController = TestBed.inject(HttpTestingController);

    const couponArray: CouponCode[] = [
      {
        name: 'new-coupon',
        discount: 0.3,
        active: true,
      },
      {
        name: 'old-coupon',
        discount: 0.8,
        active: false,
      },
    ];

    service.checkIfCouponCodeValid('new-coupon').subscribe({
      next: (res) => {
        expect(res?.name).toEqual(couponArray[0].name);
        expect(res?.discount).toEqual(couponArray[0].discount);
        expect(res?.active).toEqual(couponArray[0].active);
        done();
      },
    });

    const req = httpController.expectOne(expectedUrl);

    req.flush(couponArray);
  });
});
