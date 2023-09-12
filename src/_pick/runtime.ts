import { Data } from './types';
import { ExpressionSandbox } from '../../package/com-utils';
export default function ({ data, inputs, outputs, onError }: RuntimeParams<Data>) {
  inputs['inputContext']((context) => {
    const sandbox: ExpressionSandbox = new ExpressionSandbox({ context, prefix: 'inputValue' });
    data.picks.map(({ key, expression, title }) => {
      if (!expression) {
        outputs[key](context);
        return;
      }
      try {
        const ret = sandbox.executeWithTemplate(expression);
        outputs[key](ret);
      } catch (error: any) {
        onError?.(`[${title}(${key})]: ${error}`);
      }
    });
  });
}
