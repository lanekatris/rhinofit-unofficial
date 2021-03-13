import moment from 'moment';
import rp from 'request-promise';
import { Credentials, formatCookies } from './AuthenticationService';

export interface RegisterForThisWeekResponse {
  error?: string;
}

export type HourOfDayRange = 16 | 18 | 20;

// These are only valid days for camp 4
export enum Days {
  // Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday'
  // Saturday = 'Saturday'
}

export interface RegisterForThisWeekRequest {
  // Who we want to register as
  // email: string;
  // password: string;
  credentials: Credentials

  // What time of day do we want to schedule for?
  hourOfDay: HourOfDayRange;

  // When do we want to work out?
  days: Days[];
}

export type TimeSlotIds = Record<HourOfDayRange, string>;
export interface GymScheduleServiceParams {
  gymId: string
  timeSlotIds: TimeSlotIds
}

export class GymScheduleService {
  // constructor(private service: AuthenticationService) {}
  constructor(private params: GymScheduleServiceParams) {}

  private getReservationId(hourOfDay: HourOfDayRange, day: Days): string {
    const {timeSlotIds} = this.params;
    // 4 - 6 Monday:    125396-0
    // 6 - 8 Monday:    125397-0
    // 6 - 8 Tuesday:   125397-1
    // 6 - 8 Wednesday: 125397-2
    // 8 - 10 Monday:  125398-0
    // 8 - 10 Tuesday: 125398-1

    // const idMap = {
    //   16: '125396',
    //   18: '125397',
    //   20: '125398'
    // };

    const dayMap = {
      [Days.Monday]: 0,
      [Days.Tuesday]: 1,
      [Days.Wednesday]: 2,
      [Days.Thursday]: 3,
      [Days.Friday]: 4
    };

    return `${timeSlotIds[hourOfDay]}-${dayMap[day]}`;
  }

  public async registerForThisWeek(
    request: RegisterForThisWeekRequest
  ): Promise<RegisterForThisWeekResponse[]> {
    const {gymId} = this.params;
    const { credentials, hourOfDay, days } = request;

    const dates = days.map(dayEnum => ({
      day: dayEnum,
      fullDate: moment().day(dayEnum)
    }));

    const responses = [];

    for (const date of dates) {
      const { day, fullDate } = date;

      if (fullDate.isBefore(moment())) {
        console.log('not creating date because it is before today');
        continue;
      }

      const options = {
        url: 'https://my.rhinofit.ca/forms/memberutils',
        method: 'POST',
        headers: {
          Cookie: formatCookies(credentials.cookies)
        },
        form: {
          action: 'reservestudentclass',
          ct_id: this.getReservationId(hourOfDay, day),
          start: fullDate.format(
            `ddd MMM DD YYYY ${hourOfDay}:00:00 G\\MT 0000`
          ),
          hash: gymId,
          date: moment().valueOf()
        }
      };
      console.log('iteration', fullDate);
      const body = await rp(options);
      console.log('body', body);
      responses.push(body);
    }

    return responses;
  }
}
