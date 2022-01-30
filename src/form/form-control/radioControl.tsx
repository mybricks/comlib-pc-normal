import React from 'react';
import { Input, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import { Option, FormItemProps } from '../runtime';
import { observe } from '@mybricks/rxui';
import { FormItemContext } from '../form-item';
import ComplexFormControl from './complexFormControl';
import css from '../runtime.less';

interface RadioControlProps {
  value?: string | number;
  onChange?: (value: string | number | undefined) => void;
  // formItem: FormItemProps
  // index: number
}

// const valueMap: Record<string, Record<string, string | undefined>> = {}

export default function RadioControl({ value, onChange }: RadioControlProps) {
  const formItemContext = observe(FormItemContext, { from: 'parents' });
  const index = formItemContext.index;
  const formItem = formItemContext.formItem;
  let { radioOptions } = formItem;

  if (!(radioOptions && radioOptions.length)) {
    radioOptions = formItem.options.length > 0 ? formItem.options : [];
  }

  const triggerChange = (changedValue: string | number) => {
    if (onChange) {
      if (
        (changedValue === undefined) ||
        (changedValue &&
          typeof changedValue === 'string' &&
          changedValue.includes('$mf$'))
      ) {
        onChange('');
      } else {
        onChange(changedValue);
      }
    }
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    triggerChange(e.target.value);
  };

  const onComplexFormControlChange = (
    changedValue: Record<string, string>,
    item: Option
  ) => {
    const value = getRadioValue(changedValue);

    item.value = value;
    triggerChange(value);
  };

  return (
    <Radio.Group
      className={css['form-item-radio-group']}
      disabled={formItemContext.formItem.disabled}
      value={value}
      onChange={onRadioChange}
    >
      {radioOptions.map((item, radioIdx) => {
        if (formItem.radioOptionType === 'buttonGrp') {
          return (
            <Radio.Button
              value={item.value}
              disabled={item.disabled}
              className="radio-btnGrp"
              data-radio-form-item-index={index}
              data-radio-form-item-radio-index={radioIdx}
            >
              {item.label}
            </Radio.Button>
          )
        }
        return (
          <div data-radio-form-item-index={index} data-radio-form-item-radio-index={radioIdx} key={item.key || item.value}>
            {formItem.radioOptionType === 'button' ? (
              <Radio.Button
                value={item.value}
                disabled={item.disabled}
                style={{ marginRight: 8 }}
              >
                {item.label}
              </Radio.Button>
            ) : (
              <Radio
                value={item.value}
                disabled={item.disabled}
                style={{ marginRight: 8 }}
                >
                  {item.dynamicInput ? <div className={css.radioWrap}>
                    <Input
                      style={{ width: item.width ? `${item.width}px` : '100%' }}
                      type="text" value={item.inputVal}
                      onChange={event => item.inputVal = event.target.value}
                      disabled={formItemContext.formItem.disabled}
                      placeholder={item.inputPlaceholder}
                    />
                    <span className={css.postCopy}>{item.label}</span>
                </div> :item.label}
              </Radio>
            )}
            {item.type === 'composition' ? (
              <div
                className={`${css['form-composition-item']} ${css.extraStyle}`}
                data-item-type="composition"
                data-form-item-type="radio"
                data-form-item-radio-key={item.key}
                data-form-item-index={index}
              >
                <ComplexFormControl
                  compositionItems={
                    formItem.radioCompositionItems &&
                    formItem.radioCompositionItems[item.key]
                  }
                  value={getComplexFormControlValue(
                    item.value,
                    formItem.radioCompositionItems
                      ? formItem.radioCompositionItems[item.key]
                      : []
                  )}
                  radioKey={item.key}
                  onChange={(value) => onComplexFormControlChange(value, item)}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </Radio.Group>
  );
}

function getRadioValue(value: Record<string, string>) {
  // const arr = Object.values(value)
  Object.keys(value).map((key) => {
    if (!value[key]) {
      value[key] = '$mf$';
    }
    if (typeof value[key] === 'string') {
      value[key] =  value[key].replace(/\s+/g, '');
    }
    return value;
  });

  const res = Object.values(value).join(' ').trim();

  return res;
}

function getComplexFormControlValue(
  valueStr: string,
  compositionItems: FormItemProps[]
) {
  const valArr = valueStr ? valueStr.split(' ') : [];
  const value: Record<string, string | undefined> = {};
  compositionItems.map((item, index) => {
    value[item.name] = valArr[index] === '$mf$' ? void 0 : valArr[index];
  });
  
  return value;
}
