import { inputIds, outputIds } from "../form-container/constants";
import { RuleKeys } from "../utils/validator";
import { getItemSchema } from "./schema";
import { Data, LocationEnum, SizeEnum } from "./types";

export default function ({ data, input, output, slot, setDeclaredStyle }: UpgradeParams<Data>): boolean {

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

  //v1.1.0 -> v1.1.1 兼容操作按钮图标尺寸配置
  data.actions.items.forEach(btn => {
    if (btn.iconConfig.size && btn.iconConfig.size.length === 2) {
      setDeclaredStyle(
        `button[data-form-actions-item="${btn.key}"] .anticon`,
        { fontSize: `${Math.max(...btn.iconConfig.size)}px` }
      );
      setDeclaredStyle(
        `button[data-form-actions-item="${btn.key}"] .ant-image-img`,
        { width: `${btn.iconConfig.size[1]}px`, height: `${btn.iconConfig.size[0]}px` }
      );
      btn.iconConfig.size = [];
    }
  })

  /**
   * @description v1.2.0 新增自定义校验事件
   */

  if (!input.get(inputIds.SET_VALIDATE_INFO)) {
    input.add(inputIds.SET_VALIDATE_INFO, '设置校验状态', {
      type: 'object',
      properties: {
        validateStatus: {
          type: 'enum',
          items: [
            {
              type: 'string',
              value: 'success',
            },
            {
              type: 'string',
              value: 'error',
            },
          ],
        },
        help: {
          type: 'string',
        },
      },
    });
  }
  if (!output.get(outputIds.ON_VALIDATE)) {
    const valueSchema = {
      type: 'array',
      items: getItemSchema(data)
    };
    output.add(outputIds.ON_VALIDATE, '校验触发', valueSchema);
  }
  const cutomRule = data.rules?.find(
    (i) => i.key === RuleKeys.CUSTOM_EVENT
  );
  if (data.rules?.length && !cutomRule) {
    data.rules.push({
      key: RuleKeys.CUSTOM_EVENT,
      status: false,
      visible: true,
      title: '自定义校验',
    });
  }
  //=========== v1.2.0 end ===============

  return true;
}