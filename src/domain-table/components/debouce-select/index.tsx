import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ajax } from '../../util';
import { Field } from '../../type';

interface DebounceSelectProps {
  disabled?: boolean;
  value?: string;
  mappingFormItemOptions?: Record<string, unknown>;
  onChange?(value: string): void;
  fetchParams: Record<string, unknown>;
  field: Field;
  placeholder: string;
}
type ValueType = any;

const DebounceSelect: FC<DebounceSelectProps> = (props) => {
  const { disabled, value, fetchParams, mappingFormItemOptions, onChange, field, placeholder } =
    props;
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const fetchOptions = useCallback(
    (value: string) => {
      setFetching(true);
      const { form, ...curField } = field;
      const primaryField = (curField.mapping?.entity?.fieldAry as Field[]).find(
        (field) => field.isPrimaryKey
      );

      return ajax({
        ...fetchParams,
        params: {
          action: 'SEARCH_BY_FIELD',
          field: curField,
          orders: primaryField ? [{ fieldId: primaryField.id, order: 'DESC' }] : undefined,
          query: { keyword: value }
        }
      })
        .then((data) => {
          return (data ?? []).map((item) => {
            let label = '';
            if (form.mapping?.optionLabel) {
              label = item[form.mapping?.optionLabel];
            } else {
              Object.keys(item)
                .filter((key) => key !== 'id')
                .forEach((key) => {
                  if (typeof item[key] !== 'object' && !key.startsWith('_')) {
                    label += label ? '-' + item[key] : item[key];
                  }
                });
            }
            return { ...item, label: label || item.id, value: item.id };
          });
        })
        .finally(() => setFetching(false));
    },
    [fetchParams, field]
  );

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;

      setOptions([]);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }

        setOptions(newOptions);
      });
    };

    return debounce(loadOptions, 500);
  }, [fetchOptions]);

  const onCurChange = useCallback(
    (value) => {
      const curOptions = options.filter((option) => option.value === value);

      if (mappingFormItemOptions) {
        mappingFormItemOptions[field.name] = curOptions;
      }

      onChange?.(value);
    },
    [options, onChange, field, mappingFormItemOptions]
  );

  useEffect(() => {
    const promises = [fetchOptions('')];
    if (value) {
      promises.push(fetchOptions(value));
    }

    Promise.all(promises).then(([options1, options2 = []]) => {
      const curOptions: any[] = [],
        curOptionsMap = {};
      [...options2, ...options1].forEach((option) => {
        if (curOptionsMap[option.value]) {
          return;
        }
        curOptions.push(option);
        curOptionsMap[option.value] = 1;
      });

      setOptions(curOptions);
    });
  }, []);

  return (
    <Select
      disabled={disabled}
      showSearch
      allowClear
      defaultActiveFirstOption
      showArrow={false}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      options={options}
      value={value as ValueType}
      onChange={onCurChange}
      placeholder={placeholder}
    />
  );
};

export default DebounceSelect;
