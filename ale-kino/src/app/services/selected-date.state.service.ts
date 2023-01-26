import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class SelectedDateService {
  constructor() {}

  private selectedDateState$$ = new BehaviorSubject<{ date: string}>({
    date: format(new Date(), 'dd-MM-yyyy'),

  });

  get  selectedDateState$() {
    return this.selectedDateState$$.asObservable();
  }

  setDate(date: string) {
    this.selectedDateState$$ .next({
      ...this.selectedDateState$$ .value,
      date: date
    });
  }

  ngOnInit() {}
}
