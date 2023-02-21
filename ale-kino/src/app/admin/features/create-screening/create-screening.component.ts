import {
  Screening,
  ScreeningsService,
} from './../../../services/screenings.service';
import { Movie, MoviesService } from './../../../services/movies.service';
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
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { MatStepperModule } from '@angular/material/stepper';
import { Room, RoomsService } from 'src/app/services/rooms.service';

export interface User {
  name: string;
}

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
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatStepperModule,
    CommonModule,
  ],
})
export default class CreateScreeningComponent {
  private builder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private moviesService = inject(MoviesService);
  private roomsService = inject(RoomsService);
  private screenings = inject(ScreeningsService);
  screeningForm = this.createForm();
  isError: boolean = false;

  private movieOptions: Movie[] = [];
  filteredMovieOptions!: Observable<Movie[]>;

  private roomOptions: Room[] = [];
  filteredRoomOptions!: Observable<Room[]>;

  private createForm() {
    const form = this.builder.group({
      movieInfo: this.builder.group({
        movie: this.builder.control<string | Movie>('', Validators.required),
      }),
      roomInfo: this.builder.group({
        room: this.builder.control<string | Room>('', Validators.required),
      }),
      dateInfo: this.builder.group({
        date: this.builder.control(''),
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
        date: this.dateValue,
        time: this.dateValue,
        roomsId: this.roomValue.id,
        moviesId: this.movieValue.id,
      };
      this.screenings.addScreening(screening).subscribe((response) => {
        // console.log('Added:', response);
      });

      // console.log(this.screeningForm.value);
      // this.router.navigate(['/summary']);
    }
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

  displayMovieFn(movie: Movie): string {
    return movie && movie.title ? movie.title : '';
  }
  displayRoomFn(room: Room): string {
    return room && room.name ? room.name : '';
  }

  private _filterMovies(title: string): Movie[] {
    const filterValue = title.toLowerCase();

    return this.movieOptions.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  private _filterRooms(name: string): Room[] {
    const filterValue = name.toLowerCase();

    return this.roomOptions.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private onChangeFilterMovieOptions() {
    this.filteredMovieOptions = this.movieCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const title = typeof value === 'string' ? value : value?.title;
        return title
          ? this._filterMovies(title as string)
          : this.movieOptions.slice();
      })
    );
  }

  private onChangeFilterRoomOptions() {
    this.filteredRoomOptions = this.roomCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filterRooms(name as string)
          : this.roomOptions.slice();
      })
    );
  }

  ngOnInit() {
    this.moviesService.getAllMovies().subscribe((movies) => {
      this.movieOptions = movies;
      this.onChangeFilterMovieOptions();
    });

    this.roomsService.getAllRooms().subscribe((rooms) => {
      this.roomOptions = rooms;
      this.onChangeFilterRoomOptions();
    });
  }
}
