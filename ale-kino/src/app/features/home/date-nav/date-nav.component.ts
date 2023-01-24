import { MovieInfoService } from '../../../services/selected-date.state.service';
import { Component, OnInit } from '@angular/core';
import { DateInfoService, Day } from 'src/app/features/home/services/date-info.service';

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.scss'],
})
export class DateNavComponent implements OnInit {
  constructor(
    private movieInfo: MovieInfoService,
    private dateInfoService: DateInfoService
  ) {}

  currentWeekDays: Day[] = [];

  ngOnInit(): void {
    this.dateInfoService.currentWeekDates$.subscribe((currentWeekDays) => {
      this.currentWeekDays = currentWeekDays;
    });
  }

  getSelectedDay(dayOfTheWeek: string) {
    let date: string = this.dateInfoService.getWeekDayDate(
      dayOfTheWeek,
      this.currentWeekDays
    );
    this.movieInfo.setMovieDate(date);
  }
}
