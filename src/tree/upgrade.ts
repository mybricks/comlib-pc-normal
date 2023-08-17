import { Data } from "./constants";

export default function ({
  data,
  input
}: UpgradeParams<Data>): boolean {

  /**
  * @description v1.0.6 节点操作项支持省略样式配置
  */
  if (!data.ellipsisActionBtnsConfig) {
    data.ellipsisActionBtnsConfig = {
      useEllipsis: false,
      maxToEllipsis: 3,
      trigger: [
        'click'
      ]
    };
  }
  //=========== v1.0.6 end ===============

  if (!input.get('setSelectedKeys')) {
    input.add('setSelectedKeys', '设置选中项', { type: 'array', items: { type: 'string' } });
  }

  if (!data.hasOwnProperty('removeConfirm')) {
    data.removeConfirm = "确定删除节点{title}吗（子节点也会被删除）？此操作不可恢复！";
  }

  if (!data.hasOwnProperty('editInline')) {
    data.editInline = true
  }

  /**
    * @description v1.0.10 节点支持图标配置
    */
  if (!data.iconConfig) {
    data.iconConfig = {
      defaultSrc: false,
      size: [14, 14],
      gutter: 8
    };
  }
  //=========== v1.0.10 end ===============

  /**
    * @description v1.0.11 操作项增加图标、动态显示表达式配置
    */
  data.actionBtns.forEach(btn => {
    if (!btn.iconConfig) {
      btn.iconConfig = {
        src: false,
        size: [14, 14],
        gutter: 8
      };
    }
  })
  //=========== v1.0.11 end ===============

  return true;
}