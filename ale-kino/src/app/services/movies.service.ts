import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Movie {
  id: number,
  title: string,
  tags: string[],
  length: string,
  rated: string,
  description: string,
  image: string,
  premiere: boolean,
  score: string
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private http = inject(HttpClient);

  constructor() { }

  getAllMovies() {
    return this.http.get<Movie[]>(`/movies`);
  }

  getMovieDetails(movieId: number) {
    return this.http.get<Movie>(`/movies/${movieId}`);
  }
}
