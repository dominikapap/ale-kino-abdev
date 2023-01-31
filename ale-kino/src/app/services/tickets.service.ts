import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Seat } from './screening.state.service';

export type Ticket = {
  id: number;
  orderId: number;
  ticketTypeId: number;
  seat: Seat,
}

export type TicketType = {
  id: number;
  type: string;
  price: number;
};

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private http = inject(HttpClient);

  addTicketToOrder() {}

  removeTicketFromOrder() {}

  getAllOrderTickets(orderId: number) {
    return this.http.get<Ticket[]>(`http://localhost:3000/tickets?ordersId=${orderId}`);
  }
  getTicketTypes() {
    return this.http.get<TicketType[]>(`http://localhost:3000/ticket-types`);
  }
}
