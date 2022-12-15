import { slotInputIds } from '../constants'

/**
 * @description 通知容器进行校验
 */
const validateTrigger = (parentSlot: any, params: { id: string }) => {
  parentSlot?._inputs[slotInputIds.VALIDATE_TRIGGER]({ ...params })
}

export {
  validateTrigger
}