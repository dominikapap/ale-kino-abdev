import { UserStateService } from 'src/app/core/user.state.service';
import { AuthStateService } from 'src/app/auth/auth.state.service';
import { Component, OnInit, Input, inject } from '@angular/core';
import { DailyMovieScreenings } from 'src/app/user/features/home/movie/movie.interface';
import {MatDialog} from '@angular/material/dialog';
import { MovieScoreDialogComponent } from '../movie-score-dialog/movie-score-dialog.component';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnInit {
  private authStateService = inject(AuthStateService);
  private userStateService = inject(UserStateService);

  @Input() movie!: DailyMovieScreenings;

  constructor(public dialog: MatDialog) {}

  protected role: string = '';
  private score: number = 0;

  openDialog(movieId: number): void {
    console.log('movie id:',movieId)
    const dialogRef = this.dialog.open(MovieScoreDialogComponent, {
      data: {score: this.score},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('movie score:',result)
    });
  }


  ngOnInit(): void {
    this.authStateService.auth$.subscribe((authState) => {
      this.role = authState.role;
    });
  }
}
