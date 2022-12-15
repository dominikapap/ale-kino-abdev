import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Seat {
  row: string;
  seatNumber: number;
  isReserved: true;
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
