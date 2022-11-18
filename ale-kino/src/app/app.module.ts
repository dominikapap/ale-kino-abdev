import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { MovieComponent } from './movie/movie.component';
import { ButtonComponent } from './button/button.component';
import { HeaderComponent } from './header/header.component';
import { RoundedNavComponent } from './rounded-nav/rounded-nav.component';
import { DateNavComponent } from './date-nav/date-nav.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MovieComponent,
    ButtonComponent,
    HeaderComponent,
    RoundedNavComponent,
    DateNavComponent,
    FooterComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCartShopping);
  }
}
