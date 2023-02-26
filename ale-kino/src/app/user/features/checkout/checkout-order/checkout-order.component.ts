import { Component, inject, OnInit } from '@angular/core';
import { ScreeningRoomStateService } from 'src/app/services';
import { CheckoutOrderService } from './checkout-order.service';

@Component({
  selector: 'app-checkout-order',
  templateUrl: './checkout-order.component.html',
  styleUrls: ['./checkout-order.component.scss'],
})
export class CheckoutOrderComponent implements OnInit {
  protected screeningRoomStateService = inject(ScreeningRoomStateService);
  protected totalOrderPrice$ =
    inject(CheckoutOrderService).getTotalOrderPrice();

  ngOnInit() {
    this.screeningRoomStateService.setStateFromLocalStorage();
  }
}
