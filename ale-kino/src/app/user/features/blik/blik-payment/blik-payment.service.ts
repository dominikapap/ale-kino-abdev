import { OrdersService } from 'src/app/services';
import { inject, Injectable } from '@angular/core';
import { of, switchMap, EMPTY } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BlikPaymentService {
  private ordersService = inject(OrdersService);

  constructor() {}

  handleSendForm(route: ActivatedRoute) {
    return route.paramMap.pipe(
      switchMap((params) => {
        const orderId: string = <string>params.get('orderId');
        if (orderId) {
          return this.ordersService.updateOrder(orderId, {
            isCheckedOut: true,
          });
        } else {
          return EMPTY;
        }
      })
    );
  }
}
