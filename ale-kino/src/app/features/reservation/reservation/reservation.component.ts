import { RoomsService } from '../../../services/screening-room.state.service';
import { ScreeningService } from '../../../services/screening.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';

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
    private screeningRoomStateService: RoomsService,
    private route: ActivatedRoute
  ) {}

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
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id: string = <string>params.get('id');
          return this.screeningService.getScreeningDetails(id);
        })
      )
      .subscribe(([screening]) => {
        this.screeningDetails = screening;
        console.log(this.screeningDetails);
        this.isLoaded = true;
      });
  }
}
