import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export const dateValidator = (): ValidatorFn => {
  return (control: AbstractControl) => {
    const todaysDate = new Date();

    if (
      moment(control.value).isAfter(todaysDate, 'day') ||
      moment(control.value).isSame(todaysDate, 'day')
    ) {
      return null;
    } else {
      return { pastDate: true };
    }
  };
};
