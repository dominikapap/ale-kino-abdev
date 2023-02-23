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
          { path: '', redirectTo: 'create-screening', pathMatch: 'full' },
          {
            path: 'create-screening',
            loadComponent: () => import('./features/create-screening/create-screening.component'),
          },
          {
            path: 'add-movie',
            loadComponent: () => import('./features/add-movie/add-movie.component'),
          },
        ],
      },
    ]),
  ],
})
export default class AdminModule {}
