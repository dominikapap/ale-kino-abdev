import { Movie } from '../movie-interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieInfoService {

  constructor() { }

  private selectedMovieDate$$ = new BehaviorSubject<string>('12-12-2022');
  selectedMovieScreening$$ = new BehaviorSubject<string>('');
  selectedMovieTitle$$ = new BehaviorSubject<string>('');

  get selectedMovieDate$(){
    return this.selectedMovieDate$$.asObservable();
  }

  setMovieDate(date: string){
    this.selectedMovieDate$$.next(date);
  }

  // private convertDateFormat(date: string) {
  //   return date.replace('/', '-') + `-${this.currentYear}`;
  // }

  ngOnInit(){

  }


}
