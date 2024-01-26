import { Data, InputIds } from './types';

export default function ({ env, data, inputs, outputs, logger, onError, id }: RuntimeParams<Data>) {
  const { runtime, events } = env;
  const event = events.find((item) => item.type === data.eventType);

  if (runtime) {
    inputs[InputIds.INPUT]((val: Record<string, any>) => {
      // 映射过去
      const options = data.eventInputs.reduce((acc, { id, key }) => {
        if (val.hasOwnProperty(id)) {
          acc[key] = val[id];
        }
        return acc;
      }, {});
      if (event?.exe) {
        event.exe({ options });
      }
    });
  }
}
