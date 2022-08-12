import React, { useEffect, useCallback, useRef } from 'react';
import { useObservable } from '@mybricks/rxui';
import { runJs } from '../../package/com-utils';
import { Form } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { FormLayout, FormInstance } from 'antd/lib/form/Form';
import { ButtonType } from 'antd/es/button';
import isEmpty from './isEmpty';
import debounce from 'lodash/debounce';
import {
  getOtherParamsValues,
  getLabelCol,
  getValueIndex,
  defaultValidatorExample
} from './utils';

import { uuid, typeCheck, deepCopy } from '../utils';
import { ActionPositionType, FormItemType } from './type';
import InlineLayout from './layout/inline';
import ColumnLayout from './layout/column';
import RowLayout from './layout/row';
import moment from 'moment';

import zhConfig from './config/zh_CN';
import { defaultValidateFn } from './editors/formItem/utils';

moment.locale('zh-cn', zhConfig);

type FieldsActionsType = 'copy';
export type RadioOptionType = 'default' | 'button' | 'buttonGrp';
export type OptionType = 'default' | 'composition';
export interface Option {
  label: string;
  value: string;
  type?: OptionType;
  children?: Option[];
  key: string | number;
  disabled?: boolean;
  dynamicInput?: boolean
  inputVal?: string;
  width?: number | string
  inputPlaceholder?: string
}

export interface checkboxOption {
  label: string;
  value: string;
}

// export interface KcdnUploadConfig {
//   useKcdn?: boolean;
//   token?: string;
//   dir?: string;
//   pid?: string;
//   allowRewrite?: boolean;
//   allowHash?: boolean;
// }

// export type UploadTistType = 'text' | 'picture' | 'picture-card' | 'dragger' | undefined;
// export interface UploadConfig {
//   buttonText: string;
//   name: string;
//   listType?: UploadTistType;
//   fileType: string[];
//   fileSize: number[];
//   fileCount: number[];
//   inputId: string;
//   outputId: string;
//   fileKey: string;
//   usePreview?: boolean;
//   multiple?: boolean;
//   multipleUpload?: boolean;

//   uploadStyle?: React.CSSProperties;
//   uploadIcon?: string;
// }

export interface CodeStyleConfig {
  maxLines?: number;
  minLines?: number;
  wrap?: boolean
}

export interface DdynamicItemAction {
  title: string;
  type: ButtonType;
}

export type DynamicItemLabelShowType = 'default' | 'index';

export type DescriptionPositionType = 'top' | 'right';

export type DescriptionShowProgram = 'default' | 'first';

export interface SlotConfig {
  outputId?: string;
}

export interface FieldConfig {
  options?: Option[];
  disabled?: boolean;
}

export interface FormItemProps {
  key: string;
  label: string;
  name: string;
  size: string;
  width?: number | string;
  type: FormItemType;
  disabled: boolean;
  allowClear?: boolean;
  dropdownMatchSelectWidth?: boolean;
  dropdownShowArrow?: boolean;
  dropdownSearchOption?: boolean;
  labelInValue?: boolean;
  placeholder: string;
  isRequired: boolean;
  options: Option[];
  fieldsFormItems: FormItemProps[];
  compositionItems?: FormItemProps[];
  fieldsActions?: Array<FieldsActionsType>;
  mark?: string;
  description?: string;
  descriptionColor?: string;
  showTime?: Record<string, unknown> | boolean;
  defaultValue?: string | string[];
  span?: number;
  visible?: boolean;
  hidden?: boolean;
  useInitialValue?: boolean;
  radioCompositionItems?: Record<string, FormItemProps[]>;
  radioOptionType?: RadioOptionType;
  radioOptions?: Option[];
  checkboxOptions?: checkboxOption[];
  checkAllOption?: boolean;
  checkboxFolded?: boolean;
  checkboxDefaultUnFold?: boolean;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  banned?: string;
  addonBefore?: string;
  addonAfter?: string;
  tooltip?: string;
  // uploadConfig?: UploadConfig;
  codeStyleConfig?: CodeStyleConfig
  dynamicItemAction?: DdynamicItemAction;
  dynamicItemLabelShowType?: DynamicItemLabelShowType;
  dynamicItemLength?: number;
  descriptionPosition?: DescriptionPositionType;
  dynamicdItemDscriptionShowProgram?: DescriptionShowProgram;
  slotConfig?: SlotConfig;
  fieldsConfig?: Record<number, FieldConfig>;
  copyOutputId?: string;
  slotId?: string;
  getFormItemDesc?: boolean;
  blocksOri?: BlocksOri;
  useLinkage?: boolean;
  linkageBlocksOri?: BlocksOri;
  blocksValidator: BlocksOri;
  validator: string;
  useCodeValidator?: boolean;
  bannedBefore?: number;
  bannedAfter?: number;
  onChange?: (val: any) => void;
  max?: number;
  min?: number;
  maxLength?: number;
  minLength?: number;
  isValidate?: boolean;
  isNewRequired?: boolean;
  rules?: string[];
  maxRows?: number;
  minRows?: number;
  serviceContent?: {
    [prop: string]: any;
  };
  transOptScript?: string
  preCopy?: string
  includePreCopy?: boolean
  postCopy?: string
  includePostCopy?: boolean
  colon?: boolean
  showLabel?: boolean
  hideRequiredStyle?: boolean
  showCount?: boolean
  step?: number;
  hideHandler?: boolean;
  hasFeedback?: boolean;
  validateStatus?: string
  supportValidateIcon?: boolean
  validateCode?: string
  dataCount?: string
  titleStyle?: any;
  showTailBtn?: boolean;
  tailBtns?: any[];
  cusMargin?: number[]

  changeOnSelect?: boolean;
  disableDate?: any[]
  isTrim?: boolean
  showSearch?: boolean

  disabledDate?: (current: moment.Moment) => any
  disabledTime?: (current: moment.Moment, type?: any) => any

  useCustomNotFoundContent?: boolean;
  customNotFoundContentSlotId?: string

  onSearch?: (val?: string) => void;
  optionFilterProp?: string;
  filterOption?: boolean;
}

export type LayoutModel = 'inline' | 'row' | 'column';

export interface SubmitAction {
  title: string;
  inputId: string;
  outputId: string;
}

interface FormItemDescResult {
  dataSource?: Option[];
  disabled?: boolean;
  value?: any;
  visible?: boolean;
  blank?: boolean;
  addonBefore?: string;
  addonAfter?: string;
  isRequired?: boolean;
  child?: Record<string, FormItemDescResult>;
  refName?: string;
  fieldKey?: number;
  description?: string;
  descriptionColor?: string;
  bannedBefore?: number;
  bannedAfter?: number;
  disableDate?: any[]
}

interface BlocksOri {
  script?: string;
  vars?: Array<any>;
  xml?: string;
}

export type LabelWidthType = 'default' | 'span';

interface SubmitDebounce {
  enable: boolean;
  wait: number;
}

export interface Data {
  formItems: FormItemProps[];
  layout: FormLayout;
  layoutModel?: LayoutModel;
  labelWidthType: LabelWidthType;
  size: SizeType;
  labelAlign: FormLabelAlign;
  wrapperCol: number;
  intervalMargin: number;
  columnCount: number;
  primaryBtnText: string;
  showSecondBtn: boolean;
  secondBtnText: string;
  resetBtn: {
    text: string;
    isVisible: boolean;
  };
  actionAlign: FormLabelAlign;
  isFollow: boolean;
  matchMap: Record<string, string[]>;
  actionPosition: ActionPositionType;
  params: Record<string, unknown>;
  immediate: boolean;
  fieldsValue: string;
  showActions?: boolean;
  labelWidth?: number;
  initialValues?: Record<string, unknown>;
  submitActions: SubmitAction[];
  action: SubmitAction | undefined;
  showLabel?: boolean;
  colon?: boolean;
  formRef?: React.MutableRefObject<FormInstance | null | undefined>;
  changeSubmit?: boolean;
  blocksOri?: BlocksOri;
  defaultInitialFormItemDesc?: boolean;
  useSubmitBtnLoading?: boolean;
  submitDebounce?: SubmitDebounce;
  formJS?: string;
  useCode: string;
  bgColor?: {
    [prop: string]: string
  }
  noSubmitParmas?: boolean;
  permissionPriKey?: string
  permissionSecKey?: string
  permissionResetKey?: string
  actionsConfig?: {
    span?: number
    useLabelWidth?: boolean
  }
}

export class FormContext {
  data: Data;
  outputs: any;
  inputs: any;
  env: any;
  formRef: React.MutableRefObject<FormInstance | null | undefined>;
  slots: any;
  isLoading: boolean;
}

export default function ({
  env,
  data,
  slots,
  inputs,
  outputs
}: RuntimeParams<Data>) {
  const formRef = useRef<FormInstance | null>();
  data.formRef = formRef;
  const { preview, edit, runtime } = env;
  const formContext = useObservable(
    FormContext,
    (next) =>
      next({
        data,
        inputs,
        outputs,
        env,
        formRef,
        slots,
        isLoading: false
      }),
    { to: 'children' }
  );
  // const getFormItem = useCallback((name: string) => {
  //   const item = data.formItems.find((item) => item.name === name);
  //   return item;
  // }, [data]);

  const formItemLayout =
    data.layout === 'horizontal'
      ? {
          // labelCol: { flex: `0 0 ${data.labelWidth ? data.labelWidth : 98}px` },
          labelCol: getLabelCol(data),
          wrapperCol: { span: data.wrapperCol }
        }
      : null;
  const debouncedOutput = debounce((outputId, params) => {
    outputs[outputId](params);
  }, data.submitDebounce?.wait);

  formContext.slots = slots;

  useEffect(() => {
    if (preview || edit) {
      if (data.formItems.length <= 0) {
        data.formItems.push({
          key: uuid(),
          label: '表单名称',
          name: 'name',
          size: 'large',
          type: 'inputText',
          disabled: false,
          placeholder: '请输入表单名称',
          isRequired: false,
          validator: defaultValidatorExample,
          validateCode: defaultValidateFn,
          blocksValidator: {},
          options: [],
          fieldsFormItems: [],
          rules: [],
        });
      }
    }

    if (runtime) {
      if (
        typeof data.defaultInitialFormItemDesc === 'undefined' ||
        data.defaultInitialFormItemDesc
      ) {
        initialFormItemDesc(true);
      }

      // console.log('debug-form', inputs['submit']);
      inputs['submit']((val: any) => {
        setFormParams(data, val);
        // console.log(data, val);
        data.action = void 0;
        formRef.current?.submit();
        // console.log(data, val);
      });

      inputs['stopLoading']((val: any) => {
        formContext.isLoading = false;
      });

      inputs['otherParams']((val: any) => {
        setFormParams(data, val);
      });

      /**
       * 重置表单
       */
      inputs['reset']((val, fn) => {
        resetForm(data);
        outputs['afterReset'](true);
        fn(data.formRef?.current?.getFieldsValue());
      });

      /**
       * 初始化表单
       */
      inputs['initial']((val: Record<string, unknown>) => {
        if (typeof val === 'object') {
          setFormParams(data, val);
        }
        // initialFormItemDesc函数会获取data.params，所以先要执行setFormParams
        initialFormItemDesc(true);
        if (typeof val === 'object') {
          initialFormModel(deepCopy(val));
        }
      });

      inputs['getFormValue'] && inputs['getFormValue'](() => {
        outputs['getFormValue'] && outputs['getFormValue'](formRef.current?.getFieldsValue(true))
      })

      inputs['initialDesc']((val: Record<string, FormItemDescResult>) => {
        if (typeof val === 'object') {
          data.formItems.forEach((formItem) => {
            if (!val[formItem.name]) return;
            setFromItemDesc(val[formItem.name], formItem, formRef);
            if (formItem.type === 'dynamicItem') {
              const result = val[formItem.name].child;
              if (result) {
                formItem.fieldsFormItems.forEach((fieldsItem) => {
                  if (!result[fieldsItem.name]) return;
                  setFromItemDesc(result[fieldsItem.name], fieldsItem, formRef);
                });
              }
            }
            if (
              formItem.type === 'compositionItem' &&
              formItem.compositionItems
            ) {
              const result = val[formItem.name].child;
              if (result) {
                formItem.compositionItems.forEach((compositionItem) => {
                  if (!result[compositionItem.name]) return;
                  setFromItemDesc(
                    result[compositionItem.name],
                    compositionItem,
                    formRef
                  );
                });
              }
            }
          });
        } else {
          initialFormItemDesc();
        }
      });

      if (data.immediate) {
        formRef.current?.submit();
      }
      if (data.submitActions) {
        for (const action of data.submitActions) {
          inputs[action.inputId]((val: any[]) => {
            setFormParams(data, val);
            data.action = action;
            formRef.current?.submit();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!runtime && data.fieldsValue) {
      const params = getFieldsValue(data);
      initialFormModel(params);
    }
  }, [data.fieldsValue]);

  const submitOutput = useCallback((outputId, params) => {
    if (data.submitDebounce?.enable) {
      debouncedOutput(outputId, params);
    } else {
      outputs[outputId](params);
    }
  }, []);

  const initialFormModel = useCallback((formModel: Record<string, string>) => {
    const result = transformFormValues(data.formItems, formModel);
    formRef.current?.setFieldsValue(result);
    if (runtime) {
      const allValues = formRef.current?.getFieldsValue();
      Object.keys(result || {}).forEach((key) => {
        onValuesChange(
          {
            [key]: result[key]
          },
          allValues,
          false
        );
      });
    }
    // formRef.current?.setFieldsValue({name: ['', {fieldname: 22}]})
  }, []);

  /**
   * 初始化表单项描述
   * **/
  const initialFormItemDesc = useCallback((isInit?: boolean) => {
    data.formItems.forEach((formItem: FormItemProps): void => {
      const { getFormItemDesc, blocksOri, key, name } = formItem;
      Object.defineProperty(formItem, 'value', {
        get: function () {
          return formRef.current?.getFieldValue(name)
        },
        set: function (value) {
          const values = transformFormValues(data.formItems, { [`${name}`]: value })
          formRef.current?.setFieldsValue({ [`${name}`]: values[name] })
        },
        configurable: true
      })

      data.formItems[name] = formItem;
      // Todo 兼容js和scratch，目前只能运行js
      // if (getFormItemDesc && blocksOri) {
      if (0) {
        const script = blocksOri?.script || '';
        try {
          const fn = evalReplaceBlocksScript(
            script,
            key,
            '_pc_v2_form_blokcks_init'
          );
          fn(
            deepCopy({ ...formItem, isInit }),
            env.runtime,
            formRef.current?.getFieldValue,
            data.formItems,
            data.params,
            (result) => {
              if (!result) return;
              if (formItem?.type === 'slotItem') {
                triggerSlotUpdate(formItem, result, outputs);
              }
              setFromItemDesc(result, formItem, formRef);
              const allValues = formRef?.current?.getFieldsValue();
              onValuesChange(
                {
                  [formItem.name]:
                  formRef?.current?.getFieldValue(formItem.name) ||
                  result.value
                },
                allValues,
                isInit
              );
            },
            env
          );
        } catch (err) {
          console.error(err);
        }
      }

      if (formItem.fieldsFormItems) {
        formItem.fieldsFormItems.map((fieldsFormitem) => {
          const { type } = formItem;
          const fieldKey = 0;
          const refName = formItem.name;
          formItemInitialOutput(
            formItem,
            fieldsFormitem,
            formRef,
            data,
            env,
            type,
            fieldKey,
            refName
          );

          if (fieldsFormitem.fieldsConfig) {
            Object.keys(fieldsFormitem.fieldsConfig).map((item, index) => {
              formItemInitialOutput(
                formItem,
                fieldsFormitem,
                formRef,
                data,
                env,
                type,
                index,
                refName
              );
            });
          }
        });
      }

      if (formItem.compositionItems) {
        formItem.compositionItems.map((compositionItem) => {
          const { type } = formItem;
          const refName = formItem.name;
          formItemInitialOutput(
            formItem,
            compositionItem,
            formRef,
            data,
            env,
            type,
            0,
            refName
          );
        });
      }

      if (formItem.type === 'radio') {
        const options = formItem.radioOptions;
        if (options) {
          options.map((item) => {
            if (
              item.type === 'composition' &&
              formItem.radioCompositionItems &&
              formItem.radioCompositionItems[item.key]
            ) {
              formItem.radioCompositionItems[item.key].map(
                (compositionItem) => {
                  formItemInitialOutput(
                    formItem,
                    compositionItem,
                    formRef,
                    data,
                    env
                  );
                }
              );
            }
          });
        }
      }
    });
    const { formJS, useCode } = data;

    if (useCode && formJS) {
      try {
        runJs(formJS, [data, {...env, utils: { moment }}])
        if (runtime) {
          const allValues = formRef.current?.getFieldsValue();
          Object.keys(allValues || {}).forEach((key) => {
            onValuesChange(
              {
                [key]: allValues[key]
              },
              allValues,
              false
            );
          });
        }
      } catch (error) {
        console.error(error)
      }
    }
  }, []);

  const onValuesChange = useCallback(
    (changedValues, allValues, isInit = false) => {
    let fieldName = Object.keys(changedValues)[0];
    const resAllValues = deepCopy(allValues);

    if (!fieldName) return;

    const formItem = data.formItems.find((item) => item.name === fieldName);
    if (formItem && formItem.onChange) {
      formItem.onChange(changedValues[fieldName])
    }
      
    if (formContext.data.changeSubmit) {
      Promise.resolve().then(() => {
        const allValues = formRef.current?.getFieldsValue();
        const params = transformFormValues(
          data.formItems,
          { ...data.params, ...allValues },
          'out'
        );
        submitOutput('submit', params);
        // if (outputs && outputs['changeSubmit']) {
          // submitOutput('submit', params);
        // }
      });
    }
    if (isEmpty(data.matchMap)) return;
    const matchMap = data.matchMap;
    const value = getChangedValue(changedValues, fieldName, data.formItems);
    const fieldKey =
    formItem?.type === 'dynamicItem'
    ? getValueIndex(changedValues[fieldName])
    : void 0;
const option = getChangedFormItemOption(
  fieldName,
  changedValues,
  data.formItems,
  fieldKey
);
    let childFormItem;

    if (formItem?.type === 'compositionItem') {
      fieldName = Object.keys(changedValues[fieldName])[0];
      if (formItem.compositionItems) {
        childFormItem = formItem.compositionItems.find(
          (item) => item.name === fieldName
        );
      }
    }

    if (formItem?.type === 'dynamicItem') {
      if (
        changedValues[fieldName][0] &&
        Object.keys(changedValues[fieldName][0]).length !== 1 &&
        allValues[fieldName][0] &&
        Object.keys(allValues[fieldName][0]).length !== 1
      ) {
        if (JSON.stringify(changedValues) === JSON.stringify(allValues)) {
          return;
        }
      }

      fieldName = getChangedDynamicItemName(changedValues, fieldName);

      if (formItem.fieldsFormItems) {
        childFormItem = formItem.fieldsFormItems.find(
          (item) => item.name === fieldName
        );
      }
      if (!fieldName) return;
    }

    data.formItems.forEach((item) => {
      if (item.type === 'rangePicker') {
        const value = allValues[item.name];
        if (value) {
          resAllValues[item.name] = [
            Math.floor(moment(value[0]).valueOf() / 1000) * 1000,
            Math.floor(moment(value[1]).valueOf() / 1000) * 1000
          ];
        }
      }

      if (item.type === 'datePicker') {
        const value = allValues[item.name];
        if (value) {
          resAllValues[item.name] =
            Math.floor(moment(value).valueOf() / 1000) * 1000;
        }
      }
    });

    let changeArray;
    let changeName;
    if (formItem) {
      if (matchMap[fieldName]) {
        changeArray = matchMap[fieldName];
        changeName = fieldName;
      } else if (
        matchMap[
          childFormItem
            ? `${formItem.key}____${childFormItem.key}`
            : formItem.key
          ]
      ) {
        changeArray =
        matchMap[
          childFormItem
            ? `${formItem.key}____${childFormItem.key}`
            : formItem.key
          ];
        changeName = childFormItem
          ? `${formItem.key}____${childFormItem.key}`
          : formItem.key;
      }
    }
    // matchMap[fieldName] && matchMap[fieldName].forEach((name: string) => {
    changeArray &&
      changeArray.forEach((i: string) => {
        let isChangedCompositionItemChange = false;
        let isChangedDynamicItemChange = false;
        const changeKey = i.split('____');
        const item: any = findItem(data.formItems, changeKey[0]);
        let childItem;
        if (changeKey[1]) {
          if (item.type === 'compositionItem') {
            isChangedCompositionItemChange = true;
            childItem = findItem(item.compositionItems, changeKey[1]);
          } else if (item.type === 'dynamicItem') {
            isChangedDynamicItemChange = true;
            childItem = findItem(item.fieldsFormItems, changeKey[1]);
          }
        }
        if (!item && !childItem) return;
        const { getFormItemDesc, blocksOri, key, name } = childItem || item;
        // if (getFormItemDesc) {
        if (0) {
          const script = blocksOri?.script || '';
          try {
            const fn = evalReplaceBlocksScript(
              script,
              key,
              `${changeName}_Change`
            );
            fn(
              deepCopy({
                isInit,
                fieldName: name,
                cause: {
                  // 变化项
                  fieldName,
                  value,
                  option,
                  fieldKey,
                  allValues: resAllValues
                }
              }),
              env.runtime,
              formRef.current?.getFieldValue,
              data.formItems,
              data.params,
              (result) => {
                if (!result) return;
                let formItem = data.formItems.find(
                  (i) => i.name === item.name
                );

                if (isChangedCompositionItemChange) {
                  formItem = item.compositionItems.find(
                    (i) => i.name === childItem.name
                  );
                  result.refName = item.name;
                }
                if (isChangedDynamicItemChange) {
                  formItem = item.fieldsFormItems.find(
                    (i) => i.name === childItem.name
                  );
                  result.refName = item.name;
                  result.fieldKey =
                      !fieldKey && fieldKey !== 0 ? -1 : fieldKey;
                }
                if (formItem?.type === 'slotItem') {
                  triggerSlotUpdate(formItem, result, outputs);
                }

                if (!formItem) return;
                setFromItemDesc(result, formItem, formRef);
              },
              env
            );
          } catch (err) {
            console.error(err);
          }
        }
      });
    },
    []
  );

  const onFinishFailed = useCallback((e) => {
    formContext.isLoading = false;
  }, []);

  /**
   *
   */
  const onFinish = useCallback(() => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        // console.log('debug-form', values);
        const formModel = { ...(data.noSubmitParmas ? {} : data.params), ...values };
        if (outputs['out0']) { // 兼容代码
          outputs['out0'](formModel)
        }
        const params = transformFormValues(data.formItems, formModel, 'out');
        if (data.useSubmitBtnLoading && runtime) {
          formContext.isLoading = true;
        }

        if (data.action) {
          submitOutput(data.action.outputId, { ...params });
          data.action = void 0;
        } else {
          submitOutput('submit', { ...params });
        }
      })
      .catch((errorInfo) => {
        formContext.isLoading = false;
        console.error('[onFinishError]', errorInfo);
      });
  }, []);

  return (
    <Form
      {...formItemLayout}
      ref={(node) => (formRef.current = node)}
      size={formContext.data.size}
      layout={formContext.data.layout}
      labelAlign={formContext.data.labelAlign}
      colon={formContext.data.colon}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={data.bgColor}
    >
      {formContext.data.layoutModel === 'inline' ? (
        <InlineLayout data={data} env={env} outputs={outputs} />
      ) : null}
      {formContext.data.layoutModel === 'row' ? (
        <RowLayout data={data}  env={env} outputs={outputs} />
      ) : null}
      {formContext.data.layoutModel === 'column' ? (
        <ColumnLayout data={data}  env={env} outputs={outputs} />
      ) : null}
      </Form>
  );
}

function transformFormValues(
  formItems: FormItemProps[],
  values: any,
  transFormType = 'in'
) {
  formItems.map((item) => {
  if (item.type === 'radio') {
      // todo
      const optionValues: string[] = [];
      if (!item.radioOptions) {
        return;
      }
      item.radioOptions.map((optionItem) => {
        optionValues.push(optionItem.value);
      });
      
      const checkValue = optionValues.find(
        (value) => value === values[item.name]
      );
      if (Array.isArray(values[item.name])) {
        item.radioOptions.map((optionItem) => {
          if (optionItem.dynamicInput&& optionItem.value === values[item.name][1]) {
            optionItem.inputVal = values[item.name][0]
            values[item.name] = values[item.name][1]
          } else {
            optionItem.inputVal = ''
          }
          return optionItem;
        });
      } else {
        item.radioOptions.map((optionItem) => {
          if (optionItem.dynamicInput&& optionItem.value !== values[item.name]) {
            optionItem.inputVal = ''
          }
          return optionItem;
        });
      }
      if (!checkValue) {
        item.radioOptions.map((optionItem) => {
          if (optionItem.type === 'composition' && !optionItem.value) {
            if (values[item.name]) {
              optionItem.value = values[item.name];
            }
          }
          return optionItem;
        });
      } else {
        const option = item.radioOptions.find(
          (option) => option.value === values[item.name]
        );
        if (option.dynamicInput && !Array.isArray(option.value)) {
          values[item.name] = [option.inputVal, option.value]
        }
        if (option?.type !== 'composition') {
          item.radioOptions.map((optionItem) => {
            if (optionItem.type === 'composition') {
              optionItem.value = '';
            }
            return optionItem;
          });
        }
      }
    } else if (item.type === 'datePicker') {
      if (transFormType === 'in') {
        if (!values[item.name]) {
          return;
        }
        const num = Number(values[item.name]);
        const result: any = isNaN(num)
        ? moment(values[item.name])
        : moment(num);
        values[item.name] = !result?._isValid ? undefined : result;
      } else {
        values[item.name] = values[item.name]
          ? Math.floor(moment(values[item.name]).valueOf() / 1000) * 1000
          : undefined;
      }
    } else if (item.type === 'rangePicker') {
      if (transFormType === 'in') {
        if (!typeCheck(values[item.name], 'array') || !values[item.name]) {
          return;
        }
        const start = Number(values[item.name][0]);
        const end = Number(values[item.name][1]);
        const resultStart: any = isNaN(start)
        ? moment(values[item.name][0])
        : moment(start);
      const resultEnd: any = isNaN(end)
        ? moment(values[item.name][1])
        : moment(end);
        if (!resultStart?._isValid || !resultEnd?._isValid) {
          return;
        }
        values[item.name] = [resultStart, resultEnd];
      } else {
        const [start, end] = values[item.name] || [];
        if (!start || !end) return;
        values[item.name] = [
          Math.floor(moment(start).valueOf() / 1000) * 1000,
          Math.floor(moment(end).valueOf() / 1000) * 1000
        ];
      }
    } else if (item.type === 'timePicker') {
      if (transFormType === 'in') {
        const result: any = moment(values[item.name], 'h:m:s');
        values[item.name] = result?._isValid ? result.format('LTS') : undefined;
      } 
    } else if (item.type === 'timeRangePicker') {
      if (transFormType === 'in' && Array.isArray(values[item.name]) && values[item.name].length > 1) {
        const result: [any, any] = [moment(values[item.name][0], 'h:m:s'), moment(values[item.name][1], 'h:m:s')];
        values[item.name] = result[0]?._isValid && result[1]?._isValid ? [result[0].format('LTS'), result[1].format('LTS')] : undefined;
      } else {
        values[item.name] = values[item.name]?.map(time => time ? moment(time).format('LTS') : undefined)
      }
    } else if (item.type === 'compositionItem') {
      if (item.compositionItems) {
        const compositionItemValues = transformFormValues(
          item.compositionItems,
          values[item.name] || {},
          'out'
        );
        values[item.name] = compositionItemValues;
      }
    }
  });
  return { ...values };
}

// interface LinkageFormItemChangeProps {
//   env: any
//   formRef: any
//   data: Data
//   formItem: FormItemProps
//   refFormItem: FormItemProps
// }

function formItemInitialOutput(
  refFormItem: FormItemProps,
  formItem: FormItemProps,
  formRef: any,
  data: Data,
  env: any,
  type?: string,
  fieldKey?: number,
  refName?: string
) {
  const { getFormItemDesc, blocksOri, key } = formItem;
  if (0) {
    const script = blocksOri?.script || '';
    try {
      const fn = evalReplaceBlocksScript(script, key);
      fn(
        {
          fieldName: formItem.name
        },
        env.runtime,
        formRef.current?.getFieldValue,
        data.formItems,
        data.params,
        (result) => {
          if (!result) return;
          if (type === 'dynamicItem') {
            if (typeCheck(fieldKey, 'number')) {
              result.fieldKey = fieldKey;
            }
            if (typeCheck(refName, 'string')) {
              result.refName = refName;
            }
          }
          if (type === 'compositionItem') {
            if (typeCheck(refName, 'string')) {
              result.refName = refName;
            }
          }
          setFromItemDesc(result, formItem, formRef);
        },
        env
      );
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * @description 设置表单项描述 普通/动态/组合
 * @param result 返回值
 * @param formItem 当前表单项
 * @param formRef 表单实例
 */
 export function setFromItemDesc(
  result: FormItemDescResult,
  formItem: FormItemProps,
  formRef: any
) {
  const formModel = formRef.current?.getFieldsValue();
   if (formItem.type === 'datePicker' && typeof result === 'object' && result != null) {
    formItem.disableDate = result.disableDate
  }
  if (typeof result.fieldKey === 'number') {
    // 动态表单项行号
    // if (typeof formItem.fieldsConfig === 'undefined') {
    //   formItem['fieldsConfig'] = { [result.fieldKey]: { options: [] } }
    // }
    if (
      typeof formItem.fieldsConfig === 'undefined' &&
      result.fieldKey !== -1
    ) {
      formItem['fieldsConfig'] = { [result.fieldKey]: { options: [] } };
    }

    if (result.fieldKey !== -1 && formItem.fieldsConfig) {
      if (typeof formItem.fieldsConfig?.[result.fieldKey] === 'undefined') {
        formItem.fieldsConfig[result.fieldKey] = { options: [] };
      }
    }

    // if (typeof formItem.fieldsConfig?.[result.fieldKey] === 'undefined') {
    //   formItem.fieldsConfig[result.fieldKey] = { options: [] }
    // }

    // formItem.fieldsConfig[result.fieldKey]['options'] = result.dataSource || []
    // if (result.dataSource) {
    //   if (typeCheck(result.dataSource, 'array')) {
    //     formItem.fieldsConfig[result.fieldKey]['options'] = result.dataSource
    //   } else {
    //     formItem.fieldsConfig[result.fieldKey]['options'] = []
    //   }
    // }

    if (formItem.options.length <= 0) {
      formItem.options = result.dataSource || [];
    }

    if (typeof result.disabled !== 'undefined' && formItem.fieldsConfig) {
      if (result.fieldKey !== -1) {
        formItem.fieldsConfig[result.fieldKey]['disabled'] = result.disabled;
      } else {
        const fieldsConfig = {};
        Object.keys(formItem.fieldsConfig).forEach((i) => {
          fieldsConfig[i] = {
            ...formItem.fieldsConfig?.[i],
            disabled: result.disabled
          };
        });
        formItem.fieldsConfig = fieldsConfig;
      }
    }

    if (result.dataSource && formItem.fieldsConfig) {
      const dataSource = typeCheck(result.dataSource, 'array')
      ? result.dataSource
      : [];
      if (result.fieldKey !== -1) {
        formItem.fieldsConfig[result.fieldKey]['options'] = dataSource;
      } else {
        const fieldsConfig = {};
        Object.keys(formItem.fieldsConfig).forEach((i) => {
          fieldsConfig[i] = {
            ...formItem.fieldsConfig?.[i],
            options: dataSource
          };
        });
        formItem.fieldsConfig = fieldsConfig;
        formItem.options = dataSource;
      }
    }

    // if (formItem.options.length <= 0) {
    //   formItem.options = result.dataSource || []
    // }

    // if (result.blank) {
    //   // 父表单项字段名
    //   if (result.refName) {
    //     formModel[result.refName][result.fieldKey][formItem.name] = void 0
    //     formRef.current?.setFieldsValue(formModel)
    //   }
    // }

    if (result.blank) {
      // 父表单项字段名
      if (result.refName) {
        if (result.fieldKey === -1) {
          if (formModel[result.refName]) {
            formModel[result.refName] = formModel[result.refName].map((i) => {
              return {
                ...i,
                [formItem.name]: void 0
              };
            });
          }
        } else {
          if (formModel[result.refName]) {
            formModel[result.refName][result.fieldKey][formItem.name] = void 0;
          }
          // formModel[result.refName][result.fieldKey][formItem.name] = void 0
        }

        formRef.current?.setFieldsValue(formModel);
      }
    }

    if (typeof result.value !== 'undefined') {
      if (result.refName) {
        if (result.fieldKey === -1) {
          if (typeCheck(formModel[result.refName], 'array')) {
            formModel[result.refName] = formModel[result.refName].map((i) => {
              return {
                ...i,
                [formItem.name]: result.value
              };
            });
          } else {
            formModel[result.refName] = [{ [formItem.name]: result.value }];
          }
        } else {
          if (typeCheck(formModel[result.refName], 'array')) {
            formModel[result.refName][result.fieldKey][formItem.name] =
            result.value;
          } else {
            formModel[result.refName] = [{ [formItem.name]: result.value }];
          }
        }

        // if (typeCheck(formModel[result.refName], 'array')) {
        //   formModel[result.refName][result.fieldKey][formItem.name] = result.value
        // } else {
        //   formModel[result.refName] = [{[formItem.name]: result.value}]
        // }
        formRef.current?.setFieldsValue(formModel);
      }
    }
  } else {
    // formItem.options = result.dataSource || []
    if (result.dataSource) {
      if (typeCheck(result.dataSource, 'array')) {
        formItem.options = result.dataSource;
      } else {
        formItem.options = [];
      }
    }

    if (result.blank) {
      if (result.refName) {
        formModel[result.refName][formItem.name] = void 0;
        formRef.current?.setFieldsValue(formModel);
      } else {
        formRef.current?.setFieldsValue({ [formItem.name]: void 0 });
      }
    }

    if (result.bannedBefore && typeCheck(result.bannedBefore, 'number')) {
      formItem.bannedBefore = result.bannedBefore;
    }

    if (result.bannedAfter && typeCheck(result.bannedAfter, 'number')) {
      formItem.bannedAfter = result.bannedAfter;
    }

    if (typeof result.value !== 'undefined') {
      if (result.refName) {
        if (formItem.type === 'datePicker') {
          const value = result.value;
          if (!value) return;
          const num = Number(value);
          const result_: any = isNaN(num) ? moment(value) : moment(num);
          formRef.current?.setFieldsValue({
            [result.refName]: { [formItem.name]: result_ }
          });
        } else {
          formRef.current?.setFieldsValue({
            [result.refName]: { [formItem.name]: result.value }
          });
        }
      } else {
        let value = result.value;
        if (formItem.type === 'rangePicker') {
          if (!typeCheck(value, 'array') || !value) {
            formRef.current?.setFieldsValue({ [formItem.name]: [] });
            return;
          }
          const start = Number(value[0]);
          const end = Number(value[1]);
          const resultStart: any = isNaN(start)
          ? moment(value[0])
          : moment(start);
          const resultEnd: any = isNaN(end) ? moment(value[1]) : moment(end);
          if (!resultStart?._isValid || !resultEnd?._isValid) {
            return;
          }
          value = [resultStart, resultEnd];
        } else if (formItem.type === 'datePicker') {
          if (!value) {
            return;
          }
          const num = Number(value);
          const result: any = isNaN(num) ? moment(value) : moment(num);
          value = !result?._isValid ? undefined : result;
        }
        formRef.current?.setFieldsValue({ [formItem.name]: value });
      }
    }
  }

  // 显示隐藏
  if (typeof result.visible !== 'undefined') {
    formItem.visible = result.visible;
  }

  // 不可编辑
  if (typeof result.disabled !== 'undefined') {
    formItem.disabled = result.disabled;
  }

  // 后置标签
  if (typeof result.addonAfter !== 'undefined') {
    formItem.addonAfter = result.addonAfter;
  }

  // 前置标签
  if (typeof result.addonBefore !== 'undefined') {
    formItem.addonBefore = result.addonBefore;
  }

  // 是否校验
  if (typeof result.isRequired !== 'undefined') {
    formItem.isRequired = result.isRequired;
  }

  // 描述
  if (typeof result.description !== 'undefined') {
    formItem.description = result.description;
  }

  // 描述颜色
  if (typeof result.descriptionColor !== 'undefined') {
    formItem.descriptionColor = result.descriptionColor;
  }
}

function getFieldsValue(data: Data) {
  const fieldsValue = JSON.parse(data.fieldsValue);
  let params = {};
  data.formItems.forEach((item) => {
    params[item.name] = undefined;
  });
  params = Object.assign(params, fieldsValue);
  return params;
}

function getChangedValue(
  changedValues: any,
  fieldName: string,
  formItems: FormItemProps[]
) {
  let value: any;
  const formItem = formItems.find((item) => item.name === fieldName);
  if (!formItem) return void 0;
  value = changedValues[fieldName];

  if (formItem.type === 'dynamicItem') {
    const index = getValueIndex(value);
    if (index !== -1) {
      const dynamicItemFieldName = value && Object.keys(value[index])[0];
      value = value[index][dynamicItemFieldName];
    } else {
      value = void 0;
    }
  } else if (formItem.type === 'compositionItem') {
    const compositionItemFieldName = value && Object.keys(value)[0];
    value = value[compositionItemFieldName];
  } else if (formItem.type === 'rangePicker' && value) {
    value = [
      Math.floor(moment(value[0]).valueOf() / 1000) * 1000,
      Math.floor(moment(value[1]).valueOf() / 1000) * 1000
    ];
  } else if (formItem.type === 'datePicker' && value) {
    value = Math.floor(moment(value).valueOf() / 1000) * 1000;
  }

  return value;
}

function getOption(options: Option[] | undefined, val: any) {
  let res;

  if (!Array.isArray(options)) return res;

  for (let i = 0; i < options?.length; i++) {
    const { value, children } = options[i];
    if (children) {
      const r = getOption(children, val);
      if (r && r.value === val) {
        res = r;
        break;
      }
    }
    if (value === val) {
      res = options[i];
      break;
    }
  }

  return res;
}

function getChangedFormItemOption(
  fieldName: string,
  changedValues: any,
  formItems: FormItemProps[],
  fieldKey?: number
) {
  let option: Record<string, any> | undefined;
  const formItem = formItems.find((item) => item.name === fieldName);
  const value = getChangedValue(changedValues, fieldName, formItems);

  if (formItem) {
    if (formItem.type === 'select' || formItem.type === 'multipleSelect') {
      if (typeof fieldKey !== 'undefined') {
        if (formItem.fieldsConfig) {
          // option = formItem.fieldsConfig[fieldKey]?.options?.find(option => option.value === value)
          option = getOption(formItem.fieldsConfig[fieldKey]?.options, value);
        }
      } else {
        // option = formItem.options.find(option => option.value === value)
        option = getOption(formItem.options, value);
      }
    } else if (
      formItem.type === 'compositionItem' &&
      formItem.compositionItems
    ) {
      const formItemName = Object.keys(changedValues)[0];
      const compositionItemChangedValue = changedValues[formItemName];
      const compositionItemFieldName = Object.keys(
        changedValues[formItemName]
      )[0];
      option = getChangedFormItemOption(
        compositionItemFieldName,
        compositionItemChangedValue,
        formItem.compositionItems
      );
    } else if (formItem.type === 'dynamicItem') {
      const dynamicItemName = getChangedDynamicItemName(
        changedValues,
        fieldName
      );
      const index = getValueIndex(changedValues[fieldName]);
      option = getChangedFormItemOption(
        dynamicItemName,
        changedValues[fieldName][index],
        formItem.fieldsFormItems,
        fieldKey
      );
    }
  }

  return option;
}

function getChangedDynamicItemName(changedValues: any, fieldName: string) {
  const arr = changedValues[fieldName];
  const index = getValueIndex(arr);
  if (index === -1) return '';
  const value = arr[index];
  const dynamicItemName = Object.keys(value)[0];

  return dynamicItemName;
}

function findItem(ary, name) {
  let item = void 0;

  for (let i = 0; i < ary.length; i++) {
    if (item) break;
    if ([ary[i].name, ary[i].key].includes(name)) {
      item = ary[i];
      break;
    } else {
      if (ary[i].type === 'compositionItem') {
        item = findItem(ary[i].compositionItems, name);
      } else if (ary[i].type === 'dynamicItem') {
        item = findItem(ary[i].fieldsFormItems, name);
      }
    }
  }

  return item;
}

function evalReplaceBlocksScript(script, key, fn = '_pc_v2_form_blokcks_init') {
  const reg = new RegExp(`${key}\\(\\(${key},_output\\)=>{`);
  // .replaceAll('\\n', '')
  script = decodeURIComponent(script);
  script = script
    .trim()
    .replace(reg, 'const init = (() => {')
    .replace(/(_debugLog\().+("\]\))/g, '')
    .replace(/_output_/g, '_formres_');
  const evalScript = `
    (function(${key}, _envVars_, getFieldValue, formItems, _extraDataParams_, _formres_, env) {
      try {
        ${script}
        ${fn}()
      } catch(ex) {
        throw new Error(ex)
      }
    })
  `;
  return eval(evalScript);
}

/**
 * 重置表单
 */
export function resetForm(data: Data) {
  data.formRef?.current?.resetFields();
  data.formItems.forEach((formItem) => {
    if (formItem.type === 'dynamicItem') {
      formItem.fieldsFormItems?.map((item) => {
        item.fieldsConfig = undefined;
        return item;
      });
    }
    if (formItem.type === 'radio') {
      formItem.radioOptions?.map((option) => {
        if (option.type === 'composition') {
          option.value = '';
        }
        return option;
      });
    }
  });
  data.params = {};
}

function setFormParams(data: Data, val: any) {
  let otherParams: Record<string, string>;
  if (Array.isArray(val)) {
    otherParams = getOtherParamsValues(val || []);
  } else {
    otherParams = val;
  }

  let newOtherParams = {};
  Object.keys(otherParams || {}).forEach(key => {
    if (key && !data.formItems?.some(item => item?.name === key)) {
      newOtherParams[key] = otherParams[key];
    }
  });
  data.params = { ...data.params, ...newOtherParams };
}

// 触发自定义插槽内容刷新输出
function triggerSlotUpdate(
  formItem: FormItemProps,
  res,
  outputs: Record<string, Function>
) {
  const outputId = formItem?.slotConfig?.outputId;
  if (outputId) {
    outputs[outputId](res);
  }
}
