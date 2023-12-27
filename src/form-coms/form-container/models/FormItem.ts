import { useLayoutEffect } from 'react';
import { onChange } from './onChange'

interface FormItemInputsProps {
  id?: string
  name: string
  inputs: any
  outputs: any
  configs?: {
    setValue?: (val) => void
    setInitialValue?: (val) => void
    getValue?: (cb) => void
    returnValue?: (cb) => void
    resetValue?: () => void
    validate?: (model, cb) => void
    setDisabled?: () => void
    setEnabled?: () => void
    onChange?: (val) => void
    setIsEnabled?: (val) => void
    setIsEditable?: (val) => void
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
  SET_ENABLED: 'setEnabled',
  IS_ENABL: 'isEnable',
  IS_EDITABLE: 'isEditable'
}

const formItemOutputIds = {
  ON_CHANGE: 'onChange',
  ON_INITIAL: 'onInitial',
  RETURN_VALUE: 'returnValue',
  RETURN_VALIDATE: 'returnValidate'
}

const useFormItemInputs = ({ inputs, outputs, configs, parentSlot, id, name }: FormItemInputsProps, deps?: React.DependencyList) => {

  useLayoutEffect(() => {
    /**
     * @description 设置值
     */
    inputs[formItemInputIds.SET_VALUE] && inputs[formItemInputIds.SET_VALUE]((val, relOutputs) => {
      if (configs?.setValue) {
        configs.setValue(val);
        if(relOutputs['setValueDone']){
          relOutputs['setValueDone'](val);
        }
      }

      // 触发onchange

      if (configs?.onChange) {
        configs.onChange(val)
      } else {
        outputs[formItemOutputIds.ON_CHANGE](val);
      }
      if (parentSlot && id) {
        onChange(parentSlot, { id, value: val, name })
      }
    });

    /**
     * @description 设置初始化
     */
    inputs[formItemInputIds.SET_INITIAL_VALUE] && inputs[formItemInputIds.SET_INITIAL_VALUE]((val, relOutputs) => {
      if (configs?.setInitialValue) {
        configs.setInitialValue(val);
        if(relOutputs['setInitialValueDone']){
          relOutputs['setInitialValueDone'](val);
        }
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
    inputs[formItemInputIds.RESET_VALUE] && inputs[formItemInputIds.RESET_VALUE]((_, relOutputs) => {
      // data.value = void 0;
      if (configs?.resetValue) {
        configs.resetValue();
        if(relOutputs['resetValueDone']){
          relOutputs['resetValueDone']();
        }
      }
    });

    /**
     * @description 校验
     */
    inputs[formItemInputIds.VALIDATE] && inputs[formItemInputIds.VALIDATE]((model, outputRels) => {
      if (configs?.validate) {
        configs.validate(model, outputRels[formItemOutputIds.RETURN_VALIDATE])
      }
    });

    /**
     * @description 设置禁用
     */
    inputs[formItemInputIds.SET_DISABLED] && inputs[formItemInputIds.SET_DISABLED]((_, relOutputs) => {
      if (configs?.setDisabled) {
        configs.setDisabled();
        if(relOutputs['setDisabledDone']){
          relOutputs['setDisabledDone']();
        }
      }
    });

    /**
     * @description 设置启用
     */
    inputs[formItemInputIds.SET_ENABLED] && inputs[formItemInputIds.SET_ENABLED]((_, relOutputs) => {
      if (configs?.setEnabled) {
        configs?.setEnabled();
        if(relOutputs['setEnabledDone']){
          relOutputs['setEnabledDone']();
        }
      }
    });

    /**
     * @description 设置启用/禁用
     */
    inputs[formItemInputIds.IS_ENABL] && inputs[formItemInputIds.IS_ENABL]((val, relOutputs) => {
      if (configs?.setIsEnabled) {
        configs?.setIsEnabled(val);
        if(relOutputs['isEnableDone']){
          relOutputs['isEnableDone'](val);
        }
      }
    });

    /**
     * @description 设置编辑/只读
     */
    inputs[formItemInputIds.IS_EDITABLE] && inputs[formItemInputIds.IS_EDITABLE]((val, relOutputs) => {
      if (configs?.setIsEditable) {
        configs?.setIsEditable(val);
        if(relOutputs['isEditableDone']){
          relOutputs['isEditableDone'](val);
        }
      }
    });
  }, deps ? deps : [])

  return
}

export default useFormItemInputs