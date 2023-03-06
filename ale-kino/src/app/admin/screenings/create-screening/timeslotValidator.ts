import { ScreeningsApiService } from 'src/app/admin/screenings';
import { AbstractControl, AsyncValidatorFn, FormControl } from '@angular/forms';
import { map, of } from 'rxjs';

export function timeslotValidator(
  screeningsService: ScreeningsApiService,
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (control.value.dateInfo.time) {
      console.log(control.value)
      const roomId = control.value.roomInfo.room.id;
      console.log(control.value.dateInfo.time.split(':'));
      const time = control.value.dateInfo.time.split(':')
      const  date = new Date(control.value.dateInfo.date);
      date.setHours(time[0], time[1])
      console.log('roomId:',roomId, 'date:', date)
      screeningsService.getDailyRoomScreeningDetails(roomId, date).subscribe(dailyScreenings => {
        console.log('room daily screenings:', dailyScreenings)
      })

    }
    // console.log('test text:',test)
    return of(null);
  };
}
