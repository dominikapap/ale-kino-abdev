import { Injectable } from '@angular/core';
import { Movie } from 'src/app/movie';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {

  constructor(private http: HttpClient) {}


  getDailyScreenings(date: string){
    return this.http.get(`http://localhost:3000/screenings?_expand=movies&date=${date}`);
  }
  getMovies() {
    return this.http.get<Movie[]>('http://localhost:3000/movies');
  }

  getMovie(movieId: string){
    return this.http.get<Movie[]>(`http://localhost:3000/movies/${movieId}`);
  }

  getSchedule() {
    return this.http.get('http://localhost:3000/schedule');
  }

  ngOnInit(){

  }

}
