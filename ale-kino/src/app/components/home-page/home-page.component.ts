import { MovieScreening } from '../../movie-interfaces';
import { MovieInfoService } from './../../services/movie-info.service';
import { MoviesService } from './../../services/movies.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie, DailyMovieScreenings } from 'src/app/movie-interfaces';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  selectedMovieDate: string = '';
  movieInfoServiceSubscription = new Subscription();
  moviesServiceSubscription = new Subscription();
  subscriptions = new Subscription();
  movies: DailyMovieScreenings[] = [];

  constructor(
    private moviesService: MoviesService,
    private movieInfoService: MovieInfoService
  ) {}

  ngOnInit(): void {
    this.movieInfoServiceSubscription =
      this.movieInfoService.selectedMovieDate$$.subscribe((selectedDay) => {
        this.moviesServiceSubscription = this.moviesService
          .getDailyScreenings(selectedDay)
          .pipe(
            map((response) => {
              return Array.from(
                this.mergeMovieScreenings(<MovieScreening[]>response).values()
              );
            })
          )
          .subscribe({
            next: (response) => {
              this.movies = response;
            },
          });
      });
  }

  ngOnDestroy() {
    this.movieInfoServiceSubscription.unsubscribe();
    this.moviesServiceSubscription.unsubscribe();
  }

  mergeMovieScreenings(dailyScreenings: MovieScreening[]) {
    const formatedMovieData = new Map();
    dailyScreenings.forEach((screening) => {
      if (formatedMovieData.get(screening.moviesId) === undefined) {
        //create map entry for movie if it doesnt exist yet
        formatedMovieData.set(screening.moviesId, {
          id: screening.moviesId,
          movieInfo: screening.movies,
          screenings: [
            {
              id: screening.id,
              roomId: screening.screeningRoomsId,
              date: screening.date,
              time: screening.time,
            },
          ],
        });
      } else {
        //add a screening to an array for existing map entry for movie
        formatedMovieData.get(screening.moviesId).screenings.push({
          id: screening.id,
          roomId: screening.screeningRoomsId,
          date: screening.date,
          time: screening.time,
        });
      }
    });
    return formatedMovieData;
  }
}
