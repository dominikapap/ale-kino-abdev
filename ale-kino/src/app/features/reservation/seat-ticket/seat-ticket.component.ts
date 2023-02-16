import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Ticket,
  TicketsService,
  TicketType,
} from 'src/app/services/tickets.service';
import { ScreeningService } from '../../../services/screening.state.service';

@Component({
  selector: 'app-seat-ticket',
  templateUrl: './seat-ticket.component.html',
  styleUrls: ['./seat-ticket.component.scss'],
})
export class SeatTicketComponent implements OnInit, OnDestroy {
   ticketsService = inject(TicketsService);
  private screeningService = inject(ScreeningService);
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.screeningService.screeningTicketsState$.subscribe(
      (screeningTicketsState) => {
        this.selectedTickets = screeningTicketsState.selectedTickets;
      }
    );
    this.ticketsService.getTicketTypes().subscribe((ticketTypes) => {
      this.ticketTypes = ticketTypes;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectedTickets: Ticket[] = [];
  icon: any = 'trash-can';
  ticketTypes: TicketType[] = [];
  selectedTicket!: TicketType;

  onTicketTypeChanged(ticket: Ticket, ticketTypeId: string) {
    const ticketTypeIdAsNumber = parseInt(ticketTypeId, 10);
    this.ticketsService.updateTicket(ticket.id, {
      ticketTypesId: ticketTypeIdAsNumber,
    }).subscribe(updatedTicket => {
      this.screeningService.updateSelectedTicketToLocalState(updatedTicket)
    })
  }

  getTicketPrice(ticketTypeId: number) {
    return this.ticketTypes.find((ticketType) => ticketType.id === ticketTypeId)
      ?.price;
  }

  removeTicket(row: string, seatNumber: number) {
    const removeTicketSub = this.screeningService.removeSelectedTicket(
      row,
      seatNumber
    );
    this.subscriptions.add(removeTicketSub);
  }
}
