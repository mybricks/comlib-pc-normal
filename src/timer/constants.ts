const OUTPUT_ID_TRIGGER = 'trigger';
const INPUT_ID_TRIGGER = 'trigger';

export { INPUT_ID_TRIGGER, OUTPUT_ID_TRIGGER };

// 触发类型枚举
export enum ActionType {
  START = 'start',
  END = 'end'
}
export const ActionTypeMap = {
  [ActionType.START]: '开始定时',
  [ActionType.END]: '停止定时'
};
// 定时器类型枚举
export enum TimerType {
  INTERVAL = 'interval',
  TIMEOUT = 'timeout',
  DEBOUNCE = 'debounce',
  THROTTLE = 'throttle'
}
export const TimerTypeMap = {
  [TimerType.INTERVAL]: '轮询',
  [TimerType.TIMEOUT]: '延迟',
  [TimerType.DEBOUNCE]: '防抖',
  [TimerType.THROTTLE]: '节流',
}
/**
 * 数据源
 * @param actionType 触发类型 开始/结束
 * @param timerType 定时器类型 轮询/节流/延迟
 * @param delay 延迟/节流时间
 */
export interface Data {
  actionType: ActionType;
  timerType: TimerType;
  delay: number;
  id: string;
  name: string;
  stopId: string;
}

// 定时器触发
export function startTimer(
  data: Data,
  fn: Function,
  debFn: Function,
  thrFn: Function
) {
  const { id, name, delay, timerType } = data;
  let timerObj: any = (window as any).__timer__;
  if (!(window as any).__timer__) {
    (window as any).__timer__ = {};
    timerObj = (window as any).__timer__;
  }
  let timer;
  switch (timerType) {
    case TimerType.TIMEOUT:
      timer = window.setTimeout(() => {
        fn();
      }, delay);
      break;
    case TimerType.INTERVAL:
      timer = window.setInterval(() => {
        fn();
      }, delay);
      break;
    case TimerType.DEBOUNCE:
      debFn();
      break;
    case TimerType.THROTTLE:
      thrFn();
      break;
    default:
      break;
  }
  timerObj[id] = {
    name,
    timer
  };
}
// 定时器清除
export function stopTimer(id) {
  let timerObj: any = (window as any).__timer__;
  if (timerObj && timerObj[id] && timerObj[id].timer) {
    window.clearTimeout(timerObj[id].timer);
    window.clearInterval(timerObj[id].timer);
  }
}
