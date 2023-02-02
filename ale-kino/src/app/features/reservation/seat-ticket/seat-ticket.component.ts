import { Component, inject, OnInit } from '@angular/core';
import { Ticket, TicketsService, TicketType } from 'src/app/services/tickets.service';
import { ScreeningService, Seat } from '../../../services/screening.state.service';

@Component({
  selector: 'app-seat-ticket',
  templateUrl: './seat-ticket.component.html',
  styleUrls: ['./seat-ticket.component.scss']
})
export class SeatTicketComponent implements OnInit {
  private ticketsService = inject(TicketsService);
  constructor(private screeningService: ScreeningService) { }

  ngOnInit(): void {
    // this.screeningService.seatOccupancyState$.subscribe(seatOccupancyState => {
    //   this.seatSelectionState = seatOccupancyState.selectedSeats;
    // })
    this.screeningService.screeningTicketsState$.subscribe(screeningTicketsState => {
      this.seatSelectionState = screeningTicketsState.selectedTickets;
    })
    this.ticketsService.getTicketTypes().subscribe(ticketTypes => {
      this.ticketTypes = ticketTypes;
    })
  }

  seatSelectionState: Ticket[] = [];
  icon: any = 'trash-can';
  ticketTypes: TicketType[] = [];
  selectedTicket!: TicketType;

  onSelected(ticketId: string){
    // console.log(<TicketType>this.ticketTypes.find(ticket => ticket.id === (parseInt(ticketId, 10))))
    this.selectedTicket = <TicketType>this.ticketTypes.find(ticket => ticket.id === (parseInt(ticketId, 10)));
  }


  removeTicket(row: string, seatNumber: number) {
    this.screeningService.deselectSeat({row, seatNumber});
  }

}
