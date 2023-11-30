

import { slotInputIds } from '../constants'

interface OnChangeProps {
  id: string
  name: string
  value: any
}

/**
 * @description 通知容器进行校验
 */
const onChange = (parentSlot: any, { id, name, value }: OnChangeProps) => {
  parentSlot?._inputs[slotInputIds.ON_CHANGE]?.({ id, name, value })
}

export {
  onChange
}