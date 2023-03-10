import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs';
import { RoomsApiService } from 'src/app/services';

export function roomNameTakenValidator(
  roomsService: RoomsApiService
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return roomsService
      .checkIfNameTaken(control.value)
      .pipe(map((names) => (names.length == 0 ? null : { nameTaken: true })));
  };
}
