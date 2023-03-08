import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';

@Directive({
  selector: '[date-characters]',
  standalone: true,
})
export class DateOnlyCharactersDirective {
  private readonly DEFAULT_INPUT_LENGTH = 10;
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
    const modifiedValue = initialValue
      .replace(/[^0-9-/.]/g, '')
      .slice(0, this.maxInputLength);
      this.el.nativeElement.value = modifiedValue;
  }
}
