import React, { useCallback, useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Select, Spin } from 'antd';
import { validateFormItem } from '../utils/validator';
import { Data } from './types';
import css from './runtime.less';
import { typeCheck } from '../../utils';
import { OutputIds } from '../types';
import { validateTrigger } from '../form-container/models/validate';
import { onChange as onChangeForFc } from '../form-container/models/onChange';

const DefaultOptionKey = '_id';

/**
 * 计算表单项的输出值
 * @params data 组件数据
 */
const getOutputValue = (data) => {
  let outputValue: any = data.value;
  if (data.config.labelInValue) {
    const option = data.config.options?.find((i) => i.value === outputValue) || {};
    const { value, label } = option;
    outputValue = {
      value,
      label
    };
  }
  if (data.outputValueType === 'option') {
    const { [DefaultOptionKey]: id, ...res } =
      data.config.options.find((i) => i.value === outputValue) || {};
    outputValue = res;
  }
  return outputValue;
};

export default function Runtime({
  env,
  data,
  inputs,
  outputs,
  logger,
  parentSlot,
  id,
  name,
  title
}: RuntimeParams<Data>) {
  //fetching, 是否开启loading的开关
  const [fetching, setFetching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);
  /**
   * 类型校验方法
   */
  const valueTypeCheck = useMemo(() => {
    if (data.config.mode && ['multiple', 'tags'].includes(data.config.mode)) {
      return {
        type: ['ARRAY', 'UNDEFINED', 'NULL'],
        message: `${title}组件:【设置值】参数必须是数组！`
      };
    }
    return {
      type: ['NUMBER', 'BOOLEAN', 'STRING', 'UNDEFINED', 'NULL'],
      message: `${title}组件:【设置值】参数必须是基本类型！`
    };
  }, [data.config.mode, data.config.labelInValue]);

  useLayoutEffect(() => {
    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: data.value,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });

    inputs['getValue']((val, outputRels) => {
      const outputValue = getOutputValue(data);
      outputRels['returnValue'](outputValue);
    });

    inputs['setValue']((val) => {
      if (!typeCheck(val, valueTypeCheck.type)) {
        logger.warn(valueTypeCheck.message);
      } else {
        changeValue(val);
        // data.value = val;
      }
    });

    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        if (!typeCheck(val, valueTypeCheck.type)) {
          logger.warn(valueTypeCheck.message);
        } else {
          if (val == undefined) {
            data.value = '';
          }
          data.value = val;
          const outputValue = getOutputValue(data);
          outputs[OutputIds.OnInitial](outputValue);
        }
      });

    inputs['resetValue'](() => {
      data.value = '';
      data.value = void 0;
    });

    inputs['setOptions']((ds) => {
      if (Array.isArray(ds)) {
        data.config.options = [...ds];

        //计算值更新
        let newValArray: any[] = [],
          newVal;
        let updateValue = false;
        ds.map((item) => {
          const { checked, value } = item;
          if (checked && value != undefined) {
            updateValue = true;
            newVal = value;
            newValArray.push(value);
          }
        });
        if (updateValue) {
          if (data.config.mode && ['tags', 'multiple'].includes(data.config.mode))
            data.value = newValArray;
          if (!data.config.mode || data.config.mode === 'default') data.value = newVal;
        }
      } else {
        logger.warn(`${title}组件:【设置数据源】参数必须是{label, value}数组！`);
      }
    });

    inputs['setLoading']((val: boolean) => {
      data.config = {
        ...data.config,
        loading: val
      };
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });
  }, []);

  useEffect(() => {
    const isNumberString = new RegExp(/^\d*$/);
    if (isNumberString.test(data.maxHeight)) {
      ref.current?.style.setProperty(
        '--select--selection-overflow-max-height',
        data.maxHeight + 'px'
      );
    } else {
      ref.current?.style.setProperty('--select--selection-overflow-max-height', data.maxHeight);
    }
  }, [data.maxHeight]);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id, name });
  };
  const changeValue = useCallback((value) => {
    if (value == undefined) {
      data.value = '';
    }
    data.value = value;
    const outputValue = getOutputValue(data);
    onChangeForFc(parentSlot, { id: id, value: outputValue, name });
    outputs['onChange'](outputValue);
  }, []);
  const onChange = useCallback((val) => {
    let value = val;
    if (data.config.labelInValue) {
      value = val?.value;
    }
    changeValue(value);
    onValidateTrigger();
  }, []);
  const onBlur = useCallback((e) => {
    const outputValue = getOutputValue(data);
    outputs['onBlur'](outputValue);
  }, []);

  const onSearch = (e) => {
    //开启远程搜索功能
    if (data.dropdownSearchOption) {
      outputs['remoteSearch'](e);
      setFetching(true);
    }
    //1、远程数据源
    if (!e && data.dropdownSearchOption === true) {
      data.config.options = [];
      setFetching(false);
    }
    //2、本地数据源, 不做处理
  };

  return (
    <div className={css.select} ref={ref} id="area">
      <Select
        {...data.config}
        options={env.edit ? data.staticOptions : data.config.options}
        value={data.value}
        onChange={onChange}
        onBlur={onBlur}
        getPopupContainer={(triggerNode: HTMLElement) =>
          edit || debug ? triggerNode : document.body
        }
        dropdownClassName={id}
        onSearch={data.config.showSearch ? onSearch : void 0}
        notFoundContent={data.dropdownSearchOption && fetching ? <Spin size="small" /> : void 0}
      />
    </div>
  );
}
