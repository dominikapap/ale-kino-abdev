import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Movie {
  id?: number;
  title: string;
  tags: string[];
  length: string;
  rated: string;
  description: string;
  image: string;
  premiere: boolean;
  score?: string;
}

export interface Rating {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private http = inject(HttpClient);

  constructor() {}

  addMovie(movie: Movie) {
    return this.http.post<Movie>('/movies', {
      ...movie,
    });
  }

  getAllMovies() {
    return this.http.get<Movie[]>(`/movies`);
  }

  getAllRatings() {
    return this.http.get<Rating[]>(`/ratings`);
  }

  getAllTags() {
    return this.http.get<Tag[]>(`/tags`);
  }

  getMovieDetails(movieId: number) {
    return this.http.get<Movie>(`/movies/${movieId}`);
  }
}
