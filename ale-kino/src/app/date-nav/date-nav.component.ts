import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.scss']
})
export class DateNavComponent implements OnInit {

  constructor() { }

  items = ['13/11']

  ngOnInit(): void {
  }

}
