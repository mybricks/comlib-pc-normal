import React, { useCallback } from 'react';
import { Form, Input, InputNumber, Switch, Cascader } from 'antd';
import moment from 'moment';
import { Rule } from 'rc-field-form/es/interface';
import { runJs } from '../../../package/com-utils';
import { FormListFieldData } from 'antd/es/form/FormList';
import {
  FormItemProps,
  FormContext,
  setFromItemDesc
} from '../runtime';
import { observe } from '@mybricks/rxui';
import { ValidatorResultProps } from '../rules';
import RadioControl from './radioControl';
import CheckboxControl from './checkboxControl';
import TimePickerControl from './timeControl';
import TimeRangePickerControl from './timeRangePickerControl';
import DatePickerControl from './dateControl';
import RangePickerControl from './rangePickerControl';
import TextControl from './textControl';
import SlotItemWithLabel from './slotItemWithLabel';
import { defaultValidatorExample, ruleFnMap } from '../utils';
import css from '../runtime.less';
import CodeEditor from './codeEditor';
import SelectItem from './SelectItem';

interface FormItemTypesProps {
  formItem: FormItemProps;
  fieldName?: string | string[];
  field?: FormListFieldData;
  index?: number;
  data?: any;
  isDynamic?: boolean;
  isComposition?: boolean
}

const FormItemSize: Record<string, string> = {
  large: '100%',
  middle: '70%',
  small: '50%'
};

export default function FormControlFactory({
  formItem,
  field,
  fieldName,
  index,
  data,
  isComposition,
  isDynamic
}: FormItemTypesProps) {
  const {
    size, disabled, placeholder, options,
    width, maxLength, maxRows, minRows
  } = formItem; // width = 100%

  // const percentWidth = FormItemSize[size]
  const itemWidth = FormItemSize[size] || width || '100%';
  const formContext = observe(FormContext, { from: 'parents' });
  const { formRef, env } = formContext;
  let _name = field ? [field.name, formItem.name] : formItem.name;

  if (fieldName) {
    _name = fieldName;
  }

  let resDisabled: boolean | undefined = disabled;

  if (field && formItem) {
    resDisabled = isDynamic
      ? resDisabled || (formItem.fieldsConfig && formItem.fieldsConfig[field.fieldKey]?.disabled)
      : formItem.fieldsConfig && formItem.fieldsConfig[field.fieldKey]?.disabled;
  }

  const setFormParams = useCallback((val) => {
    formContext.data.params = { ...formContext.data.params, ...val };
  }, []);

  const onInputChange = useCallback((value, current, fn = null) => {
      if (fn && value !== current) {
        fn(value)
      }
      if (formItem.supportValidateIcon) {
        if (runJs(formItem.validateCode, [value])) {
          formItem.validateStatus = 'success'
          formItem.hasFeedback = true
        } else {
          formItem.validateStatus = 'error'
          formItem.hasFeedback = true
        }
      }
  }, [])


  const dataCount = useCallback((value) => {
    return `${formItem.maxLength ? `${value ? value.length : 0} / ${formItem.maxLength}`: `${value ? value.length : 0}` }`
  }, [formItem.maxLength])

  const InputWithCount = ({ value, onChange }: { value?: any,onChange?:any }) => {
    return (
      formItem.showCount ?
        <div
          className={css.inputStyle}
          style={{ width: itemWidth }}
          data-count={dataCount(value)}
        >
          <Input
            type="text"
            addonBefore={formItem.addonBefore}
            addonAfter={formItem.addonAfter}
            allowClear={formItem.allowClear}
            disabled={resDisabled}
            placeholder={placeholder}
            autoComplete="off"
            value={value}
            maxLength={maxLength}
            onChange={(e) => {
              onInputChange(e.target.value, value,onChange)
            }}
          />
        </div> :
        <Input
          type="text"
          addonBefore={formItem.addonBefore}
          addonAfter={formItem.addonAfter}
          allowClear={formItem.allowClear}
          disabled={resDisabled}
          placeholder={placeholder}
          autoComplete="off"
          value={value}
          style={{ width: itemWidth }}
          maxLength={maxLength}
          onChange={(e) => onInputChange(e.target.value,value, onChange)}
        />
    )
  }

  const formItemMap = {
    inputText: () => {
      return <InputWithCount />
    },
    inputPassword: () => {
      return (
        <Input
          style={{ width: itemWidth }}
          type="password"
          disabled={resDisabled}
          placeholder={placeholder}
          maxLength={maxLength}
          allowClear={formItem.allowClear}
          addonAfter={formItem.addonAfter}
          addonBefore={formItem.addonBefore}
        />
      );
    },
    inputNumber: () => {
      return (
        <InputNumber
          style={{ width: itemWidth }}
          placeholder={placeholder}
          disabled={resDisabled}
          max={formItem.max}
          min={formItem.min}
          step={formItem.step}
          className={formItem.hideHandler && css.inputNumberHideHandler}
        />
      );
    },
    inputTextarea: () => {
      return (
        <Input.TextArea
          style={{ width: itemWidth }}
          disabled={resDisabled}
          autoSize={{
            minRows: Math.max(minRows || 3, 3),
            maxRows: Math.max(maxRows || 6, 6)
          }}
          countPos="inner"
          placeholder={placeholder}
          maxLength={maxLength}
          key={`${minRows}-${maxRows}`}
          showCount={formItem.showCount}
          allowClear={formItem.allowClear}
        />
      );
    },
    select: () => {
      return (
        <SelectItem
          env={env}
          formItem={formItem}
          disabled={resDisabled}
          width={(isDynamic || isComposition) && size !== 'custom' ? 140 || width : itemWidth}
          slots={formContext.slots}
        />
      );
    },
    multipleSelect: () => {
      return (
        <SelectItem
          mode="multiple"
          env={env}
          formItem={formItem}
          disabled={resDisabled}
          width={(isDynamic || isComposition) && size !== 'custom' ? 140 || width : itemWidth}
          slots={formContext.slots}
        />
      );
    },
    tagsSelect: () => {
      return (
        <SelectItem
          mode="tags"
          env={env}
          formItem={formItem}
          disabled={resDisabled}
          width={(isDynamic || isComposition) && size !== 'custom' ? 140 || width : itemWidth}
          slots={formContext.slots}
        />
      );
    },
    switch: () => {
      return (
        <Switch
          checkedChildren={options[0] || ''}
          unCheckedChildren={options[1] || ''}
          disabled={resDisabled}
        />
      );
    },
    radio: () => {
      return <RadioControl />;
    },
    checkbox: () => {
      return <CheckboxControl />;
    },
    // transfer: () => {
    //   return <TransferControl />
    // },
    dynamicItem: () => null,
    compositionItem: () => null,
    timePicker: () => {
      return <TimePickerControl formItem={formItem} />;
    },
    timeRangePicker: () => {
      return <TimeRangePickerControl formItem={formItem} />;
    },
    datePicker: () => {
      return <DatePickerControl formItem={formItem} />;
    },
    rangePicker: () => {
      return <RangePickerControl formItem={formItem} />;
    },
    text: () => {
      return <TextControl />;
    },
    cascader: () => {
      return (
        <Cascader
          allowClear={!!formItem.allowClear}
          showSearch={!!formItem.showSearch}
          options={options}
          placeholder={placeholder}
          style={{ width: itemWidth }}
          disabled={disabled}
          changeOnSelect={formItem?.changeOnSelect}
          // {...formItem}
        />
      );
    },
    codeEditor: () => {
      const config = {
        ...formItem.codeStyleConfig,
        readOnly: disabled,
        minLines: Math.max(minRows || 3, 3),
        maxLines: Math.max(maxRows || 6, 6)
      }
      return (
        <CodeEditor config={config} />
      )
    },
    slotItem: () => null,
    slotItemWithLabel: () => {
      return <SlotItemWithLabel formContext={formContext} formItem={formItem}/>
    }
  };

  let rules: Rule[] | undefined;

  if (formItem.useCodeValidator || formItem.isRequired || formItem.rules) {
    // TODO 判断使用scratch还是代码
    if (1) {
      try {
        rules = [({ getFieldValue }) => ({
            async validator(rule, value) {
              try {
                return new Promise((resolve, reject) => {
                  (formItem.useCodeValidator || formItem.isRequired) &&  runJs(formItem.validator || defaultValidatorExample, [{curFormItem: formItem, curValue: value, ...formContext.data }, { 
                      setFormParams,
                      getFieldValue,
                      setFromItemDesc,
                      success: () => resolve(''),
                      failed: (msg: string) => reject(msg),
                      callService: env.callService,
                      utils: { moment }
                  }])
                  if (!formItem.useCodeValidator && !formItem.isRequired) {
                    if (formItem.rules.length > 0) {
                      const afterRules = formItem.rules.map((ruleKey: string) => {
                        return ruleFnMap[ruleKey]({
                          label: isDynamic || isComposition ? formItem.name : formItem.label,
                          content: value,
                          minLen: formItem.minLength,
                          messageFn: reject,
                          // success: resolve
                        });
                      });
                      if (afterRules.every((i) => i === 'success')) {
                        resolve('');
                      }
                    } else {
                      resolve('');
                    }
                  }
                  })
              } catch (error) {
                return Promise.reject(`校验函数编写错误：${error}`)
              }
            }
          })];
      } catch (e) {
        console.error(e);
      }
    } else {
      rules = [
        ({ getFieldValue }) => ({
          validator(rule, value) {
            const validatorFn = eval(getRulesEvalScript(formItem));

            const inputs = {
              value
            };
            return new Promise((resolve, reject) => {
              validatorFn(
                // inputs, // 兼容 v1.0.41
                inputs,
                data.formItems,
                { getFieldValue, setFormParams },
                (res: ValidatorResultProps) => {
                  if (typeof res === 'object') {
                    if (res.code === 0) {
                      resolve(true);
                    } else {
                      reject(res.msg || '校验错误');
                    }
                  } else {
                    reject('错误的校验返回');
                  }
                },
                (result) => {
                  if (!result) return;
                  setFromItemDesc(result, formItem, formRef);
                }
              );
            });
          }
        })
      ];
    }
  }

  return (
    <Form.Item
      {...field}
      name={_name}
      fieldKey={field ? [field.fieldKey, formItem.name] : void 0}
      label={field ? formItem.label : null}
      style={field || fieldName ? { marginBottom: 0 } : void 0}
      rules={rules}
      valuePropName={
        ['switch', 'checkbox'].includes(formItem.type) ? 'checked' : 'value'
      }
      getValueFromEvent={formItem.isTrim ? value => {
        if (typeof value === 'string') {
          return value.trim() 
        }
        if (typeof value === 'object' && value !== null) {
          const { value: v } = value.target || {}
          return typeof v === 'string' ? v.trim() : v
        }
        return value
      } : null}
      noStyle={field || fieldName ? void 0 : true}
    >
      {formItemMap[formItem.type]()}
    </Form.Item>
  );
}
