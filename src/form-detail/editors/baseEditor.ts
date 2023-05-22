import { uuid } from '../../utils';
import { Data, InputIds, TypeEnum } from '../constants';
import { updateIOSchema } from './utils';
import { updateScopeIOSchema } from './item/baseEditor';

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
    title: '标题',
    type: 'text',
    ifVisible({ data }: EditorResult<Data>) {
      return data.showTitle;
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.title;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.title = value;
      }
    }
  },
  {
    title: '列数',
    type: 'Slider',
    options: [{ max: 12, min: 1, steps: 1, formatter: '/12' }],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.column;
      },
      set({ data }: EditorResult<Data>, value: number) {
        data.column = value;
      }
    }
  },
  //内容做对齐需求
  {
    title: '标签宽度',
    items: [
      {
        title: '自动',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.autoWidth;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.autoWidth = val
          }
        }
      },
      {
        title: '固定宽度',
        type: 'inputNumber',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.autoWidth;
        },
        options: [{ min: 0, width: 120, addonAfter: 'px' }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data?.globalLabelStyle?.width??65];
          },
          set({ data }: EditorResult<Data>, val: number[]) {
            if (!data.globalLabelStyle) {
              data.globalLabelStyle = {};
            }
            data.globalLabelStyle.width = val[0];
          }
        }
      },
    ]
  },
  
  {
    title: '增加描述项',
    type: 'Button',
    value: {
      set({ data, input, output, slots }: EditorResult<Data>) {
        const id = uuid();
        data.items.push({
          id: id,
          label: `描述项${data.items.length + 1}`,
          key: id,
          showLable: true,
          value: `field${data.items.length + 1}`,
          span: 1,
          labelStyle: {
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 1,
            color: '#8c8c8c',
            letterSpacing: 0
          },
          contentStyle: {
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 1,
            color: '#333333',
            letterSpacing: 0
          },
          type: TypeEnum.Text,
          direction: 'horizontal',
          useSuffix: false,
          suffixBtnText: '查看更多',
          schema: {
            type: 'string'
          },
          labelDesc: ''
        });
        updateIOSchema({ data, input, output });
        data.items.map((item)=>{
          if(item.type !== TypeEnum.Text){
            updateScopeIOSchema({ data, item, slots, input });
          }
        })
      }
    }
  }
];
