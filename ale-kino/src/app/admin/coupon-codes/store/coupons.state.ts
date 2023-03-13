import { CouponCode } from 'src/app/services';

export type CouponsState = {
  couponsList: CouponCode[];
};

export const couponsFeatureKey = 'couponsState';
export const initialCouponsState: {
  couponsList: CouponCode[];
} = {
  couponsList: [],
};
