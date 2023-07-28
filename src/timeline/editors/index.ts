import { Data, OutputIds } from '../constants';
import ItemEditor from './item';
import BaseEditor, { DefaultSourceSchema } from './baseEditor';
import StyleEditor from './styleEditor';
import {
  updateSourceSchema,
  updateSlotSchema,
  isEqualSchema,
  createStyleForDot,
  createStyleForTitle,
  createStyleForSubtitle,
  createStyleForDesc
} from './utils';

export default {
  '@resize': {
    options: ['width']
  },
  '@inputConnected'({ input, slots }, fromPin) {
    if (isEqualSchema(fromPin.schema)) {
      updateSourceSchema(input, fromPin.schema);
      updateSlotSchema(slots, fromPin.schema);
    }
  },
  '@inputDisConnected'({ input }) {
    updateSourceSchema(input, DefaultSourceSchema);
  },
  ':root': {
    items({ data }: EditorResult<Data>, ...cate) {
      cate[0].title = '常规';
      cate[0].items = [
        {
          title: '数据源',
          items: BaseEditor
        },
        {
          title: '属性',
          items: StyleEditor
        },
        {
          title: '事件',
          items: [
            {
              type: '_Event',
              options: {
                outputId: OutputIds.ItemClick
              }
            }
          ]
        }
      ];
      return { title: '时间轴' };
    },
    style: [
      createStyleForDot({
        target: 'ul.ant-timeline > li.ant-timeline-item > div.ant-timeline-item-head'
      }),
      createStyleForTitle({
        target:
          'ul.ant-timeline > li.ant-timeline-item > div.ant-timeline-item-content span[data-type="title"]'
      }),
      createStyleForSubtitle({
        target:
          'ul.ant-timeline > li.ant-timeline-item > div.ant-timeline-item-content span[data-type="subTitle"]'
      }),
      createStyleForDesc({
        target:
          'ul.ant-timeline > li.ant-timeline-item > div.ant-timeline-item-content div[data-type="desc"]'
      })
    ]
  },
  ...ItemEditor
};
