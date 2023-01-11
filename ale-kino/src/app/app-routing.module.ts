import { ShellComponent } from './shell/shell/shell.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { ReservationComponent } from './features/reservation/reservation/reservation.component';
import { CheckoutFormComponent } from './features/checkout/checkout-form/checkout-form.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'login', component: LoginFormComponent },
      { path: 'reservation/:id', component: ReservationComponent },
      {
        path: 'checkout',
        loadChildren: () => import("./features/checkout/checkout.module").then(m => m.default),
      }
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
