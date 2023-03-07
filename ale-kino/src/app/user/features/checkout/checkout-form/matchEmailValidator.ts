import { FormControl } from '@angular/forms';

export function matchEmailValidator(emailControlName: string,) {
  let repeatEmailControl: FormControl;
  let emailControl: FormControl;

  return (control: FormControl) => {
    if (!control.parent) {
      return null;
    }

    if (!repeatEmailControl) {
      repeatEmailControl = control;
      emailControl = control.parent.get(emailControlName) as FormControl;
      emailControl.valueChanges.subscribe(() => {
        repeatEmailControl.updateValueAndValidity();
      });
    }

    if (
      emailControl.value.toLocaleLowerCase() !==
      repeatEmailControl.value.toLocaleLowerCase()
    ) {
      return { notMatch: true };
    }

    return null;
  };
}
