import { Component, OnInit } from '@angular/core';
import { RoomsService, Seat, Ticket } from '../../../services/screening-room.state.service';

@Component({
  selector: 'app-seat-ticket',
  templateUrl: './seat-ticket.component.html',
  styleUrls: ['./seat-ticket.component.scss']
})
export class SeatTicketComponent implements OnInit {
  constructor(private screeningRoomStateService: RoomsService) { }

  ngOnInit(): void {
    this.screeningRoomStateService.seatOccupancyState$.subscribe(seatOccupancyState => {
      this.seatSelectionState = seatOccupancyState.selectedSeats;
    })
    this.screeningRoomStateService.getTicketTypes().subscribe(ticketTypes => {
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
    this.screeningRoomStateService.deselectSeat({row, seatNumber});
  }

}
