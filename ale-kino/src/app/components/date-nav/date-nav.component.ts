import { MovieInfoService } from '../../services/movie-info.service';
import { Component, OnInit } from '@angular/core';
import { DateInfoService, Day } from 'src/app/services/date-info.service';

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.scss'],
})
export class DateNavComponent implements OnInit {
  constructor(private movieInfo: MovieInfoService, private dateInfoService: DateInfoService) {}

  days: Day[] = [];

  ngOnInit(): void {
    this.dateInfoService.currentWeekDates$.subscribe(weekDays => {
      this.days = weekDays;
    })
  }

  getSelectedDay(dayOfTheWeek: string) {
    let day: Day = {
      dayOfTheWeek: '',
      date: ''
    }
    day = <Day>this.days.find(day => {
      return day.dayOfTheWeek === dayOfTheWeek;
    })
    this.movieInfo.setMovieDate(day.date)
  }
}
