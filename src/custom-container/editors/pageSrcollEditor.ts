import { BehaviorEnum, Data, InputIds, PositionEnum } from '../constants';

export const PageScrollEditor = [
  {
    title: '锚点滚动',
    items: [
      {
        title: '锚点滚动',
        type: 'Switch',
        description: '是否使用锚点滚动',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useSrcollIntoView;
          },
          set({ data, input, output }: EditorResult<Data>, value: boolean) {
            data.useSrcollIntoView = value;
            const isHas = input.get(InputIds.ScrollIntoView);
            if (value) {
              if (!isHas) {
                input.add(InputIds.ScrollIntoView, '锚点滚动', { type: 'any' });
                output.add(`${InputIds.ScrollIntoView}Done`, '锚点滚动结束', { type: 'any' });
                input.get(InputIds.ScrollIntoView).setRels([`${InputIds.ScrollIntoView}Done`]);
              }
            } else {
              if (isHas) {
                input.remove(InputIds.ScrollIntoView);
                output.remove(`${InputIds.ScrollIntoView}Done`);
              }
            }
          }
        }
      },
      {
        title: '锚点ID',
        type: 'Text',
        ifVisible({ data }: EditorResult<Data>) {
          return data.useSrcollIntoView;
        },
        options: {
          placeholder: '例如：id1'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data?.id ?? '';
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.id = value;
          }
        }
      },
      {
        title: '动画',
        type: 'select',
        description: '是否使用动画',
        options: [
          { label: '无', value: BehaviorEnum.Auto },
          { label: '有', value: BehaviorEnum.Smooth }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.useSrcollIntoView;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.behavior || BehaviorEnum.Auto;
          },
          set({ data }: EditorResult<Data>, value: BehaviorEnum) {
            data.behavior = value;
          }
        }
      },
      {
        title: '垂直位置',
        type: 'select',
        description: '锚点滚动定位到目标元素的垂直位置',
        options: [
          { label: '顶部', value: PositionEnum.Start },
          { label: '居中', value: PositionEnum.Center },
          { label: '底部', value: PositionEnum.End },
          { label: '就近', value: PositionEnum.Nearest }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.useSrcollIntoView;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.block || PositionEnum.Start;
          },
          set({ data }: EditorResult<Data>, value: PositionEnum) {
            data.block = value;
          }
        }
      },
      {
        title: '水平位置',
        type: 'select',
        description: '锚点滚动定位到目标元素的水平位置',
        options: [
          { label: '顶部', value: PositionEnum.Start },
          { label: '居中', value: PositionEnum.Center },
          { label: '底部', value: PositionEnum.End },
          { label: '就近', value: PositionEnum.Nearest }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.useSrcollIntoView;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.inline || PositionEnum.Nearest;
          },
          set({ data }: EditorResult<Data>, value: PositionEnum) {
            data.inline = value;
          }
        }
      }
    ]
  }
];
