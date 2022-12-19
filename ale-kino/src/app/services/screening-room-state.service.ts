import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Seat {
  row: string;
  seatNumber: number;
  isReserved?: boolean;
  isSelected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  constructor(private http: HttpClient) {}

  private seatSelectionState$$ = new BehaviorSubject<Seat[]>([]);

  get seatSelectionState$() {
    return this.seatSelectionState$$.asObservable();
  }

  selectSeat(seat: Seat) {
    seat.isSelected = true;
    this.seatSelectionState$$.next([
      ...this.seatSelectionState$$.value,
      seat
    ]);
  }

  deselectSeat(seat: {row: string, seatNumber: number}) {
    this.seatSelectionState$$.next(
      this.seatSelectionState$$.value.filter((selectedSeat) => {
        return !(seat.row === selectedSeat.row && seat.seatNumber === selectedSeat.seatNumber);
      })
    );
  }

  isSeatSelected(seat: Seat) {
    return this.seatSelectionState$$.value.some((selectedSeat) => {
      return seat.row === selectedSeat.row && seat.seatNumber === selectedSeat.seatNumber;
    });
  }

  toggleSelectedSeat(seat: Seat){
    if(!this.isSeatSelected(seat)){
      this.selectSeat(seat)
    }else {
      this.deselectSeat(seat)
    }
  }

  getRoomDetails(roomId: string) {
    return this.http.get<any>(`http://localhost:3000/rooms/${roomId}`);
  }
}
