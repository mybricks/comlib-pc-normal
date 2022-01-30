import { Data } from '../../runtime';
import { checkItemType, getFormItemProps, setFormItemProps } from './utils';

const getNumber = (val) => {
  if (val !== '0' && !val) {
    return undefined;
  }
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};
const inputNumber = [
  {
    title: '数字输入框配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['inputNumber']);
    },
    items: [
      {
        title: '最大值',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return getFormItemProps({ data, focusArea }, 'max');
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            return setFormItemProps(
              { data, focusArea },
              'max',
              getNumber(value)
            );
          }
        }
      },
      {
        title: '最小值',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return getFormItemProps({ data, focusArea }, 'min');
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            return setFormItemProps(
              { data, focusArea },
              'min',
              getNumber(value)
            );
          }
        }
      },
      {
        title: '步长',
        type: 'Text',
        description: '默认为1，只允许设置大于0的整数',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return getFormItemProps({ data, focusArea }, 'step');
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const num = parseInt(value, 10);
            return setFormItemProps(
              { data, focusArea },
              'step',
              isNaN(num) || num <= 0 ? undefined : num
            );
          }
        }
      },
      {
        title: '隐藏上下按钮',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return getFormItemProps({ data, focusArea }, 'hideHandler');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            setFormItemProps({ data, focusArea }, 'hideHandler', value);
          }
        }
      }
    ]
  }
];

export default inputNumber;
