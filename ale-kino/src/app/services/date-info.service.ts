import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { parse } from 'date-fns';

interface Day {
  dayOfTheWeek: string;
  date: string;
}
@Injectable({
  providedIn: 'root',
})
export class DateInfoService {
  currentWeek: Day[] = [
    { dayOfTheWeek: 'Pn', date: '13/11/2022' },
    { dayOfTheWeek: 'Wt', date: '14/11/2022' },
    { dayOfTheWeek: 'Sr', date: '15/11/2022' },
    { dayOfTheWeek: 'Czw', date: '16/11/2022' },
    { dayOfTheWeek: 'Pt', date: '17/11/2022' },
    { dayOfTheWeek: 'Sb', date: '18/11/2022' },
    { dayOfTheWeek: 'Nd', date: '19/11/2022' },
  ];

  private currentWeekDates$$ = new BehaviorSubject<Day[]>([]);

  constructor() {

    const x = parse('14.03.2018', 'dd.MM.yyyy', new Date());
    console.log(x);
  }
}
