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

  rows: number = 0; //number of room rows
  seats: number = 0; //number of seats in a row
  rowLetters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  rowNumbers: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];
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
  isSelected: boolean = false;
  moveTitle: string = '';
  icon: any = 'trash-can';
  isLoaded = false;
  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.getScreening();
  }

  getScreening() {
    const subParam = this.route.paramMap.subscribe((params) => {// get screening id from url params
      const id: string = <string>params.get('id');

      const subScreen = this.screeningService //get screening details based on screening id
        .getScreeningDetails(id)
        .subscribe((screening) => {
          console.log(screening);
          this.screeningDetails = screening[0];

          const subRoom = this.roomsService //get room details
            .getRoomDetails(this.screeningDetails.screeningRooms.roomsId)
            .subscribe((roomDetails) => {
              this.rows = roomDetails.rows;
              this.seats = roomDetails.seats;
              console.log(roomDetails);
            });

          this.subscriptions.add(subRoom);
          this.isLoaded = true;
        });
      this.subscriptions.add(subScreen);
    });
    this.subscriptions.add(subParam);
  }

  generateRowLetters(rowsNumber: number) { //generate an array of letters
    const alpha = Array.from(Array(rowsNumber)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));
    console.log(alphabet);
    return alphabet;
  }

  generateSeatNumbers(){
    //tbc
  }

  initiateRoomSizeData(rows: number, seats: number){
    this.rowLetters = this.generateRowLetters(rows);
  }

  addSeat(letter: string, number: number) {
    console.log('seat was clicked', letter, number);
    this.isSelected = true;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
