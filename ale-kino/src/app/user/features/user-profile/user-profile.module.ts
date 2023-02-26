import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserProfilePageComponent } from '.';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: UserProfilePageComponent,
        children: [
          { path: '', redirectTo: 'user-profile', pathMatch: 'full' },
          {
            path: 'watchlist',
            loadComponent: () => import('./user-watchlist/user-watchlist.component'),
          },
          {
            path: 'orders',
            loadComponent: () => import('./user-orders/user-orders.component'),
          },
          {
            path: 'orders/:id',
            loadComponent: () => import('./user-order-details/user-order-details.component'),
          },
        ],
      },
    ]),
  ],
})
export default class AdminModule {}
