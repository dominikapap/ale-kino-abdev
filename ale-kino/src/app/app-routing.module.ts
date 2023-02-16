import { ShellComponent } from './shell/shell/shell.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', loadChildren: () => import('./features/home/home.module') },
      {
        path: 'reservation/:id',
        loadChildren: () => import('./features/reservation/reservation.module'),
      },
      {
        path: 'checkout/:id',
        loadChildren: () => import('./features/checkout/checkout.module'),
      },
      {
        path: 'summary',
        loadChildren: () => import('./features/summary/summary.module'),
      },
    ],
  },
  { path: 'login', loadChildren: () => import('./auth/auth.module') },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
