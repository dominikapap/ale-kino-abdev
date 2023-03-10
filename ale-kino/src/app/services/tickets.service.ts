import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { Seat } from './rooms-api.service';

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

  addTicketToOrder(orderId: string, seat: Seat) {
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
          return this.getTicketWithTypeData(updatedTicket);
        })
      );
  }

  getTicketWithTypeData(ticket: Ticket) {
    return this.getTicketTypeInfoById(ticket.ticketTypesId).pipe(
      map((ticketTypeData) => {
        return (ticket = {
          ...ticket,
          ticketTypes: ticketTypeData,
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

  getAllOrderTickets(orderId: string) {
    return this.http.get<Ticket[]>(`/tickets?ordersId=${orderId}`);
  }

  getAllOrderTicketsWithFullInfo(orderId: string) {
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
    return this.getTicketTypes().pipe(
      map((ticketTypes) => {
        return ticketTypes.find((ticketType) => ticketType.id === ticketTypeId);
      })
    );
  }
}
