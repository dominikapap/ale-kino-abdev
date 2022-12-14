import { RoomsService } from './../../services/rooms.service';
import { ScreeningService } from './../../services/screening.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

interface Ticket {
  type: string;
  price: number;
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  constructor(
    private screeningService: ScreeningService,
    private roomsService: RoomsService,
    private route: ActivatedRoute
  ) {}

  rowLetters: string[] = [];
  rowNumbers: number[] = [];
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

  screeningDetails: any;
  icon: any = 'trash-can';
  isLoaded = false;
  subscriptions: Subscription = new Subscription();
  selectedSeatMap = new Map();

  ngOnInit(): void {
    this.getScreening();
  }

  getScreening() {
    const subParam = this.route.paramMap.subscribe((params) => {
      // get screening id from url params
      const id: string = <string>params.get('id');

      const subScreen = this.screeningService //get screening details based on screening id
        .getScreeningDetails(id)
        .subscribe((screening) => {
          // console.log(screening);
          this.screeningDetails = screening[0];

          const subRoom = this.roomsService //get room details
            .getRoomDetails(this.screeningDetails.screeningRooms.roomsId)
            .subscribe((roomDetails) => {
              this.initiateRoomSizeData(roomDetails.rows, roomDetails.seats);
            });

          this.subscriptions.add(subRoom);
          this.isLoaded = true;
        });
      this.subscriptions.add(subScreen);
    });
    this.subscriptions.add(subParam);
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

  addSeat(letter: string, number: number) {
    const mapKey = `${letter}${number}`;

    if (this.selectedSeatMap.has(mapKey)) {
      this.selectedSeatMap.delete(mapKey);
    } else {
      this.selectedSeatMap.set(mapKey, {
        letter,
        number,
        isActive: true,
      });
    }
    // console.log([...this.selectedSeatMap.entries()]);
  }

  isActive(letter: string, number: number) {
    const mapKey = `${letter}${number}`;
    let seat = this.selectedSeatMap.get(mapKey);
    return seat?.isActive;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
