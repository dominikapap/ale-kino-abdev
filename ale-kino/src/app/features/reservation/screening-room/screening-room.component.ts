import { Ticket, TicketsService } from 'src/app/services/tickets.service';
import { Order, OrdersService } from './../../../services/orders.service';
import {
  ScreeningService,
  Seat,
  TicketState,
} from '../../../services/screening.state.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ScreeningRoomsService } from 'src/app/services/screening-rooms.service';
import { UserStateService } from 'src/app/core/user.state.service';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';

export type RoomSize = {
  rows: number;
  seats: number;
};

@Component({
  selector: 'app-screening-room',
  templateUrl: './screening-room.component.html',
  styleUrls: ['./screening-room.component.scss'],
})
export class ScreeningRoomComponent implements OnInit {
  private screeningRoomService = inject(ScreeningRoomsService);
  private screeningService = inject(ScreeningService);
  private userState = inject(UserStateService);

  @Input() roomId: number = 0;
  @Input() screeningRoomId: number = 0;
  @Input() maxNumberOfReservedSeats: number = 10;
  seatSelectionState: Seat[] = [];
  roomSetupData: any;
  ticketsState: TicketState = {
    reservedTickets: [],
    selectedTickets: [],
  };

  ngOnInit(): void {
    this.screeningService.seatOccupancyState$.subscribe(
      (seatOccupancyState) => {
        this.seatSelectionState = seatOccupancyState.selectedSeats;
      }
    );

    this.screeningRoomService.initiateRoomSetupData(this.roomId);
    this.screeningRoomService.roomSetupData$.subscribe((roomSetupData) => {
      this.roomSetupData = roomSetupData;
    });

    this.screeningService.initiateScreeningTicketsState(this.screeningRoomId);

    this.screeningService.screeningTicketsState$.subscribe((ticketsState) => {
      this.ticketsState = ticketsState;
    });
  }

  toggleSeat(row: string, seatNumber: number) {
    this.screeningService.toggleSelectedSeat({ row, seatNumber });
  }

  isSelected(row: string, seatNumber: number) {
    return this.screeningService.isSeatSelectedN({ row, seatNumber });
  }

  initiateReservedSeats(seats: Seat[]) {
    this.screeningService.reserveSeats(seats);
  }

  isReserved(row: string, seatNumber: number) {
    return this.screeningService.isSeatReserved({ row, seatNumber });
  }
}
