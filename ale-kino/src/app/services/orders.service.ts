import { CouponCodesService } from './coupon-codes.service';
import { TicketsService } from './tickets.service';
import { map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  newsletter?: boolean;
};

export type Order = {
  id: number;
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

  getOrderById(orderId: number) {
    return this.http.get<Order>(`/orders?id=${orderId}`);
  }

  getOrdersByUserId(userId: number) {
    return this.http.get<Order[]>(`/orders?usersId=${userId}`);
  }

  getUserOrderHistory(userId: number) {
    return this.http.get<Order[]>(`/orders?isCheckedOut=true&usersId=${userId}`);
  }

  createScreeningOrder(screeningId: number, userId: number) {
    return this.http.post<Order>('/orders', {
      usersId: userId,
      screeningsId: screeningId,
      isCheckedOut: false,
    });
  }

  updateOrder(orderId: number, orderSlice: Partial<Order>) {
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

  getNotCheckedOutUserScreeningOrder(screeningId: number, userId: number) {
    return this.http.get<Order[]>(
      `/orders?screeningsId=${screeningId}&userId=${userId}&isCheckedOut=false`
    );
  }

  getOrderTotalPrice(orderId: number) {
    return this.getOrderById(orderId).pipe(
      switchMap((order) => {
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

  constructor() {}
}
