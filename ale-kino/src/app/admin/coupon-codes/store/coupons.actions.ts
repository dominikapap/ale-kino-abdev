import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CouponCode } from 'src/app/services';

export const CouponsActions = createActionGroup({
  source: 'Coupons',
  events: {
    'add new coupon': props<CouponCode>(),
    'get all coupons': emptyProps(),
  },
});

export const CouponsApiActions = createActionGroup({
  source: 'Coupons API',
  events: {
    'add new coupon success': props<CouponCode>(),
    'add new coupon failure': emptyProps(),
    'get all coupons success': props<{ couponsList: CouponCode[] }>(),
    'get all coupons failure': emptyProps(),
  },
});
