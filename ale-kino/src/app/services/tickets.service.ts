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

  addTicketToOrder(orderId: number, seat: Seat) {
    return this.http.post<Ticket>('/tickets', { ordersId: orderId, seat: seat, ticketTypesId: 1 })
  }

  removeTicketFromOrder(ticketId: number) {
    return this.http.delete(`/tickets/${ticketId}`);
  }

  getAllOrderTickets(orderId: number) {
    return this.http.get<Ticket[]>(`/tickets?ordersId=${orderId}`);
  }
  getTicketTypes() {
    return this.http.get<TicketType[]>(`/ticketTypes`);
  }
}
