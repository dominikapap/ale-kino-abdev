import { MovieScreening } from '../../movie-interfaces';
import { MovieInfoService } from './../../services/movie-info.service';
import { MoviesService } from './../../services/movies.service';
import { Component, OnInit } from '@angular/core';
import { Movie, DailyMovieScreenings } from 'src/app/movie-interfaces';
import { map, Subscription } from 'rxjs';





@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  selectedMovieDate: string = '';
  subscriptions = new Subscription();
  movies: DailyMovieScreenings[] = [];

  constructor(
    private moviesService: MoviesService,
    private movieInfoService: MovieInfoService
  ) {}

  ngOnInit(): void {

    this.movieInfoService.selectedMovieDate$$.subscribe((selectedDay) => {
      this.subscriptions.unsubscribe(); //remove previous day subscription
      this.subscriptions = this.moviesService
        .getDailyScreenings(selectedDay).pipe(
          map(response => {
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
