import { UserStateService } from './../../../../core/user.state.service';
import { Component, inject } from '@angular/core';
import  HomeModule  from '../../home/home.module';
import { NgIf, AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-user-watchlist',
  templateUrl: './user-watchlist.component.html',
  styleUrls: ['./user-watchlist.component.scss'],
  standalone: true,
  imports: [HomeModule,NgIf, AsyncPipe, NgFor]
})
export default class UserWatchlistComponent {
  protected userWatchListMovies$ = inject(UserStateService).getUserWatchListMovies();

}
