import { MovieInfoService } from '../../services/movie-info.service';
import { MoviesService } from './../../services/movies.service';
import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/movie';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  movies: Movie[] = [];
  dailyMovies: Movie[] = [];
  selectedMovieDate: string = '';

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.moviesService.getMovies().subscribe({
      next: (response) => this.movies = response
    });

  }

}
