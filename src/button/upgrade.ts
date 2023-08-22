import { Data, InputIds, OutputIds, ShapeEnum, SizeEnum, TypeEnum } from './constants';
import { isEmptyObject } from '../utils';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
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
   * @description v1.0.15 , 新增按钮动态禁用
   */
  if (!input.get(InputIds.Disabled)) {
    input.add(InputIds.Disabled, '设置禁用', {
      type: 'boolean'
    });
  }

  return true;
}
