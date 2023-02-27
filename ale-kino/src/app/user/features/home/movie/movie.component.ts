import { Subscription, switchMap, of } from 'rxjs';
import { UserStateService } from 'src/app/core/user.state.service';
import { AuthStateService } from 'src/app/auth/auth.state.service';
import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MovieScoreDialogComponent } from '../movie-score-dialog/movie-score-dialog.component';
import { Screening } from 'src/app/services';
import { Movie } from 'src/app/admin/movies';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
  protected authStateService = inject(AuthStateService);
  protected userStateService = inject(UserStateService);
  private subscriptions = new Subscription();

  @Input() movie!: Movie;
  @Input() screenings: Screening[] = [];

  constructor(public dialog: MatDialog) {}

  private score: number = 0;
  private movieId: number = -1;
  protected ratedMovieList: number[] = [];
  protected textShort = true;

  openDialog(movieId: number): void {
    this.movieId = movieId;
    const dialogRef = this.dialog.open(MovieScoreDialogComponent, {
      data: { score: this.score },
    });

    const dialogSub = dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.userStateService.rateMovieByUser(this.movieId, result);
          }
          return of(result);
        })
      )
      .subscribe();
    this.subscriptions.add(dialogSub);
  }

  toggleWatchListMovie(movieId: number) {
    const sub = this.userStateService
      .toggleMovieOnUserList(movieId, 'movieWatchList')
      .subscribe();
    this.subscriptions.add(sub);
  }

  toggleTextLength() {
    this.textShort = !this.textShort;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
