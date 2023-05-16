import React, { useEffect } from 'react';
import { Data } from './constants';
import css from './runtime.less';
import { Progress, Tooltip } from 'antd';

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  useEffect(() => {
    if (env.runtime) {
      //设置进度
      inputs['setPercent']((ds: number) => {
        data.percent = ds;
      });
      //设置颜色
      inputs['setColor']((ds: string) => {
        data.strokeColor = ds;
      });
    }
  });
  let fontSize = Number(data.circleSize.slice(0, -2));
  useEffect(() => {
    if (data.type !== 'line') {
      document.body.style.setProperty('--inner--size', data.circleSize);
      if (fontSize <= 60 && fontSize > 20) {
        document.body.style.setProperty('--inner--font-size', '14px');
      } else if (fontSize <= 20) {
        document.body.style.setProperty('--inner--font-size', '0px');
      } else {
        document.body.style.setProperty('--inner--font-size', '24px');
      }
    }
  }, [data.circleSize]);

  return (
    <div className={css.progress}>
      <div className={data.type !== 'line' ? css.circleProgress : void 0}>
        {fontSize <= 20 ? (
          <Tooltip title={data.percent + '%'}>
            <Progress
              percent={data.percent}
              type={data.type}
              showInfo={data.isShow}
              status={data.status}
              steps={data.isSteps ? data.steps : void 0}
              size={data.size}
              strokeColor={data.isColor ? data.strokeColor : void 0}
            />
          </Tooltip>
        ) : (
          <Progress
            percent={data.percent}
            type={data.type}
            showInfo={data.isShow}
            status={data.status}
            steps={data.isSteps && data.type === 'line' ? data.steps : void 0}
            size={data.size}
            strokeColor={data.isColor ? data.strokeColor : void 0}
          />
        )}
      </div>
    </div>
  );
}
