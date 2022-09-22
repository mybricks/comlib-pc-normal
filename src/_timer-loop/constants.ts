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
 */
export interface Data {
  id: string;
  delay: number;
  immediate?: boolean;
}
