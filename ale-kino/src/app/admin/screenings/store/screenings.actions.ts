import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Screening } from '../screenings-api.service';

export const ScreeningsActions = createActionGroup({
  source: 'Screenings',
  events: {
    'add new screening': props<Screening>(),
    'get all screenings': emptyProps(),
  },
});
export const ScreeningsAPIActions = createActionGroup({
  source: 'Screenings API',
  events: {
    ['add new screening success']: props<Screening>(),
    ['add new screening failure']: emptyProps(),
    ['get all screenings success']: props<{ screeningsList: Screening[] }>(),
    ['get all screenings failure']: emptyProps(),
  },
});
