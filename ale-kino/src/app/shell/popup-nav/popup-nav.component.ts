import { MenuCategory } from './../header/header-nav.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-nav',
  templateUrl: './popup-nav.component.html',
  styleUrls: ['./popup-nav.component.scss'],
})
export class PopupNavComponent implements OnInit {
  constructor() {}
  @Input() isPopNavHidden: boolean = true;
  @Input() navItems: MenuCategory[] = [];

  @Output() clickNavItemEvent = new EventEmitter<string>();

  ngOnInit(): void {}

  handleNavItemClick(navItem: string) {
    this.clickNavItemEvent.emit(navItem);
  }
}
