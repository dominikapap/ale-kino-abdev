import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  score: number;
}

@Component({
  selector: 'app-movie-score-dialog',
  templateUrl: './movie-score-dialog.component.html',
  styleUrls: ['./movie-score-dialog.component.scss'],
})
export class MovieScoreDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MovieScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  private rating: number = 5;
  private starCount: number = 10;
  protected ratingArr: number[] = [];

  onClick(rating: number) {
    this.rating = rating;
    this.data.score = rating;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    this.data.score = this.rating;
  }
}
