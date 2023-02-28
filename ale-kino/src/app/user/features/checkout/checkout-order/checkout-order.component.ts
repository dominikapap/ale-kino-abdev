import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CheckoutOrderService } from './checkout-order.service';

@Component({
  selector: 'app-checkout-order',
  templateUrl: './checkout-order.component.html',
  styleUrls: ['./checkout-order.component.scss'],
})
export class CheckoutOrderComponent {
  private activatedRoute = inject(ActivatedRoute);
  protected totalOrderPrice$ = inject(CheckoutOrderService).getTotalOrderPrice(
    this.activatedRoute
  );
  protected orderDetails$ = inject(CheckoutOrderService).getOrderDetails(
    this.activatedRoute
  );
}
