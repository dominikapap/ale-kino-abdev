import { Injectable } from '@angular/core';
import {
  DailyMovieScreenings,
  Movie,
  MovieScreening,
} from 'src/app/movie-interfaces';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { MovieInfoService } from './movie-info.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private movies$$ = new BehaviorSubject<DailyMovieScreenings[]>([]);

  get movies$() {
    return this.movies$$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private movieInfoService: MovieInfoService
  ) {
    this.movieInfoService.movieSelectionState$.subscribe((movieSelectionState) => {
      this.getDailyScreenings(movieSelectionState.movieDate)
        .pipe(
          map((response) => {
            return Array.from(
              this.mergeMovieScreenings(<MovieScreening[]>response).values()
            );
          })
        )
        .subscribe({
          next: (response) => {
            this.movies$$.next(response);
          },
        });
    });
  }

  getDailyScreenings(date: string) {
    return this.http.get(
      `http://localhost:3000/screenings?_expand=movies&date=${date}`
    );
  }

  getMovie(movieId: string) {
    return this.http.get<Movie[]>(`http://localhost:3000/movies/${movieId}`);
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

  ngOnInit() {}
}
