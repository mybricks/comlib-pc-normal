import { useLayoutEffect } from 'react';
import { onChange } from './onChange'

interface FormItemInputsProps {
  id?: string
  inputs: any
  outputs: any
  configs?: {
    setValue?: (val) => void
    setInitialValue?: (val) => void
    getValue?: (cb) => void
    returnValue?: (cb) => void
    resetValue?: () => void
    validate?: (cb) => void
    setDisabled?: () => void
    setEnabled?: () => void
  }
  parentSlot?: any
}

const formItemInputIds = {
  SET_VALUE: 'setValue',
  SET_INITIAL_VALUE: 'setInitialValue',
  GET_VALUE: 'getValue',
  RESET_VALUE: 'resetValue',
  VALIDATE: 'validate',
  SET_DISABLED: 'setDisabled',
  SET_ENABLED: 'setEnabled'
}

const formItemOutputIds = {
  ON_CHANGE: 'onChange',
  ON_INITIAL: 'onInitial',
  RETURN_VALUE: 'returnValue',
  RETURN_VALIDATE: 'returnValidate'
}

const useFormItemInputs = ({ inputs, outputs, configs, parentSlot, id }: FormItemInputsProps, deps?: React.DependencyList) => {
  
  useLayoutEffect(() => {
    /**
     * @description 设置值
     */
    inputs[formItemInputIds.SET_VALUE] && inputs[formItemInputIds.SET_VALUE]((val) => {
      if (configs?.setValue) {
        configs.setValue(val)
      }

      // 触发onchange
      outputs[formItemOutputIds.ON_CHANGE](val);
      
      if (parentSlot && id) {
        onChange(parentSlot, { id: id, value: val })
      }
    });

    /**
     * @description 设置初始化
     */
    inputs[formItemInputIds.SET_INITIAL_VALUE] && inputs[formItemInputIds.SET_INITIAL_VALUE]((val) => {
      if (configs?.setInitialValue) {
        configs.setInitialValue(val)
      } 
      outputs[formItemOutputIds.ON_INITIAL](val);
    });

    /**
     * @description 获取值
     */
    inputs[formItemInputIds.GET_VALUE] && inputs[formItemInputIds.GET_VALUE]((val, outputRels) => {
      if (configs?.returnValue) {
        configs.returnValue(outputRels[formItemOutputIds.RETURN_VALUE])
      }
      // outputRels['returnValue'](data.value);
    });

    /**
     * @description 重置
     */
    inputs[formItemInputIds.RESET_VALUE] && inputs[formItemInputIds.RESET_VALUE](() => {
      // data.value = void 0;
      if (configs?.resetValue) {
        configs.resetValue()
      }
    });

    /**
     * @description 校验
     */
    inputs[formItemInputIds.VALIDATE] && inputs[formItemInputIds.VALIDATE]((val, outputRels) => {
      if (configs?.validate) {
        configs.validate(outputRels[formItemOutputIds.RETURN_VALIDATE])
      }
    });

    /**
     * @description 设置禁用
     */
    inputs[formItemInputIds.SET_DISABLED] && inputs[formItemInputIds.SET_DISABLED](() => {
      if (configs?.setDisabled) {
        configs.setDisabled()
      }
      
    });

    /**
     * @description 设置启用
     */
    inputs[formItemInputIds.SET_ENABLED] && inputs[formItemInputIds.SET_ENABLED](() => {
      if (configs?.setEnabled) {
        configs?.setEnabled()
      }
    });

  }, deps ? deps : [])

  return
}

export default useFormItemInputs