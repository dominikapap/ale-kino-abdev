import { SelectedDateService } from '../../../../services';
import { Component, inject } from '@angular/core';
import { DateInfoService, Day } from 'src/app/user/features/home/services/date-info.service';

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.scss'],
})
export class DateNavComponent  {
  protected selectedDateService = inject(SelectedDateService);
  protected dateInfoService = inject(DateInfoService);

  getSelectedDay(dayOfTheWeek: string, currentWeekDays: Day[]) {
    let date: string = this.dateInfoService.getWeekDayDate(
      dayOfTheWeek,
      currentWeekDays
    );
    this.selectedDateService.setDate(date);
  }
}
