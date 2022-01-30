import { Data } from '../../runtime';
import { RuleKeys } from '../../utils';
import {
  checkItemType,
  getFormItemProps,
  setFormItemProps,
  getFormItem
} from './utils';

const InputItemBaseEditor = [
  {
    title: '输入框配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, [
        'inputText',
        'inputPassword',
        'inputTextarea'
      ]);
    },
    items: [
      {
        title: '清除内容图标',
        type: 'Switch',
        description: '开启后可点击清除内容',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'allowClear');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'allowClear', value);
          }
        }
      },
      {
        title: '前置标签',
        type: 'Text',
        description: '展示在输入框前面的固定内容',
        options: {
          placeholder: '请输入 前置标签'
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkItemType({ data, focusArea }, [
            'inputText',
            'inputPassword'
          ]);
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'addonBefore');
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, focusArea }, 'addonBefore', value);
          }
        }
      },
      {
        title: '后置标签',
        type: 'Text',
        description: '展示在输入框后面的固定内容',
        options: {
          placeholder: '请输入 后置标签'
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkItemType({ data, focusArea }, [
            'inputText',
            'inputPassword'
          ]);
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'addonAfter');
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            setFormItemProps({ data, focusArea }, 'addonAfter', value);
          }
        }
      }
    ]
  }
];

const InputItemPowerEditor = [
  {
    title: '输入框配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, [
        'inputText',
        'inputPassword',
        'inputTextarea'
      ]);
    },
    items: [
      {
        title: '行数限制',
        type: 'Inputnumber',
        options: [
          { title: '最小', min: 3, width: 100 },
          { title: '最大', min: 6, width: 100 }
        ],
        description: '行数限制',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkItemType({ data, focusArea }, ['inputTextarea']);
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return [
              getFormItemProps({ data, focusArea }, 'minRows') || 3,
              getFormItemProps({ data, focusArea }, 'maxRows') || 6
            ];
          },
          set({ data, focusArea }: EditorResult<Data>, value: number[]) {
            setFormItemProps({ data, focusArea }, 'minRows', value[0]);
            setFormItemProps({ data, focusArea }, 'maxRows', value[1]);
          }
        }
      },
      {
        title: '删除两端空白字符',
        type: 'Switch',
        description: '是否删除两端空白字符',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkItemType({ data, focusArea }, [
            'inputText',
            'inputTextarea'
          ]);
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'isTrim');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'isTrim', value);
          }
        }
      },
      {
        title: '显示字数',
        type: 'Switch',
        description: '是否显示字数',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkItemType({ data, focusArea }, [
            'inputText',
            'inputTextarea'
          ]);
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'showCount');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'showCount', value);
          }
        }
      },
      {
        title: '最大字数限制',
        type: 'Text',
        options: {
          placeholder: '请输入 最大字数限制',
          type: 'number'
        },
        description: '最大字数限制',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'maxLength');
          },
          set({ data, focusArea }: EditorResult<Data>, value: number) {
            setFormItemProps(
              { data, focusArea },
              'maxLength',
              value === 0 ? undefined : value
            );
          }
        }
      },
      {
        title: '最小字数限制',
        type: 'Text',
        options: {
          placeholder: '请输入 最小字数限制',
          type: 'number'
        },
        description: '最小字数限制',
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: number) {
            setFormItemProps(
              { data, focusArea },
              'minLength',
              value === 0 ? undefined : value
            );
            const item = getFormItem({ data, focusArea });
            const preRules = item.rules || [];
            if (value) {
              if (!item.rules) {
                item.rules = [];
              }
              item.rules = preRules.filter((i) => i !== RuleKeys.MIN);
              item.rules.push(RuleKeys.MIN);
            } else {
              item.rules = preRules.filter((i) => i !== RuleKeys.MIN);
            }
          },
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'minLength');
          }
        }
      }
    ]
  }
];

export { InputItemBaseEditor, InputItemPowerEditor };
