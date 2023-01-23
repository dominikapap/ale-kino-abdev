import { SummaryComponent } from './summary/summary.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    RouterModule,
    RouterModule.forChild([
      {
        path: '',
        component: SummaryComponent,
        children: [],
      },
    ]),
  ],
})
export default class SummaryModule {}
