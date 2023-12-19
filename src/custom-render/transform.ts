import * as Babel from '@babel/standalone';
import type { ReactNode } from 'react';

interface transformReturns {
  transformCode: string;
  node: ReactNode;
}
type FuncType = (code: string, scope: Record<string, any>) => transformReturns;

const transform = (code: string) => {
  const options = {
    presets: ['env', 'react'],
    plugins: [
      ['proposal-decorators', { legacy: true }],
      'proposal-class-properties',
      [
        'transform-typescript',
        {
          isTSX: true
        }
      ]
    ]
  };
  try {
    return Babel.transform(code, options).code;
  } catch (error) {
    throw error;
  }
};

const getReactNode = (code: string, scope: Record<string, any>) => {
  const fn = eval(code);
  return fn(scope);
};
 
const createElement: FuncType = (code, scope = {}) => {
  const transformCode = transform(code.trim().replace(/;$/, ''));
  return { transformCode, node: getReactNode(transformCode, scope) };
};

export { createElement };
