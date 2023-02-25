import {
  ScreeningRoomState,
  ScreeningRoomStateService,
  TicketState,
} from './../../../../services/screening-room.state.service';
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

  @Input() roomId: number = 0;
  @Input() screeningRoomId: number = 0;
  protected roomSetupData: any;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const roomSetupSub = this.screeningRoomStateService
      .initiateRoomSetupData(this.roomId)
      .subscribe((roomSetup) => {
        this.roomSetupData = roomSetup;
      });

      const ticketInitSub =
      this.screeningRoomStateService.initiateScreeningTicketsState(
        this.screeningRoomId
      ).subscribe();
    this.subscriptions.add(roomSetupSub);
    this.subscriptions.add(ticketInitSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleSeat(row: string, seatNumber: number) {
    this.screeningRoomStateService.toggleSelectedSeat({ row, seatNumber }).subscribe();
  }

  isSelected(row: string, seatNumber: number) {
    return this.screeningRoomStateService.isSeatSelected({ row, seatNumber });
  }

  isReserved(row: string, seatNumber: number) {
    return this.screeningRoomStateService.isSeatReserved({ row, seatNumber });
  }
}
