import { Data } from './runtime';

export const InputIds = {
  SetOptions: 'setOptions'
};

export const OutputIds = {
  SetOptionsDone: 'setOptionsDone'
};

export const refreshSchema = (props: EditorResult<Data>) => {
  const { data, input, output } = props;
  const { label, value, children } = data.fieldNames;
  const optionsSchema = {
    title: '输入数据源数据',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        [label || 'label']: {
          title: '标题',
          type: 'string'
        },
        [value || 'value']: {
          title: '字段名',
          type: 'string'
        },
        disabled: {
          title: '禁用勾选',
          type: 'boolean'
        },
        [children || 'children']: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object'
          }
        }
      }
    }
  };
  input.get(InputIds.SetOptions)?.setSchema(optionsSchema);
  output.get(OutputIds.SetOptionsDone)?.setSchema(optionsSchema);
};
