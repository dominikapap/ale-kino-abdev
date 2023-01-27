import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Movie } from '../features/home/movie/movie.interface';

export type Screening = {
  id: number;
  date: string;
  time: string;
  roomInfo: Room;
  movieInfo: Movie;
};

export interface Seat {
  row: string;
  seatNumber: number;
  isReserved?: boolean;
  isSelected?: boolean;
}

export interface Room {
  id: number;
  rows: number;
  seats: number;
}
export interface ScreeningRoom {
  id: number;
  reservedSeats: Seat[];
  room: Room;
}

export type SeatState = {
  selectedSeats: Seat[];
  reservedSeats: Seat[];
};

export type Ticket = {
  id: number;
  type: string;
  price: number;
};

const defaultSeatState: SeatState = {
  selectedSeats: [],
  reservedSeats: [],
};

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  private http = inject(HttpClient);

  private seatOccupancyState$$ = new BehaviorSubject<SeatState>(
    defaultSeatState
  );
  private MAX_NUMBER_OF_RESERVED_SEATS: number = 10;

  get seatOccupancyState$() {
    return this.seatOccupancyState$$.asObservable();
  }

  get seatOccupancyStateValue() {
    return this.seatOccupancyState$$.value;
  }

  private patchState(stateSlice: Partial<SeatState>) {
    this.seatOccupancyState$$.next({
      ...this.seatOccupancyStateValue,
      ...stateSlice,
    });
  }

  /* Seat selection state functions */
  selectSeat(seat: Seat) {
    seat.isSelected = true;
    const newSelectedSeats = [
      ...this.seatOccupancyStateValue.selectedSeats,
      seat,
    ];
    this.patchState({ selectedSeats: newSelectedSeats });
  }

  deselectSeat(seat: { row: string; seatNumber: number }) {
    const newSelectedSeats = this.seatOccupancyStateValue.selectedSeats.filter(
      (selectedSeat) => {
        return !(
          seat.row === selectedSeat.row &&
          seat.seatNumber === selectedSeat.seatNumber
        );
      }
    );
    this.patchState({ selectedSeats: newSelectedSeats });
  }

  isSeatSelected(seat: Seat) {
    return this.seatOccupancyStateValue.selectedSeats.some((selectedSeat) => {
      return (
        seat.row === selectedSeat.row &&
        seat.seatNumber === selectedSeat.seatNumber
      );
    });
  }

  toggleSelectedSeat(seat: Seat) {
    if (
      !this.isSeatSelected(seat) &&
      this.seatOccupancyStateValue.selectedSeats.length <
        this.MAX_NUMBER_OF_RESERVED_SEATS
    ) {
      this.selectSeat(seat);
    } else {
      this.deselectSeat(seat);
    }
  }

  /* Seat reservation state functions */
  reserveSeat(seat: Seat) {
    seat.isReserved = true;
    const newReservedSeats = [
      ...this.seatOccupancyStateValue.reservedSeats,
      seat,
    ];
    this.patchState({ reservedSeats: newReservedSeats });
  }

  reserveSeats(seats: Seat[]) {
    seats.forEach((seat) => {
      this.reserveSeat(seat);
    });
  }

  isSeatReserved(seat: Seat) {
    return this.seatOccupancyStateValue.reservedSeats.some((reservedSeat) => {
      return (
        seat.row === reservedSeat.row &&
        seat.seatNumber === reservedSeat.seatNumber
      );
    });
  }

  getScreeningDetails(screeningId: string) {
    return this.http.get<any>(
      `http://localhost:3000/screenings?_expand=rooms&_expand=movies&id=${screeningId}`
    );
  }

}
