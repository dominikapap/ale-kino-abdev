import { ScreeningRoomComponent } from './screening-room/screening-room.component';
import { SeatTicketComponent } from './seat-ticket/seat-ticket.component';
import { ReservationComponent } from './reservation/reservation.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ReservationComponent,
    SeatTicketComponent,
    ScreeningRoomComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {
        path: '',
        component: ReservationComponent,
        children: [],
      },
    ]),
  ],
})
export default class ReservationModule {}
