import { SuggestionType } from './types';
import Sandbox from './sandbox'
export const getCodeFromTemplate = (template: string) => {
  //   const code = template.match(/(?<=\{)(.+?)(?=\})/g);
  //   if (!code) throw new Error('表达式格式错误');
  //   return code[0];
};

const defaultWrapSuggestion = {
  label: Sandbox.CONTEXT,
  insertText: Sandbox.CONTEXT
};

export const getSuggestionFromSchema = (schema) => {
  if (schema?.type?.toLowerCase() === 'object') {
    return [
      {
        ...defaultWrapSuggestion,
        properties: transform(schema.properties)
      }
    ];
  }
  if (schema?.type?.toLowerCase() === 'array') {
    return [defaultWrapSuggestion];
  }
  return [];
};

const transform = (properties) => {
  const _prop: SuggestionType[] = [];
  Object.keys(properties || {}).forEach((key) => {
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
