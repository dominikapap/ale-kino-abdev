import { createSelector } from '@ngrx/store';
import { RoomsState } from './rooms.state';

const selectRoomsState = (state: { roomsState: RoomsState }) =>
  state.roomsState;

export const selectRoomsList = createSelector(
  selectRoomsState,
  (state) => state.roomsList
);
