import {
  ScreeningDetails,
  ScreeningService,
} from '../../../../services/screening.state.service';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit, OnDestroy {
  screeningService = inject(ScreeningService);
  private route = inject(ActivatedRoute);
  private subscriptions = new Subscription();

  screeningDetails!: ScreeningDetails | undefined;
  icon: string = 'trash-can';

  ngOnInit(): void {
    this.initializeScreeningDetails();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeScreeningDetails() {
    const initDetailsSub =
      this.screeningService.initializeScreeningDetailsFromRoute(this.route);
    const stateDetailsSub =
      this.screeningService.screeningTicketsState$.subscribe((state) => {
        this.screeningDetails = state.screeningDetails;
      });
    this.subscriptions.add(initDetailsSub);
    this.subscriptions.add(stateDetailsSub);
  }
}
