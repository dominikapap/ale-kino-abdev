import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() value: string = '';
  @Input() btnClass: string = '';
  @Input() icon?: IconProp;

  @Output() clickButtonEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  handleButtonClick() {
    this.clickButtonEvent.emit();
  }
}
