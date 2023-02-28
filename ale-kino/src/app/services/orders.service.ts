import { CouponCodesService } from './coupon-codes.service';
import { TicketsService } from './tickets.service';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute } from '@angular/router';
import { ScreeningsApiService } from '../admin/screenings';

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  newsletter?: boolean;
};

export type Order = {
  id: string;
  userId: number;
  screeningsId: number;
  isCheckedOut: boolean;
  customerInfo: CustomerInfo;
  couponCodesId?: number;
};

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private ticketsService = inject(TicketsService);
  private couponCodesService = inject(CouponCodesService);
  private screeningsService = inject(ScreeningsApiService);

  getOrderById(orderId: string) {
    return this.http.get<Order[]>(`/orders?id=${orderId}`);
  }

  getOrdersByUserId(userId: number) {
    return this.http.get<Order[]>(`/orders?usersId=${userId}`);
  }

  getUserOrderHistory(userId: string) {
    return this.http.get<Order[]>(`/orders?isCheckedOut=true&usersId=${userId}`);
  }

  createScreeningOrder(screeningId: number, userId: string) {
    return this.http.post<Order>('/orders', {
      id: uuidv4(),
      usersId: userId,
      screeningsId: screeningId,
      isCheckedOut: false,
    });
  }

  updateOrder(orderId: string, orderSlice: Partial<Order>) {
    return this.http.patch<Order>(`/orders/${orderId}`, {
      ...orderSlice,
    });
  }

  getAllScreeningOrders(screeningId: number) {
    return this.http.get(`/orders?screeningsId=${screeningId}`);
  }

  getAllCheckedOutScreeningOrders(screeningId: number) {
    return this.http.get<Order[]>(
      `/orders?screeningsId=${screeningId}&isCheckedOut=true`
    );
  }

  getNotCheckedOutUserScreeningOrder(screeningId: number, userId: string) {
    return this.http.get<Order[]>(
      `/orders?screeningsId=${screeningId}&userId=${userId}&isCheckedOut=false`
    );
  }

  getOrderTotalPrice(orderId: string) {
    return this.getOrderById(orderId).pipe(
      switchMap(([order]) => {
        if (order.couponCodesId) {
          return this.couponCodesService
            .getCouponCodeById(order.couponCodesId)
            .pipe(map(([coupon]) => coupon.discount));
        } else {
          return of(0);
        }
      }),
      switchMap((discount) => {
        return this.ticketsService.getAllOrderTicketsWithFullInfo(orderId).pipe(
          map((tickets) => {
            let totalOrderPrice = 0;
            tickets.forEach(
              (ticket) =>
                (totalOrderPrice += ticket.ticketTypes?.price! * (1 - discount))
            );
            return totalOrderPrice;
          })
        );
      })
    );
  }

  getOrderDetailsByRouteId(route: ActivatedRoute) {
    return route.paramMap.pipe(
      switchMap((params) => {
        const orderId: string = <string>params.get('id');
        return this.getOrderById(orderId);
      }),
      switchMap(([order]) => {
        const screeningDetails$ = this.screeningsService.getScreeningDetailsById(order.screeningsId);
        const orderTickets$ = this.ticketsService.getAllOrderTicketsWithFullInfo(order.id);
        return combineLatest([screeningDetails$, orderTickets$]);
      }),
      map(([[screeningDetails], orderTickets]) => {
        return {
          screeningDetails,
          orderTickets,
        };
      })
    );
  }

  constructor() {}
}
