import { SuggestionType } from './types'
export const getCodeFromTemplate = (template: string) => {
  const code = template.match(/(?<=\{)(.+?)(?=\})/g);
  if (!code) throw new Error('表达式格式错误');
  return code[0];
};

export const sandbox = (code: string | null) => {
  const fn = new Function(
    'context',
    `with(context){
          return ${code}
      }`
  );

  return function (context: any) {
    return fn(context);
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
