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

interface Premiere {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddMovieComponent {
  private builder = inject(NonNullableFormBuilder);
  private movieService = inject(MoviesApiService);
  private store = inject(Store);
  protected ratings$ = this.movieService.getAllRatings();
  protected tags$ = this.movieService.getAllTags();
  subscriptions = new Subscription();

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  private readonly MIN_LENGTH = 1;
  private readonly MAX_TITLE_LENGTH = 100;
  protected readonly MAX_DESCRIPTION_LENGTH = 3000;
  private readonly MAX_IMAGE_URL_LENGTH = 300;
  protected readonly MIN_MOVIE_LENGTH = 1;
  protected readonly MAX_MOVIE_LENGTH = 6000;
  private readonly NO_STARTING_WHITESPACE = /^(?!\s)/;
  private readonly NO_STARTING_ZERO_NUMBER = /^(?!0)/;

  screeningForm = this.createForm();
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
          Validators.maxLength(this.MAX_TITLE_LENGTH),
          Validators.minLength(this.MIN_LENGTH),
          Validators.pattern(this.NO_STARTING_WHITESPACE),
        ],
      }),
      description: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.maxLength(this.MAX_DESCRIPTION_LENGTH),
          Validators.minLength(this.MIN_LENGTH),
          Validators.pattern(this.NO_STARTING_WHITESPACE),
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
          Validators.maxLength(this.MAX_MOVIE_LENGTH),
          Validators.minLength(this.MIN_MOVIE_LENGTH),
          Validators.pattern(this.NO_STARTING_ZERO_NUMBER),
        ],
      }),
      premiere: this.builder.control('', {
        validators: [Validators.required],
      }),
      image: this.builder.control('', {
        validators: [
          Validators.required,
          Validators.minLength(this.MIN_LENGTH),
          Validators.maxLength(this.MAX_IMAGE_URL_LENGTH),
          Validators.pattern(this.NO_STARTING_WHITESPACE),
        ],
      }),
    });

    return form;
  }

  sendForm() {
    this.screeningForm.markAllAsTouched();
    if (this.screeningForm.invalid) {
      return;
    }
    if (this.screeningForm.valid) {
      const { premiere, ...movieData } = this.screeningForm.getRawValue();
      const movie: Movie = {
        ...movieData,
        premiere: premiere === 'true',
      };
      this.store.dispatch(MoviesActions.addNewMovie(movie));
      this.formGroupDirective.resetForm();
    }
  }

  get titleCtrl() {
    return this.screeningForm.controls.title;
  }
  get descriptionCtrl() {
    return this.screeningForm.controls.description;
  }
  get tagsCtrl() {
    return this.screeningForm.controls.tags;
  }
  get ratedCtrl() {
    return this.screeningForm.controls.rated;
  }
  get lengthCtrl() {
    return this.screeningForm.controls.length;
  }
  get premiereCtrl() {
    return this.screeningForm.controls.premiere;
  }
  get imageCtrl() {
    return this.screeningForm.controls.image;
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
