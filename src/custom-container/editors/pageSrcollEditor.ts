import { BehaviorEnum, Data, InputIds, PositionEnum } from '../constants';

export const PageScrollEditor = [
  {
    title: '锚点滚动配置',
    items: [
      {
        title: '锚点滚动',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useSrcollIntoView;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            data.useSrcollIntoView = value;
            const isHas = input.get(InputIds.ScrollIntoView);
            if (value) {
              !isHas && input.add(InputIds.ScrollIntoView, '锚点滚动', { type: 'any' });
            } else {
              isHas && input.remove(InputIds.ScrollIntoView);
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
