import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScreeningDetails } from 'src/app/admin/screenings';
import { ScreeningRoomStateService } from 'src/app/services';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit, OnDestroy {
  private screeningRoomStateService = inject(ScreeningRoomStateService);
  protected screeningRoomState$ =
    this.screeningRoomStateService.screeningRoomState$;
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
    const initDetailsSub = this.screeningRoomStateService
      .initializeScreeningDetailsFromRoute(this.route)
      .subscribe((screeningDetails) => {
        this.screeningDetails = screeningDetails;
      });
    this.subscriptions.add(initDetailsSub);
  }
}
