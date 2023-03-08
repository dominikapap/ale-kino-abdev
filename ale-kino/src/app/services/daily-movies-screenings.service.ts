import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { SelectedDateService } from './selected-date.state.service';
import { Movie } from '../admin/movies';
import { Screening } from '../admin/screenings';

export interface MovieScreening {
  date: string;
  id: number;
  movies: Movie;
  moviesId: number;
  screeningRoomsId: number;
  time: string;
}

export interface DailyMovieScreenings {
  id: number;
  movieInfo: Movie;
  screenings: Screening[];
}

@Injectable({
  providedIn: 'root',
})
export class DailyMoviesScreeningsService {
  private http = inject(HttpClient);
  private selectedDateService = inject(SelectedDateService);

  private dailyScreenings$$ = new BehaviorSubject<DailyMovieScreenings[]>([]);

  get dailyScreenings$() {
    return this.dailyScreenings$$.asObservable();
  }

  private get dailyScreeningsValue() {
    return this.dailyScreenings$$.value;
  }

  getDailyScreeningsState() {
    return this.selectedDateService.selectedDateState$.pipe(
      switchMap((selectedDate) => {
        return this.getDailyScreenings(selectedDate.date);
      }),
      map((response) => {
        return Array.from(
          this.mergeMovieScreenings(<MovieScreening[]>response).values()
        );
      }),
      tap((nextDailyScreeningsState) => {
        this.dailyScreenings$$.next(nextDailyScreeningsState);
      })
    );
  }

  getScreeningDetails(screeningId: string) {
    return this.http.get(`/screenings?_expand=movies&id=${screeningId}`);
  }

  getDailyScreenings(date: string) {
    return this.http.get(`/screenings?_expand=movies&date=${date}`);
  }

  mergeMovieScreenings(dailyScreenings: MovieScreening[]) {
    const formatedMovieData = new Map<number, DailyMovieScreenings>();
    dailyScreenings.forEach((screening) => {
      if (formatedMovieData.get(screening.moviesId) === undefined) {
        //create map entry for movie if it doesnt exist yet
        formatedMovieData.set(screening.moviesId, {
          id: screening.moviesId,
          movieInfo: screening.movies,
          screenings: [
            {
              id: screening.id,
              moviesId: screening.moviesId,
              roomsId: screening.screeningRoomsId,
              date: screening.date,
              time: screening.time,
            },
          ],
        });
      } else {
        //add a screening to an array for existing map entry for movie
        formatedMovieData.get(screening.moviesId)?.screenings.push({
          id: screening.id,
          moviesId: screening.moviesId,
          roomsId: screening.screeningRoomsId,
          date: screening.date,
          time: screening.time,
        });
      }
    });
    return formatedMovieData;
  }

  ngOnInit() {}
}
