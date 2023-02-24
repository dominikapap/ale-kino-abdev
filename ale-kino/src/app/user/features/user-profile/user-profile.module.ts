import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserProfilePageComponent } from './user-profile-page/user-profile-page.component';

@NgModule({
  declarations: [],
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
        ],
      },
    ]),
  ],
})
export default class AdminModule {}
