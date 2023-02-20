import { MovieComponent } from './movie/movie.component';
import { TimeNavComponent } from './time-nav/time-nav.component';
import { DateNavComponent } from './date-nav/date-nav.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ButtonComponent } from '../ui/button/button.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HomePageComponent,
    MovieComponent,
    DateNavComponent,
    TimeNavComponent,
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    ButtonComponent,
    RouterModule.forChild([
      {
        path: '',
        component: HomePageComponent,
        children: [],
      },
    ]),
  ],
})
export default class HomeModule {}
