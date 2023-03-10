import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TrimDirective } from 'src/app/shared/directives';
import AddRoomComponent from './add-room/add-room.component';
import { RoomsEffects, roomsFeatureKey, roomsReducer } from './store';

@NgModule({
  declarations: [AddRoomComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TrimDirective,
    StoreModule.forFeature(roomsFeatureKey, roomsReducer),
    EffectsModule.forFeature([RoomsEffects]),
    RouterModule.forChild([
      { path: '', redirectTo: 'add-room', pathMatch: 'full' },
      {
        path: 'add-room',
        component: AddRoomComponent,
      },
    ]),
  ],
})
export default class RoomsModule {}
