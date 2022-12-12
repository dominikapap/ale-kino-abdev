import { BehaviorSubject, of, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { format, getDay, subDays, addDays } from 'date-fns';

export interface Day {
  dayOfTheWeek: string;
  date: string;
}
@Injectable({
  providedIn: 'root',
})
export class DateInfoService {

  private currentWeekDates$$ = new BehaviorSubject<Day[]>([]);

  get currentWeekDates$() {
    return this.currentWeekDates$$.asObservable();
  }

  constructor() {
    of<Date[]>(this.getCurrentWeekDates())
      .pipe(
        map((date) => {
          return this.convertDateToDayFormat(date);
        })
      )
      .subscribe((weekDates) => {
        this.currentWeekDates$$.next(weekDates);
      });
  }

  private convertDateToDayFormat(dates: Date[]) {
    let days: Day[] = [];
    dates.forEach((date) => {
      days.push({
        dayOfTheWeek: format(date, 'EEEEEE'),
        date: format(date, 'dd-MM-yyyy'),
      });
    });
    return days;
  }

  private getCurrentWeekDates(): Date[] {
    //creates an array with current week dates
    const currentWeekDatesArray: Date[] = [];
    const daysInWeek = 7;
    const mondayDate = subDays(new Date(), getDay(new Date()) - 1);
    for (let i = 0; i < daysInWeek; i++) {
      currentWeekDatesArray.push(addDays(mondayDate, i));
    }
    return currentWeekDatesArray;
  }
}
