import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Room {
  id: number;
  name: string;
  rows: number;
  seats: number;
}

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);

  getAllRooms(){
    return this.http.get<Room[]>(`/rooms`);
  }

  getRoomDetails(roomId: number) {
    return this.http.get<Room>(`/rooms/${roomId}`);
  }
}
