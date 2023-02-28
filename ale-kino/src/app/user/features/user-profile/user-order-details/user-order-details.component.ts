import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { OrdersService } from 'src/app/services';

@Component({
  selector: 'app-user-order-details',
  templateUrl: './user-order-details.component.html',
  styleUrls: ['./user-order-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export default class UserOrderDetailsComponent {
  private route = inject(ActivatedRoute)
  protected orderDetails$ = inject(OrdersService).getOrderDetailsByRouteId(
    this.route
  );

}
