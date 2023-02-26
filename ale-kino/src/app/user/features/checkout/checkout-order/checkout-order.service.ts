import { inject, Injectable } from '@angular/core';
import { switchMap } from 'rxjs';
import { OrdersService, ScreeningRoomStateService } from 'src/app/services';

@Injectable({
  providedIn: 'root',
})
export class CheckoutOrderService {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  private ordersService$ = inject(OrdersService);

  getTotalOrderPrice() {
    return this.screeningRoomStateService.screeningRoomState$.pipe(
      switchMap((state) => {
        return this.ordersService$.getOrderTotalPrice(
          state.ticketState.notCheckedOutOrderId!
        );
      })
    );
  }
}
