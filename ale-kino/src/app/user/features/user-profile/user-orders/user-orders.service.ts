import { Order, OrdersService } from 'src/app/services';
import { combineLatest, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { UserStateService } from './../../../../core/user.state.service';
import { inject, Injectable } from '@angular/core';
import { ScreeningDetails, ScreeningsApiService } from 'src/app/admin/screenings';

export type OrderExtended = {
  order: Order;
  details: ScreeningDetails;
};

@Injectable({
  providedIn: 'root',
})
export class UserOrdersService {
  private userService = inject(UserStateService);
  private ordersService = inject(OrdersService);
  private screeningsService = inject(ScreeningsApiService);

  constructor() {}

  getUserOrders() {
    return this.userService.user$.pipe(
      switchMap((userState) => {
        return this.ordersService.getUserOrderHistory(userState.id);
      }),
      switchMap((orders) => {
        const requests: Observable<ScreeningDetails[]>[] = [];
        orders.forEach((order) => {
          requests.push(
            this.screeningsService.getScreeningDetailsById(order.screeningsId)
          );
        });
        return combineLatest([
          of(orders),
          forkJoin<ScreeningDetails[][]>(requests),
        ]);
      }),
      map(([orders, details]) => {
        return [orders, details.flat()];
      }),
      map(([orders, details]) => {
        const orderDetails: OrderExtended[] = [];
        for (let i = 0; i < orders.length; i++) {
          orderDetails.push({
            order: <Order>orders[i],
            details: <ScreeningDetails>details[i],
          });
        }
        return orderDetails;
      })
    );
  }
}
