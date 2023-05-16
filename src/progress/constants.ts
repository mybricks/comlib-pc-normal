/**
 * 数据源
 * @param percent 进度
 * @param type 类型
 * @param isShow 是否显示进度数值或状态图标
 * @param status 状态
 * @param strokeColor 进度条颜色
 * @param isSteps 开启显示步数
 * @param steps 步数
 * @param isColor 是否开启颜色
 * @param size 'line'的尺寸
 * @param circleSize 'circle' | 'dashboard' 的尺寸
 */
export interface Data {
  percent: number;
  type: 'line' | 'circle' | 'dashboard';
  isShow: boolean;
  status: 'success' | 'exception' | 'normal' | 'active';
  strokeColor: string;
  isSteps: boolean;
  steps: number;
  isColor: boolean;
  size: any;
  circleSize: string;
}

export const InputIds = {
  SetColor: 'setColor'
}