import { Data } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.0 -> v1.0.1, 新增进度条线宽度、自定义内容表达式等
   */

  if (data?.strokeWidth === undefined) {
    data.strokeWidth = data.type === 'line' ? 8 : 6;
  }

  if (data?.trailColor === undefined) {
    data.trailColor = 'f3f3f3';
  }

  if (typeof data?.circleSize === 'string') {
    data.circleSize = Number((data.circleSize as string).slice(0, -2));
  }

  if (data?.isFormat === undefined) {
    data.isFormat = false;
  }

  if (data?.formatFunction === undefined) {
    data.formatFunction = '';
  }

  const statusSchema = {
    type: 'enum',
    items: [
      {
        type: 'string',
        value: 'success'
      },
      {
        type: 'string',
        value: 'exception'
      },
      {
        type: 'string',
        value: 'normal'
      },
      {
        type: 'string',
        value: 'active'
      }
    ]
  };

  if (input.get('setStatus')?.schema?.type !== 'enum') {
    input.get('setStatus').setSchema(statusSchema);
  }

  /**
   * @description v1.0.11 新增设置进度、状态、颜色
  */
  if (!output.get("setPercentDone")) {
    output.add("setPercentDone", "设置进度完成", {type: "number"});
  }
  if (output.get("setPercentDone") &&
    input.get("setPercent") &&
    !input.get("setPercent")?.rels?.includes("setPercentDone")) {
    input.get("setPercent").setRels(["setPercentDone"]);
  }

  if (!output.get("setStatusDone")) {
    output.add("setStatusDone", '设置状态完成', statusSchema);
  }
  if (output.get("setStatusDone") &&
    input.get("setStatus") &&
    !input.get("setStatus")?.rels?.includes("setStatusDone")) {
    input.get("setStatus").setRels(["setStatusDone"]);
  }

  if(data.isColor && !output.get('setColorDone') && input.get('setColor')){
    output.add('setColorDone', '设置颜色完成', { type: 'string' });
    input.get("setColor").setRels(["setColorDone"]);
  }
  return true;
}
