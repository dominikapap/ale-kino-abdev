import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numbers-only]',
  standalone: true,
})
export class NumbersOnlyDirective {
  private readonly DEFAULT_INPUT_LENGTH = 6;
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
      .replace(/[^0-9]/g, '')
      .slice(0, this.maxInputLength);
      this.el.nativeElement.value = modifiedValue;
      this.control.control?.setValue(modifiedValue);
  }
}
