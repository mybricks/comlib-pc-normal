import { Data, SlotIds, InputIds } from './constants';
import { getFilterSelector, getFilterSelectorWithId, getLegacyDeclaredStyle } from '../utils/cssSelector';
import { isEmptyObject } from '../utils';

export default function ({
  id,
  data,
  slot,
  input,
  output,
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
    output.add('setStyleComplete', '完成', {type: 'any'})
    input.get(InputIds.SetStyle).setRels(['setStyleComplete'])
  }

  if (!input.get(InputIds.ScrollTo)) {
    input.add(InputIds.ScrollTo, '滚动到', { type: 'number' });
    output.add('scrollComplete', '完成', {type: 'any'})
    input.get(InputIds.ScrollTo).setRels(['scrollComplete'])
  }

  /**
   * @description v1.0.19 新增 自动滚动、滚动时间、方向 
  */
  if (typeof data.isAutoScroll === 'undefined') {
    data.isAutoScroll = false;
  }
  if (typeof data.direction === 'undefined') {
    data.direction = "vertical";
  }
  if (typeof data.scrollTime === 'undefined') {
    data.scrollTime = 2000;
  }
  //=========== v1.0.19 end ===============

  /**
   * @description v1.0.21 兼容智能排列，flexDepiction 
  */
  if(data.slotStyle.flexDirection === 'smart'){
    data.slotStyle.position = 'smart'
  }

  /**
   * @description v1.0.22 增加padding 
  */
  if(typeof data.slotStyle.paddingType === 'undefined'){
    data.slotStyle.paddingType = "independentPadding"
  }
  if(typeof data.slotStyle.paddingTop === 'undefined'){
    data.slotStyle.paddingTop = 0
  }
  if(typeof data.slotStyle.paddingBottom === 'undefined'){
    data.slotStyle.paddingBottom = 0
  }
  if(typeof data.slotStyle.paddingLeft === 'undefined'){
    data.slotStyle.paddingLeft = 0
  }
  return true;
}