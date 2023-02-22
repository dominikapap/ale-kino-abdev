import { AutocompleteService } from './autocomplete.service';
import {
  Screening,
  ScreeningsService,
} from './../../../services/screenings.service';
import { Movie } from './../../../services/movies.service';
import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, switchMap, Subscription } from 'rxjs';
import { MatStepperModule } from '@angular/material/stepper';
import { Room } from 'src/app/services/rooms.service';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@Component({
  selector: 'app-create-screening',
  templateUrl: './create-screening.component.html',
  styleUrls: ['./create-screening.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatStepperModule,
    CommonModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
  ],
})
export default class CreateScreeningComponent {
  private builder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private autocompleteService = inject(AutocompleteService);
  private screeningsService = inject(ScreeningsService);
  private subscriptions = new Subscription();
  screeningForm = this.createForm();
  filteredMovieOptions!: Observable<Movie[]>;
  filteredRoomOptions!: Observable<Room[]>;
  canPickScreeningTime = false;

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
        time: this.builder.control({value: '', disabled: true}, Validators.required),
      }),
    });

    return form;
  }

  sendForm() {
    this.screeningForm.markAllAsTouched();
    if (this.screeningForm.invalid) {
      console.log('invalid');
      return;
    }

    if (this.screeningForm.valid) {
      const screening: Screening = {
        date: this.screeningsService.convertDateFormat(
          new Date(this.dateValue)
        ),
        time: this.timeValue,
        roomsId: this.roomValue.id,
        moviesId: this.movieValue.id,
      };
      this.screeningsService.addScreening(screening).subscribe((response) => {
        console.log('Added:', response);
      });

      console.log(this.screeningForm.value);
      // this.router.navigate(['/summary']);
    }
  }

  private handleDateChange() {
    this.dateTimeCtrl.valueChanges
      .pipe(
        switchMap((dateValue) => {
          return this.screeningsService.getDailyRoomScreeningDetails(
            this.roomValue.id,
            new Date(dateValue)
          );
        })
      )
      .subscribe((dailyRoomScreenings) => {
        console.log('daily screenings', dailyRoomScreenings);
        this.timeCtrl.enable();
        this.canPickScreeningTime = true;
      });
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
