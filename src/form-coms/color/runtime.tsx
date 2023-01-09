import React, { useState } from 'react';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';
import useFormItemInputs from '../form-container/models/FormItem';
import ColorPicker from './color-picker';

export interface Data {
  options: any[];
  isChoose: boolean;
  choose: string;
  font: string;
  icon?: string;
  color: string;
  rules: any[];
  disabled: boolean;
  width?: number | string;
  colorType: 'rgb' | 'hex' | 'hsl';
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
//RGB转换为HSL
function rgbtohsl(r: number, g: number, b: number) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var l: number = (min + max) / 2;
  var difference = max - min;
  var h, s, l: number;
  if (max == min) {
    h = 0;
    s = 0;
  } else {
    s = l > 0.5 ? difference / (2.0 - max - min) : difference / (max + min);
    switch (max) {
      case r:
        h = (g - b) / difference + (g < b ? 6 : 0);
        break;
      case g:
        h = 2.0 + (b - r) / difference;
        break;
      case b:
        h = 4.0 + (r - g) / difference;
        break;
    }
    h = Math.round(h * 60);
  }
  s = Math.round(s * 100); //转换成百分比的形式
  l = Math.round(l * 100);
  return [h, s, l];
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env } = props;
  const [isShow, setIsShow] = useState<boolean>(false);

  useFormItemInputs({
    inputs,
    outputs,
    configs: {
      setValue(val) {
        data.color = val;
      },
      setInitialValue(val) {
        data.color = val;
      },
      returnValue(output) {
        switch (data.colorType) {
          case 'rgb':
            output(data.color);
            break;
          case 'hex':
            output(rgbToHex(data.color));
            break;
          case 'hsl':
            let newRgb: any = data.color.match(/\d+/g);
            output(rgbtohsl(newRgb[0], newRgb[2], newRgb[3]));
            break;
        }
      },
      resetValue() {
        data.color = void 0;
      },
      setDisabled() {
        data.disabled = true;
      },
      setEnabled() {
        data.disabled = false;
      },
      validate(output) {
        validateFormItem({
          value: data.color,
          env,
          rules: data.rules
        })
          .then((r) => {
            output(r);
          })
          .catch((e) => {
            output(e);
          });
      }
    }
  });

  const onClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsShow(!isShow);
  };

  const onChangeComplete = (e) => {
    data.color = e;
    let newRgb: any = data.color.match(/\d+/g);
    //值变化
    switch (data.colorType) {
      case 'rgb':
        outputs['onChange'](data.color);
        break;
      case 'hex':
        outputs['onChange'](rgbToHex(data.color));
        break;
      case 'hsl':
        outputs['onChange'](rgbtohsl(newRgb[0], newRgb[2], newRgb[3]));
        break;
    }
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

  return (
    <div style={{ backgroundColor: data.disabled ? '#f5f5f5' : void 0 }}>
      <div
        onClick={data.disabled ? void 0 : onClick}
        className={css.block}
        style={{ width: data.width, backgroundColor: data.color }}
      ></div>
      <div className={css.colorPicker} onClick={colorOnClick}>
        {isShow ? <ColorPicker color={data.color} onChangeComplete={onChangeComplete} /> : void 0}
      </div>
    </div>
  );
}
