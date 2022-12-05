import { Movie } from '../movie';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieInfoService {

  constructor() { }

  selectedMovieDate$$ = new BehaviorSubject<string>('13-11-2022');
  selectedMovieTime$$ = new BehaviorSubject<string>('');
  selectedMovieTitle$$ = new BehaviorSubject<string>('');

  ngOnInit(){

  }


}
