import { OrdersService, ScreeningRoomStateService } from 'src/app/services';
import { inject, Injectable } from '@angular/core';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class BlikPaymentService {
  private ordersService = inject(OrdersService);
  private screeningRoomStateService = inject(ScreeningRoomStateService);

  constructor() {}

  handleSendForm() {
    return this.screeningRoomStateService.screeningRoomState$.pipe(
      switchMap((roomState) => {
        const orderId = roomState.ticketState.notCheckedOutOrderId;
        if (orderId) {
          return this.ordersService.updateOrder(orderId!, {
            isCheckedOut: true,
          });
        } else {
          return of({});
        }
      })
    );
  }
}
