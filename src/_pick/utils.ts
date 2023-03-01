import { SuggestionType } from './types';
export const getCodeFromTemplate = (template: string) => {
  if (template.startsWith('{') && template.endsWith('}')) {
    const code = template.substring(1, template.length - 1);
    return !!code.trim() ? code : null;
  } else if(!!template.trim()) {
    throw new Error('表达式格式错误');
  }
  //   const code = template.match(/(?<=\{)(.+?)(?=\})/g);
  //   if (!code) throw new Error('表达式格式错误');
  //   return code[0];
};

export const sandbox = (template: string) => {
  const code = getCodeFromTemplate(template);
  const fn = new Function(
    'context',
    `with(context){
          return ${code}
      }`
  );
  return function (context: any) {
    const ret = fn(context);
    if (typeof ret === 'undefined') {
      throw new Error(`${code} is not defined`);
    }
    return ret;
  };
};

export const getSuggestionFromSchema = (schema) => {
  if (!schema || schema?.type !== 'object') return [];
  return transform(schema.properties);
};

const transform = (properties) => {
  const _prop: SuggestionType[] = [];
  Object.keys(properties).forEach((key) => {
    const suggestion: SuggestionType = {
      label: key,
      insertText: key
    };
    if (!!properties[key].properties) {
      suggestion.properties = transform(properties[key].properties);
    }
    _prop.push(suggestion);
  });
  return _prop;
};

export { uuid } from '../utils';
