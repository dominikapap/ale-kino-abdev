import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RoomsService } from './rooms.service';

export type RoomSetup = {
  rowLetters: string[];
  rowNumbers: number[];
};

const defaultRoomSetupData: RoomSetup = {
  rowLetters: [],
  rowNumbers: [],
};

@Injectable({
  providedIn: 'root',
})
export class ScreeningRoomsService {
  private roomService = inject(RoomsService);
  constructor() {}

  private roomSetupData$$ = new BehaviorSubject<RoomSetup>(
    defaultRoomSetupData
  );

  get roomSetupData$() {
    return this.roomSetupData$$.asObservable();
  }

  get roomSetupDataValue() {
    return this.roomSetupData$$.value;
  }

  private patchState(stateSlice: Partial<RoomSetup>) {
    this.roomSetupData$$.next({
      ...this.roomSetupDataValue,
      ...stateSlice,
    });
  }

  private generateRowLetters(rowsNumber: number) {
    //generate an array of letters
    const alpha = Array.from(Array(rowsNumber)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));
    return alphabet;
  }

  private generateSeatNumbers(seats: number) {
    return Array.from({ length: seats }, (_, i) => i + 1);
  }

  initiateRoomSetupData(screeningRoomId: number) {
    console.log(screeningRoomId)
    this.roomService
      .getRoomDetails(screeningRoomId)
      .subscribe((roomDetails) => {
        this.patchState({
          rowLetters: this.generateRowLetters(roomDetails.rows),
          rowNumbers: this.generateSeatNumbers(roomDetails.seats),
        });
      });
  }
}
