import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import CreateScreeningComponent from './create-screening/create-screening.component';
import { ScreeningsEffects, screeningsFeatureKey, screeningsReducer } from './store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [CreateScreeningComponent],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatStepperModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    CommonModule,
    MatSnackBarModule,
    StoreModule.forFeature(screeningsFeatureKey, screeningsReducer),
    EffectsModule.forFeature([ScreeningsEffects]),
    RouterModule.forChild([
      { path: '', redirectTo: 'create-screening', pathMatch: 'full' },
      {
        path: 'create-screening',
        component: CreateScreeningComponent,
      },
    ]),
  ],
})
export default class MoviesModule {}
