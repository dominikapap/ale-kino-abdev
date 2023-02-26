import { Subscription } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { ScreeningRoomStateService } from 'src/app/services';

@Component({
  selector: 'app-checkout-order',
  templateUrl: './checkout-order.component.html',
  styleUrls: ['./checkout-order.component.scss'],
})
export class CheckoutOrderComponent implements OnInit {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  protected roomState$ = this.screeningRoomStateService.screeningRoomState$;
  private subscriptions = new Subscription();
  protected orderTotalCost: number = 0;

  ngOnInit() {
    this.screeningRoomStateService.setStateFromLocalStorage();
    const sub = this.screeningRoomStateService.screeningRoomState$.subscribe(state => {
      state.ticketState.selectedTickets.forEach(ticket => {
        this.orderTotalCost += <number>ticket.ticketTypes?.price
      })
    })
    this.subscriptions.add(sub);
  }
  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
