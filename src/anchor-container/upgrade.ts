import { Data, OutputIds, Schemas } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 增加固定锚点配置
  */

  if (typeof data.enableFix === "undefined") {
    data.enableFix = true;
  };

  if (typeof data.useDynamicData === "undefined") {
    data.useDynamicData = true;
  };

  /**
    * @description v1.0.7 增加锚点位置配置
  */
  if (typeof data.anchorPosition === "undefined") {
    data.anchorPosition = 'right';
  };


  if (input.get('setActiveAnchor') && !output.get(`${'setActiveAnchor'}Done`)) {
    output.add(`${'setActiveAnchor'}Done`, '完成', {
      type: 'object',
      properties: {
        index: {
          title: '锚点索引',
          type: 'number',
          description: '激活锚点的索引，从0开始'
        },
        title: {
          title: '锚点标题',
          type: 'string',
          description: '锚点标题内容'
        }
      }
    });
    input.get('setActiveAnchor').setRels([`${'setActiveAnchor'}Done`]);
  }
  // -------------------- 1.0.11 end --------------------

  return true;
}