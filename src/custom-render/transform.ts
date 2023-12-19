import * as Babel from '@babel/standalone';
import * as SchemaToTypes from "./json-schema-to-typescript";
import { ParamsType } from './constants'

type FuncType = (code: string) => Function;

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

const createElement: FuncType = (code) => {
  const transformCode = transform(code.trim().replace(/;$/, ''));
  return eval(transformCode);
};

const genLibTypes = async (schema: Record<string, any>) => {
  schema.title = 'props'
  const propTypes = await SchemaToTypes.compile(schema, "", {
    bannerComment: "",
    unknownAny: false,
    format: false,
  }).then((ts) => {
    return ts.replace("export ", "");
  });
  return `
    ${propTypes}\n
    ${ParamsType}
  `;
};


export { createElement, genLibTypes };
