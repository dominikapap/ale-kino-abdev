import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  forkJoin,
  map,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Movie, MoviesService } from '../services/movies.service';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  ratedMovies?: number[];
  movieWatchList?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private http = inject(HttpClient);
  private movieService = inject(MoviesService);
  constructor() {}

  private user$$ = new ReplaySubject<User>(1);

  get user$() {
    return this.user$$.asObservable();
  }

  addUser(user: User) {
    this.user$$.next(user);
  }

  resetUser() {
    this.user$$ = new ReplaySubject<User>(1);
  }

  updateUserInfo(userId: number, userSlice: Partial<User>) {
    return this.http.patch<User>(`/users/${userId}`, { ...userSlice });
  }

  rateMovieByUser(movieId: number, points: number) {
    return this.movieService.updateMovieScore(movieId, points).pipe(
      switchMap((ratedMovie) => {
        return this.toggleMovieOnUserList(<number>ratedMovie.id, 'ratedMovies');
      })
    );
  }

  toggleMovieOnUserList(
    movieId: number,
    userListName: 'movieWatchList' | 'ratedMovies'
  ) {
    return this.user$.pipe(
      take(1),
      switchMap((userState) => {
        if (this.movieOnTheList(movieId, <number[]>userState[userListName])) {
          const updatedMovieList: number[] = <number[]>(
            userState[userListName]?.filter(
              (listedMovieId) => listedMovieId !== movieId
            )
          );
          return this.updateUserInfo(userState.id, {
            [userListName]: updatedMovieList,
          });
        } else {
          const updatedMovieList: number[] = [
            ...(<number[]>userState[userListName]),
            movieId,
          ];
          return this.updateUserInfo(userState.id, {
            [userListName]: updatedMovieList,
          });
        }
      }),
      tap((updatedUser) => {
        this.addUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
    );
  }

  movieOnTheList(movieId: number, movieList: number[]) {
    return movieList.some((listedMovieId) => listedMovieId === movieId);
  }

  getUserWatchListMovies() {
    return this.user$.pipe(
      switchMap((userState) => {
        const requests: Observable<Movie>[] = [];
        if (userState.movieWatchList?.length) {
          userState.movieWatchList.forEach((movieId) => {
            requests.push(this.movieService.getMovieDetails(movieId));
          });
          return forkJoin<Movie[]>(requests);
        } else {
          return of([]);
        }
      }),
      map((movies) => {
        return movies.flat();
      })
    );
  }
}
