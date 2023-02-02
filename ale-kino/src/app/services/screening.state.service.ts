import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { UserStateService } from '../core/user.state.service';
import { Movie } from '../features/home/movie/movie.interface';
import { OrdersService } from './orders.service';
import { Ticket, TicketsService } from './tickets.service';

export type Screening = {
  id: number;
  date: string;
  time: string;
  roomInfo: Room;
  movieInfo: Movie;
};

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
export interface ScreeningRoom {
  id: number;
  reservedSeats: Seat[];
  room: Room;
}

export type SeatState = {
  selectedSeats: Seat[];
  reservedSeats: Seat[];
};

const defaultSeatState: SeatState = {
  selectedSeats: [],
  reservedSeats: [],
};

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

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  private http = inject(HttpClient);
  private ordersService = inject(OrdersService);
  private ticketsService = inject(TicketsService);
  private userService = inject(UserStateService);

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

  initiateScreeningTicketsState(screeningRoomId: number) {
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
        console.log('Tickets:', tickets);
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
          this.patchTicketsState({ notCheckedOutOrderId: order.id });
          return this.ticketsService.getAllOrderTickets(order.id);
        })
      )
      .subscribe((tickets) => {
        console.log('Not checked out user order:', tickets);
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

  isSeatSelectedN(seat: Seat) {
    return this.screeningTicketsStateValue.selectedTickets.find(
      (selectedTickets) => {
        return (
          seat.row === selectedTickets.seat.row &&
          seat.seatNumber === selectedTickets.seat.seatNumber
        );
      }
    );
  }

  toggleSelectedSeatN(seat: Seat) {
    const selectedTicket = this.isSeatSelectedN(seat);
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

  // Old version below

  private seatOccupancyState$$ = new BehaviorSubject<SeatState>(
    defaultSeatState
  );
  private MAX_NUMBER_OF_RESERVED_SEATS: number = 10;

  get seatOccupancyState$() {
    return this.seatOccupancyState$$.asObservable();
  }

  get seatOccupancyStateValue() {
    return this.seatOccupancyState$$.value;
  }

  private patchState(stateSlice: Partial<SeatState>) {
    this.seatOccupancyState$$.next({
      ...this.seatOccupancyStateValue,
      ...stateSlice,
    });
  }

  /* Seat selection state functions */
  selectSeat(seat: Seat) {
    seat.isSelected = true;
    const newSelectedSeats = [
      ...this.seatOccupancyStateValue.selectedSeats,
      seat,
    ];
    this.patchState({ selectedSeats: newSelectedSeats });
  }

  deselectSeat(seat: { row: string; seatNumber: number }) {
    const newSelectedSeats = this.seatOccupancyStateValue.selectedSeats.filter(
      (selectedSeat) => {
        return !(
          seat.row === selectedSeat.row &&
          seat.seatNumber === selectedSeat.seatNumber
        );
      }
    );
    this.patchState({ selectedSeats: newSelectedSeats });
  }

  isSeatSelected(seat: Seat) {
    return this.seatOccupancyStateValue.selectedSeats.some((selectedSeat) => {
      return (
        seat.row === selectedSeat.row &&
        seat.seatNumber === selectedSeat.seatNumber
      );
    });
  }

  toggleSelectedSeat(seat: Seat) {
    if (
      !this.isSeatSelected(seat) &&
      this.seatOccupancyStateValue.selectedSeats.length <
        this.MAX_NUMBER_OF_RESERVED_SEATS
    ) {
      this.selectSeat(seat);
    } else {
      this.deselectSeat(seat);
    }
  }

  /* Seat reservation state functions */
  reserveSeat(seat: Seat) {
    seat.isReserved = true;
    const newReservedSeats = [
      ...this.seatOccupancyStateValue.reservedSeats,
      seat,
    ];
    this.patchState({ reservedSeats: newReservedSeats });
  }

  reserveSeats(seats: Seat[]) {
    seats.forEach((seat) => {
      this.reserveSeat(seat);
    });
  }

  getScreeningDetails(screeningId: string) {
    return this.http.get<any>(
      `http://localhost:3000/screenings?_expand=rooms&_expand=movies&id=${screeningId}`
    );
  }
}
