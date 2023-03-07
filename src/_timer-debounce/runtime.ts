import { Data, InputIds, OutputIds } from './constants';
import debounce from 'lodash/debounce';

export default function (props: RuntimeParams<Data>) {
  const { env, data, outputs, inputs } = props;
  // 防抖
  const debounceOutput = debounce((val) => {
    outputs[OutputIds.Trigger](val);
  }, data.delay);

  if (env?.runtime && inputs) {
    inputs[InputIds.Trigger]((val) => {
      debounceOutput(val);
    });
  }
}