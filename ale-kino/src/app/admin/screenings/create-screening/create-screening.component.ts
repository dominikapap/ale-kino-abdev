import { AutocompleteService } from './autocomplete.service';
import { Room } from '../../../services';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormGroupDirective,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Observable, switchMap, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { Movie } from '../../movies';
import { Screening, ScreeningsApiService } from '../screenings-api.service';
import { Store } from '@ngrx/store';
import { ScreeningsActions } from '../store';

@Component({
  selector: 'app-create-screening',
  templateUrl: './create-screening.component.html',
  styleUrls: ['./create-screening.component.scss'],
})
export default class CreateScreeningComponent {
  private builder = inject(NonNullableFormBuilder);
  private autocompleteService = inject(AutocompleteService);
  private screeningsService = inject(ScreeningsApiService);
  private store = inject(Store);
  private subscriptions = new Subscription();
  screeningForm = this.createForm();
  filteredMovieOptions!: Observable<Movie[]>;
  filteredRoomOptions!: Observable<Room[]>;
  canPickScreeningTime = false;

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  private createForm() {
    const form = this.builder.group({
      movieInfo: this.builder.group({
        movie: this.builder.control<string | Movie>('', Validators.required),
      }),
      roomInfo: this.builder.group({
        room: this.builder.control<string | Room>('', Validators.required),
      }),
      dateInfo: this.builder.group({
        date: this.builder.control('', Validators.required),
        time: this.builder.control(
          { value: '', disabled: true },
          Validators.required
        ),
      }),
    });

    return form;
  }

  sendForm(stepper: MatStepper) {
    this.screeningForm.markAllAsTouched();
    if (this.screeningForm.invalid) {
      return;
    }

    if (this.screeningForm.valid) {
      const screening: Screening = this.convertFormData();
      this.store.dispatch(ScreeningsActions.addNewScreening(screening));
      stepper.reset();
      this.formGroupDirective.resetForm();
    }
  }

  private convertFormData(): Screening {
    return {
      date: this.screeningsService.convertDateFormat(new Date(this.dateValue)),
      time: this.timeValue,
      roomsId: this.roomValue.id,
      moviesId: <number>this.movieValue.id,
    };
  }

  private handleDateChange() {
    const sub = this.dateTimeCtrl.valueChanges
      .pipe(
        switchMap((dateValue) => {
          return this.screeningsService.getDailyRoomScreeningDetails(
            this.roomValue.id,
            new Date(dateValue)
          );
        })
      )
      .subscribe(() => {
        this.timeCtrl.enable();
        this.canPickScreeningTime = true;
      });
    this.subscriptions.add(sub);
  }

  get movieValue() {
    return <Movie>this.screeningForm.value.movieInfo?.movie;
  }

  get roomValue() {
    return <Room>this.screeningForm.value.roomInfo?.room;
  }

  get dateValue() {
    return <string>this.screeningForm.value.dateInfo?.date;
  }

  get timeValue() {
    return <string>this.screeningForm.value.dateInfo?.time;
  }

  get movieInformationForm() {
    return this.screeningForm['controls'].movieInfo;
  }

  get roomInformationForm() {
    return this.screeningForm['controls'].roomInfo;
  }
  get dateInformationForm() {
    return this.screeningForm['controls'].dateInfo;
  }

  get movieCtrl() {
    return this.movieInformationForm['controls'].movie;
  }
  get roomCtrl() {
    return this.roomInformationForm['controls'].room;
  }
  get dateTimeCtrl() {
    return this.dateInformationForm['controls'].date;
  }
  get timeCtrl() {
    return this.dateInformationForm['controls'].time;
  }

  displayMovieFn(movie: Movie): string {
    return movie && movie.title ? movie.title : '';
  }
  displayRoomFn(room: Room): string {
    return room && room.name ? room.name : '';
  }

  ngOnInit() {
    const movieSub =
      this.autocompleteService.initializeAutocompleteMovieOptions(
        this.movieCtrl
      );
    const roomSub = this.autocompleteService.initializeAutocompleteRoomOptions(
      this.roomCtrl
    );
    const autoStateSub =
      this.autocompleteService.autocompleteOptionsStateState$.subscribe(
        (autoState) => {
          this.filteredMovieOptions = <Observable<Movie[]>>(
            autoState.filteredMovieOptions
          );
          this.filteredRoomOptions = <Observable<Room[]>>(
            autoState.filteredRoomOptions
          );
        }
      );
    this.subscriptions.add(movieSub);
    this.subscriptions.add(roomSub);
    this.subscriptions.add(autoStateSub);
    this.handleDateChange();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
