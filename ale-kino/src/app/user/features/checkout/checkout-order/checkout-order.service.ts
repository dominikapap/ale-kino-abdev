import { TicketsService } from './../../../../services/tickets.service';
import { ScreeningsApiService } from 'src/app/admin/screenings';
import { CouponCodesService } from './../../../../services/coupon-codes.service';
import { inject, Injectable } from '@angular/core';
import { combineLatest, map, of, switchMap, tap } from 'rxjs';
import { OrdersService, ScreeningRoomStateService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CheckoutOrderService {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  private ordersService$ = inject(OrdersService);
  private ticketsService = inject(TicketsService);
  private couponCodeService = inject(CouponCodesService);
  private screeningsService = inject(ScreeningsApiService);

  getTotalOrderPrice(route: ActivatedRoute) {
    // return this.screeningRoomStateService.screeningRoomState$.pipe(
    //   switchMap((state) => {
    //     return this.ordersService$.getOrderTotalPrice(
    //       state.ticketState.notCheckedOutOrderId!
    //     );
    //   }),
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

  getOrderDetails(route: ActivatedRoute) {
    return route.paramMap.pipe(
      switchMap((params) => {
        const orderId: string = <string>params.get('id');
        return this.ordersService$.getOrderById(orderId);
      }),
      switchMap(([order]) => {
        const screeningDetails$ =
          this.screeningsService.getScreeningDetailsById(order.screeningsId);
        const orderTickets$ =
          this.ticketsService.getAllOrderTicketsWithFullInfo(order.id);
        return combineLatest([screeningDetails$, orderTickets$]);
      }),
      map(([[screeningDetails], orderTickets]) => {
        return {
          screeningDetails,
          orderTickets,
        };
      })
    );
  }
}
