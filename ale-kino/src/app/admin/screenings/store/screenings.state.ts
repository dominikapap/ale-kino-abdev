import { Screening } from '../screenings-api.service';

export interface ScreeningsState {
  screeningsList: Screening[];
}

export const screeningsFeatureKey = 'screeningsState';

export const initialScreeningsState: ScreeningsState = {
  screeningsList: [],
};
