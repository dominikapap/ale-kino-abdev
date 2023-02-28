import { CouponCodesService } from './../../../../services';
import { inject, Injectable } from '@angular/core';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { OrdersService, } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CheckoutOrderService {
  private ordersService$ = inject(OrdersService);
  private couponCodeService = inject(CouponCodesService);

  getTotalOrderPrice(route: ActivatedRoute) {
    return route.paramMap.pipe(
      switchMap((params) => {
        const orderId: string = <string>params.get('id');
        return this.ordersService$.getOrderTotalPrice(orderId);
      }),
      switchMap((orderTotalPrice) => {
        return combineLatest([
          of(orderTotalPrice),
          this.couponCodeService.couponCodeState$,
        ]);
      }),
      map(([orderTotalPrice, couponCode]) => {
        return orderTotalPrice * (1 - couponCode.discount);
      })
    );
  }
}
