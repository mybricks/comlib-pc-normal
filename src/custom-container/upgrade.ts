import { Data, SlotIds } from './constants';
import { getFilterSelector } from '../utils/cssSelector';
import { isEmptyObject } from '../utils';

export default function ({
  id,
  data,
  slot,
  config,
  setDeclaredStyle,
  getDeclaredStyle,
  removeDeclaredStyle
}: UpgradeParams<Data>): boolean {
  const styleConfig = config.get('style');
  if (styleConfig) {
    styleConfig.setBinding('data.legacyConfigStyle');
  }
  /**
   * @description v1.0.1 slotStyle兼容
   */
  if (!data.slotStyle) {
    const contentSlot = slot.get(SlotIds.Content);
    const flexDirection = contentSlot?.getLayout()?.split('-')?.[1] || 'row';
    const alignItems = contentSlot?.getAlignItems() || 'flex-start';
    const justifyContent = contentSlot?.getJustifyContent() || 'flex-start';
    data.slotStyle = {
      display: 'flex',
      position: 'inherit',
      flexWrap: 'nowrap',
      flexDirection,
      alignItems,
      justifyContent
    };
  }
  //style upgrade
  if (!isEmptyObject(data.style)) {
    setDeclaredStyle(`.root${getFilterSelector(id)}`, { ...data.style });
    data.style = {};
  }
  if (!isEmptyObject(data.hoverStyle)) {
    setDeclaredStyle(`.root:hover${getFilterSelector(id)}`, { ...data.hoverStyle });
    data.hoverStyle = {};
  }

  if (data.hasOwnProperty('overflowX')) {
    setDeclaredStyle(`.root${getFilterSelector(id)}`, { overflowX: data.overflowX });
    delete data.overflowX;
  }

  if (data.hasOwnProperty('overflowY')) {
    setDeclaredStyle(`.root${getFilterSelector(id)}`, { overflowY: data.overflowY });
    delete data.overflowY;
  }

  if (data.hasOwnProperty('useOverflowUnset') && data.useOverflowUnset) {
    setDeclaredStyle(`.root${getFilterSelector(id)}`, { overflow: 'unset' });
    delete data.useOverflowUnset;
  }

  const preStyle = getDeclaredStyle(`.root${getFilterSelector(id)}`);
  const preHoverStyle = getDeclaredStyle(`.root:hover${getFilterSelector(id)}`);

  let css: React.CSSProperties = {}, hoverCss: React.CSSProperties = {};
  
  if (preStyle) {
    css = { ...preStyle.css };
    removeDeclaredStyle(`.root${getFilterSelector(id)}`);
    setDeclaredStyle('> .root', css);
  }
  if (preHoverStyle) {
    hoverCss = { ...preHoverStyle.css };
    removeDeclaredStyle(`.root:hover${getFilterSelector(id)}`);
    setDeclaredStyle('> .root:hover', hoverCss);
  }

  return true;
}