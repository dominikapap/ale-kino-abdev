import { RoomsService } from '../../services/screening-room-state.service';
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
  ) {
 }

  rowLetters: string[] = [];
  rowNumbers: number[] = [];
  rows: number = 0;
  seats: number = 0;

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
    this.getScreeningDetails();
  }

  getScreeningDetails() {
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
              this.rows = roomDetails.rows;
              this.seats = roomDetails.seats;
              // this.initiateRoomSizeData(roomDetails.rows, roomDetails.seats);
              this.isLoaded = true;
            });

          this.subscriptions.add(subRoom);

        });
      this.subscriptions.add(subScreen);
    });
    this.subscriptions.add(subParam);
  }



  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
