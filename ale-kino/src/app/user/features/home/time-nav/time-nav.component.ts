import { Component, Input, OnInit } from '@angular/core';
import { Screening } from 'src/app/admin/screenings';


@Component({
  selector: 'app-time-nav',
  templateUrl: './time-nav.component.html',
  styleUrls: ['./time-nav.component.scss'],
})
export class TimeNavComponent implements OnInit {
  @Input() screenings: Screening[] = [];
  @Input() routerLink: string = '';

  constructor() {}

  ngOnInit(): void {}
}
