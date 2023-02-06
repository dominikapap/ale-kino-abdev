import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { UserStateService } from '../core/user.state.service';
import { OrdersService } from './orders.service';
import { Ticket, TicketsService } from './tickets.service';

export interface Seat {
  row: string;
  seatNumber: number;
  isReserved?: boolean;
  isSelected?: boolean;
}

export interface Room {
  id: number;
  rows: number;
  seats: number;
}

export type TicketState = {
  notCheckedOutOrderId?: number;
  selectedTickets: Ticket[];
  reservedTickets: Ticket[];
};

const defaultTicketState: TicketState = {
  notCheckedOutOrderId: -1,
  selectedTickets: [],
  reservedTickets: [],
};

@Injectable()
export class ScreeningService {
  private http = inject(HttpClient);
  private ordersService = inject(OrdersService);
  private ticketsService = inject(TicketsService);
  private userService = inject(UserStateService);

  private MAX_NUMBER_OF_RESERVED_SEATS: number = 10;
  private screeningTicketsState$$ = new BehaviorSubject<TicketState>(
    defaultTicketState
  );

  get screeningTicketsState$() {
    return this.screeningTicketsState$$.asObservable();
  }

  get screeningTicketsStateValue() {
    return this.screeningTicketsState$$.value;
  }

  private patchTicketsState(stateSlice: Partial<TicketState>) {
    this.screeningTicketsState$$.next({
      ...this.screeningTicketsStateValue,
      ...stateSlice,
    });
  }

  private resetScreeningTicketState() {
    this.patchTicketsState(defaultTicketState);
  }

  initiateScreeningTicketsState(screeningRoomId: number) {
    this.resetScreeningTicketState();
    //get screening tickets from checked out orders
    this.ordersService
      .getAllCheckedOutScreeningOrders(screeningRoomId)
      .pipe(
        switchMap((checkedOutOrders) => {
          let requests: Observable<Ticket[]>[] = [];
          checkedOutOrders.forEach((order) => {
            requests.push(this.ticketsService.getAllOrderTickets(order.id));
          });
          return forkJoin<Ticket[][]>(requests);
        }),
        map((orders) => {
          let tickets: Ticket[] = [];
          orders.forEach((order) => {
            tickets = [...tickets, ...order];
          });
          return tickets;
        })
      )
      .subscribe((tickets) => {
        this.patchTicketsState({ reservedTickets: tickets });
      });
    //get user screening tickets from not checked out order
    this.userService.user$
      .pipe(
        switchMap((user) => {
          return this.ordersService.getNotCheckedOutUserScreeningOrder(
            screeningRoomId,
            user.id
          );
        }),
        switchMap(([order]) => {
          this.patchTicketsState({ notCheckedOutOrderId: order?.id });
          return this.ticketsService.getAllOrderTickets(order?.id);
        })
      )
      .subscribe((tickets) => {
        this.patchTicketsState({ selectedTickets: tickets });
      });
  }

  isSeatReserved(seat: Seat) {
    return this.screeningTicketsStateValue.reservedTickets.some(
      (reservedTicket) => {
        return (
          seat.row === reservedTicket.seat.row &&
          seat.seatNumber === reservedTicket.seat.seatNumber
        );
      }
    );
  }

  isSeatSelected(seat: Seat) {
    return this.screeningTicketsStateValue.selectedTickets.find(
      (selectedTickets) => {
        return (
          seat.row === selectedTickets.seat.row &&
          seat.seatNumber === selectedTickets.seat.seatNumber
        );
      }
    );
  }

  toggleSelectedSeat(seat: Seat) {
    const selectedTicket = this.isSeatSelected(seat);
    if (
      selectedTicket === undefined &&
      this.screeningTicketsStateValue.selectedTickets.length <
        this.MAX_NUMBER_OF_RESERVED_SEATS &&
      this.screeningTicketsStateValue.notCheckedOutOrderId
    ) {
      this.ticketsService
        .addTicketToOrder(
          this.screeningTicketsStateValue.notCheckedOutOrderId,
          seat
        )
        .subscribe((selectedTicket) => {
          this.addSelectedTicketToLocalState(selectedTicket);
        });
    } else if (selectedTicket !== undefined) {
      this.ticketsService
        .removeTicketFromOrder((<Ticket>selectedTicket)?.id)
        .subscribe(() => {
          this.removeSelectedTicketFromLocalState(selectedTicket);
        });
    }
  }

  private addSelectedTicketToLocalState(selectedTicket: Ticket) {
    this.patchTicketsState({
      selectedTickets: [
        ...this.screeningTicketsStateValue.selectedTickets,
        selectedTicket,
      ],
    });
  }

  removeSelectedTicketFromLocalState(selectedTicket: Ticket) {
    const newSelectedTicketsState =
      this.screeningTicketsStateValue.selectedTickets.filter((ticket) => {
        return selectedTicket?.id !== ticket.id;
      });
    this.patchTicketsState({ selectedTickets: newSelectedTicketsState });
  }

  getScreeningDetails(screeningId: string) {
    return this.http.get<any>(
      `/screenings?_expand=rooms&_expand=movies&id=${screeningId}`
    );
  }
}
