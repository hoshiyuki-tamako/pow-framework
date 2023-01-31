import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { ICondition } from '../framework';

dayjs.extend(duration);

export class TimeLimited implements ICondition {
  static readonly defaultOptions = {
    duration: dayjs.duration({ seconds: 5 }),
  };

  duration = TimeLimited.defaultOptions.duration;
  timeoutAt = dayjs();

  constructor(duration = TimeLimited.defaultOptions.duration) {
    this.duration = duration;
  }

  reset() {
    this.timeoutAt = dayjs().add(this.duration);
  }

  shouldContinue() {
    return this.timeoutAt.diff(dayjs()) > 0;
  }
}