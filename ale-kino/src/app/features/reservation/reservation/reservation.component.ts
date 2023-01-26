import { ScreeningService } from '../../../services/screening.state.service';
// import { ScreeningService } from '../../../services/screening.service';
import { Component, inject, OnInit } from '@angular/core';
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
  private screeningService = inject(ScreeningService);

  constructor(
    // private screeningService: ScreeningService,
    private route: ActivatedRoute
  ) {}

  rowLetters: string[] = [];
  rowNumbers: number[] = [];
  rows: number = 0;
  seats: number = 0;

  screeningDetails: any;
  icon: any = 'trash-can';
  isLoaded = false;

  ngOnInit(): void {
    this.getScreeningDetails();
  }

  getScreeningDetails() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id: string = <string>params.get('id');
          this.screeningService.getScreeningDetailsN(id).subscribe(screeningDetails => {
            console.log('sd:',screeningDetails)
          })
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
