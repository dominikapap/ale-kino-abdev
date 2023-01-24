import { Component, Input, OnInit } from '@angular/core';
import { RoomsService, Seat } from '../../../services/screening-room.state.service';


interface Ticket {
  type: string;
  price: number;
}

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
  }
  selectedSeatMap = new Map();
  seatSelectionState: Seat[] = [];

  icon: any = 'trash-can';
  ticketTypes: Ticket[] = [
    {
      type: 'bilet normalny',
      price: 2,
    },
    {
      type: 'bilet ulgowy',
      price: 11,
    },
    {
      type: 'bilet rodzinny',
      price: 30,
    },
    {
      type: 'voucher',
      price: 25,
    },
  ];

  removeTicket(row: string, seatNumber: number) {
    this.screeningRoomStateService.deselectSeat({row, seatNumber});
  }

}
