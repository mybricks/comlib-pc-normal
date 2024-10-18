import { Data, OutputIds } from '../constants';

export const EventEditor = [
  {
    title: '事件',
    items: [
      {
        title: '点击',
        type: '_Event',
        options: {
          outputId: OutputIds.Click
        }
      },
      {
        title: '鼠标移入',
        type: '_Event',
        options: {
          outputId: OutputIds.MouseEnter
        }
      },
      {
        title: '鼠标移出',
        type: '_Event',
        options: {
          outputId: OutputIds.MouseLeave
        }
      },
      {
        title: '当滚动到顶部',
        type: '_Event',
        options: {
          outputId: 'scrollTop'
        }
      },
      {
        title: '当滚动到底部',
        type: '_Event',
        options: {
          outputId: 'scrollBottom'
        }
      }
    ]
  }
];
