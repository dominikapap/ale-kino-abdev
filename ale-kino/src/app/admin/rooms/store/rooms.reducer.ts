import { createReducer, on } from '@ngrx/store';
import { RoomsAPIActions } from './rooms.actions';
import { initialRoomsState } from './rooms.state';

export const roomsReducer = createReducer(
  initialRoomsState,

  on(RoomsAPIActions.addNewRoomSuccess, (state, action) => {
    return { ...state, roomsList: [...state.roomsList, action] };
  }),
  on(RoomsAPIActions.getAllRoomsSuccess, (state, { roomsList }) => ({
    ...state,
    roomsList: [...state.roomsList, ...roomsList],
  }))
);
