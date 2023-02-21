
import { Component, inject, OnInit } from '@angular/core';
import { Ticket } from 'src/app/services/tickets.service';
import { ScreeningDetails } from 'src/app/services/screenings.service';
import { ScreeningRoomStateService } from 'src/app/services/screening-room.state.service';

@Component({
  selector: 'app-checkout-order',
  templateUrl: './checkout-order.component.html',
  styleUrls: ['./checkout-order.component.scss'],
})
export class CheckoutOrderComponent implements OnInit {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  screeningDetails!: ScreeningDetails | undefined;
  openOrderTicketList: Ticket[] = [];
  orderTotalCost: number = 0;

  ngOnInit() {
    this.screeningRoomStateService.screeningRoomState$.subscribe((state) => {
      this.screeningDetails = state.screeningDetails;
      this.openOrderTicketList = state.ticketState.selectedTickets;
      console.log('ticket list: ', state.ticketState.selectedTickets)
      // this.calculateTotalOrderCost();
    });
  }

  // private calculateTotalOrderCost() {
  //   this.openOrderTicketList.forEach(
  //     (ticket) => (this.orderTotalCost += ticket.ticketTypes.price)
  //   );
  // }
}
