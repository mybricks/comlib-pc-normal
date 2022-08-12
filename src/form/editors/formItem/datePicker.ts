import moment from 'moment';
import { checkItemType, getFormItemProps, setFormItemProps } from './utils';
import { Data } from '../../runtime';

const datePickerItem = [
  {
    title: '日期选择配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['datePicker', 'rangePicker']);
    },
    items: [
      {
        title: '日期选择类型',
        type: 'Select',
        options: [
          { label: '日期', value: 'date' },
          { label: '周', value: 'week' },
          { label: '月份', value: 'month' },
          { label: '季度', value: 'quarter' },
          { label: '年份', value: 'year' }
        ],
        value: {
          set(
            { data, focusArea }: EditorResult<Data>,
            value: 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined
          ) {
            if (!focusArea) return;
            setFormItemProps({ data, focusArea }, 'picker', value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return getFormItemProps({ data, focusArea }, 'picker') || 'date';
          }
        }
      },
      {
        title: '时间选择',
        type: 'Switch',
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            setFormItemProps({ data, focusArea }, 'showTime', value);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return !!getFormItemProps({ data, focusArea }, 'showTime');
          }
        }
      },
      {
        title: '默认时间',
        type: 'Text',
        description: '不设置默认使用当前时间',
        options: {
          placeholder: '例：00:00:00'
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return (
            !!getFormItemProps({ data, focusArea }, 'showTime') &&
            checkItemType({ data, focusArea }, ['datePicker'])
          );
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            setFormItemProps({ data, focusArea }, 'showTime', {
              defaultValue: moment(value, 'HH:mm:ss').isValid()
                ? value
                : undefined
            });
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const showTime: any = getFormItemProps(
              { data, focusArea },
              'showTime'
            );
            if (typeof showTime?.defaultValue === 'string') {
              return showTime?.defaultValue;
            }
            if (typeof showTime !== 'object') {
              setFormItemProps({ data, focusArea }, 'showTime', {});
            }
            return undefined;
          }
        }
      },
      {
        title: '默认时间',
        type: 'Text',
        description: '用 - 分割开始时间和结束时间，不设置默认使用当前时间',
        options: {
          placeholder: '例：00:00:00-23:59:59'
        },
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return (
            !!getFormItemProps({ data, focusArea }, 'showTime') &&
            checkItemType({ data, focusArea }, ['rangePicker'])
          );
        },
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const arr = value.split('-').map((item) => item.trim());
            const isValid = !arr.some((item) => item && !moment(item, 'HH:mm:ss').isValid());
            setFormItemProps({ data, focusArea }, 'showTime', {
              defaultValue: isValid ? arr : undefined
            });
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const showTime: any = getFormItemProps(
              { data, focusArea },
              'showTime'
            );
            const defaultValue = showTime?.defaultValue;
            if (Array.isArray(defaultValue)) {
              return defaultValue.join('-');
            }
            if (typeof showTime !== 'object') {
              setFormItemProps({ data, focusArea }, 'showTime', {});
            }
            return undefined;
          }
        }
      }
    ]
  }
];

export default datePickerItem;
