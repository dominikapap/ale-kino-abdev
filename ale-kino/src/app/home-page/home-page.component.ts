import { MoviesService } from './../movies.service';
import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/movie';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.movies = this.moviesService.getMovies();
    console.log(this.movies)
  }

}
