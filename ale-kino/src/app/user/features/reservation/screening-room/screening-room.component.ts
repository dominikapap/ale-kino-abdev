import { ScreeningRoomState, ScreeningRoomStateService, TicketState } from './../../../../services/screening-room.state.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Seat } from 'src/app/services/rooms.service';

export type RoomSize = {
  rows: number;
  seats: number;
};

@Component({
  selector: 'app-screening-room',
  templateUrl: './screening-room.component.html',
  styleUrls: ['./screening-room.component.scss'],
})
export class ScreeningRoomComponent implements OnInit {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  // private screeningService = inject(ScreeningService);

  @Input() roomId: number = 0;
  @Input() screeningRoomId: number = 0;
  @Input() maxNumberOfReservedSeats: number = 10;
  seatSelectionState: Seat[] = [];
  roomSetupData: any;
  ticketsState: TicketState = {
    reservedTickets: [],
    selectedTickets: [],
  };

  ngOnInit(): void {
    this.screeningRoomStateService.initiateRoomSetupData(this.roomId);
    this.screeningRoomStateService.screeningRoomState$.subscribe((roomState) => {
      this.roomSetupData = roomState.roomSetup;
    });

    this.screeningRoomStateService.initiateScreeningTicketsState(this.screeningRoomId);

    this.screeningRoomStateService.screeningRoomState$.subscribe((roomState) => {
      this.ticketsState = roomState.ticketState;
    });
  }

  toggleSeat(row: string, seatNumber: number) {
    this.screeningRoomStateService.toggleSelectedSeat({ row, seatNumber });
  }

  isSelected(row: string, seatNumber: number) {
    return this.screeningRoomStateService.isSeatSelected({ row, seatNumber });
  }

  isReserved(row: string, seatNumber: number) {
    return this.screeningRoomStateService.isSeatReserved({ row, seatNumber });
  }
}
