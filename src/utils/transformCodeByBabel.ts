import { utils } from '@fangzhou/com-utils';

interface Props {
  presets: string[];
}
export const transformCodeByBabel = (val: string, props?: Props) => {
  if (!(window as any).Babel || typeof val !== 'string') {
    return val;
  }
  try {
    return utils.transformCodeByBabel(val, props);
  } catch (e) {
    // return val;
  }
  return val;
};
