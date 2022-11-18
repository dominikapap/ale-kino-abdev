import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { MoviesService } from './../movies.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  constructor(private userService: UserService, private moviesService: MoviesService) { }

  user: User = this.userService.getUser();
  items = ['12:00', '15:30', '21:30'];

  ngOnInit(): void {
  }

}
