import BaseEditor from './baseEditor';
import IndexEditor from './indexEditor';

export default {
  '[data-timeline-id]': ({}, cate1) => {
    cate1.title = '常规';
    cate1.items = [...BaseEditor, ...IndexEditor];
    return {
      title: '时间轴节点'
    };
  }
};
