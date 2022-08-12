import { message, Select } from 'antd';
import React from 'react';
import { runJs } from '../../../package/com-utils';
import { FormItemProps } from '../runtime';

interface Props {
  slots: any;
  env: Env;
  formItem: FormItemProps;
  width: string | number;
  disabled: boolean;
  value?: string;
  mode?: 'multiple' | 'tags';
  onChange?: (value: string) => void;
}

type OptionType = 'default' | 'composition';
interface Option {
  label: string;
  value: string;
  type?: OptionType;
  children?: Option[];
  key: string | number;
  disabled?: boolean;
  dynamicInput?: boolean;
  inputVal?: string;
  width?: number | string;
  inputPlaceholder?: string;
}

export default (props: Props) => {
  const { slots, env, value, mode, onChange, formItem, width, disabled } =
    props;
  const {
    placeholder,
    options,
    useCustomNotFoundContent,
    customNotFoundContentSlotId
  } = formItem;

  if (formItem.dropdownMatchSelectWidth !== false) {
    formItem.dropdownMatchSelectWidth = true;
  }

  if (formItem.labelInValue !== true) {
    formItem.labelInValue = false;
  }

  let timeout: number | null = null;
  const debounceFetch = (value: string, env: any) => {
    const { serviceContent = {} } = formItem;
    if (!serviceContent.id) return;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    const fetchDataForService = () => {
      try {
        env
          .callService(serviceContent.id, { [formItem.name]: value })
          .then((r) => {
            if (formItem.transOptScript) {
              runJs(formItem.transOptScript, [formItem, r]);
            } else {
              formItem.options = handleOptions(r);
            }
          })
          .catch((e) => {
            message.error(e.msg || e);
            console.warn(e);
          });
      } catch (e) {
        message.error(e.msg || e);
        console.warn(e);
      }
    };
    timeout = window.setTimeout(fetchDataForService, 300);
  };
  const searchOptions = (value: string) => {
    if (value) {
      debounceFetch(value, env);
    } else {
      resOptions = [];
    }
  };
  const handleOptions = (options: Option[] | undefined): Option[] => {
    let res: Option[] = [];
    if (!options) {
      res = [];
    } else if (options.length > 0) {
      if (!(options[0].label !== undefined && options[0].value !== undefined)) {
        if (
          (options[0].value && !options[0].label) ||
          (options[0].label && !options[0].value)
        ) {
          res = options.map((item) => {
            const val = item.value || item.label;
            return {
              key: val,
              value: val,
              label: val.toString()
            };
          });
        }
      } else {
        res = options.map((item) => {
          return {
            key: item.value,
            value: item.value,
            label: item.label
          };
        });
      }
    }
    return res;
  };
  let resOptions: Option[] | undefined = handleOptions(options);

  return (
    <Select
      style={{
        width
      }}
      disabled={disabled}
      mode={mode}
      showSearch={formItem.showSearch !== false}
      onSearch={
        typeof formItem.onSearch === 'function'
          ? formItem.onSearch
          : (formItem.dropdownSearchOption &&
              ((value: string) => searchOptions(value))) ||
            undefined
      }
      showArrow={formItem.dropdownShowArrow}
      allowClear={formItem.allowClear}
      optionFilterProp={formItem.optionFilterProp || 'label'}
      filterOption={formItem.filterOption !== false}
      labelInValue={formItem.labelInValue}
      placeholder={placeholder}
      dropdownMatchSelectWidth={formItem.dropdownMatchSelectWidth}
      options={resOptions || options}
      notFoundContent={
        useCustomNotFoundContent && slots && slots[customNotFoundContentSlotId]
          ? slots[customNotFoundContentSlotId].render()
          : undefined
      }
      getPopupContainer={
        env.edit
          ? (node: HTMLElement) => node.parentNode as HTMLElement
          : undefined
      }
      open={env.edit && useCustomNotFoundContent ? true : undefined}
      value={value}
      onChange={onChange}
      tokenSeparators={mode === 'tags' ? [' '] : undefined}
    >
      {selectOptions(resOptions || options)}
    </Select>
  );
};
function selectOptions(options) {
  if (!Array.isArray(options)) return;
  return options.map((item: any) => {
    const { label, value, children } = item;
    if (children) {
      return (
        <Select.OptGroup key={label} label={label}>
          {children.map((i) => {
            return (
              <Select.Option key={i.value} value={i.value}>
                {i.label}
              </Select.Option>
            );
          })}
        </Select.OptGroup>
      );
    } else {
      return (
        <Select.Option key={value} value={value}>
          {label}
        </Select.Option>
      );
    }
  });
}
