import { Data, SlotIds } from './constants';

export default function ({ data, slot, config, setDeclaredStyle }: UpgradeParams<Data>): boolean {
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
  //style
  setDeclaredStyle('> .root', { ...data.style });
  setDeclaredStyle('> .root:hover', { ...data.hoverStyle });
  return true;
}