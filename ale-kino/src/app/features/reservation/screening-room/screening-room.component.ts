import {
  ScreeningService,
  ScreeningRoom,
  Seat,
} from '../../../services/screening.state.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RoomsService } from 'src/app/services/rooms.service';
import { RoomSetup, ScreeningRoomsService } from 'src/app/services/screening-rooms.service';

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
  private roomService = inject(RoomsService);
  private screeningRoomService = inject(ScreeningRoomsService);
  private screeningService = inject(ScreeningService);

  @Input() roomId: number = 0;
  @Input() maxNumberOfReservedSeats: number = 10;
  seatSelectionState: Seat[] = [];
  roomSetupData: any;

  ngOnInit(): void {
    this.screeningService.seatOccupancyState$.subscribe(
      (seatOccupancyState) => {
        this.seatSelectionState = seatOccupancyState.selectedSeats;
      }
    );

    this.screeningRoomService.initiateRoomSetupData(this.roomId);
    this.screeningRoomService.roomSetupData$.subscribe(roomSetupData => {
      console.log('rsd:',roomSetupData)
      this.roomSetupData = roomSetupData;
    })
  }

  toggleSeat(row: string, seatNumber: number) {
    this.screeningService.toggleSelectedSeat({ row, seatNumber });
  }

  isSelected(row: string, seatNumber: number) {
    return this.screeningService.isSeatSelected({ row, seatNumber });
  }

  initiateReservedSeats(seats: Seat[]) {
    // console.log(seats)
    this.screeningService.reserveSeats(seats);
  }

  isReserved(row: string, seatNumber: number) {
    return this.screeningService.isSeatReserved({ row, seatNumber });
  }
}
