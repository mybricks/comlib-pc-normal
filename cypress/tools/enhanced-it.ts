import { Func } from 'mocha';

/** 获取函数被执行位置的组件名 */
const getCallingComponentName = () => {
  const error = new Error();
  const stackLines = error.stack!.split('\n');
  const targetStr = stackLines![2];

  let prefix = 'src/';
  if (targetStr.includes('src/form-coms')) prefix = 'src/form-coms/';

  return stackLines?.[2].split(prefix)[1].split('/')[0];
};

/**
 * 增强版的 it，可以自动跳过某些组件的测试用例
 */
export default function enhancedIt(title: string, fn?: Func) {
  const componentName = getCallingComponentName();

  if (Cypress.env('check') === '__checkAll') {
    return it(title, fn);
  }

  return (Cypress.env('check')?.split(' ').includes(componentName) ? it : it.skip)(title, fn);
}
