import { Data } from './constants';

export default function ({ data, input }: UpgradeParams<Data>): boolean {
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

  if (input.get('setStatus')?.schema?.type !== 'enum') {
    input.get('setStatus').setSchema({
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
    });
  }

  return true;
}
