import { Data } from '../../constants';

export const createStyleForGrid = ({ target }: StyleModeType<Data> = {}) => ({
  title: '容器',
  options: ['background', 'Border'],
  target
});

export const createStyleForRow = ({ target }: StyleModeType<Data> = {}) => ({
  title: '行',
  options: [{ type: 'background', config: { disableBackgroundImage: true } }],
  target
});

export const createStyleForCol = ({ target }: StyleModeType<Data>) => ({
  title: '单元格',
  options: ['background', 'Border', 'Padding', { type: 'size', config: { disableWidth: true } }],
  target
});
