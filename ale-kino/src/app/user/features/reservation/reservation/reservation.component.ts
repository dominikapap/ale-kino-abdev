
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScreeningRoomStateService } from 'src/app/services/screening-room.state.service';
import { ScreeningDetails } from 'src/app/services/screenings.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit, OnDestroy {
  screeningRoomStateService = inject(ScreeningRoomStateService);
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
      this.screeningRoomStateService.initializeScreeningDetailsFromRoute(this.route);
    const stateDetailsSub =
      this.screeningRoomStateService.screeningRoomState$.subscribe((state) => {
        this.screeningDetails = state.screeningDetails;
      });
    this.subscriptions.add(initDetailsSub);
    this.subscriptions.add(stateDetailsSub);
  }
}
