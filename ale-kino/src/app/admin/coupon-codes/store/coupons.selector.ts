import { createSelector } from '@ngrx/store';
import { CouponsState } from '.';

const selectCouponsState = (state: { couponsState: CouponsState }) =>
  state.couponsState;

export const selectCouponsList = createSelector(
  selectCouponsState,
  (state) => state.couponsList
);
