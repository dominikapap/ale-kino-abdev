import { ScreeningRoomState, ScreeningRoomStateService, TicketState } from './../../../../services/screening-room.state.service';
import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { Seat } from 'src/app/services/rooms.service';
import { Subscription } from 'rxjs';

export type RoomSize = {
  rows: number;
  seats: number;
};

@Component({
  selector: 'app-screening-room',
  templateUrl: './screening-room.component.html',
  styleUrls: ['./screening-room.component.scss'],
})
export class ScreeningRoomComponent implements OnInit, OnDestroy {
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
  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const roomSetupSub = this.screeningRoomStateService.initiateRoomSetupData(this.roomId);
    this.subscriptions = this.screeningRoomStateService.initiateScreeningTicketsState(this.screeningRoomId);

    const roomStateSub = this.screeningRoomStateService.screeningRoomState$.subscribe((roomState) => {
      this.roomSetupData = roomState.roomSetup;
      this.ticketsState = roomState.ticketState;
    });
    this.subscriptions.add(roomStateSub);
    this.subscriptions.add(roomSetupSub);
  }

  ngOnDestroy(){
    console.log('destroyed')
    this.subscriptions.unsubscribe();
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
