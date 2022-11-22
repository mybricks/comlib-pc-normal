import React, { useLayoutEffect, useState, ReactNode, useCallback } from 'react';
import { Rate } from 'antd';
import { validateFormItem } from '../utils/validator';
import * as Icons from '@ant-design/icons';
import css from './runtime.less';
interface Data {
  options: any[];
  isChoose: boolean;
  choose: string;
  font: string;
  icon?: string;
  color?: string;
  rules: any[];
  config: {
    disabled: boolean;
    defaultValue: number;
    count: number;
  };
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs, env } = props;
  const [value, setValue] = useState<number>(data.config.defaultValue);

  useLayoutEffect(() => {
    //1、设置值
    inputs['setValue']((val) => {
      setValue(val);
      onChange(val);
    });
    //2、设置校验
    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: value,
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
    //3、获取值
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](value);
    });
  }, [value]);

  //4、重置值
  inputs['resetValue'](() => {
    setValue(0);
  });
  //5、设置只读状态
  inputs['setDisabled'](() => {
    data.config.disabled = true;
  });
  //6、设置启用状态
  inputs['setEnabled'](() => {
    data.config.disabled = false;
  });

  //1、值变化
  const onChange = useCallback((value) => {
    setValue(value);
    outputs['onChange'](value);
  }, []);

  const btnItemR = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return <>{Icon}</>;
  };

  return (
    <div>
      <Rate
        allowHalf={true}
        {...data.config}
        value={value}
        onChange={onChange}
        character={
          data.isChoose && (data.choose === 'font' || 'icon')
            ? data.choose === 'font'
              ? data.font
              : btnItemR({ icon: data.icon })
            : void 0
        }
        style={{ color: data.color }}
      ></Rate>
    </div>
  );
}
