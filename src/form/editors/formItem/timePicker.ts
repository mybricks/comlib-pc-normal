import moment from 'moment';
import { checkItemType, getFormItemProps, setFormItemProps } from './utils';
import { Data } from '../../runtime';

const timePickerItem = [
  {
    title: '时间选择配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['timePicker', 'timeRangePicker']);
    },
    items: [
      {
        title: '默认时间',
        type: 'Text',
        options: {
          placeholder: '例：00:00:00'
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return (
            checkItemType({ data, focusArea }, ['timePicker'])
          );
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const result = moment(value, 'h:m:s');
            setFormItemProps({ data, focusArea }, 'defaultValue', result.isValid() ? value : undefined);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const defaultValue: any = getFormItemProps(
              { data, focusArea },
              'defaultValue'
            );
            if (typeof defaultValue === 'string') {
              return defaultValue;
            }
            return undefined;
          }
        }
      },
      {
        title: '默认时间',
        type: 'Text',
        description: '用 - 分割开始时间和结束时间',
        options: {
          placeholder: '例：00:00:00-23:59:59'
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return (
            checkItemType({ data, focusArea }, ['timeRangePicker'])
          );
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const arr = value.split('-').map((item) => item.trim());
            const isValid = !arr.some((item) => item && !moment(item, 'h:m:s').isValid());
            setFormItemProps({ data, focusArea }, 'defaultValue', isValid ? arr : undefined);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const defaultValue: any = getFormItemProps(
              { data, focusArea },
              'defaultValue'
            );
            if (Array.isArray(defaultValue)) {
              return defaultValue.join('-');
            }
            return undefined;
          }
        }
      }
    ]
  }
];

export default timePickerItem;