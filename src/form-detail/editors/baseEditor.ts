import { uuid } from '../../utils';
import { Data, InputIds, TypeEnum } from '../constants';
import { updateIOSchema } from './utils';

export const BaseEditor = [
  {
    title: '显示冒号',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.colon;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        data.colon = value;
      }
    }
  },
  {
    title: '显示标题',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.showTitle;
      },
      set({ data, input }: EditorResult<Data>, value: boolean) {
        data.showTitle = value;
        if (value) input.add(InputIds.SetTitle, '设置标题', { type: 'string' });
        else input.remove(InputIds.SetTitle);
      }
    }
  },
  {
    title: '增加描述项',
    type: 'Button',
    value: {
      set({ data, input, output }: EditorResult<Data>) {
        const id = uuid();
        data.items.push({
          id: id,
          label: `新增描述项`,
          key: id,
          value: ``,
          span: 1,
          labelStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            lineHeight: 1,
            color: '#8c8c8c',
            letterSpacing: 0
          },
          contentStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            lineHeight: 1,
            color: '#333333',
            letterSpacing: 0
          },
          type: TypeEnum.Text,
          direction: 'horizontal',
          useSuffix: false,
          suffixBtnText: '查看更多'
        });
        updateIOSchema({ data, input, output });
      }
    }
  },
];
