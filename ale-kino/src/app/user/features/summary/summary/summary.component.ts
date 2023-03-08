import { SummaryService } from './summary.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  private activeRoute = inject(ActivatedRoute);
  protected orderDetails$ = inject(SummaryService).handleSendForm(
    this.activeRoute
  );
}
