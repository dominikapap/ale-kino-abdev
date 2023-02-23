import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { Seat } from './rooms.service';

export type Ticket = {
  id: number;
  ordersId: number;
  ticketTypesId: number;
  seat: Seat;
  ticketTypes?: TicketType;
};

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
    return this.http.post<Ticket>('/tickets', {
      ordersId: orderId,
      seat: seat,
      ticketTypesId: 1,
    });
  }

  removeTicketFromOrder(ticketId: number) {
    return this.http.delete(`/tickets/${ticketId}`);
  }

  updateTicket(ticketId: number, ticketSlice: Partial<Ticket>) {
    return this.http
      .patch<Ticket>(`/tickets/${ticketId}`, { ...ticketSlice })
      .pipe(
        switchMap((updatedTicket) => {
          const ticketTypes$ = this.getTicketTypeInfoById(
            updatedTicket.ticketTypesId
          );
          return combineLatest([of(updatedTicket), ticketTypes$]);
        }),
        map(([updatedTicket, ticketTypes]) => {
          return (updatedTicket = {
            ...updatedTicket,
            ticketTypes: ticketTypes,
          });
        })
      );
  }

  getTicketPriceByTypeId(ticketTypeId: number) {
    return this.getTicketTypeById(ticketTypeId).pipe(
      map(([ticketType]) => {
        return ticketType.price;
      })
    );
  }

  getAllOrderTickets(orderId: number) {
    return this.http.get<Ticket[]>(`/tickets?ordersId=${orderId}`);
  }

  getAllOrderTicketsWithFullInfo(orderId: number) {
    return this.http.get<Ticket[]>(
      `/tickets?_expand=ticketTypes&ordersId=${orderId}`
    );
  }

  getTicketTypeById(ticketTypeId: number) {
    return this.http.get<TicketType[]>(`/ticketTypes?id=${ticketTypeId}`);
  }

  getTicketTypes() {
    return this.http.get<TicketType[]>(`/ticketTypes`);
  }

  getTicketTypeInfo(ticketTypeId: number) {
    return this.http.get<TicketType>(`/ticketTypes?id=${ticketTypeId}`);
  }

  getTicketTypeInfoById<TicketType>(ticketTypeId: number) {
    console.log('ticket type id:', ticketTypeId);
    return this.getTicketTypes().pipe(
      map((ticketTypes) => {
        return ticketTypes.find((ticketType) => ticketType.id === ticketTypeId);
      })
    );
  }
}
