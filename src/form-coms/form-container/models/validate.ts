import { slotInputIds } from '../constants'

interface ValidateTriggerProps {
  id: string
  name: string
}

/**
 * @description 通知容器进行校验
 */
const validateTrigger = (parentSlot: any, params: ValidateTriggerProps) => {
  parentSlot?._inputs[slotInputIds.VALIDATE_TRIGGER]?.({ ...params })
}

export {
  validateTrigger
}