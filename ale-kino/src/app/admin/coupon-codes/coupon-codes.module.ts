import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TrimDirective } from 'src/app/shared/directives';
import AddCouponComponent from './add-coupon/add-coupon.component';
import { couponsFeatureKey, couponsReducer, CouponsEffects } from './store';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [AddCouponComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    TrimDirective,
    StoreModule.forFeature(couponsFeatureKey, couponsReducer),
    EffectsModule.forFeature([CouponsEffects]),
    RouterModule.forChild([
      { path: '', redirectTo: 'add-coupon', pathMatch: 'full' },
      {
        path: 'add-coupon',
        component: AddCouponComponent,
      },
    ]),
  ],
})
export default class CouponCodesModule {}
