import { AuthStateService } from './../auth/auth.state.service';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  first,
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { User, UserStateService } from '../core/user.state.service';
import { Order, OrdersService } from './orders.service';
import { RoomsApiService, Seat } from './rooms-api.service';
import { Ticket, TicketsService } from './tickets.service';
import { ScreeningDetails, ScreeningsApiService } from '../admin/screenings';
import { v4 as uuidv4 } from 'uuid';

export type RoomSetup = {
  rowLetters: string[];
  rowNumbers: number[];
};

export type TicketState = {
  notCheckedOutOrderId?: string;
  selectedTickets: Ticket[];
  reservedTickets: Ticket[];
};

const defaultTicketState: TicketState = {
  notCheckedOutOrderId: '',
  selectedTickets: [],
  reservedTickets: [],
};

export type ScreeningRoomState = {
  screeningDetails?: ScreeningDetails;
  ticketState: TicketState;
  roomSetup: RoomSetup;
};

const defaultRoomSetupData: RoomSetup = {
  rowLetters: [],
  rowNumbers: [],
};

const defaultScreeningRoomState: ScreeningRoomState = {
  ticketState: defaultTicketState,
  roomSetup: defaultRoomSetupData,
};

@Injectable({
  providedIn: 'root',
})
export class ScreeningRoomStateService {
  private ticketsService = inject(TicketsService);
  private roomsService = inject(RoomsApiService);
  private ordersService = inject(OrdersService);
  private userService = inject(UserStateService);
  private screeningService = inject(ScreeningsApiService);
  private authState$ = inject(AuthStateService).auth$;

  constructor() {}
  private MAX_NUMBER_OF_RESERVED_SEATS: number = 10;
  private screeningRoomState$$ = new BehaviorSubject<ScreeningRoomState>(
    defaultScreeningRoomState
  );

  get screeningRoomState$() {
    return this.screeningRoomState$$.asObservable();
  }

  private get screeningRoomStateValue() {
    return this.screeningRoomState$$.value;
  }

  private patchState(stateSlice: Partial<ScreeningRoomState>) {
    this.screeningRoomState$$.next({
      ...this.screeningRoomStateValue,
      ...stateSlice,
    });
  }

  private patchTicketState(stateSlice: Partial<TicketState>) {
    this.screeningRoomState$$.next({
      ...this.screeningRoomStateValue,
      ticketState: {
        ...this.screeningRoomStateValue.ticketState,
        ...stateSlice,
      },
    });
  }

  resetScreeningRoomState() {
    this.patchState(defaultScreeningRoomState);
  }

  initiateScreeningTicketsState(screeningRoomId: number) {
    //reset state
    this.resetScreeningRoomState();
    //get screening tickets from checked out orders
    const reservedTicketsSub =
      this.getReservedScreeningTickets(screeningRoomId);
    //get user screening tickets from not checked out order
    const selectedTicketsSub =
      this.getSelectedScreeningTickets(screeningRoomId);
    return combineLatest([reservedTicketsSub, selectedTicketsSub]);
  }

  isSeatReserved(seat: Seat) {
    return this.screeningRoomStateValue.ticketState.reservedTickets.some(
      (reservedTicket) => {
        return (
          seat.row === reservedTicket.seat.row &&
          seat.seatNumber === reservedTicket.seat.seatNumber
        );
      }
    );
  }

  isSeatSelected(seat: Seat) {
    return this.screeningRoomStateValue.ticketState.selectedTickets.find(
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
      this.screeningRoomStateValue.ticketState.selectedTickets.length <
        this.MAX_NUMBER_OF_RESERVED_SEATS &&
      this.screeningRoomStateValue.ticketState.notCheckedOutOrderId
    ) {
      return this.ticketsService
        .addTicketToOrder(
          this.screeningRoomStateValue.ticketState.notCheckedOutOrderId,
          seat
        )
        .pipe(
          first(),
          switchMap((selectedTicket) => {
            return this.ticketsService.getTicketWithTypeData(selectedTicket);
          }),
          tap((selectedTicket) => {
            this.addSelectedTicketToLocalState(selectedTicket);
          })
        );
    } else if (selectedTicket !== undefined) {
      return this.ticketsService
        .removeTicketFromOrder((<Ticket>selectedTicket)?.id)
        .pipe(
          first(),
          tap(() => {
            this.removeSelectedTicketFromLocalState(selectedTicket);
          })
        );
    } else {
      return of(EMPTY);
    }
  }

  private addSelectedTicketToLocalState(selectedTicket: Ticket) {
    this.patchTicketState({
      selectedTickets: [
        ...this.screeningRoomStateValue.ticketState.selectedTickets,
        selectedTicket,
      ],
    });
  }

  private removeSelectedTicketFromLocalState(selectedTicket: Ticket) {
    const newSelectedTicketsState =
      this.screeningRoomStateValue.ticketState.selectedTickets.filter(
        (ticket) => {
          return selectedTicket?.id !== ticket.id;
        }
      );
    this.patchTicketState({ selectedTickets: newSelectedTicketsState });
  }

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
    } else {
      return new Subscription();
    }
  }

  updateSelectedTicketToLocalState(selectedTicket: Ticket) {
    const oldSelectedTicket = <Ticket>(
      this.screeningRoomStateValue.ticketState.selectedTickets.find(
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
          const requests: Observable<Ticket[]>[] = [];
          checkedOutOrders.forEach((order) => {
            requests.push(
              this.ticketsService.getAllOrderTicketsWithFullInfo(order.id)
            );
          });
          return forkJoin<Ticket[][]>(requests);
        }),
        map((orders) => {
          return orders.flat();
        }),
        tap((reservedTickets) => this.patchTicketState({ reservedTickets }))
      );
  }

  private getSelectedScreeningTickets(screeningRoomId: number) {
    return this.authState$.pipe(
      switchMap((authState) => {
        if (authState.role === 'guest') {
          const guestUser: User = {
            id: uuidv4(),
            email: '',
            username: 'guest',
          };
          this.userService.addUser(guestUser);
        }
        return this.userService.user$;
      }),
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
        this.patchTicketState({ notCheckedOutOrderId: order?.id });
        return this.ticketsService.getAllOrderTicketsWithFullInfo(order?.id);
      }),
      tap((selectedTickets) => this.patchTicketState({ selectedTickets }))
    );
  }

  private generateRowLetters(rowsNumber: number) {
    //generate an array of letters
    const alpha = Array.from(Array(rowsNumber)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));
    return alphabet;
  }

  private generateSeatNumbers(seats: number) {
    return Array.from({ length: seats }, (_, i) => i + 1);
  }

  initiateRoomSetupData(screeningRoomId: number) {
    return this.roomsService.getRoomDetails(screeningRoomId).pipe(
      map((roomDetails) => {
        return {
          rowLetters: this.generateRowLetters(roomDetails.rows),
          rowNumbers: this.generateSeatNumbers(roomDetails.seats),
        };
      }),
      tap((roomSetup) => {
        this.patchState({
          roomSetup,
        });
      })
    );
  }

  initializeScreeningDetailsFromRoute(route: ActivatedRoute) {
    return route.paramMap.pipe(
      switchMap((params) => {
        const id: string = <string>params.get('id');
        return this.screeningService.getScreeningDetails(id);
      }),
      map(([screeningDetails]) => {
        return screeningDetails;
      }),
      tap((screeningDetails) => {
        this.patchState({ screeningDetails });
      })
    );
  }

  setStateFromLocalStorage() {
    const state = localStorage.getItem('state');
    if (state) {
      this.patchState(JSON.parse(state));
    }
  }
}
