import { createReducer, on } from '@ngrx/store';
import { ScreeningsAPIActions } from './screenings.actions';
import { initialScreeningsState } from './screenings.state';

export const screeningsReducer = createReducer(
  initialScreeningsState,

  on(ScreeningsAPIActions.addNewScreeningSuccess, (state, action) => {
    return { ...state, screeningsList: [...state.screeningsList, action] };
  }),
  on(ScreeningsAPIActions.getAllScreeningsSuccess, (state, { screeningsList }) => ({
    ...state,
    screeningsList: [...state.screeningsList, ...screeningsList],
  }))
);
