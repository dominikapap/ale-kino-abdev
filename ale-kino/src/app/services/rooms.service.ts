import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private http = inject(HttpClient);

  getRoomDetails(roomId: number) {
    return this.http.get<any>(`/rooms/${roomId}`);
  }
}
