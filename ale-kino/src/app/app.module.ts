import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faCartShopping, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { MovieComponent } from './features/home/movie/movie.component';
import { ButtonComponent } from './features/ui/button/button.component';
import { HeaderComponent } from './shell/header/header.component';
import { RoundedNavComponent } from './features/ui/rounded-nav/rounded-nav.component';
import { DateNavComponent } from './features/home/date-nav/date-nav.component';
import { FooterComponent } from './shell/footer/footer.component';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { ReservationComponent } from './features/reservation/reservation/reservation.component';
import { CheckoutFormComponent } from './features/checkout/checkout-form/checkout-form.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { PopupNavComponent } from './shell/popup-nav/popup-nav.component';
import { TimeNavComponent } from './features/home/time-nav/time-nav.component';
import { ScreeningRoomComponent } from './features/reservation/screening-room/screening-room.component';
import { SeatTicketComponent } from './features/reservation/seat-ticket/seat-ticket.component';
import { ShellComponent } from './shell/shell/shell.component';


@NgModule({
  declarations: [
    AppComponent,
    MovieComponent,
    ButtonComponent,
    HeaderComponent,
    RoundedNavComponent,
    DateNavComponent,
    FooterComponent,
    HomePageComponent,
    ReservationComponent,

    LoginFormComponent,
    PopupNavComponent,
    TimeNavComponent,
    ScreeningRoomComponent,
    SeatTicketComponent,
    ShellComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule, HttpClientModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCartShopping);
    library.addIcons(faTrashCan);
  }
}
