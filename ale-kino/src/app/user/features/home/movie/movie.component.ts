import { AuthStateService } from 'src/app/auth/auth.state.service';
import { Component, OnInit, Input, inject } from '@angular/core';
import { DailyMovieScreenings } from 'src/app/user/features/home/movie/movie.interface';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  private authStateService = inject(AuthStateService);
  @Input() movie!: DailyMovieScreenings;

  constructor() {}

  role: string = '';

  ngOnInit(): void {
    this.authStateService.auth$.subscribe((authState) => {
      this.role = authState.role;
    });
  }
}
