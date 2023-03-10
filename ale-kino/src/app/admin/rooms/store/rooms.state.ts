import { Room } from 'src/app/services';

export type RoomsState = {
  roomsList: Room[];
};

export const roomsFeatureKey = 'roomsState';
export const initialRoomsState: {
  roomsList: Room[];
} = {
  roomsList: [],
};
