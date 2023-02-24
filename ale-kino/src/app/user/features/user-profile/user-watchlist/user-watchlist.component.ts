import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UserStateService } from './../../../../core/user.state.service';
import { Component, inject } from '@angular/core';
import  HomeModule  from '../../home/home.module';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-watchlist',
  templateUrl: './user-watchlist.component.html',
  styleUrls: ['./user-watchlist.component.scss'],
  standalone: true,
  imports: [HomeModule, CommonModule, MatButtonModule, RouterModule]
})
export default class UserWatchlistComponent {
  protected userWatchListMovies$ = inject(UserStateService).getUserWatchListMovies();

}
