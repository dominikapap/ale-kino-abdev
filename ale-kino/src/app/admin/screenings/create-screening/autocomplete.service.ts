import { inject, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { Movie, MoviesService } from 'src/app/services/movies.service';
import { Room, RoomsService } from 'src/app/services/rooms.service';

export type AutocompleteOptionsState = {
  movieOptions: Movie[];
  roomOptions: Room[];
  filteredMovieOptions: Observable<Movie[]>;
  filteredRoomOptions: Observable<Room[]>;
};

const defaultOptionsState: AutocompleteOptionsState = {
  movieOptions: [],
  roomOptions: [],
  filteredMovieOptions: new Observable<Movie[]>(),
  filteredRoomOptions:  new Observable<Room[]>()
};

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private moviesService = inject(MoviesService);
  private roomsService = inject(RoomsService);
  constructor() {}

  private autocompleteOptionsStateState$$ =
    new BehaviorSubject<AutocompleteOptionsState>(defaultOptionsState);

  get autocompleteOptionsStateState$() {
    return this.autocompleteOptionsStateState$$.asObservable();
  }

  private get autocompleteOptionsStateStateValue() {
    return this.autocompleteOptionsStateState$$.value;
  }

  private patchState(stateSlice: Partial<AutocompleteOptionsState>) {
    this.autocompleteOptionsStateState$$.next({
      ...this.autocompleteOptionsStateStateValue,
      ...stateSlice,
    });
  }

  private _filterMovies(title: string): Movie[] {
    const filterValue = title.toLowerCase();

    return this.autocompleteOptionsStateStateValue.movieOptions.filter(
      (option) => option.title.toLowerCase().includes(filterValue)
    );
  }

  private _filterRooms(name: string): Room[] {
    const filterValue = name.toLowerCase();

    return this.autocompleteOptionsStateStateValue.roomOptions.filter(
      (option) => option.name.toLowerCase().includes(filterValue)
    );
  }

  onChangeFilterMovieOptions(movieControl: FormControl) {
    const filteredMovieOptions = movieControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const title = typeof value === 'string' ? value : value?.title;
        return title
          ? this._filterMovies(title as string)
          : this.autocompleteOptionsStateStateValue.movieOptions.slice();
      })
    );
    this.patchState({ filteredMovieOptions });
  }

  onChangeFilterRoomOptions(roomControl: FormControl) {
    const filteredRoomOptions =  roomControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filterRooms(name as string)
          : this.autocompleteOptionsStateStateValue.roomOptions.slice();
      })
    );
    this.patchState({ filteredRoomOptions });
  }

  initializeAutocompleteMovieOptions(movieControl: FormControl) {
    return this.moviesService.getAllMovies().subscribe((movies) => {
      this.autocompleteOptionsStateStateValue.movieOptions = movies;
      return this.onChangeFilterMovieOptions(movieControl);
    });
  }

  initializeAutocompleteRoomOptions(roomControl: FormControl) {
    return this.roomsService.getAllRooms().subscribe((rooms) => {
      this.autocompleteOptionsStateStateValue.roomOptions = rooms;
      return this.onChangeFilterRoomOptions(roomControl);
    });
  }

}
