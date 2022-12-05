import { MovieInfoService } from '../../services/movie-info.service';
import { Schedule } from './../../movie';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../services/user.service';
import { Movie } from 'src/app/movie';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  @Input() movie: Movie = {
    id: 0,
    title: '',
    tags: [''],
    length: '',
    rated: '',
    description: '',
    image: '',
    premiere: false,
    score: '',
    schedule: [],
  };

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

  dailySchedule: Schedule | undefined = {
    date: '',
    hours: [],
  };

  ngOnInit(): void {
    this.userService.subject.subscribe((user) => {
      this.user = user;
    });

    this.movieInfo.selectedMovieDate$$.subscribe((value) => {
      this.dailySchedule = this.movie.schedule.find((date) => {
        return date.date === value;
      });
    });
  }

  getMovieInfo(time: string){
    this.movieInfo.selectedMovieTime$$.next(time);
    this.movieInfo.selectedMovieTitle$$.next(this.movie.title);
  }
}
