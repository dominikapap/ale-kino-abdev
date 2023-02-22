import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieScoreDialogComponent } from './movie-score-dialog.component';

describe('MovieScoreDialogComponent', () => {
  let component: MovieScoreDialogComponent;
  let fixture: ComponentFixture<MovieScoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieScoreDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieScoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
