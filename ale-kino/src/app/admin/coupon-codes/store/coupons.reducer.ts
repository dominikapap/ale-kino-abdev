import { createReducer, on } from '@ngrx/store';
import { CouponsApiActions, initialCouponsState } from '.';

export const couponsReducer = createReducer(
  initialCouponsState,

  on(CouponsApiActions.addNewCouponSuccess, (state, action) => {
    return { ...state, couponsList: [...state.couponsList, action] };
  }),

  on(CouponsApiActions.getAllCouponsSuccess, (state, { couponsList }) => ({
    ...state,
    couponsList: [...state.couponsList, ...couponsList],
  }))
);
