import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import {
  OUTPUT_ID_TRIGGER,
  INPUT_ID_TRIGGER,
  Data,
  ActionType,
  stopTimer,
  startTimer
} from './constants';

export default function (props: RuntimeParams<Data>) {
  const { env, data, outputs, inputs } = props;
  // 防抖
  const debounceOutput = debounce((val) => {
    outputs[OUTPUT_ID_TRIGGER](val);
  }, data.delay);
  // 节流
  const throttleOutput = throttle((val) => {
    outputs[OUTPUT_ID_TRIGGER](val);
  }, data.delay);

  if (env?.runtime && inputs) {
    stopTimer(data.id);
    inputs[INPUT_ID_TRIGGER]((val) => {
      if (data.actionType === ActionType.START) {
        startTimer(
          data,
          () => {
            outputs[OUTPUT_ID_TRIGGER](val);
          },
          () => debounceOutput(val),
          () => throttleOutput(val)
        );
      } else {
        stopTimer(data.stopId);
      }
    });
  }
}
