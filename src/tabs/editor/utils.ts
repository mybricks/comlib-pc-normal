import { Data } from '../constants';
export const createStyleForDefault = ({ initValue, target }: StyleModeType<Data>) => ({
  title: '默认标签',
  initValue,
  options: [
    { type: 'font', config: { disableTextAlign: true } },
    { type: 'background', config: { disableBackgroundImage: true } }
  ],
  target,
  domTarget: '.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab'
});

export const createStyleForActive = ({ initValue, target }: StyleModeType<Data>) => ({
  title: '选中标签',
  initValue,
  options: [
    { type: 'font', config: { disableTextAlign: true } },
    { type: 'background', config: { disableBackgroundImage: true } }
  ],
  target
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
  target: '.ant-tabs .ant-tabs-nav .ant-tabs-ink-bar'
});
