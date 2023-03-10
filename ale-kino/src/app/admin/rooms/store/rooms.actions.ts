import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Room } from 'src/app/services';

export const RoomsActions = createActionGroup({
  source: 'Rooms',
  events: {
    'add new room': props<Room>(),
    'get all rooms': emptyProps(),
  },
});

export const RoomsAPIActions = createActionGroup({
  source: 'Rooms API',
  events: {
    ['add new room success']: props<Room>(),
    ['add new room failure']: emptyProps(),
    ['get all rooms success']: props<{ roomsList: Room[] }>(),
    ['get all rooms failure']: emptyProps(),
  },
});
