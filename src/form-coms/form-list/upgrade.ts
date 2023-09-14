import { Data, LocationEnum, SizeEnum } from "./types";

export default function ({ data, input, output, slot }: UpgradeParams<Data>): boolean {

  /**
   * @description v1.1.0
   */

  /** 1. 作用域支持添加自定义内容项组件 */
  if (!data.additionalItems) data.additionalItems = [];
  slot.get('formItems').setSchema([
    "mybricks.normal-pc.form-container/form-item",
    "mybricks.normal-pc.form-container/form-addition-container"
  ]);

  /** 2. 支持标题样式配置 */
  if (data.showLabel === undefined) {
    data.showLabel = data.items.some(item => item.hiddenLabel === false);
    data.labelWidth = 98;
    data.items.forEach(item => {
      if (item.showLabel === undefined) {
        if (item.hiddenLabel === true) {
          item.showLabel = 'default';
        } else {
          item.showLabel = true;
        }
      }
    });
  }

  /** 3. 支持操作项尺寸、图标、动态显隐配置 */
  data.actions.items.forEach(btn => {
    if (!btn.iconConfig) {
      btn.iconConfig = {
        src: false,
        size: [14, 14],
        gutter: 8,
        location: LocationEnum.FRONT
      }
    }
    if (btn.size === undefined) {
      btn.size = SizeEnum.Middle;
    }
    if (['add', 'remove'].includes(btn.key) && !btn.displayExpression) {
      if (btn.key === 'add') {
        btn.displayExpression = '{item.isLast}';
      }
      if (btn.key === 'remove') {
        btn.displayExpression = '{item.listLength !== 0}';
      }
    }
  });

  /** 4. 支持列表项样式配置 */
  if (!data.listItemMargin) {
    data.listItemMargin = [0, 0, 0, 0];
  }

  //=========== v1.1.0 end ===============

  return true;
}