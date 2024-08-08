import { Data } from '../constants';
import { getFilterSelector } from '../../utils/cssSelector';
import { InputIds, OutputIds } from '../constants';
export const createStyleForDefault = ({ initValue, target }: StyleModeType<Data>) => ({
  title: '标签',
  initValue,
  options: [
    'border',
    { type: 'font', config: { disableTextAlign: true } },
    { type: 'background', config: { disableBackgroundImage: true } },
  ],
  target,
  domTarget:
    '.root > .ant-tabs > .ant-tabs-nav > .ant-tabs-nav-wrap > .ant-tabs-nav-list > .ant-tabs-tab'
});

export const createFontStyleForActive = ({ initValue, target, title = '标签' }: StyleModeType<Data>) => ({
  title,
  initValue,
  options: [
    { type: 'font', config: { disableTextAlign: true } },
  ],
  target,
});

export const createStyleForActive = ({ initValue, target, title }: StyleModeType<Data>) => ({
  title,
  initValue,
  options: [
    'border',
    { type: 'background', config: { disableBackgroundImage: true } }
  ],
  target,
});

export const createStyleForBar = ({}: StyleModeType<Data> = {}) => ({
  title: '选中条',
  ifVisible({ data }: EditorResult<Data>) {
    return data.type === 'line';
  },
  options: [
    'border',
    { type: 'background', config: { disableBackgroundImage: true } },
    { type: 'size', config: { disableWidth: true } }
  ],
  target: ({ id }: EditorResult<Data>) =>
    `.ant-tabs .ant-tabs-nav .ant-tabs-ink-bar${getFilterSelector(id)}`
});

export const setDynamicTabsIO = (props: EditorResult<Data>) => {
  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        key: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        tooltipText: {
          type: 'string'
        },
        closable: {
          type: 'boolean'
        }
      }
    }
  };
  const { data, input, output } = props;
  if (data.dynamicTabs) {
    input.add(InputIds.SetTabs, '设置标签页数据', schema);
    output.add(OutputIds.SetTabsDone, '完成', schema);
    input.get(InputIds.SetTabs).setRels([OutputIds.SetTabsDone]);
  } else {
    if (input.get(InputIds.SetTabs)) {
      input.remove(InputIds.SetTabs);
    }
    if (output.get(OutputIds.SetTabsDone)) {
      output.remove(OutputIds.SetTabsDone);
    }
  }
};
