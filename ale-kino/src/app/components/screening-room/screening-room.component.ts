import { RoomsService } from './../../services/rooms.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-screening-room',
  templateUrl: './screening-room.component.html',
  styleUrls: ['./screening-room.component.scss']
})
export class ScreeningRoomComponent implements OnInit {

  constructor(private roomsService: RoomsService) {
   }

  @Input() rows: number = 0;
  @Input() seats: number = 0;
  @Input() maxNumberOfReservedSeats: number = 10;

  selectedSeatMap = new Map();
  rowLetters: string[] = [];
  rowNumbers: number[] = [];

  ngOnInit(): void {
    this.roomsService.selectedSeatMap$.subscribe(selectedSeatMap => {
      this.selectedSeatMap = selectedSeatMap;
    })
    this.initiateRoomSizeData(this.rows, this.seats);
  }

  generateRowLetters(rowsNumber: number) {
    //generate an array of letters
    const alpha = Array.from(Array(rowsNumber)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));
    return alphabet;
  }

  generateSeatNumbers(seats: number) {
    return Array.from({ length: seats }, (_, i) => i + 1);
  }

  initiateRoomSizeData(rows: number, seats: number) {
    this.rowLetters = this.generateRowLetters(rows);
    this.rowNumbers = this.generateSeatNumbers(seats);
  }

  addSeat(row: string, seatNumber: number) {
    // this.roomsService.addSeat(row, seatNumber);
    const mapKey = `${row}${seatNumber}`;

    if (this.selectedSeatMap.has(mapKey)) {
      this.selectedSeatMap.delete(mapKey);
    } else if (this.selectedSeatMap.size < this.maxNumberOfReservedSeats) {
      this.selectedSeatMap.set(mapKey, {
        row,
        seatNumber,
        isSelected: true,
      });
    }

  }

  isReserved(row: string, seatNumber: number) {
    const mapKey = `${row}${seatNumber}`;
    let seat = this.selectedSeatMap.get(mapKey);
    return seat?.isSelected;
  }

}
