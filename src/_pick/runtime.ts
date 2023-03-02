import { Data } from './types';
import Sandbox from './sandbox';
import { isSimplePick, isCombinationPick } from './utils'
export default function ({ data, inputs, outputs, onError }: RuntimeParams<Data>) {
  const sandbox = new Sandbox();
  inputs['inputContext']((context) => {
    data.picks.map(({ key, expression, title }) => {
      if (!expression) {
        outputs[key](context);
        return;
      }
      if (!isSimplePick(expression) && !isCombinationPick(expression)) {
        throw new Error(`对象取值 [${title}(${key})]: expression must start with "inputValue"`);
      }
      try {
        const ret = sandbox.run({ context, expression });
        outputs[key](ret);
      } catch (error: any) {
        onError?.(`[${title}(${key})]: ${error}`);
      }
    });
  });
}
