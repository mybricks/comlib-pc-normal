const PREFIX = 'inputValue';

const defaultWrapSuggestion = {
  label: PREFIX,
  insertText: PREFIX,
  detail: '输入数据'
};

export type SuggestionType = {
  label: string;
  insertText: string;
  detail?: string;
  properties?: Array<SuggestionType>;
};

export const getSuggestionFromSchema = (schema: Record<string, any>) => {
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

const transform = (properties: Record<string, any>) => {
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
