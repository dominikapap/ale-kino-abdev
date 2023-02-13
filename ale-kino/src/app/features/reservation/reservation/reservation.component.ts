import { ScreeningService } from '../../../services/screening.state.service';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, Subscription } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit, OnDestroy {
  private screeningService = inject(ScreeningService);
  private route = inject(ActivatedRoute);
  private subscriptions = new Subscription();

  screeningDetails: any;
  icon: any = 'trash-can';
  isLoaded = false;

  ngOnInit(): void {
    this.getScreeningDetails();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getScreeningDetails() {
    const sub = this.route.paramMap
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
    this.subscriptions.add(sub);
  }
}
