import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Ticket,
  TicketsService,
  TicketType,
  ScreeningRoomStateService,
} from 'src/app/services';

@Component({
  selector: 'app-seat-ticket',
  templateUrl: './seat-ticket.component.html',
  styleUrls: ['./seat-ticket.component.scss'],
})
export class SeatTicketComponent implements OnInit, OnDestroy {
  ticketsService = inject(TicketsService);
  ticketTypes$ = this.ticketsService.getTicketTypes();
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.screeningRoomStateService.screeningRoomState$.subscribe(
      (screeningTicketsState) => {
        this.selectedTickets =
          screeningTicketsState.ticketState.selectedTickets;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectedTickets: Ticket[] = [];
  icon: any = 'trash-can';
  selectedTicket!: TicketType;

  onTicketTypeChanged(ticket: Ticket, ticketTypeId: string) {
    const ticketTypeIdAsNumber = parseInt(ticketTypeId, 10);
    this.ticketsService
      .updateTicketN(ticket.id, {
        ticketTypesId: ticketTypeIdAsNumber,
      })
      .subscribe((updatedTicket) => {
        this.screeningRoomStateService.updateSelectedTicketToLocalState(
          updatedTicket
        );
      });
  }

  removeTicket(row: string, seatNumber: number) {
    const removeTicketSub = this.screeningRoomStateService.removeSelectedTicket(
      row,
      seatNumber
    );
    this.subscriptions.add(removeTicketSub);
  }
}
