import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[blikCode]',
  standalone: true,
})
export class BlikCodeDirective {
  private readonly BLIK_CODE_LENGTH = 6;
  private el: ElementRef<HTMLInputElement> = inject(
    ElementRef<HTMLInputElement>
  );

  @HostListener('input', ['$event']) onInputChange() {
    this.el.nativeElement.setAttribute(
      'maxLength',
      this.BLIK_CODE_LENGTH.toString()
    );
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue
      .replace(/[^0-9]/g, '')
      .slice(0, this.BLIK_CODE_LENGTH);
  }
}
