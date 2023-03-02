import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';

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

  @HostListener('input', ['$event']) onInputChange() {
    this.el.nativeElement.setAttribute(
      'maxLength',
      this.maxInputLength.toString()
    );
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue
      .replace(/[^0-9]/g, '')
      .slice(0, this.maxInputLength);
  }
}
