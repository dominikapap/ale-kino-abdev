import { Component, OnInit } from '@angular/core';
import { format, add } from 'date-fns';

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.scss']
})
export class DateNavComponent implements OnInit {

  constructor() { }

  items = ['13/11']

  ngOnInit(): void {
    console.log(format(new Date(), 'dd/MM'));
  }

  initiateWeekDates(){
    for(let i = 0; i < 7; i++){
      this.items.push()
    }
    const dateToday = format(new Date(), 'dd/MM');
  }

}
