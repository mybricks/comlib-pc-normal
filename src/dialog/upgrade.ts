import { Data, OutputIds } from './constants';

export default function ({
  data,
  input,
  output
}: UpgradeParams<Data>): boolean {

  const schema = {
    type: 'any'
  };

  /**
   * @description v1.1.4 增加关闭回调事件
   */
  if (!output.get(OutputIds.AfterClose)) {
    output.add(OutputIds.AfterClose, '关闭回调', schema)
  }

  /**
   * @description v1.1.8 增加maskClosable配置项
   */
  if (data.maskClosable === undefined) {
    data.maskClosable = false;
  }

  data.footerBtns.forEach(btn => {
    /**
    * @description v1.1.11 操作项默认开启动态显隐、禁用启用
    */
    const { dynamicHidden, dynamicDisabled, autoClose } = btn;
    if (!dynamicHidden) {
      btn.dynamicDisabled = true;
      input.add(`hidden${btn.id}`, `隐藏-${btn.title}按钮`, schema);
      input.add(`show${btn.id}`, `显示-${btn.title}按钮`, schema);
    }
    if (!dynamicDisabled) {
      btn.dynamicDisabled = true;
      input.add(`disable${btn.id}`, `禁用-${btn.title}按钮`, schema);
      input.add(`enable${btn.id}`, `启用-${btn.title}按钮`, schema);
    }

    /**
     * @description v1.1.12 底部按钮增加“自动关闭”配置项
     */
    if (autoClose === undefined) {
      btn.autoClose = true;
    }

  });

  return true;
}