import debounce from 'lodash/debounce';
import { slotInputIds } from '../constants'
import { ValidateInfo } from '../../types';
interface ValidateTriggerProps {
  id: string
  name: string
  /** 携带这个字段时，表单项校验传到表单容器后，不用在表单容器侧触发表单项的validate */
  validateInfo?: ValidateInfo
}

/**
 * @description 通知容器进行校验
 */
const validateTrigger = (parentSlot: any, params: ValidateTriggerProps) => {
  parentSlot?._inputs[slotInputIds.VALIDATE_TRIGGER]?.({ ...params })
}
/**
 * @description (带防抖)通知容器进行校验
 */
const debounceValidateTrigger = debounce(validateTrigger, 300);

export {
  validateTrigger,
  debounceValidateTrigger
}