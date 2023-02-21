import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
} from 'rxjs';
import { UserStateService } from '../core/user.state.service';
import { Order, OrdersService } from './orders.service';
import { RoomsService, Seat } from './rooms.service';
import { ScreeningDetails, ScreeningsService } from './screenings.service';
import { Ticket, TicketsService } from './tickets.service';

export type RoomSetup = {
  rowLetters: string[];
  rowNumbers: number[];
};

export type ScreeningRoomState = {
  screeningDetails?: ScreeningDetails;
  notCheckedOutOrderId?: number;
  selectedTickets: Ticket[];
  reservedTickets: Ticket[];
  roomSetup: RoomSetup;
};

const defaultRoomSetupData: RoomSetup = {
  rowLetters: [],
  rowNumbers: [],
};

const defaultScreeningRoomState: ScreeningRoomState = {
  notCheckedOutOrderId: -1,
  selectedTickets: [],
  reservedTickets: [],
  roomSetup: defaultRoomSetupData,
};

@Injectable({
  providedIn: 'root',
})
export class ScreeningRoomStateService {
  private ticketsService = inject(TicketsService);
  private roomsService = inject(RoomsService);
  private ordersService = inject(OrdersService);
  private userService = inject(UserStateService);
  private screeningService = inject(ScreeningsService);
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

  private resetScreeningRoomState() {
    this.patchState(defaultScreeningRoomState);
  }

  isSeatReserved(seat: Seat) {
    return this.screeningRoomStateValue.reservedTickets.some(
      (reservedTicket) => {
        return (
          seat.row === reservedTicket.seat.row &&
          seat.seatNumber === reservedTicket.seat.seatNumber
        );
      }
    );
  }

  isSeatSelected(seat: Seat) {
    return this.screeningRoomStateValue.selectedTickets.find(
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
      this.screeningRoomStateValue.selectedTickets.length <
        this.MAX_NUMBER_OF_RESERVED_SEATS &&
      this.screeningRoomStateValue.notCheckedOutOrderId
    ) {
      this.ticketsService
        .addTicketToOrder(
          this.screeningRoomStateValue.notCheckedOutOrderId,
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
    this.patchState({
      selectedTickets: [
        ...this.screeningRoomStateValue.selectedTickets,
        selectedTicket,
      ],
    });
  }

  private removeSelectedTicketFromLocalState(selectedTicket: Ticket) {
    const newSelectedTicketsState =
      this.screeningRoomStateValue.selectedTickets.filter((ticket) => {
        return selectedTicket?.id !== ticket.id;
      });
    this.patchState({ selectedTickets: newSelectedTicketsState });
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
    let oldSelectedTicket = <Ticket>(
      this.screeningRoomStateValue.selectedTickets.find(
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
        this.patchState({ notCheckedOutOrderId: order?.id });
        return this.ticketsService.getAllOrderTicketsWithFullInfo(order?.id);
      })
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
    this.roomsService
      .getRoomDetails(screeningRoomId)
      .subscribe((roomDetails) => {
        this.patchState({
          roomSetup: {
            rowLetters: this.generateRowLetters(roomDetails.rows),
            rowNumbers: this.generateSeatNumbers(roomDetails.seats),
          },
        });
      });
  }

  initializeScreeningDetailsFromRoute(route: ActivatedRoute) {
    return route.paramMap
      .pipe(
        switchMap((params) => {
          const id: string = <string>params.get('id');
          return this.screeningService.getScreeningDetails(id);
        })
      )
      .subscribe(([screeningDetails]) => {
        this.patchState({ screeningDetails });
      });
  }
}
