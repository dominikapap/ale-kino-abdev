import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Room {
  id?: number;
  name: string;
  rows: number;
  seats: number;
}

export interface Seat {
  row: string;
  seatNumber: number;
  isReserved?: boolean;
  isSelected?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoomsApiService {
  private http = inject(HttpClient);

  addRoom(room: Room) {
    return this.http.post<Room>(`/rooms`, {
      name: room.name,
      seats: room.seats,
      rows: room.rows,
    });
  }

  getAllRooms() {
    return this.http.get<Room[]>(`/rooms`);
  }

  getRoomDetails(roomId: number) {
    return this.http.get<Room>(`/rooms/${roomId}`);
  }

  checkIfNameTaken(roomName: string) {
    return this.http.get<Room[]>(`/rooms?name=${roomName}`);
  }
}
