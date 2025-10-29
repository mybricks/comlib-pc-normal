import { Data, InputIds, ScopeSlotIds, TypeEnum } from '../constants';
import { createItem, updateIOSchema } from './utils';
import { updateScopeIOSchema } from './item/baseEditor';

export const BaseEditor = [
  {
    title: '显示冒号',
    type: 'Switch',
    description: '开启后，描述列表的每一项都会显示冒号',
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
    description: '开启后，描述列表会显示标题',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.showTitle;
      },
      set({ data, input, output }: EditorResult<Data>, value: boolean) {
        data.showTitle = value;
        if (value) {
          input.add(InputIds.SetTitle, '设置标题', { type: 'string' });
          output.add("setTitleComplete", '完成', { type: 'any' });
          input.get(InputIds.SetTitle).setRels(["setTitleComplete"]);
        } else {
          input.remove(InputIds.SetTitle);
          output.remove("setTitleComplete");
        }
      }
    }
  },
  {
    title: '标题',
    type: 'text',
    description: '描述列表的标题',
    options: {
      locale: true
    },
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
    },
    binding: {
      with: 'data.title',
      schema: {
        type: 'string'
      }
    }
  },
  {
    title: '右上角操作区',
    type: 'Switch',
    description: '开启后，支持在描述列表右上角自定义内容',
    value: {
      get({ data }: EditorResult<Data>) {
        return !!data.showExtra;
      },
      set({ data, slot, input }: EditorResult<Data>, value: boolean) {
        if (value) {
          slot.add(ScopeSlotIds.UpperRightArea, '右上角操作区');
        } else {
          slot.remove(ScopeSlotIds.UpperRightArea);
        }
        data.showExtra = value;
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
  {
    title: '移动端列数',
    type: 'Slider',
    options: [{ max: 12, min: 1, steps: 1, formatter: '/12' }],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.mobileColumn;
      },
      set({ data }: EditorResult<Data>, value: number) {
        data.mobileColumn = value;
      }
    }
  },
  {
    title: '增加描述项',
    type: 'Button',
    description: '点击增加描述项',
    value: {
      set({ data, input, output, slots }: EditorResult<Data>) {
        data.items.push(createItem({ data }));
        updateIOSchema({ data, input, output });
        data.items.map((item) => {
          if (item.type !== TypeEnum.Text) {
            updateScopeIOSchema({ data, item, slots, input });
          }
        })
      }
    }
  }
];
