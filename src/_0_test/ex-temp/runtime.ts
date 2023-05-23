import { ExpressionSandbox } from '../../../package/com-utils';
export default function ({ env, data }) {
  const { expression } = data;
  const context = {};
  const sandbox = new ExpressionSandbox({ context });
  if (env.debug && !!expression) {
    const ret = sandbox.execute(expression);
    console.log(ret);
  }
}
