import { Subscription } from 'rxjs';
import { Movie } from 'src/app/services/movies.service';
import { Component, inject, ViewChild } from '@angular/core';
import {
  NonNullableFormBuilder,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { MoviesService } from 'src/app/services';

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
  private movieService = inject(MoviesService);
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
    const { title, tags, length, rated, description, image, premiere } =
      this.screeningForm.value;
    // handle...
    if (this.screeningForm.valid) {
      const movie: Movie = {
        title: title!,
        tags: tags!,
        length: length!,
        rated: rated!,
        description: description!,
        image: image!,
        premiere: premiere! === 'true',
      };
      const sub = this.movieService.addMovie(movie).subscribe((response) => {
      this.formGroupDirective.resetForm();
      });
      this.subscriptions.add(sub);
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
