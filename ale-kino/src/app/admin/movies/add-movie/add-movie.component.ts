import { Subscription } from 'rxjs';
import { Component, inject, ViewChild } from '@angular/core';
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
})
export default class AddMovieComponent {
  private builder = inject(NonNullableFormBuilder);
  private movieService = inject(MoviesApiService);
  private store = inject(Store);
  protected ratings$ = this.movieService.getAllRatings();
  protected tags$ = this.movieService.getAllTags();
  subscriptions = new Subscription();

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  screeningForm = this.createForm();
  protected MIN_MOVIE_LENGTH = 0;
  protected MAX_MOVIE_LENGTH = 6000;
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
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      description: this.builder.control('', {
        validators: [Validators.required, Validators.maxLength(3000)],
      }),
      tags: this.builder.control<string[]>([], {
        validators: [Validators.required],
      }),
      rated: this.builder.control('', {
        validators: [Validators.required],
      }),
      length: this.builder.control('', {
        validators: [Validators.required],
      }),
      premiere: this.builder.control('', {
        validators: [Validators.required],
      }),
      image: this.builder.control('', {
        validators: [Validators.required],
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
      const {premiere, ...movieData} = this.screeningForm.getRawValue()
      const movie: Movie = {
        ...movieData,
        premiere: premiere === 'true'
      }
      this.store.dispatch(
        MoviesActions.addNewMovie(movie)
      );
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

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
