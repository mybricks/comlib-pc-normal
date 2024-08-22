/**
 * @description 根据 layout 编辑器返回值，设置插槽布局类型
 * 
 */
const setSlotLayout = (slot, val) => {
  if (!slot) return;

  if (val.position === 'smart') {
    slot.setLayout('smart');
  } else if (val.position === 'absolute') {
    slot.setLayout(val.position);
  } else if (val.display === 'flex') {
    if (val.flexDirection === 'row') {
      slot.setLayout('flex-row');
    } else if (val.flexDirection === 'column') {
      slot.setLayout('flex-column');
    }
  }
};

export {
  setSlotLayout
}