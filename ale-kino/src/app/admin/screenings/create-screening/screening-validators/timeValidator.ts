import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export function timeValidator(dateControlName: string) {
  let timeControl: FormControl;
  let dateControl: FormControl;

  return (control: FormControl) => {
    if (!control.parent) {
      return null;
    }

    if (!timeControl) {
      timeControl = control;
      dateControl = control.parent.get(dateControlName) as FormControl;
      dateControl.valueChanges.subscribe(() => {
        timeControl.updateValueAndValidity();
      });
    }

    const [hours, minutes] = timeControl.value.split(':');
    const selectedDateTime = new Date();
    selectedDateTime.setHours(hours);
    selectedDateTime.setMinutes(minutes);
    if (
      (moment(dateControl.value).isSame(new Date(), 'day') &&
        moment(selectedDateTime).isAfter(new Date(), 'minute')) ||
      moment(dateControl.value).isAfter(new Date(), 'day')
    ) {
      return null;
    } else {
      return { pastTime: true };
    }
  };
}
