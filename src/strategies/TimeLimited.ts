import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { IStrategy, PowOverworkError, WorkFunction } from '../framework';

dayjs.extend(duration);

export class TimeLimited implements IStrategy {
  static readonly defaultOptions = {
    duration: dayjs.duration({ seconds: 5 }),
  };

  duration?= TimeLimited.defaultOptions.duration;

  constructor(duration: duration.Duration | undefined = TimeLimited.defaultOptions.duration) {
    this.duration = duration;
  }

  async run(fn: WorkFunction) {
    const abortController = new AbortController();
    const now = dayjs();
    do {
      const result = await fn({ abortController });
      if (result) {
        return result;
      }
    } while (!abortController.signal.aborted && (!this.duration || dayjs().diff(now.add(this.duration)) < 0));
    throw new PowOverworkError();
  }
}