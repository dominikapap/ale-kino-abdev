
import { Component, inject, OnInit } from '@angular/core';
import { ScreeningRoomStateService } from 'src/app/services/screening-room.state.service';

@Component({
  selector: 'app-checkout-order',
  templateUrl: './checkout-order.component.html',
  styleUrls: ['./checkout-order.component.scss'],
})
export class CheckoutOrderComponent implements OnInit {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  protected roomState$ = this.screeningRoomStateService.screeningRoomState$;
  orderTotalCost: number = 0;

  ngOnInit() {

  }
}
