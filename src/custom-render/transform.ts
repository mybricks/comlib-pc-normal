import { getParamsType } from './constants';

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
    if (!window.Babel) {
      throw Error('Babel was not found in window');
    }
    return window.Babel.transform(code, options).code;
  } catch (error) {
    throw error;
  }
};

const createElement: FuncType = (code) => {
  if(code.includes('var _RTFN_')) {
    return eval(decodeURIComponent(code))
  }
  code = `var _RTFN_ = ${code.trim().replace(/;$/, '')} `;
  let transformCode = transform(code);
  transformCode = `(function() {\n${transformCode}\nreturn _RTFN_; })()`
  return eval(transformCode);
};

const genLibTypes = async (schema: Record<string, any>) => {
  const SchemaToTypes = window.jstt;
  if(!SchemaToTypes) return;
  schema.title = 'Props';
  const propTypes = await SchemaToTypes.compile(schema, '', {
    bannerComment: '',
    unknownAny: false,
    format: false
  }).then((ts) => {
    return ts.replace('export ', '');
  });
  return `
    ${propTypes}\n
    ${getParamsType('Props')}
  `;
};


export { createElement, genLibTypes };
