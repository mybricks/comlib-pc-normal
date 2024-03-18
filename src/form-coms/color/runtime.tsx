import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { validateFormItem, RuleKeys } from '../utils/validator';
import css from './runtime.less';
import ColorPicker from './color-picker';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';
import { colorRgbaToHex } from './utils';

export interface Data {
  color: string;
  rules: any[];
  disabled: boolean;
  width?: number | string;
  colorType: 'rgb' | 'hex';
  validateTrigger: string[];
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot, name } = props;
  const [isShow, setIsShow] = useState<boolean>(false);
  const validateRelOutputRef = useRef<any>(null);
  const valueRef = useRef<any>(data.color);

  const [color, setColor] = useState(data.color);

  useLayoutEffect(() => {
    if (env.edit || data.color !== undefined) changeValue(data.color);
  }, [data.color]);

  useLayoutEffect(() => {
    //1.设置值
    inputs['setValue']((val, relOutputs) => {
      changeValue(val);
      switch (data.colorType) {
        case 'rgb':
          outputs['onChange'](val);
          if (relOutputs['setValueDone']) {
            relOutputs['setValueDone'](val);
          }
          //onValidateTrigger(ValidateTriggerType.OnChange);
          break;
        case 'hex':
          outputs['onChange'](colorRgbaToHex(val));
          if (relOutputs['setValueDone']) {
            relOutputs['setValueDone'](val);
          }
          //onValidateTrigger(ValidateTriggerType.OnChange);
          break;
      }
    });
    //2.设置初始值
    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val, relOutputs) => {
        changeValue(val);
        switch (data.colorType) {
          case 'rgb':
            outputs['onInitial'](val);
            if (relOutputs['setInitialValueDone']) {
              relOutputs['setInitialValueDone'](val);
            }
            //onValidateTrigger(ValidateTriggerType.OnInit);
            break;
          case 'hex':
            outputs['onInitial'](colorRgbaToHex(val));
            if (relOutputs['setInitialValueDone']) {
              relOutputs['setInitialValueDone'](val);
            }
            //onValidateTrigger(ValidateTriggerType.OnInit);
            break;
        }
      });
    //3.校验
    inputs['validate']((model, outputRels) => {
      validateFormItem({
        value: valueRef.current,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const customRule = data.rules.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
          if (customRule?.status) {
            validateRelOutputRef.current = outputRels['returnValidate'];
            outputs['onValidate'](valueRef.current);
          } else {
            outputRels['returnValidate'](r);
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });
    //4. 获取值
    inputs['getValue']((val, outputRels) => {
      switch (data.colorType) {
        case 'rgb':
          outputRels['returnValue'](valueRef.current);
          break;
        case 'hex':
          outputRels['returnValue'](colorRgbaToHex(valueRef.current));
          break;
      }
    });
    //5. 重置值
    inputs['resetValue']((_, outputRels) => {
      changeValue(void 0);
      if (outputRels['resetValueDone']) {
        outputRels['resetValueDone']();
      }
    });

    //6. 设置禁用
    inputs['setDisabled']((_, outputRels) => {
      data.disabled = true;
      if (outputRels['setDisabledDone']) {
        outputRels['setDisabledDone']();
      }
    });
    //7. 设置启用
    inputs['setEnabled']((_, outputRels) => {
      data.disabled = false;
      if (outputRels['setEnabledDone']) {
        outputRels['setEnabledDone']();
      }
    });
    //8. 设置启用/禁用
    inputs['isEnable']((val, outputRels) => {
      if (val === true) {
        data.disabled = false;
        if (outputRels['isEnableDone']) {
          outputRels['isEnableDone'](val);
        }
      } else {
        data.disabled = true;
        if (outputRels['isEnableDone']) {
          outputRels['isEnableDone'](val);
        }
      }
    });
  }, [color]);

  const onClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsShow(!isShow);
  };

  const onValidateTrigger = () => {
    //data.validateTrigger?.includes(type) &&
    validateTrigger(parentSlot, { id: props.id, name: name });
  };

  const changeValue = (val) => {
    setColor(val);
    valueRef.current = val;
    //值变化
    switch (data.colorType) {
      case 'rgb':
        onChangeForFc(parentSlot, { id: props.id, name: name, value: val });
        break;
      case 'hex':
        onChangeForFc(parentSlot, { id: props.id, name: name, value: colorRgbaToHex(val) });
        break;
    }
  };

  const onChangeComplete = (e) => {
    changeValue(e);
    //值变化
    switch (data.colorType) {
      case 'rgb':
        outputs['onChange'](e);
        break;
      case 'hex':
        outputs['onChange'](colorRgbaToHex(e));
        break;
    }
    onValidateTrigger();
  };

  document.addEventListener('click', (e) => {
    e.stopPropagation();
    setIsShow(false);
  });

  const colorOnClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsShow(true);
  };

  useEffect(() => {
    inputs['setValidateInfo']((info: object, outputRels) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        outputRels['setValidateInfoDone'](info);
      }
    });
  }, []);

  return (
    <div style={{ width: data.width }}>
      <div
        onClick={data.disabled ? void 0 : onClick}
        className={css.block}
        style={{
          width: data.width,
          backgroundColor: color || '#000000',
          cursor: data.disabled ? 'not-allowed' : void 0
        }}
      >
        <div
          style={{ height: '22px', backgroundColor: data.disabled ? 'hsla(0,0%,100%,.8)' : void 0 }}
        ></div>
      </div>
      <div className={css.colorPicker} style={{ top: data.width }} onClick={colorOnClick}>
        {isShow ? (
          <ColorPicker color={color || '#000000'} onChangeComplete={onChangeComplete} />
        ) : (
          void 0
        )}
      </div>
    </div>
  );
}
