import { Injectable } from '@angular/core';
import {
  DailyMovieScreenings,
  Movie,
  MovieScreening,
} from 'src/app/features/home/movie/movie.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { MovieInfoService } from './selected-date.state.service';

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
    this.movieInfoService.movieSelectionState$.subscribe(
      (movieSelectionState) => {
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
      }
    );
  }

  getScreeningDetails(screeningId: string) {
    return this.http.get(
      `http://localhost:3000/screenings?_expand=movies&id=${screeningId}`
    );
  }

  getDailyScreenings(date: string) {
    return this.http.get(
      `http://localhost:3000/screenings?_expand=movies&date=${date}`
    );
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
