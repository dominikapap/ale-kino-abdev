import { Movie } from '../movie-interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieInfoService {

  constructor() { }

    items = ['13/11', '14/11', '15/11', '16/11', '17/11', '18/11', '19/11'];
  currentYear = '2022';

  private selectedMovieDate$$ = new BehaviorSubject<string>('13-11-2022');
  selectedMovieScreening$$ = new BehaviorSubject<string>('');
  selectedMovieTitle$$ = new BehaviorSubject<string>('');

  get selectedMovieDate$(){
    return this.selectedMovieDate$$.asObservable();
  }

  setMovieDate(date: string){
    this.selectedMovieDate$$.next(this.convertDateFormat(date));
  }

  private convertDateFormat(date: string) {
    return date.replace('/', '-') + `-${this.currentYear}`;
  }

  ngOnInit(){

  }


}
