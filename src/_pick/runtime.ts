import { Data } from './types';
import Sandbox from './sandbox';
export default function ({ data, inputs, outputs, onError }: RuntimeParams<Data>) {
  const sandbox = new Sandbox();
  inputs['inputContext']((context) => {
    data.picks.map(({ key, expression }) => {
      if (!expression) {
        outputs[key](context);
        return;
      }
      try {
        const ret = sandbox.run({ context, expression });
        outputs[key](ret);
      } catch (error: any) {
        onError?.(error);
      }
    });
  });
}
