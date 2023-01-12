import { ShellComponent } from './shell/shell/shell.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', loadChildren: () => import('./features/home/home.module') },
      { path: 'login', loadChildren: () => import('./auth/auth.module') },
      {
        path: 'reservation/:id',
        loadChildren: () => import('./features/reservation/reservation.module'),
      },
      {
        path: 'checkout',
        loadChildren: () => import('./features/checkout/checkout.module'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
