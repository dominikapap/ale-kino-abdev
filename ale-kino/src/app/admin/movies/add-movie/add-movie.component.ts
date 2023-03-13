import { Subscription } from 'rxjs';
import {
  Component,
  inject,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { Movie, MoviesApiService } from '..';
import { Store } from '@ngrx/store';
import { MoviesActions } from '../store';
import {
  MIN_LENGTH,
  NO_STARTING_WHITESPACE,
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGE_URL_LENGTH,
  MAX_MOVIE_LENGTH,
  NO_STARTING_ZERO_NUMBER,
  MAX_TITLE_LENGTH,
} from '../../shared/validators-constans';

interface Premiere {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddMovieComponent {
  private builder = inject(NonNullableFormBuilder);
  private movieService = inject(MoviesApiService);
  private store = inject(Store);
  protected ratings$ = this.movieService.getAllRatings();
  protected tags$ = this.movieService.getAllTags();
  readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;
  readonly MAX_MOVIE_LENGTH = MAX_MOVIE_LENGTH;
  readonly MIN_MOVIE_LENGTH = MIN_LENGTH;
  subscriptions = new Subscription();

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  movieForm = this.createForm();
  premiereOptions: Premiere[] = [
    { value: true, viewValue: 'Tak' },
    { value: false, viewValue: 'Nie' },
  ];

  onTagRemoved(tag: string) {
    const tags = this.tagsCtrl.value as string[];
    this.removeFirst(tags, tag);
    this.tagsCtrl.setValue(tags); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  private createForm() {
    const form = this.builder.group({
      title: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.maxLength(MAX_TITLE_LENGTH),
          Validators.minLength(MIN_LENGTH),
          Validators.pattern(NO_STARTING_WHITESPACE),
        ],
      }),
      description: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.maxLength(MAX_DESCRIPTION_LENGTH),
          Validators.minLength(MIN_LENGTH),
          Validators.pattern(NO_STARTING_WHITESPACE),
        ],
      }),
      tags: this.builder.control<string[]>([], {
        validators: [Validators.required],
      }),
      rated: this.builder.control('', {
        validators: [Validators.required],
      }),
      length: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.maxLength(MAX_MOVIE_LENGTH),
          Validators.minLength(MIN_LENGTH),
          Validators.pattern(NO_STARTING_ZERO_NUMBER),
        ],
      }),
      premiere: this.builder.control('', {
        validators: [Validators.required],
      }),
      image: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.minLength(MIN_LENGTH),
          Validators.maxLength(MAX_IMAGE_URL_LENGTH),
          Validators.pattern(NO_STARTING_WHITESPACE),
        ],
      }),
    });

    return form;
  }

  sendForm() {
    this.movieForm.markAllAsTouched();
    if (this.movieForm.invalid) {
      return;
    }
    if (this.movieForm.valid) {
      const { premiere, ...movieData } = this.movieForm.getRawValue();
      const movie: Movie = {
        ...movieData,
        premiere: premiere === 'true',
      };
      this.store.dispatch(MoviesActions.addNewMovie(movie));
      this.formGroupDirective.resetForm();
    }
  }

  get titleCtrl() {
    return this.movieForm.controls.title;
  }
  get descriptionCtrl() {
    return this.movieForm.controls.description;
  }
  get tagsCtrl() {
    return this.movieForm.controls.tags;
  }
  get ratedCtrl() {
    return this.movieForm.controls.rated;
  }
  get lengthCtrl() {
    return this.movieForm.controls.length;
  }
  get premiereCtrl() {
    return this.movieForm.controls.premiere;
  }
  get imageCtrl() {
    return this.movieForm.controls.image;
  }

  getLengthErrorMessage() {
    if (this.lengthCtrl.hasError('required')) {
      return 'Pole Czas Trwania jest wymagane';
    }
    if (this.lengthCtrl.hasError('min')) {
      return `Podana długość filmu jest za krótka`;
    }
    if (this.lengthCtrl.hasError('max')) {
      return 'Podana długość filmu jest za długa';
    }
    if (this.lengthCtrl.hasError('pattern')) {
      return 'Długość filmu nie może zaczynać się od 0';
    }
    return '';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
