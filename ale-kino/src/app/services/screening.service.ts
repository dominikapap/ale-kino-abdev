import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MoviesService } from './movies.service';

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  constructor(
    private http: HttpClient,
    private moviesService: MoviesService,
    private route: ActivatedRoute
  ) {}

  private screening$$ = new BehaviorSubject({});

  get screening$() {
    return this.screening$$.asObservable();
  }

  setScreening(screeningId: string) {
    this.moviesService
      .getScreeningDetails(screeningId)
      .subscribe((screeningDetails) => {
        this.screening$$.next(screeningDetails);
        console.log(screeningDetails);
        // return screeningDetails;
      });
  }

  getScreeningDetails(screeningId: string) {
    return this.http.get<any>(
      `http://localhost:3000/screenings?_expand=movies&_expand=screeningRooms&id=${screeningId}`
    );
  }
}
