import { BehaviorEnum, Data, PositionEnum } from '../constants';

export default [
  {
    title: '锚点滚动配置',
    items: [
      {
        title: '动画',
        type: 'select',
        description: '点击菜单项，对应内容插槽会滚动到可视区域',
        options: [
          { label: '无', value: BehaviorEnum.Auto },
          { label: '有', value: BehaviorEnum.Smooth }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.scrollConfig.behavior;
          },
          set({ data }: EditorResult<Data>, value: BehaviorEnum) {
            data.scrollConfig.behavior = value;
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
        value: {
          get({ data }: EditorResult<Data>) {
            return data.scrollConfig.block;
          },
          set({ data }: EditorResult<Data>, value: PositionEnum) {
            data.scrollConfig.block = value;
          }
        }
      },
      // {
      //   title: '水平位置',
      //   type: 'select',
      //   options: [
      //     { label: '顶部', value: PositionEnum.Start },
      //     { label: '居中', value: PositionEnum.Center },
      //     { label: '底部', value: PositionEnum.End },
      //     { label: '就近', value: PositionEnum.Nearest }
      //   ],
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.scrollConfig.inline;
      //     },
      //     set({ data }: EditorResult<Data>, value: PositionEnum) {
      //       data.scrollConfig.inline = value;
      //     }
      //   }
      // }
    ]
  }
];
