import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);

  getScreeningOrders(screeningId: number){
    return this.http.get(`http://localhost:3000/orders?screeningsId=${screeningId}`)
  }

  constructor() { }
}
