import { ShellComponent } from './shell/shell/shell.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', loadChildren: () => import('./user/features/home/home.module') },
      {
        path: 'reservation/:id',
        loadChildren: () => import('./user/features/reservation/reservation.module'),
      },
      {
        path: 'checkout/:id',
        loadChildren: () => import('./user/features/checkout/checkout.module'),
      },
      {
        path: 'summary',
        loadChildren: () => import('./user/features/summary/summary.module'),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./admin/admin.module'),
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
