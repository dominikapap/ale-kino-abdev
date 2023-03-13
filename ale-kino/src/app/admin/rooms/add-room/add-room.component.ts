import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { RoomsApiService } from 'src/app/services';
import {
  MAX_COLUMNS,
  MAX_NAME_LENGTH,
  MAX_ROWS,
  MIN_COLUMNS,
  MIN_LENGTH,
  MIN_ROWS,
  NO_STARTING_WHITESPACE,
  NO_STARTING_ZERO_NUMBER,
} from '../../shared/validators-constans';
import { RoomsActions } from '../store';
import { roomNameTakenValidator } from './room-name-taken.validator';

type RoomForm = FormGroup<{
  name: FormControl<string>;
  rows: FormControl<number>;
  seats: FormControl<number>;
}>;

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddRoomComponent {
  private builder = inject(NonNullableFormBuilder);
  private roomsService = inject(RoomsApiService);
  private store = inject(Store);
  readonly MIN_ROWS = MIN_ROWS;
  readonly MAX_ROWS = MAX_ROWS;
  readonly MIN_COLUMNS = MIN_COLUMNS;
  readonly MAX_COLUMNS = MAX_COLUMNS;
  roomForm = this.createRoomForm();

  get nameCtrl() {
    return this.roomForm.controls.name;
  }
  get rowsCtrl() {
    return this.roomForm.controls.rows;
  }
  get seatsCtrl() {
    return this.roomForm.controls.seats;
  }

  sendForm() {
    this.roomForm.markAllAsTouched();
    if (this.roomForm.invalid) {
      return;
    }
    this.store.dispatch(RoomsActions.addNewRoom(this.roomForm.getRawValue()));
  }

  private createRoomForm(): RoomForm {
    return this.builder.group({
      name: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.maxLength(MAX_NAME_LENGTH),
          Validators.minLength(MIN_LENGTH),
          Validators.pattern(NO_STARTING_WHITESPACE),
        ],
        asyncValidators: [roomNameTakenValidator(this.roomsService)],
        updateOn: 'blur',
      }),
      rows: this.builder.control(10, {
        validators: [
          Validators.required,
          Validators.min(MIN_ROWS),
          Validators.max(MAX_ROWS),
        ],
      }),
      seats: this.builder.control(10, {
        validators: [
          Validators.required,
          Validators.min(MIN_COLUMNS),
          Validators.max(MAX_COLUMNS),
        ],
      }),
    });
  }
}
