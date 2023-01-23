import { AuthState } from './../../../auth/auth.state.service';
import { AuthStateService } from 'src/app/auth/auth.state.service';
import { Screening } from '../../../model/movie-interfaces';
import { MovieInfoService } from '../../../services/movie-info.service';
import { Component, OnInit, Input, inject } from '@angular/core';
import { User } from '../../../model/user-interfaces';
import { UserService } from '../../../services/user.service';
import { Movie, DailyMovieScreenings } from 'src/app/model/movie-interfaces';
import { UserStateService } from 'src/app/core/user.state.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  private authStateService = inject(AuthStateService);
  @Input() movie!: DailyMovieScreenings;

  constructor(private movieInfo: MovieInfoService) {}

  role: string = '';

  ngOnInit(): void {
    this.authStateService.auth$.subscribe((authState) => {
      this.role = authState.role;
    });
  }

  getMovieInfo(time: string) {
    // console.log(time)
    // const screening = this.movie.screenings.find(sc => {
    //   return sc.time === time;
    // })
    // console.log('screening:', screening)
    // this.movieInfo.selectedMovieScreening$$.next(time);
    // this.movieInfo.selectedMovieTitle$$.next(this.movie.movieInfo.title);
  }
}
