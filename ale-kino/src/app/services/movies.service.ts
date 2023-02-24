import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs';

export interface Score {
  points: number;
  votes: number;
}

export interface Movie {
  id?: number;
  title: string;
  tags: string[];
  length: string;
  rated: string;
  description: string;
  image: string;
  premiere: boolean;
  score?: Score;
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

  updateMovie(movieId: number, movieSlice: Partial<Movie>) {
    return this.http.patch<Movie>(`/movies/${movieId}`, { ...movieSlice });
  }

  updateMovieScore(movieId: number, points: number) {
    return this.http.get<Movie>(`/movies/${movieId}`).pipe(
      switchMap((movie) => {
        let score: Score;
        if (movie.score) {
          score = {
            points: movie.score.points + points,
            votes: movie.score.votes + 1,
          };
        } else {
          score = {
            points: points,
            votes: 1,
          };
        }

        return this.http.patch<Movie>(`/movies/${movieId}`, {
          score,
        })
      })
    );
  }
}
