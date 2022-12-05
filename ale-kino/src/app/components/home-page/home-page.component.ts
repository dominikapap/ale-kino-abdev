import { MovieInfoService } from './../../services/movie-info.service';
import { MoviesService } from './../../services/movies.service';
import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/movie';

interface MovieScreening {
  date: string;
  id: number;
  movies: Movie;
  moviesId: number;
  roomsId: number;
  time: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  movies: Movie[] = [];
  dailyMovies: Movie[] = [];
  dailyScreenings: MovieScreening[] = [];
  selectedMovieDate: string = '';

  constructor(
    private moviesService: MoviesService,
    private movieInfoService: MovieInfoService
  ) {}

  ngOnInit(): void {
    this.movieInfoService.selectedMovieDate$$.subscribe((selectedDay) => {
      this.moviesService.getDailyScreenings(selectedDay)
      .subscribe({
        next: (response) => {
          this.dailyScreenings = <MovieScreening[]>response;
          this.dailyScreenings.forEach(screening => {
            console.log(screening)
          })
        },
      });
    });

    this.moviesService.getMovies().subscribe({
      next: (response) => (this.movies = response),
    });
  }
}
