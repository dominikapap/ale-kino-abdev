import { UserStateService } from 'src/app/core/user.state.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs';

export type Order = {
  id: number;
  userId: number;
  screeningId: number;
  isCheckedOut: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private userService = inject(UserStateService);

  createScreeningOrder(screeningId: number, userId: number) {
    return this.http.post<Order>('/orders', {
      usersId: userId,
      screeningsId: screeningId,
      isCheckedOut: false,
    }).pipe(tap(response => console.log('post response:',response)));
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
