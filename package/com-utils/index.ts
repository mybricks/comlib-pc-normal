import Sandbox from './sandbox';
import utils from './utils';

interface Props {
  env?: any;
  callback?: () => any;
}
export function runJs(scriptText: string | any, model?: any[], props?: Props) {
  const { env = {}, callback = () => { } } = props || {};
  const isRuntime = env?.runtime && !env?.runtime?.debug;
  // 出码场景下是一个可直接运行的quan函数
  if (env?.toCode && Number.isInteger(scriptText)) {
    env.extractFns[scriptText](...model)
    return
  }

  if (typeof scriptText === 'object') {
    scriptText = isRuntime ? scriptText?.transformCode || scriptText?.code : scriptText?.code;
  }

  let fn = null;
  if (model && model.length) {
    const sandBox = new Sandbox({ module: true });
    let sourceStr = decodeURIComponent(scriptText);
    if (/export\s+default.*async.*function.*\(/g.test(sourceStr)) {
      fn = sandBox.compile(
        `${sourceStr.replace(/export\s+default.*function.*\(/g, 'async function _RT_(')}`
      );
    } else {
      fn = sandBox.compile(
        `${sourceStr.replace(/export\s+default.*function.*\(/g, 'function _RT_(')}`
      );
    }
  } else {
    const sandBox = new Sandbox();
    fn = sandBox.compile(`${decodeURIComponent(scriptText)}`);
  }

  return fn.run(model, callback);
}

export { utils };
export { default as ExpressionSandbox } from './expressionSandbox';
