import { CouponCodesService } from './../../../../services/coupon-codes.service';
import { inject, Injectable } from '@angular/core';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { OrdersService, ScreeningRoomStateService } from 'src/app/services';

@Injectable({
  providedIn: 'root',
})
export class CheckoutOrderService {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  private ordersService$ = inject(OrdersService);
  private couponCodeService = inject(CouponCodesService)

  getTotalOrderPrice() {
    return this.screeningRoomStateService.screeningRoomState$.pipe(
      switchMap((state) => {
        return this.ordersService$.getOrderTotalPrice(
          state.ticketState.notCheckedOutOrderId!
        );
      }),
      switchMap(orderTotalPrice => {
        return combineLatest([of(orderTotalPrice),this.couponCodeService.couponCodeState$])
      }),
      map(([orderTotalPrice, couponCode]) => {
        return orderTotalPrice * (1 - couponCode.discount)
      })
    );
  }
}
