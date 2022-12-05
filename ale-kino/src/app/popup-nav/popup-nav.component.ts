import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popup-nav',
  templateUrl: './popup-nav.component.html',
  styleUrls: ['./popup-nav.component.scss']
})
export class PopupNavComponent implements OnInit {

  constructor() { }
@Input() isPopNavHidden: boolean = true;
@Input() navItems: string[] = [];

  ngOnInit(): void {
  }

}
