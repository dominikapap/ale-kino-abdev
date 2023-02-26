import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';

export type CouponCode = {
  id?: number;
  name: string;
  discount: number;
  active: boolean;
};

const defaultCouponCodeState = {
  name: '',
  discount: 0,
  active: false,
};

@Injectable({
  providedIn: 'root',
})
export class CouponCodesService {
  private http = inject(HttpClient);
  constructor() {}

  private couponCodeState$$ = new BehaviorSubject<CouponCode>(
    defaultCouponCodeState
  );

  get couponCodeState$() {
    return this.couponCodeState$$.asObservable();
  }

  private get couponCodeStateValue() {
    return this.couponCodeState$$.value;
  }

  private patchState(stateSlice: Partial<CouponCode>) {
    this.couponCodeState$$.next({
      ...this.couponCodeStateValue,
      ...stateSlice,
    });
  }

  setCouponCodeDiscount(couponName: string) {
    return this.getCouponCodeByName(couponName).pipe(
      tap(([coupon]) => {
        this.patchState(coupon);
      })
    );
  }

  getCouponCodeByName(couponCodeName: string) {
    return this.http.get<CouponCode[]>(`/couponCodes?name=${couponCodeName}`);
  }

  getCouponCodeById(couponCodeId: number) {
    return this.http.get<CouponCode[]>(`/couponCodes/${couponCodeId}`);
  }

  getAllCouponCodes() {
    return this.http.get<CouponCode[]>(`/couponCodes`);
  }

  updateSelectedCouponCode(couponCodeSlice: Partial<CouponCode>) {
    return this.http.patch<CouponCode>(`/couponCodes/${this.couponCodeStateValue.id}`, {
      ...couponCodeSlice,
    });
  }

  checkIfCouponCodeValid(couponCode: string) {
    return this.http.get<CouponCode[]>('/couponCodes').pipe(
      map((code) => {
        return code.find((code) => code.name === couponCode);
      })
    );
  }
}
