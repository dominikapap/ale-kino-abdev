import { Screening } from './../../movie';
import { MovieInfoService } from '../../services/movie-info.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../services/user.service';
import { Movie, DailyMovieScreenings } from 'src/app/movie';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  @Input() movie!: DailyMovieScreenings;

  constructor(
    private userService: UserService,
    private movieInfo: MovieInfoService
  ) {}

  user: User = {
    username: '',
    type: {
      isUser: false,
      isAdmin: false,
    },
  };

  dailyTimeSchedule: string[] = [];
  // dailySchedule: Schedule | undefined = {
  //   date: '',
  //   hours: [],
  // };

  ngOnInit(): void {
    this.userService.subject.subscribe((user) => {
      this.user = user;
    });

    this.dailyTimeSchedule = this.screeningTimeToArray(this.movie);
  }

  getMovieInfo(time: string) {
    this.movieInfo.selectedMovieTime$$.next(time);
    this.movieInfo.selectedMovieTitle$$.next(this.movie.movieInfo.title);
  }

  screeningTimeToArray(movie: DailyMovieScreenings) {
    //get time from each screening and group them in an array
    const dailyTimeSchedule: string[] = [];
    movie.screenings.forEach((screening: Screening) => {
      dailyTimeSchedule.push(screening.time);
    });
    return dailyTimeSchedule;
  }
}
