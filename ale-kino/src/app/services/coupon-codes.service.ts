import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

export type CouponCode = {
  id: number;
  name: string;
  active: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class CouponCodesService {
  private http = inject(HttpClient);
  constructor() {}

  getAllCouponCodes() {
    return this.http.get<CouponCode[]>(`/couponCodes`);
  }

  checkIfCouponCodeValid(couponCode: string) {
    return this.http
      .get<CouponCode[]>('/couponCodes')
      .pipe(map((code) => {
        return code.find((code) => code.name === couponCode)
      }));
  }
}
