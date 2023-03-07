import { format } from 'date-fns';
import {
  Directive,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[trim-whitespace]',
  standalone: true,
})
export class TrimDirective {
  private el: ElementRef<HTMLInputElement> = inject(
    ElementRef<HTMLInputElement>
  );
  private control =  inject(NgControl);

  @HostListener('blur', ['$event']) onInputChange() {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.trim();
    this.control.control?.setValue(initialValue.trim())
  }
}
