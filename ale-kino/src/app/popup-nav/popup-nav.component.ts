import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-nav',
  templateUrl: './popup-nav.component.html',
  styleUrls: ['./popup-nav.component.scss'],
})
export class PopupNavComponent implements OnInit {
  constructor() {}
  @Input() isPopNavHidden: boolean = true;
  @Input() navItems: string[] = [];

  @Output() clickNavItemEvent = new EventEmitter<string>();

  ngOnInit(): void {}

  handleNavItemClick(navItem: string) {
    this.clickNavItemEvent.emit(navItem);
  }
}
