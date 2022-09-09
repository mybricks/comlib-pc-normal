import ItemEditor from './item';
import BaseEditor from './baseEditor';
import StyleEditor from './styleEditor';
import EventEditor from './eventEditor';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': ({}, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [...BaseEditor];

    cate2.title = '样式';
    cate2.items = [...StyleEditor];

    cate3.title = '事件';
    cate3.items = [...EventEditor];

    return { title: '时间轴' };
  },
  ...ItemEditor
};
