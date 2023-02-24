import { MovieComponent } from './movie/movie.component';
import { TimeNavComponent } from './time-nav/time-nav.component';
import { DateNavComponent } from './date-nav/date-nav.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ButtonComponent } from '../ui/button/button.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MovieScoreDialogComponent } from './movie-score-dialog/movie-score-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    HomePageComponent,
    MovieComponent,
    DateNavComponent,
    TimeNavComponent,
    MovieScoreDialogComponent,
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    ButtonComponent,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePageComponent,
        children: [],
      },
    ]),
  ],
  exports: [MovieComponent]
})
export default class HomeModule {}
