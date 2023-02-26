import { ScreeningsService } from './../../../../services';
import { Order, OrdersService, ScreeningDetails } from 'src/app/services';
import {
  combineLatest,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { UserStateService } from './../../../../core/user.state.service';
import { inject, Injectable } from '@angular/core';

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
  private screeningsService = inject(ScreeningsService);

  constructor() {}

  getUserOrders() {
    return this.userService.user$.pipe(
      switchMap((userState) => {
        return this.ordersService.getOrdersByUserId(userState.id);
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
