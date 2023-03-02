import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Room } from 'src/app/services';
import { Movie } from '../movies';

export type ScreeningDetails = {
  id: number;
  date: string;
  time: string;
  rooms: Room;
  movies: Movie;
};

export type Screening = {
  id?: number;
  date: string;
  time: string;
  roomsId: number;
  moviesId: number;
};

@Injectable({
  providedIn: 'root',
})
export class ScreeningsApiService {
  private http = inject(HttpClient);

  constructor() {}

  addScreening(screening: Screening) {
    return this.http.post<Screening>('/screenings', {
      date: screening.date,
      time: screening.time,
      roomsId: screening.roomsId,
      moviesId: screening.moviesId,
    });
  }

  getAllScreenings() {
    return this.http.get<Screening[]>(`/screenings`);
  }

  getAllDailyRoomScreenings(date: Date, roomId: number) {
    const convertedDate = this.convertDateFormat(date);
    return this.http.get<Screening[]>(
      `/screenings?date=${convertedDate}&roomsId=${roomId}`
    );
  }

  getScreeningDetailsById(screeningId: number) {
    return this.http.get<ScreeningDetails[]>(
      `/screenings?_expand=rooms&_expand=movies&id=${screeningId}`
    );
  }

  getAllScreeningsDetails() {
    return this.http.get<ScreeningDetails[]>(
      `/screenings?_expand=rooms&_expand=movies`
    );
  }

  getScreeningDetails(screeningId: string) {
    return this.http.get<ScreeningDetails[]>(
      `/screenings?_expand=rooms&_expand=movies&id=${screeningId}`
    );
  }

  getDailyRoomScreeningDetails(roomId: number, date: Date) {
    return this.http.get<ScreeningDetails[]>(
      `/screenings?_expand=movies&date=${this.convertDateFormat(
        date
      )}&roomsId=${roomId}`
    );
  }

  convertDateFormat(dateValue: Date) {
    let date: string | number = dateValue.getDate();
    let month: string | number = dateValue.getMonth() + 1;
    const year = dateValue.getFullYear();

    if (date < 10) {
      date = '0' + date;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return `${date}-${month}-${year}`;
  }

  getScreeningIdFromRoute(route: ActivatedRoute) {
    return route.paramMap.pipe(
      map((params) => {
        const screeningId: string = <string>params.get('screeningId');
        return screeningId;
      })
    );
  }
}
