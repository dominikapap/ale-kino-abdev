import { BehaviorSubject, of, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { format, getDay, subDays, addDays, isPast,isSameDay} from 'date-fns';

export interface Day {
  dayOfTheWeek: string;
  date: string;
  isPast?: boolean;
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
        isPast: this.checkIfPastDate(date)
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

  getWeekDayDate(dayOfTheWeek: string, days: Day[]) {
    let day: Day = {
      dayOfTheWeek: '',
      date: '',
    };
    day = <Day>days.find((day) => {
      return day.dayOfTheWeek === dayOfTheWeek;
    });
    return day.date;
  }

  private checkIfPastDate(date: Date){
    if(isPast(date) && !isSameDay(date, new Date())){
      return true;
    }
    return false;
  }
}
