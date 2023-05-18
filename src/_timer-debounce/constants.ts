export const InputIds = {
  Trigger: 'trigger',
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
 * @param delay 延迟时间
 */
export interface Data {
  delay: number;
  isleading: boolean
}