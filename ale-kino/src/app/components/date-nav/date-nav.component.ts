import { MovieInfoService } from '../../services/movie-info.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.scss'],
})
export class DateNavComponent implements OnInit {
  constructor(private movieInfo: MovieInfoService) {}

  items = ['13/11', '14/11', '15/11', '16/11', '17/11', '18/11', '19/11'];
  currentYear = '2022';
  ngOnInit(): void {}

  private convertDateFormat(date: string) {
    return date.replace('/', '-') + `-${this.currentYear}`;
  }
  getSelectedDate(date: string) {
    this.movieInfo.selectedMovieDate$$.next(this.convertDateFormat(date));
  }
}
