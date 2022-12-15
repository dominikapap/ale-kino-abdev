import { Component, Input, OnInit } from '@angular/core';
import { RoomsService } from '../services/rooms.service';


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

  constructor(private roomsService: RoomsService) { }

  ngOnInit(): void {
    this.roomsService.selectedSeatMap$.subscribe(selectedSeatMap => {
      this.selectedSeatMap = selectedSeatMap;
    })
  }
  selectedSeatMap = new Map();
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
    const mapKey = `${row}${seatNumber}`;
    this.selectedSeatMap.delete(mapKey);
    console.log('Ticket was removed!')
  }

}
