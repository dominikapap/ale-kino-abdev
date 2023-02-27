import { state } from '@angular/animations';
import { createSelector } from '@ngrx/store';
import { ScreeningsState } from './screenings.state';

const selectScreeningsState = (state: { screeningsState: ScreeningsState }) =>
  state.screeningsState;

export const selectScreeningsList = createSelector(
  selectScreeningsState,
  (state) => state.screeningsList
);
