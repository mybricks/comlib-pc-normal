import { Data } from '../../runtime';
import {
  checkItemType,
  getFormItemProps,
  setFormItemProps,
  getFormItem
} from './utils';

const CheckboxItemBaseEditor = [
  {
    title: '多选框配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['checkbox']);
    },
    items: [
      {
        title: '开启全部选择框',
        type: 'Switch',
        description: '支持多选框全选和反选',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'checkAllOption');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'checkAllOption', value);
          }
        }
      },
      {
        title: '开启多选框折叠展示',
        type: 'Switch',
        description: '多选框过多时，支持折叠展示',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'checkboxFolded');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'checkboxFolded', value);
          }
        }
      },
      {
        title: '默认展开',
        type: 'Switch',
        description: '多选框支持折叠展示时，设置默认展开或折叠',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return getFormItemProps({ data, focusArea }, 'checkboxFolded');
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return (
              getFormItemProps({ data, focusArea }, 'checkboxDefaultUnFold') !==
              false
            );
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps(
              { data, focusArea },
              'checkboxDefaultUnFold',
              value
            );
          }
        }
      },
      {
        title: '添加多选框',
        type: 'Button',
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            const formItem = getFormItem({ data, focusArea });
            if (typeof formItem.checkboxOptions === 'undefined') {
              formItem.checkboxOptions = [];
            }
            const length = formItem.checkboxOptions.length;
            const option = {
              label: `选项${length + 1}`,
              value: `选项${length + 1}`
            };
            formItem.checkboxOptions.push(option);
          }
        }
      }
    ]
  }
];

export { CheckboxItemBaseEditor };
