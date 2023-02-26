import { CommonModule } from '@angular/common';
import { UserOrdersService } from './user-orders.service';
import { Component, ChangeDetectionStrategy, inject, } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule]
})
export default class UserOrdersComponent {
protected userOrders$ = inject(UserOrdersService).getUserOrders();
}
