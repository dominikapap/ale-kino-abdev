import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  constructor(private http: HttpClient) {}

  private seatSelectionState$$ = new BehaviorSubject<Seat[]>([]);
  private seatReservationState$$ = new BehaviorSubject<Seat[]>([]);
  private maxNumberOfReservedSeats: number = 10;

  /* Seat selection state functions */
  get seatSelectionState$() {
    return this.seatSelectionState$$.asObservable();
  }

  selectSeat(seat: Seat) {
    seat.isSelected = true;
    this.seatSelectionState$$.next([...this.seatSelectionState$$.value, seat]);
  }

  deselectSeat(seat: { row: string; seatNumber: number }) {
    this.seatSelectionState$$.next(
      this.seatSelectionState$$.value.filter((selectedSeat) => {
        return !(
          seat.row === selectedSeat.row &&
          seat.seatNumber === selectedSeat.seatNumber
        );
      })
    );
  }

  isSeatSelected(seat: Seat) {
    return this.seatSelectionState$$.value.some((selectedSeat) => {
      return (
        seat.row === selectedSeat.row &&
        seat.seatNumber === selectedSeat.seatNumber
      );
    });
  }

  toggleSelectedSeat(seat: Seat) {
    if (
      !this.isSeatSelected(seat) &&
      this.seatSelectionState$$.value.length < this.maxNumberOfReservedSeats
    ) {
      this.selectSeat(seat);
    } else {
      this.deselectSeat(seat);
    }
  }
  /* Seat reservation state functions */
  get seatReservationState$() {
    return this.seatReservationState$$.asObservable();
  }

  reserveSeat(seat: Seat) {
    seat.isReserved = true;
    this.seatReservationState$$.next([...this.seatReservationState$$.value, seat]);
  }

  reserveSeats(seats: Seat[]) {
    seats.forEach(seat => {
      this.reserveSeat(seat)
    })
  }

  isSeatReserved(seat: Seat) {
    return this.seatReservationState$$.value.some((reservedSeat) => {
      return (
        seat.row === reservedSeat.row &&
        seat.seatNumber === reservedSeat.seatNumber
      );
    });
  }

  getScreeningRoomDetails(screeningRoomId: string) {
    return this.http
      .get<any>(
        `http://localhost:3000/screeningRooms?_expand=rooms&id=${screeningRoomId}`
      )
      .pipe(
        map((screeningRoomDetailsArray) => {
          return this.convertScreeningRoomJSONStructure(
            screeningRoomDetailsArray
          );
        })
      );
  }

  getRoomDetails(roomId: string) {
    return this.http.get<any>(`http://localhost:3000/rooms/${roomId}`);
  }

  private convertScreeningRoomJSONStructure(
    screeningRoomDetailsArray: {
      id: number;
      reservedSeats: Seat[];
      rooms: Room;
    }[]
  ) {
    const scDetails: ScreeningRoom = {
      id: screeningRoomDetailsArray[0].id,
      reservedSeats: screeningRoomDetailsArray[0].reservedSeats,
      room: screeningRoomDetailsArray[0].rooms,
    };
    return scDetails;
  }
}
