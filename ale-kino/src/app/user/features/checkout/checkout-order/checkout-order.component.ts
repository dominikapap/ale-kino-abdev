
import { Component, inject, OnInit } from '@angular/core';
import { Ticket, TicketsService, TicketType } from 'src/app/services/tickets.service';
import { ScreeningDetails } from 'src/app/services/screenings.service';
import { ScreeningRoomStateService } from 'src/app/services/screening-room.state.service';

@Component({
  selector: 'app-checkout-order',
  templateUrl: './checkout-order.component.html',
  styleUrls: ['./checkout-order.component.scss'],
})
export class CheckoutOrderComponent implements OnInit {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  protected roomState$ = this.screeningRoomStateService.screeningRoomState$;
  ticketsService = inject(TicketsService);
  // screeningDetails!: ScreeningDetails | undefined;
  // openOrderTicketList: Ticket[] = [];
  orderTotalCost: number = 0;
  ticketTypes: TicketType[] = [];

  ngOnInit() {
    // this.screeningRoomStateService.screeningRoomState$.subscribe((state) => {
    //   // this.screeningDetails = state.screeningDetails;
    //   // this.openOrderTicketList = state.ticketState.selectedTickets;
    //   console.log('ticket list: ', state.ticketState.selectedTickets)
    //   // this.calculateTotalOrderCost();
    // });
    this.ticketsService.getTicketTypes().subscribe((ticketTypes) => {
      this.ticketTypes = ticketTypes;
    });
  }

  getTicketPrice(ticketTypeId: number) {
    return this.ticketTypes.find((ticketType) => ticketType.id === ticketTypeId)
      ?.price;
  }

  // private calculateTotalOrderCost() {
  //   this.openOrderTicketList.forEach(
  //     (ticket) => (this.orderTotalCost += ticket.ticketTypes.price)
  //   );
  // }
}
