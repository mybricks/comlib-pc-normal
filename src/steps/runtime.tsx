import { Button, message, Steps } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Data } from './constants';
import css from './index.less';

const { Step } = Steps;

function usePrevious<T>(value: T): T {
  const ref: any = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function ({ env, data, slots, outputs, inputs }: RuntimeParams<Data>) {
  const { runtime } = env;
  const stepAry = data.stepAry.filter((item) => !item.hide);
  const preIndex = usePrevious<number>(data.current);

  useEffect(() => {
    if (runtime) {
      data.current = 0;
    }
  }, []);

  useEffect(() => {
    if (runtime) {
      inputs['prevStep'](prev);

      inputs['nextStep']((ds: any) => {
        if (data.current < stepAry.length - 1) {
          stepAry[data.current].content = ds;
          data.current += 1;
        } else if (data.fullSubmit) {
          return outputs['submit'](collectParams(ds));
        }
      });

      inputs['jumpTo']((val: number) => {
        if (!val || typeof val !== 'number') {
          message.error('【步骤条】跳转步骤必须是数字');
          return;
        }
        if (val > stepAry.length - 1) {
          message.error('【步骤条】跳转步骤超出范围');
          return;
        }
        data.current = val;
      });

      inputs['submit']((ds: any, relOutputs) => {
        relOutputs['submit'](collectParams(ds));
      });

      inputs['getIndex']((_, relOutputs) => {
        relOutputs['getIndex'](data.current);
      });
    }
  }, [stepAry]);

  useEffect(() => {
    if (runtime) {
      stepLeaveHook().then(stepIntoHook);
    }
  }, [data.current]);

  const stepIntoHook = () => {
    const slotInputs = slots[stepAry[data.current].id].inputs;
    slotInputs[`${stepAry[data.current].id}_into`]({ current: data.current });
  };

  const stepLeaveHook = () => {
    if (preIndex === undefined) return Promise.resolve();
    const slotInputs = slots[stepAry[preIndex].id].inputs;
    return Promise.all([slotInputs[`${stepAry[preIndex].id}_leave`]()]);
  };

  const getCurrentStep = (pre = null): any => {
    return stepAry[data.current + (pre ? pre : 0)] || {};
  };

  const collectParams = (ds: any = {}) => {
    const params = ds;
    stepAry.forEach(({ content }) => {
      if (Object.prototype.toString.call(content) === '[object Object]') {
        Object.assign(params, content);
      }
    });
    return params;
  };

  const prev = useCallback(() => {
    if (runtime) {
      if (data.current > 0) {
        data.current -= 1;
      }
    }
  }, []);

  const next = useCallback((item) => {
    if (runtime) {
      const { id } = item;
      outputs[id] && outputs[id](data.current);
      // 兼容旧逻辑
      if (!outputs[id] && outputs[data.current]) {
        outputs[data.current](data.current);
      }
    }
  }, []);

  const submit = () => {
    if (runtime) {
      outputs['submit'](collectParams());
    }
  };

  //计算所有slot，通过display:block|none实现显示隐藏，避免被卸载
  const renderSlots = () => {
    const rtn: any[] = [];
    if (!env.preview) {
      for (const id in slots) {
        rtn.push(
          <div
            key={id}
            style={{
              display: `${getCurrentStep().id === id ? 'block' : 'none'}`,
              height: '100%'
            }}
          >
            {slots[id].render()}
          </div>
        );
      }
    }
    return rtn;
  };

  const renderPreviousBtn = () => {
    return data.toolbar.showSecondBtn && data.current > 0 ? (
      <Button
        style={{ margin: '0 8px' }}
        onClick={() => prev(getCurrentStep(-1))}
        data-item-type="pre"
      >
        {env.i18n(data.toolbar.secondBtnText || '上一步')}
      </Button>
    ) : null;
  };

  const renderNextBtn = () => {
    if (data.current === stepAry.length - 1) return null;
    return (
      <Button type="primary" onClick={() => next(getCurrentStep())} data-item-type="next">
        {env.i18n(data.toolbar.primaryBtnText || '下一步')}
      </Button>
    );
  };

  const renderSubmitBtn = () => {
    return data.fullSubmit && data.current === stepAry.length - 1 ? (
      <Button type="primary" onClick={submit} data-item-type="submit">
        {env.i18n(data.toolbar.submitText || '提交')}
      </Button>
    ) : null;
  };

  const renderToolbar = () => {
    if (data.toolbar.type === 'never') return null;
    if (data.toolbar.type === 'default')
      return (
        <div
          className={css.stepsAction}
          data-item-type="stepActions"
          style={{ display: 'flex', justifyContent: data.toolbar.actionAlign }}
        >
          {renderPreviousBtn()}
          {renderNextBtn()}
          {renderSubmitBtn()}
        </div>
      );
    if (data.toolbar.type === 'custom')
      return <div style={{ height: 50 }}>{slots.customToolbar.render()}</div>;
  };

  return (
    <div className={css.stepbox}>
      <div className={classnames(data.steps.direction === 'vertical' && css.verticalWrap)}>
        <Steps
          current={data.current}
          size={data.steps.size}
          type={data.steps.type}
          direction={data.steps.direction || 'horizontal'}
        >
          {stepAry.map((item: any) => {
            if (data.steps.showDesc) {
              return (
                <Step
                  key={item.id}
                  title={env.i18n(item.title)}
                  subTitle={env.i18n(item.subTitle)}
                  description={env.i18n(item.description)}
                  data-item-type="step"
                />
              );
            } else {
              return (
                <Step
                  key={item.id}
                  title={env.i18n(item.title)}
                  subTitle={env.i18n(item.subTitle)}
                  data-item-type="step"
                />
              );
            }
          })}
        </Steps>
        {!data.hideSlots ? (
          <div className={`${css.stepsContent} ${env.preview && css.preview}`}>
            <div className={css.content}>{renderSlots()}</div>
          </div>
        ) : null}
      </div>
      {renderToolbar()}
    </div>
  );
}
