import { DailyMoviesScreeningsService } from '../../../../services/daily-movies-screenings.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DailyMovieScreenings } from 'src/app/user/features/home/movie/movie.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  dailyScreenings: DailyMovieScreenings[] = [];

  constructor(
    private dailyScreeningsService: DailyMoviesScreeningsService,
  ) {}

  ngOnInit(): void {
    this.getDailyMovies();
  }

  getDailyMovies(){
    const sub = this.dailyScreeningsService.dailyScreenings$.subscribe((dailyScreenings) => {
      this.dailyScreenings = dailyScreenings;
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}
