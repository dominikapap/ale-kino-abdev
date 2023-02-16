import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  switchMap,
  combineLatest,
  of,
  Subscription,
} from 'rxjs';
import { UserStateService } from '../core/user.state.service';
import { Movie } from '../features/home/movie/movie.interface';
import { Order, OrdersService } from './orders.service';
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

export type ScreeningDetails = {
  id: number;
  date: string;
  time: string;
  rooms: Room;
  movies: Movie;
};

export type TicketState = {
  screeningDetails?: ScreeningDetails;
  notCheckedOutOrderId?: number;
  selectedTickets: Ticket[];
  reservedTickets: Ticket[];
};

const defaultTicketState: TicketState = {
  notCheckedOutOrderId: -1,
  selectedTickets: [],
  reservedTickets: [],
};

@Injectable({
  providedIn: 'root',
})
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
    this.getReservedScreeningTickets(screeningRoomId).subscribe((tickets) => {
      this.patchTicketsState({ reservedTickets: tickets });
    });
    //get user screening tickets from not checked out order
    this.getSelectedScreeningTickets(screeningRoomId).subscribe((tickets) => {
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

  private removeSelectedTicketFromLocalState(selectedTicket: Ticket) {
    const newSelectedTicketsState =
      this.screeningTicketsStateValue.selectedTickets.filter((ticket) => {
        return selectedTicket?.id !== ticket.id;
      });
    this.patchTicketsState({ selectedTickets: newSelectedTicketsState });
  }

  // updateSelectedTicket(ticketId: number, ticketSlice: Partial<Ticket>) {
  //   return this.ticketsService
  //     .updateTicket(ticketId, ticketSlice)
  //     .subscribe(([ticket, [ticketType]]) => {
  //       this.updateSelectedTicketToLocalState({
  //         ...ticket,
  //         ticketTypes: ticketType,
  //       });
  //     });
  // }

  removeSelectedTicket(row: string, seatNumber: number) {
    const selectedTicket = this.isSeatSelected({
      row,
      seatNumber,
    });
    if (selectedTicket !== undefined) {
      return this.ticketsService
        .removeTicketFromOrder((<Ticket>selectedTicket)?.id)
        .subscribe(() => {
          this.removeSelectedTicketFromLocalState(selectedTicket);
        });
    }else {
      return new Subscription()
    }
  }

  updateSelectedTicketToLocalState(selectedTicket: Ticket) {
    let oldSelectedTicket = <Ticket>(
      this.screeningTicketsStateValue.selectedTickets.find(
        (ticket) => ticket.id === selectedTicket.id
      )
    );
    Object.assign(oldSelectedTicket, selectedTicket);
  }

  private getReservedScreeningTickets(screeningRoomId: number) {
    return this.ordersService
      .getAllCheckedOutScreeningOrders(screeningRoomId)
      .pipe(
        switchMap((checkedOutOrders) => {
          let requests: Observable<Ticket[]>[] = [];
          checkedOutOrders.forEach((order) => {
            requests.push(
              this.ticketsService.getAllOrderTicketsWithFullInfo(order.id)
            );
          });
          return forkJoin<Ticket[][]>(requests);
        }),
        map((orders) => {
          return orders.flat();
        })
      );
  }

  private getSelectedScreeningTickets(screeningRoomId: number) {
    return this.userService.user$.pipe(
      switchMap((user) => {
        const order: Observable<Order[]> =
          this.ordersService.getNotCheckedOutUserScreeningOrder(
            screeningRoomId,
            user.id
          );
        return combineLatest([order, of(user)]);
      }),
      switchMap(([[order], user]) => {
        const newOrder$ = this.ordersService.createScreeningOrder(
          screeningRoomId,
          user.id
        );
        return order !== undefined ? of(order) : newOrder$;
      }),
      switchMap((order) => {
        this.patchTicketsState({ notCheckedOutOrderId: order?.id });
        return this.ticketsService.getAllOrderTicketsWithFullInfo(order?.id);
      })
    );
  }

  initializeScreeningDetailsFromRoute(route: ActivatedRoute) {
    return route.paramMap
      .pipe(
        switchMap((params) => {
          const id: string = <string>params.get('id');
          return this.getScreeningDetails(id);
        })
      )
      .subscribe(([screeningDetails]) => {
        this.patchTicketsState({ screeningDetails });
      });
  }

  getScreeningDetails(screeningId: string) {
    return this.http.get<ScreeningDetails[]>(
      `/screenings?_expand=rooms&_expand=movies&id=${screeningId}`
    );
  }
}
