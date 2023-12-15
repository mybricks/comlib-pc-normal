import * as Babel from '@babel/standalone';
import type { ReactNode } from 'react';

interface transformReturns {
  transformCode: string;
  node: ReactNode;
}
type FuncType = (code: string, scope: Record<string, any>) => transformReturns;

const removeSemicolon = (text: string): string => {
  while (text.trim().endsWith(';')) {
    text = text.slice(0, text.length - 1)
  }
  return text
}

const transform = (code: string) => {
  const options = {
    presets: ['env', 'react'],
    plugins: [
      ['proposal-decorators', { legacy: true }],
      ['proposal-class-properties', { loose: true }],
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
  const transformCode = transform(removeSemicolon(code));
  return { transformCode, node: getReactNode(transformCode, scope) };
};

export { createElement };
