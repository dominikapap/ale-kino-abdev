import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  constructor(private http: HttpClient) {}

  getRoomDetails(roomId: string) {
    return this.http.get<any>(`http://localhost:3000/rooms/${roomId}`);
  }
}
