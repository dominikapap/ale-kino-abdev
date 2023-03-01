import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackBar = inject(MatSnackBar);
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  openSnackBar(
    message: string,
    duration: number | undefined,
    panelClass = ['red-snackbar'],
    action = 'Zamknij',
    horizontalPosition = this.horizontalPosition,
    verticalPosition = this.verticalPosition
  ) {
    let config = new MatSnackBarConfig();
    config.duration = duration ? duration : 3000;
    config.panelClass = panelClass ? panelClass : ['snackbar-success'];
    config.horizontalPosition = horizontalPosition;
    config.verticalPosition = verticalPosition;

    this.snackBar.open(message, action, config);
  }
}
