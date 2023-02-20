import { ButtonComponent } from '../user/features/ui/button/button.component';
import { DashboardComponent } from '.';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        children: [
          {
            path: 'create-screening',
            loadComponent: () => import('./features/create-screening/create-screening.component'),
          },
        ],
      },
    ]),
  ],
})
export default class AdminModule {}
