import { Movie } from '../movie-interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieInfoService {

  constructor() { }

  selectedMovieDate$$ = new BehaviorSubject<string>('13-11-2022');
  selectedMovieScreening$$ = new BehaviorSubject<string>('');
  selectedMovieTitle$$ = new BehaviorSubject<string>('');

  get selectedMovieDate$(){
    return this.selectedMovieDate$$.asObservable();
  }

  ngOnInit(){

  }


}
