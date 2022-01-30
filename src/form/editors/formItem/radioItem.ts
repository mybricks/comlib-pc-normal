import { uuid } from '../../../utils';
import { Data } from '../../runtime';
import {
  checkItemType,
  getFormItemProps,
  setFormItemProps,
  getFormItem
} from './utils';

type RadioOptionType = 'default' | 'button' | 'buttonGrp';
const RadioItemBaseEditor = [
  {
    title: '单选框配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['radio']);
    },
    items: [
      {
        title: '单选框风格',
        type: 'Select',
        options: [
          { label: '默认', value: 'default' },
          { label: '按钮', value: 'button' },
          { label: '按钮组合', value: 'buttonGrp' }
        ],
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return (
              getFormItemProps({ data, focusArea }, 'radioOptionType') ||
              'default'
            );
          },
          set({ data, focusArea }: EditorResult<Data>, value: RadioOptionType) {
            setFormItemProps({ data, focusArea }, 'radioOptionType', value);
          }
        }
      },
      {
        title: '添加单选框',
        type: 'Button',
        value: {
          set({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const formItem = getFormItem({ data, focusArea });
            if (typeof formItem.radioOptions === 'undefined') {
              formItem.radioOptions = [];
            }
            const length = formItem.radioOptions.length;
            const option = {
              label: `选项${length + 1}`,
              value: `选项${length + 1}`,
              key: uuid()
            };

            formItem.radioOptions.push(option);
          }
        }
      }
    ]
  }
];

export { RadioItemBaseEditor };
