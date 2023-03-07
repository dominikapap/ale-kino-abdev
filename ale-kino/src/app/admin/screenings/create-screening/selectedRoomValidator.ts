import { inject } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export const selectedRoomValidator = (): ValidatorFn => {
  return (control: AbstractControl) => {
    if (control.value.name) {
      return null;
    } else {
      return { notFromList: true };
    }
  };
};
