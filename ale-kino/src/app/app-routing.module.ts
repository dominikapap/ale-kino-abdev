import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ReservationComponent } from './reservation/reservation.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'checkout', component: CheckoutFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
