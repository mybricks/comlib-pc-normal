import { Data } from '../../runtime';
import { checkItemType, getFormItemProps, setFormItemProps } from './utils';

const cascaderItem = [
 
  {
    title: '级联选择配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return checkItemType({ data, focusArea }, ['cascader']);
    },
    items: [
      {
        title: '允许选择任意一级',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'changeOnSelect');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'changeOnSelect', value);
          }
        }
      },
      {
        title: '清除内容图标',
        type: 'Switch',
        description: '开启后可点击清除内容',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkItemType({ data, focusArea }, ['cascader']);
        },
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
        title: '支持搜索',
        type: 'Switch',
        description: '开启后可输入内容搜索',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return checkItemType({ data, focusArea }, ['cascader']);
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            return getFormItemProps({ data, focusArea }, 'showSearch');
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            setFormItemProps({ data, focusArea }, 'showSearch', value);
          }
        }
      },
    ]
  }
];

export default cascaderItem;
