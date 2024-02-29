import { Data, InputIds, OutputIds, ShapeEnum, SizeEnum, TypeEnum } from './constants';
import { isEmptyObject } from '../utils';

export default function ({ input, output, data, setDeclaredStyle, removeDeclaredStyle, getDeclaredStyle }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.3 , 新增按钮动态标题
   */
  const valueSchema = {
    type: 'string'
  };
  if (!input.get('dynamicTitle')) {
    input.add('dynamicTitle', '设置标题', valueSchema);
  }

  /**
   * @description v1.0.5 , fix setSchema问题
   */
  const click = output.get(OutputIds.Click);
  const dbClick = output.get(OutputIds.DbClick);
  if (data.dataType === 'number') {
    click.setSchema({
      type: 'number'
    });
    dbClick.setSchema({
      type: 'number'
    });
  }

  /**
   * @description v1.0.5->1.0.6 , 增加图标
   */
  if (typeof data.useIcon === 'undefined') {
    data.useIcon = false;
  }
  if (typeof data.isCustom === 'undefined') {
    data.isCustom = false;
  }
  if (typeof data.icon === 'undefined') {
    data.icon = 'HomeOutlined';
  }
  if (typeof data.src === 'undefined') {
    data.src = '';
  }
  if (typeof data.showText === 'undefined') {
    data.showText = true;
  }
  if (typeof data.iconDistance === 'undefined') {
    data.iconDistance = 8;
  }
  if (typeof data.iconLocation === 'undefined') {
    data.iconLocation = 'front';
  }
  if (typeof data.contentSize === 'undefined') {
    data.contentSize = [14, 14];
  }
  if (typeof data.type === 'undefined') {
    data.type = TypeEnum.Primary;
  }
  if (typeof data.size === 'undefined') {
    data.size = SizeEnum.Middle;
  }
  if (typeof data.shape === 'undefined') {
    data.shape = ShapeEnum.Default;
  }

  /**
   * @description v1.0.7 style编辑器改造
   */
  if (!isEmptyObject(data.style)) {
    if (typeof data.style.fontSize === 'number') data.style.fontSize = data.style.fontSize + 'px';
    setDeclaredStyle(`.button`, data.style);
    data.style = {};
  }

  /**
   * @description v1.0.8 , 新增按钮动态禁用
   */
  if (!input.get(InputIds.Disabled)) {
    input.add(InputIds.Disabled, '设置禁用', {
      type: 'boolean'
    });
  }

  /**
   * @description v1.0.17 「style 配置项 => 风格」删除选项「危险按钮」，新增「style 配置项 => 危险按钮」
   */
  if(data.type === TypeEnum.Danger) {
    data.type = TypeEnum.Primary;
    data.danger = true;
  }


  /**
   * @description v1.0.18 调整激活态样式 target
   */
  if(!data.asMapArea && data.type !== TypeEnum.Link) {
    const preStyle = getDeclaredStyle(`button.ant-btn:not([disabled]):active`);
    removeDeclaredStyle(`button.ant-btn:not([disabled]):active`);
    removeDeclaredStyle(`button.ant-btn:not([disabled]):active > span`);
    if(preStyle?.css){
      setDeclaredStyle(`button.ant-btn:not([disabled]):active`, preStyle.css);
    }
  }

  //1.0.21 -> 1.0.22 设置标题、禁用、输出数据完成
  if (!output.get("setDynamicTitleDone")) {
    output.add("setDynamicTitleDone", "设置标题完成", { type: 'string' });
  }
  if (output.get("setDynamicTitleDone") &&
    input.get("dynamicTitle") &&
    !input.get("dynamicTitle")?.rels?.includes("setDynamicTitleDone")) {
    input.get("dynamicTitle").setRels(["setDynamicTitleDone"]);
  }

  if (!output.get("setDynamicDisabledDone")) {
    output.add("setDynamicDisabledDone", "设置禁用完成", { type: 'boolean' });
  }
  if (output.get("setDynamicDisabledDone") &&
    input.get("dynamicDisabled") &&
    !input.get("dynamicDisabled")?.rels?.includes("setDynamicDisabledDone")) {
    input.get("dynamicDisabled").setRels(["setDynamicDisabledDone"]);
  }

  if(data.dataType = "external" && !output.get("setExternalDone") && input.get("external")){
    output.add("setExternalDone", '设置输出数据完成', { type: 'string' });
    input.get("external").setRels(["setExternalDone"]);
  }
  return true;
}
