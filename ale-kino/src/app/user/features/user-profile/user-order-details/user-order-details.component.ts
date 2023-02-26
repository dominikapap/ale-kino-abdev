import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserOrderDetailsService } from './user-order-details.service';
import { Component, inject } from '@angular/core';


@Component({
  selector: 'app-user-order-details',
  templateUrl: './user-order-details.component.html',
  styleUrls: ['./user-order-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export default class UserOrderDetailsComponent {
  private route = inject(ActivatedRoute)
  protected tickets$ = inject(UserOrderDetailsService).getOrderTickets(this.route);

}
