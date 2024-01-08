import { Data, OutputIds, InputIds } from './types';
import moment from 'moment';

type CountdownCallback = (timeLeft: number | string) => void;
type TimeUpdateCallback = (timeLeft: number | string) => void;

export default function ({ env, data, inputs, logger, onError }: RuntimeParams<Data>) {
  const { runtime } = env;
  const { staticTime, format, customFormat, isFormat, immediate } = data;
  let timer: NodeJS.Timeout | null = null;
  let timeLeft: number = 0;

  const formatTime = (seconds: number) => {
    if (!isFormat) {
      return seconds;
    }

    const milliseconds = seconds * 1000;
    const m = moment.utc(milliseconds);
    return m.format(format === 'custom' ? customFormat : format);
  };

  const clearCountdown = () => {
    if (!!timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const startCountdown = (
    initialTimeInSeconds: number,
    onEnd: CountdownCallback,
    onTimeUpdate: TimeUpdateCallback
  ) => {
    timeLeft = initialTimeInSeconds;
    if (!!immediate) {
      onTimeUpdate(formatTime(timeLeft));
    }
    timer = setInterval(() => {
      timeLeft--;
      onTimeUpdate(formatTime(timeLeft));

      if (timeLeft <= 0) {
        clearCountdown();
        onEnd(0);
      }
    }, 1000);
  };

  inputs[InputIds.StartCountdown]((time: number, outputRels: any) => {
    try {
      startCountdown(
        !isNaN(Number(time)) ? Number(time) : staticTime,
        outputRels[OutputIds.CountdownOut],
        outputRels[OutputIds.ResidualTime]
      );
    } catch (ex: any) {
      onError?.(ex);
      console.error('倒计时组件运行错误.', ex);
      logger.error(`${ex}`);
    }
  });

  inputs[InputIds.StopCountdown]((_: any, outputRels: any) => {
    outputRels[OutputIds.CountdownOut](timeLeft);
    clearCountdown();
  });

  if (typeof runtime?.onComplete === 'function') {
    runtime.onComplete(() => {
      clearCountdown();
    });
  }
}
