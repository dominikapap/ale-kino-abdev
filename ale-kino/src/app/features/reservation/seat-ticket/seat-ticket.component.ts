import { Component, inject, OnInit } from '@angular/core';
import { TicketsService } from 'src/app/services/tickets.service';
import { ScreeningService, Seat, Ticket } from '../../../services/screening.state.service';

@Component({
  selector: 'app-seat-ticket',
  templateUrl: './seat-ticket.component.html',
  styleUrls: ['./seat-ticket.component.scss']
})
export class SeatTicketComponent implements OnInit {
  private ticketsService = inject(TicketsService);
  constructor(private screeningService: ScreeningService) { }

  ngOnInit(): void {
    this.screeningService.seatOccupancyState$.subscribe(seatOccupancyState => {
      this.seatSelectionState = seatOccupancyState.selectedSeats;
    })
    this.ticketsService.getTicketTypes().subscribe(ticketTypes => {
      this.ticketTypes = ticketTypes;
    })
  }

  seatSelectionState: Seat[] = [];
  icon: any = 'trash-can';
  ticketTypes: Ticket[] = [];
  selectedTicket!: Ticket;

  onSelected(ticketId: string){
    console.log(<Ticket>this.ticketTypes.find(ticket => ticket.id === (parseInt(ticketId, 10))))
    this.selectedTicket = <Ticket>this.ticketTypes.find(ticket => ticket.id === (parseInt(ticketId, 10)));
  }


  removeTicket(row: string, seatNumber: number) {
    this.screeningService.deselectSeat({row, seatNumber});
  }

}
