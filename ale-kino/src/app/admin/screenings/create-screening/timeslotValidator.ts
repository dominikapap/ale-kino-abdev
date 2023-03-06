import { ScreeningsApiService } from 'src/app/admin/screenings';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, of } from 'rxjs';
import * as moment from 'moment';
import { SnackbarService } from 'src/app/shared/services';
import { inject } from '@angular/core';

export function timeslotValidator(): AsyncValidatorFn {
  const screeningsService = inject(ScreeningsApiService)
  const snackbarService = inject(SnackbarService)
  return (control: AbstractControl) => {
    if (control.value.dateInfo.time) {
      const { roomInfo, dateInfo, movieInfo } = control.value;
      const selectedTimeslot = calculateSelectedScreeningTimeslot(
        dateInfo,
        movieInfo.movie.length
      );

      return screeningsService
        .getDailyRoomScreeningDetails(
          roomInfo.room.id,
          selectedTimeslot.startTime
        )
        .pipe(
          map((dailyScreenings) => {
            const collidingScreenings = dailyScreenings.filter((screening) => {
              const date = moment(screening.date, 'DD-MM-YYYY');
              const takenTimeslot = calculateSelectedScreeningTimeslot(
                { date: date.format('MM-DD-YYYY'), time: screening.time },
                screening.movies.length
              );
              if (
                (selectedTimeslot.startTime > takenTimeslot.startTime &&
                  selectedTimeslot.startTime < takenTimeslot.endTime) ||
                (selectedTimeslot.endTime > takenTimeslot.startTime &&
                  selectedTimeslot.endTime < takenTimeslot.endTime) ||
                (selectedTimeslot.startTime < takenTimeslot.startTime &&
                  selectedTimeslot.endTime > takenTimeslot.endTime)
              ) {
                return screening;
              } else {
                return;
              }
            });
            if (collidingScreenings.length > 0) {
              snackbarService.openSnackBar(
                'Niestety wybrana godzina jest już zajęta',
                5000,
                ['snackbar-error']
              );
              return { timeslotTaken: true };
            } else {
              return null;
            }
          })
        );
    }

    return of(null);
  };
}

function calculateSelectedScreeningTimeslot(
  dateInfo: { date: string; time: string },
  length: string
) {
  const startTime = new Date(dateInfo.date);
  const [timeHours, timeMinutes] = dateInfo.time.split(':');
  startTime.setHours(
    Number.parseInt(timeHours, 10),
    Number.parseInt(timeMinutes, 10)
  );
  const endTime = moment(startTime).add(length, 'm').toDate();

  return {
    startTime: startTime,
    endTime: endTime,
  };
}
