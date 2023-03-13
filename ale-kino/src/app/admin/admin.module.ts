import { ButtonComponent } from '../user/features/ui/button/button.component';
import { DashboardComponent } from '.';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        children: [
          {
            path: 'movies',
            loadChildren: () => import('./movies/movies.module'),
          },
          {
            path: 'screenings',
            loadChildren: () => import('./screenings/screenings.module'),
          },
          {
            path: 'rooms',
            loadChildren: () => import('./rooms/rooms.module'),
          },
          {
            path: 'coupons',
            loadChildren: () => import('./coupon-codes/coupon-codes.module'),
          },
        ],
      },
    ]),
  ],
})
export default class AdminModule {}
