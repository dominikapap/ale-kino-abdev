import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Movie } from './movies.service';
import { Room } from './rooms.service';

export type ScreeningDetails = {
  id: number;
  date: string;
  time: string;
  rooms: Room;
  movies: Movie;
};

@Injectable({
  providedIn: 'root'
})
export class ScreeningsService {
  private http = inject(HttpClient);

  constructor() { }

  getScreeningDetails(screeningId: string) {
    return this.http.get<ScreeningDetails[]>(
      `/screenings?_expand=rooms&_expand=movies&id=${screeningId}`
    );
  }
}
