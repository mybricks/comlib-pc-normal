

import { slotInputIds } from '../constants'

/**
 * @description 通知容器进行校验
 */
const onChange = (parentSlot: any, { id, value }: { id: string, value: any }) => {
  parentSlot?._inputs[slotInputIds.ON_CHANGE]?.({ id, value })
}

export {
  onChange
}