import { DailyMoviesScreeningsService } from '../../../../services';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  protected dailyScreenings$ = inject(
    DailyMoviesScreeningsService
  ).getDailyScreeningsState();
}
