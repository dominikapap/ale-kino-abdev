import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[letters-only]',
  standalone: true,
})
export class LettersOnlyDirective {
  private readonly DEFAULT_INPUT_LENGTH = 30;
  @Input() maxInputLength: number = this.DEFAULT_INPUT_LENGTH;
  private el: ElementRef<HTMLInputElement> = inject(
    ElementRef<HTMLInputElement>
  );
  private control =  inject(NgControl);

  @HostListener('input', ['$event']) onInputChange() {
    this.el.nativeElement.setAttribute(
      'maxLength',
      this.maxInputLength.toString()
    );
    const initialValue = this.el.nativeElement.value;
    const modifiedValue = initialValue
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, this.maxInputLength);
      this.el.nativeElement.value = modifiedValue;
      this.control.control?.setValue(modifiedValue);
  }
}
