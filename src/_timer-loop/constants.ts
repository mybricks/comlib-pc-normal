export const InputIds = {
  Trigger: 'trigger',
  Cancel: 'cancel'
};

export const OutputIds = {
  Trigger: 'trigger'
};

export const Schemas = {
  Any: {
    type: 'any'
  }
};

/**
 * 数据源
 * @param id 定时器ID
 * @param delay 循环时间
 * @param useCancel 开启取消
 * @param immediate 立即执行
 */
export interface Data {
  id: string;
  delay: number;
  useCancel?: boolean;
  immediate?: boolean;
}
