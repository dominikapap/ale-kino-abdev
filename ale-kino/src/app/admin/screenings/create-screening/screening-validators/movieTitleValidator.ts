import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, of } from 'rxjs';
import { MoviesApiService } from '../../../movies';

export function movieTitleValidator(): AsyncValidatorFn {
  const moviesApiService = inject(MoviesApiService);
  return (control: AbstractControl) => {
    if (control.value.title) {
      return moviesApiService.getMovieByTitle(control.value.title).pipe(
        map((movies) => {
          return movies.length > 0 ? null : { noMatch: true };
        })
      );
    } else {
      return of({ notFromList: true });
    }
  };
}
