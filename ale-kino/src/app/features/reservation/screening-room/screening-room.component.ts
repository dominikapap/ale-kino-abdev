import {
  RoomsService,
  ScreeningRoom,
  Seat,
} from '../../../services/screening-room-state.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-screening-room',
  templateUrl: './screening-room.component.html',
  styleUrls: ['./screening-room.component.scss'],
})
export class ScreeningRoomComponent implements OnInit {
  constructor(private screeningRoomStateService: RoomsService) {}

  @Input() screeningRoomId: string = '';
  @Input() maxNumberOfReservedSeats: number = 10;

  rowLetters: string[] = [];
  rowNumbers: number[] = [];
  seatSelectionState: Seat[] = [];

  ngOnInit(): void {
    this.screeningRoomStateService
      .getScreeningRoomDetails(this.screeningRoomId)
      .subscribe((screeningRoomDetails: ScreeningRoom) => {
        // console.log(screeningRoomDetails)
        this.initiateRoomSizeData(
          screeningRoomDetails.room.rows,
          screeningRoomDetails.room.seats
        );
        this.initiateReservedSeats(screeningRoomDetails.reservedSeats);
      });

    this.screeningRoomStateService.seatSelectionState$.subscribe(
      (seatSelectionState) => {
        this.seatSelectionState = seatSelectionState;
      }
    );
  }

  private generateRowLetters(rowsNumber: number) {
    //generate an array of letters
    const alpha = Array.from(Array(rowsNumber)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));
    return alphabet;
  }

  private generateSeatNumbers(seats: number) {
    return Array.from({ length: seats }, (_, i) => i + 1);
  }

  private initiateRoomSizeData(rows: number, seats: number) {
    this.rowLetters = this.generateRowLetters(rows);
    this.rowNumbers = this.generateSeatNumbers(seats);
  }

  toggleSeat(row: string, seatNumber: number) {
    this.screeningRoomStateService.toggleSelectedSeat({ row, seatNumber });
  }

  isSelected(row: string, seatNumber: number) {
    return this.screeningRoomStateService.isSeatSelected({ row, seatNumber });
  }

  initiateReservedSeats(seats: Seat[]){
    // console.log(seats)
    this.screeningRoomStateService.reserveSeats(seats);
  }

  isReserved(row: string, seatNumber: number) {
    return this.screeningRoomStateService.isSeatReserved({ row, seatNumber });
  }

}
