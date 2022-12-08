import { MoviesService } from './../../services/movies.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DailyMovieScreenings } from 'src/app/movie-interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  movies: DailyMovieScreenings[] = [];

  constructor(
    private moviesService: MoviesService,
  ) {}

  ngOnInit(): void {
    this.getDailyMovies();
  }

  getDailyMovies(){
    const sub = this.moviesService.movies$.subscribe((movies) => {
      this.movies = movies;
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}
