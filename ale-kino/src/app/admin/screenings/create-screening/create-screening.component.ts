import { AutocompleteService } from './autocomplete.service';
import { Room } from '../../../services';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormControl,
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
import {
  timeslotValidator,
  movieTitleValidator,
  selectedRoomValidator,
  dateValidator,
  timeValidator,
} from './screening-validators';

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
  private readonly MIN_LENGTH = 1;
  private readonly NO_STARTING_WHITESPACE = /^(?!\s)/;
  private readonly IS_TIME_FORMAT = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  screeningForm = this.createForm();
  filteredMovieOptions!: Observable<Movie[]>;
  filteredRoomOptions!: Observable<Room[]>;
  canPickScreeningTime = false;

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  private createForm() {
    const form = this.builder.group(
      {
        movieInfo: this.builder.group({
          movie: this.builder.control<string | Movie>('', {
            validators: [
              Validators.required,
              Validators.minLength(this.MIN_LENGTH),
              Validators.pattern(this.NO_STARTING_WHITESPACE),
            ],
            asyncValidators: [movieTitleValidator()],
          }),
        }),
        roomInfo: this.builder.group({
          room: this.builder.control<string | Room>('', {
            validators: [
              Validators.required,
              Validators.minLength(this.MIN_LENGTH),
              Validators.pattern(this.NO_STARTING_WHITESPACE),
              selectedRoomValidator(),
            ],
          }),
        }),
        dateInfo: this.builder.group({
          date: this.builder.control('', {
            validators: [Validators.required, dateValidator()],
          }),
          time: this.builder.control(
            { value: '', disabled: true },
            {
              validators: [
                Validators.required,
                Validators.pattern(this.IS_TIME_FORMAT),
                timeValidator('date'),
              ],
            }
          ),
        }),
      },
      {
        asyncValidators: [timeslotValidator()],
      }
    );

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
      roomsId: this.roomValue.id!,
      moviesId: <number>this.movieValue.id,
    };
  }

  private handleDateChange() {
    const sub = this.dateTimeCtrl.valueChanges
      .pipe(
        switchMap((dateValue) => {
          return this.screeningsService.getDailyRoomScreeningDetails(
            this.roomValue.id!,
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

  get dateValue(): string {
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

  getMovieErrorMessage() {
    if (this.movieCtrl.hasError('required')) {
      return 'To pole jest obowiązkowe';
    }
    if (this.movieCtrl.hasError('pattern')) {
      return `Podana nazwa jest niepoprawna`;
    }
    if (this.movieCtrl.hasError('noMatch')) {
      return 'Podany tytuł filmu nie istnieje';
    }
    if (this.movieCtrl.hasError('notFromList')) {
      return 'Proszę wybrać tytuł z listy filmów';
    }
    return '';
  }

  getRoomErrorMessage() {
    if (this.roomCtrl.hasError('required')) {
      return 'To pole jest obowiązkowe';
    }
    if (this.roomCtrl.hasError('pattern')) {
      return `Podana nazwa jest niepoprawna`;
    }
    if (this.roomCtrl.hasError('notFromList')) {
      return 'Proszę wybrać salę z listy sal';
    }
    return '';
  }

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'To pole jest obowiązkowe';
    }
    if (control.hasError('pattern')) {
      return `Podana nazwa jest niepoprawna`;
    }
    return '';
  }

  getDateErrorMessage() {
    if (this.dateTimeCtrl.hasError('required')) {
      return 'To pole jest obowiązkowe';
    }
    if (this.dateTimeCtrl.hasError('pattern')) {
      return `Podana data jest niepoprawna`;
    }
    if (this.dateTimeCtrl.hasError('pastDate')) {
      return `Nie można wybrać daty, która już minęła`;
    }
    return '';
  }

  getTimeErrorMessage() {
    if (this.timeCtrl.hasError('required')) {
      return 'To pole jest obowiązkowe';
    }
    if (this.timeCtrl.hasError('pattern')) {
      return `Podany czas jest niepoprawny`;
    }
    if (this.timeCtrl.hasError('pastTime')) {
      return `Nie można wybrać czasu, który już minął`;
    }
    return '';
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
