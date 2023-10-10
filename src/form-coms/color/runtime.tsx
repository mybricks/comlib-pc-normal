import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { validateFormItem, RuleKeys } from '../utils/validator';
import css from './runtime.less';
import ColorPicker from './color-picker';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import { validateTrigger } from '../form-container/models/validate';
import { ValidateTriggerType } from '../types';

export interface Data {
  color: string;
  rules: any[];
  disabled: boolean;
  width?: number | string;
  colorType: 'rgb' | 'hex';
  validateTrigger: string[];
}

//RGB转换为HEX
function rgbToHex(rgb) {
  if (!/^(rgb|RGB)/.test(rgb)) {
    return rgb;
  }
  var color = rgb.toString().match(/\d+/g);
  var hex = '#';
  for (var i = 0; i < 3; i++) {
    if (color[i] < 0 || color[i] > 255) {
      return rgb;
    }
    hex += ('0' + Number(color[i]).toString(16)).slice(-2);
  }
  return hex;
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env, parentSlot, name } = props;
  const [isShow, setIsShow] = useState<boolean>(false);
  const validateRelOuputRef = useRef<any>(null);

  useLayoutEffect(() => {
    //1.设置值
    inputs['setValue']((val) => {
      data.color = val;
      switch (data.colorType) {
        case 'rgb':
          outputs['onChange'](data.color);
          //onValidateTrigger(ValidateTriggerType.OnChange);
          break;
        case 'hex':
          outputs['onChange'](rgbToHex(data.color));
          //onValidateTrigger(ValidateTriggerType.OnChange);
          break;
      }
    });
    //2.设置初始值
    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        data.color = val;
        switch (data.colorType) {
          case 'rgb':
            outputs['onInitial'](data.color);
            //onValidateTrigger(ValidateTriggerType.OnInit);
            break;
          case 'hex':
            outputs['onInitial'](rgbToHex(data.color));
            //onValidateTrigger(ValidateTriggerType.OnInit);
            break;
        }
      });
    //3.校验
    inputs['validate']((model, outputRels) => {
      validateFormItem({
        value: data.color,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const cutomRule = data.rules.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
          if (cutomRule?.status) {
            validateRelOuputRef.current = outputRels['returnValidate'];
            outputs['onValidate'](data.color);
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
          outputRels['returnValue'](data.color);
          break;
        case 'hex':
          outputRels['returnValue'](rgbToHex(data.color));
          break;
      }
    });
    //5. 重置值
    inputs['resetValue'](() => {
      data.color = void 0;
    });

    //6. 设置禁用
    inputs['setDisabled'](() => {
      data.disabled = true;
    });
    //7. 设置启用
    inputs['setEnabled'](() => {
      data.disabled = false;
    });
  }, []);

  const onClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsShow(!isShow);
  };

  const onValidateTrigger = () => {
    //data.validateTrigger?.includes(type) &&
    validateTrigger(parentSlot, { id: props.id, name: name });
  };

  const onChangeComplete = (e) => {
    data.color = e;
    //值变化
    switch (data.colorType) {
      case 'rgb':
        onChangeForFc(parentSlot, { id: props.id, name: name, value: data.color });
        outputs['onChange'](data.color);
        break;
      case 'hex':
        onChangeForFc(parentSlot, { id: props.id, name: name, value: rgbToHex(data.color) });
        outputs['onChange'](rgbToHex(data.color));
        break;
    }
    //onValidateTrigger(ValidateTriggerType.OnChange);
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
    inputs['setValidateInfo']((info: object) => {
      //console.log('validateRelOuputRef.current',validateRelOuputRef)
      if (validateRelOuputRef.current) {
        validateRelOuputRef.current(info);
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
          backgroundColor: data.color,
          cursor: data.disabled ? 'not-allowed' : void 0
        }}
      >
        <div
          style={{ height: '22px', backgroundColor: data.disabled ? 'hsla(0,0%,100%,.8)' : void 0 }}
        ></div>
      </div>
      <div className={css.colorPicker} onClick={colorOnClick}>
        {isShow ? <ColorPicker color={data.color} onChangeComplete={onChangeComplete} /> : void 0}
      </div>
    </div>
  );
}
