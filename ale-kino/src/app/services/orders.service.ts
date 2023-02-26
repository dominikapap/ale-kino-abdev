import { switchMap } from 'rxjs';
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
  screeningId: number;
  isCheckedOut: boolean;
  customerInfo: CustomerInfo;
};

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);

  getOrderById(orderId: number) {
    return this.http.get(`/orders?id=${orderId}`);
  }

  createScreeningOrder(screeningId: number, userId: number) {
    return this.http.post<Order>('/orders', {
      usersId: userId,
      screeningsId: screeningId,
      isCheckedOut: false,
    });
  }

  updateOrder(orderId: number, customerInfo: CustomerInfo) {
    return this.http.patch<Order>(`/orders/${orderId}`, {
      customerInfo,
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

  constructor() {}
}
