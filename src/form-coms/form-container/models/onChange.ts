

import { slotInputIds } from '../constants'

/**
 * @description 通知容器进行校验
 */
const onChange = (parentSlot: any, { id, value }: Partial<{ id: string, name: string, value: any }>) => {
  parentSlot?._inputs[slotInputIds.ON_CHANGE]?.({ id, value })
}

export {
  onChange
}