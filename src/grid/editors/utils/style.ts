import { Data } from '../../constants';

export const createStyleForGrid = ({ target }: StyleTargetType<Data> = {}) => ({
  title: '容器',
  options: ['background', 'Border'],
  target
});

export const createStyleForRow = ({ target }: StyleTargetType<Data> = {}) => ({
  title: '行',
  options: [{ type: 'background', config: { disableBackgroundImage: true } }],
  target
});

export const createStyleForCol = ({ target }: StyleTargetType<Data>) => ({
  title: '单元格',
  options: ['background', 'Border', 'Padding', { type: 'size', config: { disableWidth: true } }],
  target
});
