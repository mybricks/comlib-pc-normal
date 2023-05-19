import { Data } from './types';
import { ExpressionSandbox } from '../../package/com-utils';
export default function ({ data, inputs, outputs, onError }: RuntimeParams<Data>) {
  let sandbox;
  inputs['inputContext']((context) => {
    if (!sandbox) {
      sandbox = new ExpressionSandbox({ context, prefix: 'inputValue' });
    }
    data.picks.map(({ key, expression, title }) => {
      if (!expression) {
        outputs[key](context);
        return;
      }
      try {
        const ret = sandbox.execute(expression);
        outputs[key](ret);
      } catch (error: any) {
        onError?.(`[${title}(${key})]: ${error}`);
      }
    });
  });
}
