import { useLayoutEffect } from 'react';
import { validateFormItem } from '../../utils/validator'

interface FormItemInputsProps {
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
}

const useFormItemInputs = ({ inputs, outputs, configs }: FormItemInputsProps) => {
  
  useLayoutEffect(() => {
    
    inputs['setValue']((val) => {
      if (configs?.setValue) {
        configs.setValue(val)
      }
      outputs['onChange'](val);
    });

    inputs['setInitialValue']((val) => {
      if (configs?.setInitialValue) {
        configs.setInitialValue(val)
      } 
      outputs['onInitial'](val);
    });

    inputs['getValue']((val, outputRels) => {
      if (configs?.returnValue) {
        configs.returnValue(outputRels['returnValue'])
      }
      // outputRels['returnValue'](data.value);
    });

    inputs['resetValue'](() => {
      // data.value = void 0;
      if (configs?.resetValue) {
        configs.resetValue()
      }
    });

    inputs['validate']((val, outputRels) => {
      if (configs?.validate) {
        configs.validate(outputRels['returnValidate'])
      }
    });

    //设置禁用
    inputs['setDisabled'](() => {
      if (configs?.setDisabled) {
        configs.setDisabled()
      }
      
    });
    //设置启用
    inputs['setEnabled'](() => {
      if (configs?.setEnabled) {
        configs?.setEnabled()
      }
    });

  }, [])

  return
}

export default useFormItemInputs