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
import { HeaderComponent } from './shell/header/header.component';
import { RoundedNavComponent } from './features/ui/rounded-nav/rounded-nav.component';
import { FooterComponent } from './shell/footer/footer.component';
import { PopupNavComponent } from './shell/popup-nav/popup-nav.component';
import { ShellComponent } from './shell/shell/shell.component';
import { ButtonComponent } from './features/ui/button/button.component';
import { SummaryComponent } from './features/summary/summary/summary.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RoundedNavComponent,
    FooterComponent,
    PopupNavComponent,
    ShellComponent,
    SummaryComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule, FontAwesomeModule, ButtonComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCartShopping);
    library.addIcons(faTrashCan);
  }
}
