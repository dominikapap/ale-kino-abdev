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

  private selectedSeatMap$$ = new BehaviorSubject<Map<string, Seat>>(new Map());

  get selectedSeatMap$() {
    return this.selectedSeatMap$$.asObservable();
  }

  /**********TEST********* */
  private seatSelectionState$$ = new BehaviorSubject<Seat[]>([]);

  get selectionSeatState$() {
    return this.seatSelectionState$$.asObservable();
  }

  selectSeat(row: string, seatNumber: number) {
    console.log(row, seatNumber);
    this.seatSelectionState$$.next([
      ...this.seatSelectionState$$.value,
      {
        row,
        seatNumber,
        isSelected: true,
      },
    ]);
  }

  deselectSeat(row: string, seatNumber: number) {
    this.seatSelectionState$$.next(
      this.seatSelectionState$$.value.filter((seat) => {
        return row !== seat.row && seatNumber !== seat.seatNumber;
      })
    );
  }

  isSelectedSeat(row: string, seatNumber: number) {
    return this.seatSelectionState$$.value.some((seat) => {
      return row === seat.row && seatNumber === seat.seatNumber;
    });
  }

  // addSeat(row: string, seatNumber: number){
  //   const mapKey = `${row}${seatNumber}`;
  //   this.selectedSeatMap$$.next()
  // }

  // modifySelectedSeat(
  //   row: string,
  //   seatNumber: number,
  //   maxNumberOfReservedSeats: number
  // ) {
  //   this.selectedSeatMap$.subscribe((selectedSeatMap) => {
  //     const mapKey = `${row}${seatNumber}`;
  //     if (selectedSeatMap.has(mapKey)) {
  //       selectedSeatMap.delete(mapKey);
  //     } else if (selectedSeatMap.size < maxNumberOfReservedSeats) {
  //       selectedSeatMap.set(mapKey, {
  //         row,
  //         seatNumber,
  //         isReserved: true,
  //       });
  //     }

  //     this.selectedSeatMap$$.next(selectedSeatMap);
  //   });
  // }

  getRoomDetails(roomId: string) {
    return this.http.get<any>(`http://localhost:3000/rooms/${roomId}`);
  }
}
