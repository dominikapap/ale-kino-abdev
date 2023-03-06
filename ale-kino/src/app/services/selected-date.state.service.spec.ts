import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SelectedDateService } from './selected-date.state.service';
import { format } from 'date-fns';

describe('CouponCodesService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [SelectedDateService],
    });
  });

  const defaultState = {
    date: format(new Date(), 'dd-MM-yyyy'),
  };

  it('initial state', (done) => {
    const state = TestBed.inject(EnvironmentInjector).get(SelectedDateService);

    state.selectedDateState$.subscribe((selectedDate) => {
      expect(selectedDate).toEqual(defaultState);
      done();
    });
  });

  it('set state', (done) => {
    const state = TestBed.inject(EnvironmentInjector).get(SelectedDateService);

    const newDate: string = '04-03-2023';
    state.setDate(newDate);
    state.selectedDateState$.subscribe((date) => {
      expect(date).toEqual({date: newDate});
      done();
    });
  });
});
