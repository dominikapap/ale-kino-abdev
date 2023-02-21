import {
  ScreeningService,
} from '../../../../services/screening.state.service';
import { Component, inject, OnInit } from '@angular/core';
import { Ticket } from 'src/app/services/tickets.service';
import { ScreeningDetails } from 'src/app/services/screenings.service';

@Component({
  selector: 'app-checkout-order',
  templateUrl: './checkout-order.component.html',
  styleUrls: ['./checkout-order.component.scss'],
})
export class CheckoutOrderComponent implements OnInit {
  private screeningService = inject(ScreeningService);
  screeningDetails!: ScreeningDetails | undefined;
  openOrderTicketList: Ticket[] = [];
  orderTotalCost: number = 0;

  ngOnInit() {
    this.screeningService.screeningTicketsState$.subscribe((state) => {
      this.screeningDetails = state.screeningDetails;
      this.openOrderTicketList = state.selectedTickets;
      console.log('ticket list: ', state.selectedTickets)
      // this.calculateTotalOrderCost();
    });
  }

  // private calculateTotalOrderCost() {
  //   this.openOrderTicketList.forEach(
  //     (ticket) => (this.orderTotalCost += ticket.ticketTypes.price)
  //   );
  // }
}
