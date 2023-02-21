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
  screeningForm = this.createForm();
  isError: boolean = false;

  movieOptions: Movie[] = [];
  filteredMovieOptions!: Observable<Movie[]>;

  roomOptions: Room[] = [];
  filteredRoomOptions!: Observable<Room[]>;

  private createForm() {
    const form = this.builder.group({
      movieInfo: this.builder.group({
        movieTitle: this.builder.control<string | Movie>(
          '',
          Validators.required
        ),
      }),
      roomInfo: this.builder.group({
        roomName: this.builder.control<string | Room>('', Validators.required),
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

    console.log(this.screeningForm.value);
    if (this.screeningForm.valid) {
      // this.router.navigate(['/summary']);
    }
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
    return this.movieInformationForm['controls'].movieTitle;
  }
  get roomCtrl() {
    return this.roomInformationForm['controls'].roomName;
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
