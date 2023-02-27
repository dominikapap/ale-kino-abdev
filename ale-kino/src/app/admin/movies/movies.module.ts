import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import AddMovieComponent from './add-movie/add-movie.component';
import { moviesFeatureKey, moviesReducer, MoviesEffects } from './store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AddMovieComponent],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    CommonModule,
    StoreModule.forFeature(moviesFeatureKey, moviesReducer),
    EffectsModule.forFeature([MoviesEffects]),
    RouterModule.forChild([
      { path: '', redirectTo: 'add-movie', pathMatch: 'full' },
      {
        path: 'add-movie',
        component: AddMovieComponent,
      },
    ]),
  ],
})
export default class MoviesModule {}
