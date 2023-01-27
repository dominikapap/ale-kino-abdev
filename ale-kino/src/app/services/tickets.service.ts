import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ticket } from './screening.state.service';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private http = inject(HttpClient);
  getTicketTypes() {
    return this.http.get<Ticket[]>(`http://localhost:3000/ticket-types`);
  }
}
