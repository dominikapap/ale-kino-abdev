import { Screening } from '../../movie-interfaces';
import { MovieInfoService } from '../../services/movie-info.service';
import { Component, OnInit, Input, inject } from '@angular/core';
import { User } from '../../user-interfaces';
import { UserService } from '../../services/user.service';
import { Movie, DailyMovieScreenings } from 'src/app/movie-interfaces';
import { UserStateService } from 'src/app/core/user.state.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  private userStateService = inject(UserStateService);
  @Input() movie!: DailyMovieScreenings;

  constructor(
    private userService: UserService,
    private movieInfo: MovieInfoService,
  ) {}

  user: User = {
    username: '',
    type: {
      isUser: false,
      isAdmin: false,
    },
  };

  ngOnInit(): void {
    this.userService.subject.subscribe((user) => {
      this.user = user;
    });
    this.userStateService.user$.subscribe(user => {
      console.log('user', user)
    })

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
