import css from './steps.less';
import { Button, Steps } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useComputed } from '@mybricks/rxui';

const { Step } = Steps;

interface StepAry {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  content: any;
}

interface Toolbar {
  showDesc: number;
  submit: any;
  size: any;
  type: any;
  reset: any;
  showSecondBtn: boolean;
  actionAlign?: string;
  showActions?: boolean;
  primaryBtnText?: string;
  secondBtnText?: string;
  resetText?: string;
  submitText?: string;
}

declare type Data = {
  stepAry: StepAry[];
  current: number;
  toolbar: Toolbar;
  fullSubmit: boolean;
  useSubmitBtnLoading: boolean;
  hideSlots?: boolean
};

export default function ({ env, data, slots, outputs, inputs }: RuntimeParams<Data>) {
  const { runtime } = env;

  inputs &&
    inputs['nextStep']((ds: any, fn: any) => {
      if (data.current !== data.stepAry.length - 1) {
        data.stepAry[data.current].content = ds;
        data.current += 1;
      } else {
        if (data.fullSubmit) {
          const params = ds;
          data.stepAry.forEach(({ content }) => {
            if (Object.prototype.toString.call(content) === '[object Object]') {
              Object.assign(params, content);
            }
          });
          // outputs['fullSubmit'](params);
          outputs['submit'](params);
        }
      }
      outputs['nextStep'](ds);
    });

  inputs &&
    inputs['prevStep']((ds: any, fn: any) => {
      if (data.current > 0) {
        data.current -= 1;
      }
    });

  inputs &&
    inputs['submit']((ds: any, fn: any) => {
      const params = ds;
      data.stepAry.forEach(({ content }) => {
        if (Object.prototype.toString.call(content) === '[object Object]') {
          Object.assign(params, content);
        }
      });

      outputs['submit'](params);
      // outputs['fullSubmit'](params);
    });

  inputs &&
    inputs['reset']((ds: any, fn: any) => {
      data.current = 0;
      outputs['reset'](ds || {});
    });

  useEffect(() => {
    if (runtime) {
      data.current = 0;
    }
  }, []);

  const getCurrentStep = useCallback((pre?) => {
    const step = data.stepAry[data.current + (pre ? pre : 0)];

    return step || {};
  }, []);

  const next = useCallback((item) => {
    if (env.runtime) {
      const { id } = item;
      // let content: any = true;
      // const index = data.stepAry.findIndex((i) => i.id === id);
      outputs[id] && outputs[id](data.current);

      // 兼容旧逻辑
      if (!outputs[id] && outputs[data.current]) {
        outputs[data.current](data.current);
      }

      // if (index === data.stepAry.length - 1) {
      //   outputs[data.current]();
      // }

      // if (index !== data.stepAry.length - 1) {
      //   // data.current += 1;
      //   // outputs[data.current](content, (val: any) => {
      //   //   data.stepAry[index].content = val;
      //   //   if (Object.prototype.toString.call(val) === '[object Object]') {
      //   //     content = Object.assign(content, val);
      //   //   }
      //   // });
      //   outputs[data.current]();
      // } else {
      //   if (data.fullSubmit) {
      //     const params = {};
      //     data.stepAry.forEach(({ content }) => {
      //       if (Object.prototype.toString.call(content) === '[object Object]') {
      //         Object.assign(params, content);
      //       }
      //     });

      //     content = params;
      //     outputs['fullSubmit'](content);
      //   }
      // }
    }

    // outputs[id] &&
    //   outputs[id](content, (val: any) => {
    //     console.log('here')

    //     data.stepAry[index].content = val;

    //     if (index !== data.stepAry.length - 1) {
    //       data.current += 1;
    //     } else {
    //       if (Object.prototype.toString.call(val) === '[object Object]') {
    //         content = Object.assign(content, val);
    //       }
    //       if (data.fullSubmit) {
    //         outputs['fullSubmit'](content); // 全量提交
    //       }
    //     }
    //   });
  }, []);

  const prev = useCallback(({ id }) => {
    if (env.runtime) {
      data.current = data.current - 1;
    }
  }, []);

  const onSubmit = () => {
    const params = {};
    data.stepAry.forEach(({ content }) => {
      if (Object.prototype.toString.call(content) === '[object Object]') {
        Object.assign(params, content);
      }
    });
    outputs['submit'](params);
  }

  //计算所有slot，通过display:block|none实现显示隐藏，避免被卸载
  const renderSlots = useComputed(() => {
    const rtn: any[] = [];
    if (!env.preview) {
      for (const id in slots) {
        rtn.push(
          <div
            key={id}
            style={{ display: `${getCurrentStep().id === id ? 'block' : 'none'}`, height: '100%' }}
          >
            {slots[id].render()}
          </div>
        );
      }
    }
    return rtn;
  });

  const handleReset = () => {
    data.current = 0;
    outputs['reset']({});
  };

  return (
    <div className={css.stepbox}>
      <Steps current={data.current} size={data.toolbar.size} type={data.toolbar.type}>
        {data.stepAry.map((item: any) => {
          if (data.toolbar.showDesc) {
            return (
              <Step
                key={item.id}
                title={item.title}
                subTitle={item.subTitle}
                description={item.description}
                data-item-type="step"
              />
            );
          } else {
            return (
              <Step
                key={item.id}
                title={item.title}
                subTitle={item.subTitle}
                data-item-type="step"
              />
            );
          }
        })}
      </Steps>
     {!data.hideSlots ? <div className={`${css.stepsContent} ${env.preview && css.preview}`}>
        <div className={css.content}>{renderSlots}</div>
      </div> : null}
      {typeof data.toolbar.showActions === 'undefined' || data.toolbar.showActions ? (
        <div
          className={css.stepsAction}
          data-item-type="stepActions"
          style={{ display: 'flex', justifyContent: data.toolbar.actionAlign }}
        >
          {data.current < data.stepAry.length - 1 && (
            <Button type="primary" onClick={() => next(getCurrentStep())} data-item-type="next">
              {data.toolbar.primaryBtnText || '下一步'}
            </Button>
          )}
          {data.current === data.stepAry.length - 1 && data.toolbar.submit && (
            <Button type="primary" onClick={onSubmit} data-item-type="submit">
              {data.toolbar.submitText || '提交'}
            </Button>
          )}
          {data.toolbar.showSecondBtn && data.current > 0 && (
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => prev(getCurrentStep(-1))}
              data-item-type="pre"
            >
              {data.toolbar.secondBtnText || '上一步'}
            </Button>
          )}
          {data.toolbar.reset && (
            <Button danger onClick={handleReset} data-item-type="resetBtn">
              {data.toolbar.resetText || '重置'}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
