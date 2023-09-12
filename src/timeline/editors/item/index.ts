import BaseEditor from './baseEditor';
import IndexEditor from './indexEditor';
import {
  createStyleForDot,
  createStyleForTitle,
  createStyleForSubtitle,
  createStyleForDesc
} from '../utils';
import { Data } from '../../constants';

export default {
  '[data-timeline-id]': {
    title: '节点',
    items({}, cate1) {
      cate1.title = '常规';
      cate1.items = [...BaseEditor, ...IndexEditor];
      return {
        title: '时间轴节点'
      };
    },
    style: [
      createStyleForDot({
        target({ focusArea }: EditorResult<Data>) {
          const { timelineId } = focusArea.dataset;
          const selector = `ul.ant-timeline > li[data-timeline-id="${timelineId}"] > div.ant-timeline-item-head`;
          return selector;
        }
      }),
      createStyleForTitle({
        target({ focusArea }: EditorResult<Data>) {
          const { timelineId } = focusArea.dataset;
          const selector = `ul.ant-timeline > li[data-timeline-id="${timelineId}"] > div.ant-timeline-item-content span[data-type="title"]`;
          return selector;
        }
      }),
      createStyleForSubtitle({
        target({ focusArea }: EditorResult<Data>) {
          const { timelineId } = focusArea.dataset;
          const selector = `ul.ant-timeline > li[data-timeline-id="${timelineId}"] > div.ant-timeline-item-content span[data-type="subTitle"]`;
          return selector;
        }
      }),
      createStyleForDesc({
        target({ focusArea }: EditorResult<Data>) {
          const { timelineId } = focusArea.dataset;
          const selector = `ul.ant-timeline > li[data-timeline-id="${timelineId}"] > div.ant-timeline-item-content div[data-type="desc"]`;
          return selector;
        }
      })
    ]
  }
};
