import { Data, InputIds, OutputIds } from './constants';
// import { setSlotLayout } from './editor';
import { setSlotLayout } from '../utils/editorTools'
import { descriptionUp } from '../form-coms/utils/descriptionUp';
import { descriptionUpList } from './constants';

const TabListSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        title: '卡片id',
        type: 'string'
      },
      key: {
        title: '卡片key',
        type: 'string'
      },
      name: {
        title: '卡片标题',
        type: 'string'
      }
    }
  }
}

/**
 * @description v1.0.8 -> v1.0.9 增加通知类型、尺寸、位置偏移、状态
 */
const upgradeItemInfo = (item) => {
  if (typeof item.infoType === 'undefined') {
    item.infoType = 'text';
  }
  if (typeof item.size === 'undefined') {
    item.size = 'default';
  }
  if (typeof item.offset === 'undefined') {
    item.offset = [0, 0];
  }
  if (typeof item.status === 'undefined') {
    item.status = 'error';
  }
  if (typeof item.showZero === 'undefined') {
    item.showZero = false;
  }
}

export default function ({
  data,
  input,
  output,
  style,
  setDeclaredStyle,
  slot,
  registerPermission,
}: UpgradeParams<Data>): boolean {

  data.tabList.forEach((item) => {
    /**
     * @description v1.0.7 -> v1.0.8 权限能力改版
     * 把 permissionKey 转化成新版 permission 数据
     */
    // @ts-expect-error permissionKey 已废弃，type 中不存在此字段
    if (item.permissionKey) {
      const { id } = registerPermission({
        // @ts-expect-error permissionKey 已废弃，type 中不存在此字段
        code: item.permissionKey,
        title: '权限名称'
      });
      item.permission = { id };
    }

    upgradeItemInfo(item)

    /**
     * @description v1.0.28 fix: 新增卡片slotStyle默认值问题
     */
    const slotInstance = slot.get(item.id);
    if (slotInstance.getLayout() === 'smart' && data.slotStyle.position !== 'smart') {
      setSlotLayout(slotInstance, data.slotStyle);
    }


    if (input.get(item.key) && !output.get(`${item.key}Done`)) {
      output.add(`${item.key}Done`, '通知数', { type: 'follow' });
      input.get(item.key).setRels([`${item.key}Done`]);
    }
    // =========== 1.0.49 end ===============

  });

  if (!('hideAdd' in data)) {
    data.hideAdd = true;
  }

  const getTabs = input.get(InputIds.GetTabs);
  if (!getTabs) {
    input.add(InputIds.GetTabs, '获取卡片列表', { type: 'any' });
    const getTabsDone = output.get(OutputIds.GetTabsDone);
    if (!getTabsDone) {
      output.add(OutputIds.GetTabsDone, '卡片数据', TabListSchema);
      input.get(InputIds.GetTabs).setRels([OutputIds.GetTabsDone])
    }
  }

  const addTab = output.get(OutputIds.AddTab)
  if (!addTab) {
    output.add(OutputIds.AddTab, '卡片新增', TabListSchema)
  }

  const removeTab = output.get(OutputIds.RemoveTab)
  if (!removeTab) {
    output.add(OutputIds.RemoveTab, '卡片删除', TabListSchema)
  }

  if (!data.slotStyle) {
    data.slotStyle = {};
  }

  // /**
  // * @description v1.0.26 fix: slotStyle默认值问题
  // */
  // if (data.slotStyle?.position === 'smart' && data.slotStyle?.display === 'flex') {
  //   data.slotStyle.display = 'block';
  // }
  //=========== v1.0.26 end ===============

  // /**
  // * @description v1.0.28 fix: 新增卡片slotStyle默认值问题
  // */
  // data.tabList.forEach(item => {
  //   const slotInstance = slot.get(item.id);
  //   if (slotInstance.getLayout() === 'smart' && data.slotStyle.position !== 'smart')
  //     setSlotLayout(slotInstance, data.slotStyle);
  // })
  //=========== v1.0.28 end ===============

  /**
  * @description v1.0.33 fix: 修复卡片激活状态下字体颜色配置不生效问题
  */
  const activeTabSelector = `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab-active:not(#{id} *[data-isslot=\"1\"] *)`;
  const activeTabFontSelector = `.ant-tabs .ant-tabs-nav-wrap .ant-tabs-tab-active:not(#{id} *[data-isslot=\"1\"] *) div.ant-tabs-tab-btn`
  const activeTabStyle = style.styleAry?.find?.(item => item.selector === activeTabSelector);
  const activeFontColor = activeTabStyle?.css?.color;
  if (activeFontColor) {
    setDeclaredStyle(activeTabFontSelector, { color: activeFontColor });
  }

  //=========== v1.0.33 end ===============

  /**
   * @description v1.0.38 新增description
  */
  descriptionUp(descriptionUpList, input, output);

  //=========== 1.0.38 end ===============

  // data.tabList.forEach(item => {
  //   if (input.get(item.key) && !output.get(`${item.key}Done`)) {
  //     output.add(`${item.key}Done`, '通知数', { type: 'follow' });
  //     input.get(item.key).setRels([`${item.key}Done`]);
  //   }
  // })
  // =========== 1.0.49 end ===============

  /**
  * @description v1.0.55 feat: 增加删除卡片输入项
  */
  if (!removeTab) {
    input.add("removeTab", '删除卡片', {
      "type": "object",
      "properties": {
        "key": {
          "title": "卡片 key",
          "type": "string",
          "description": "卡片的 key"
        },
        "index": {
          "title": "卡片下标",
          "type": "number",
          "description": "卡片的下标"
        }
      }
    });
  }
  // =========== 1.0.55 end ===============

  return true;
}
