import React, { useEffect } from 'react';
import { Data } from './constants';
import css from './runtime.less';
import { Progress, Tooltip } from 'antd';
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined
} from '@ant-design/icons';

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  useEffect(() => {
    if (env.runtime) {
      //设置进度
      inputs['setPercent']((ds: number, relOutputs) => {
        data.percent = ds;
        relOutputs['setPercentDone'](ds);
      });
      //设置颜色
      inputs['setColor']((ds: string, relOutputs) => {
        data.strokeColor = ds;
        relOutputs['setColorDone'](ds);
      });
      //设置状态
      inputs['setStatus']((ds: 'success' | 'exception' | 'normal' | 'active', relOutputs) => {
        data.status = ds;
        relOutputs['setStatusDone'](ds);
      });
    }
  });

  // 调整因circleSize变化导致的内容字体
  // 自定义进度值
  const circleSizeFormat = (percent?: number, successPercent?: number): React.ReactNode => {
    if (data.type === 'line') {
      if (data.status === 'success') {
        return <CheckCircleFilled />;
      } else if (data.status === 'exception') {
        return <CloseCircleFilled />;
      }
    }

    if (data.type === 'circle' || data.type === 'dashboard') {
      if (data.status === 'success') {
        return <CheckOutlined />;
      } else if (data.status === 'exception') {
        return <CloseOutlined />;
      }
    }
    let percentFormat =
      data?.formatFunction && data?.isFormat && data?.isShow
        ? data.formatFunction.replace(/{([^}]+)}/g, `${percent}`)
        : `${percent}%`;
    if (data.type !== 'line') {
      if (data.circleSize <= 60 && data.circleSize > 20) {
        return <span style={{ fontSize: '12px' }}>{percentFormat}</span>;
      } else if (data.circleSize > 60) {
        return <span style={{ fontSize: '24px' }}>{percentFormat}</span>;
      } else {
        return null;
      }
    }
    return percentFormat;
  };

  return (
    <div className={css.progress}>
      <div className={data.type !== 'line' ? css.circleProgress : void 0}>
        {data.circleSize <= 20 ? (
          <Tooltip title={data.percent + '%'}>
            <Progress
              percent={data.percent}
              format={() => null}
              type={data.type}
              showInfo={data.isShow}
              status={data.status}
              steps={data.isSteps ? data.steps : void 0}
              size={data.size}
              strokeColor={data.isColor ? data.strokeColor : void 0}
              trailColor={data.isColor ? data.trailColor : void 0}
              strokeWidth={data.strokeWidth}
              width={data.circleSize}
            />
          </Tooltip>
        ) : (
          <Progress
            percent={data.percent}
            format={circleSizeFormat}
            type={data.type}
            showInfo={data.isShow}
            status={data.status}
            steps={data.isSteps && data.type === 'line' ? data.steps : void 0}
            size={data.size}
            strokeColor={data.isColor ? data.strokeColor : void 0}
            trailColor={data.isColor ? data.trailColor : void 0}
            strokeWidth={data.strokeWidth}
            width={data.circleSize}
          />
        )}
      </div>
    </div>
  );
}
