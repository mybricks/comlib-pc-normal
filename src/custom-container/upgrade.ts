import { Data, SlotIds, InputIds } from './constants';
import { getFilterSelector, getFilterSelectorWithId, getLegacyDeclaredStyle } from '../utils/cssSelector';
import { isEmptyObject } from '../utils';

export default function ({
  id,
  data,
  slot,
  input,
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

  const legacyStyle = getLegacyDeclaredStyle(getDeclaredStyle, [`.root${getFilterSelector(id)}`, `.root${getFilterSelectorWithId(id)}`])
  const legacyHoverStyle = getLegacyDeclaredStyle(getDeclaredStyle, [`.root:hover${getFilterSelector(id)}`, `.root:hover${getFilterSelectorWithId(id)}`])

  if(legacyStyle) {
    removeDeclaredStyle(legacyStyle.selector)
    setDeclaredStyle('> .root', {...legacyStyle.css});
  }
  if(legacyHoverStyle){
    removeDeclaredStyle(legacyHoverStyle.selector)
    setDeclaredStyle('> .root:hover', {...legacyHoverStyle.css})
  }

  if (!input.get(InputIds.SetStyle)) {
    input.add(InputIds.SetStyle, "动态设置样式", {
      type: "object",
      properties: {
        background: {
          type: "string",
        },
      },
    });
  }

  if (!input.get(InputIds.ScrollTo)) {
    input.add(InputIds.ScrollTo, '滚动到', { type: 'number' });
  } 

  return true;
}