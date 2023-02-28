import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, switchMap } from 'rxjs';
import { ScreeningRoomStateService, OrdersService } from 'src/app/services';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  protected screeningRoomStateService = inject(ScreeningRoomStateService);
  protected ordersService = inject(OrdersService);

  // getSummaryOrderDetails() {
  //   return this.screeningRoomStateService.screeningRoomState$.pipe(
  //     switchMap((roomState) => {
  //       if (roomState.ticketState.notCheckedOutOrderId) {
  //         return this.ordersService.getOrderById(
  //           roomState.ticketState.notCheckedOutOrderId
  //         );
  //       } else {
  //         return EMPTY;
  //       }
  //     }),
  //     map(([order]) => {
  //       return order;
  //     })
  //   );
  // }

  handleSendForm(route: ActivatedRoute) {
    return route.paramMap.pipe(
      switchMap((params) => {
        const orderId: string = <string>params.get('id');
        if (orderId) {
          return this.ordersService.getOrderById(orderId);
        } else {
          return EMPTY;
        }
      }),
      map(([order]) => {
        return order;
      })
    );
  }
}
