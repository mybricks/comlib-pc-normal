import { Data, InputIds, OutputIds } from './constants';
import throttle from 'lodash/throttle';


export default function (props: RuntimeParams<Data>) {
  const { env, data, outputs, inputs } = props;
  // 节流
  const throttleOutput = throttle((val) => {
    outputs[OutputIds.Trigger](val);
  }, data.delay);

  if (env?.runtime && inputs) {
    inputs[InputIds.Trigger]((val) => {
      throttleOutput(val);
    });
  }
}
