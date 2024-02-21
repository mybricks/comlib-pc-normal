import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError, id }: RuntimeParams<Data>) {
  const event = env.events.find(item => item.type === data.eventType)
  const inputNum = Object.keys(inputs).length;
  let count = 0
  let res = {};

  if (env.runtime) {
    Object.keys(inputs).forEach((key, index) => {
      inputs[key]((val, outputRels) => {
        const item = data.eventInputs.find(item => item.id === key);
        res[item.key] = val
        count++

        if (count === inputNum) {
          if (event?.exe) {
            event.exe({ options: res })
            outputRels['runDone']({ options: res })
            // outputs['onFinish']({ options: res })
          }
        }
      })
    })
  }

}