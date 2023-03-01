import { ScreeningRoomStateService } from './../../../../services';
import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export type RoomSize = {
  rows: number;
  seats: number;
};

export type RoomSetup = {
  rowLetters: string[],
  rowNumbers: number[]
}

@Component({
  selector: 'app-screening-room',
  templateUrl: './screening-room.component.html',
  styleUrls: ['./screening-room.component.scss'],
})
export class ScreeningRoomComponent implements OnInit, OnDestroy {
  private screeningRoomStateService = inject(ScreeningRoomStateService);

  @Input() roomId: number = 0;
  @Input() screeningRoomId: number = 0;
  protected roomSetupData: RoomSetup = {
    rowLetters: [],
    rowNumbers: []
  };
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const roomSetupSub = this.screeningRoomStateService
      .initiateRoomSetupData(this.roomId)
      .subscribe((roomSetup) => {
        this.roomSetupData = roomSetup;
      });

    const ticketInitSub = this.screeningRoomStateService
      .initiateScreeningTicketsState(this.screeningRoomId)
      .subscribe();
    this.subscriptions.add(roomSetupSub);
    this.subscriptions.add(ticketInitSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleSeat(row: string, seatNumber: number) {
    const sub = this.screeningRoomStateService
      .toggleSelectedSeat({ row, seatNumber })
      .subscribe();
    this.subscriptions.add(sub);
  }

  isSelected(row: string, seatNumber: number) {
    return this.screeningRoomStateService.isSeatSelected({ row, seatNumber });
  }

  isReserved(row: string, seatNumber: number) {
    return this.screeningRoomStateService.isSeatReserved({ row, seatNumber });
  }
}
