import { ScreeningService } from '../../../services/screening.state.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  private screeningService = inject(ScreeningService);
  private route = inject(ActivatedRoute);

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
          return this.screeningService.getScreeningDetails(id);
        })
      )
      .subscribe(([screening]) => {
        this.screeningDetails = screening;
        this.isLoaded = true;
      });
  }
}
