import { Button, Steps } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { Data, INTO, LEAVE, CLICK, StepItem } from './constants';
import { usePrevious } from '../utils/hooks';
import css from './index.less';
import { checkIfMobile, uuid } from '../utils';
import * as Icons from '@ant-design/icons';

const { Step } = Steps;

export default function ({
  env,
  data,
  slots,
  outputs,
  inputs,
  logger,
  onError
}: RuntimeParams<Data>) {
  const { runtime } = env;
  const stepAry = data.stepAry.filter((item) => !item.hide);
  const preIndex = usePrevious<number>(data.current);
  const isMobile = checkIfMobile(env);

  const direction = isMobile ? 'vertical' : data.steps.direction || 'horizontal';
  const labelPlacement = data.steps.labelPlacement || 'horizontal';

  useEffect(() => {
    if (runtime) {
      data.current = 0;
    }
  }, []);

  useEffect(() => {
    if (runtime) {
      inputs['prevStep'](prev);

      inputs['nextStep']((ds: any, relOutputs) => {
        if (data.current < stepAry.length - 1) {
          stepAry[data.current].content = ds;
          data.current += 1;
          relOutputs['nextStepComplete']();
        }
      });

      inputs['jumpTo']((val: number, relOutputs) => {
        if (typeof val !== 'number') {
          onError('【步骤条】跳转步骤必须是数字');
          logger.error('【步骤条】跳转步骤必须是数字');
          return;
        }
        if (val > stepAry.length - 1 || val < 0) {
          onError('【步骤条】跳转步骤超出范围');
          logger.error('【步骤条】跳转步骤超出范围');
          return;
        }
        data.current = val;
        relOutputs['jumpToComplete']();
      });

      inputs['getIndex']((_, relOutputs) => {
        relOutputs['getIndex'](data.current);
      });

      inputs['setHideSteps'] &&
        inputs['setHideSteps']((val: number[], relOutputs) => {
          if (!Array.isArray(val)) {
            onError('【步骤条】设置隐藏步骤参数必须是数组');
            logger.error('【步骤条】设置隐藏步骤参数必须是数组');
            return;
          }
          data.stepAry.forEach((item, index) => {
            if (val.includes(index)) {
              item.hide = true;
            } else {
              item.hide = false;
            }
          });
          relOutputs['setHideStepsComplete']();
        });

      inputs['setSteps'] &&
        inputs['setSteps']((val: Array<StepItem>, relOutputs) => {
          if (!Array.isArray(val)) {
            onError('【步骤条】步骤数据格式不对');
            return;
          }
          data.stepAry = val.map((item, index) => {
            if (!item.id) {
              item.id = `${uuid()}_${index}`;
            }
            return item;
          });
          relOutputs['setStepsDone'](val);
        });

      // stepAry.forEach(({ id }, index) => {
      //   //最后一步没有next output
      //   if (index < stepAry.length - 1) {
      //     slots[id].outputs[`${id}_next`]((val) => {
      //       if (data.current < stepAry.length - 1) {
      //         stepAry[data.current].content = val;
      //         data.current += 1;
      //       }
      //     });
      //   }
      // });
    }
  }, [stepAry]);

  // useEffect(() => {
  //   if (runtime) {
  //     // stepRenderHook();
  //     stepLeaveHook().then(stepIntoHook);
  //   }
  // }, [data.current]);

  const getPreviousData = () => {
    const content = {};
    for (let i = 0; i < data.current; i++) {
      content[i] = stepAry[i].content;
    }
    return content;
  };

  const stepRenderHook = () => {
    const currentStep = stepAry[data.current];
    if (!currentStep?.render) {
      const slotInputs = slots[stepAry[data.current].id].inputs;
      slotInputs[`${stepAry[data.current].id}_render`] &&
        slotInputs[`${stepAry[data.current].id}_render`]();
    }
  };

  const stepIntoHook = () => {
    stepAry[data.current].render = true; //标记步骤渲染状态
    const { id } = stepAry[data.current];
    outputs[`${id}${INTO}`](getPreviousData());
  };

  const stepLeaveHook = () => {
    if (preIndex === undefined) return Promise.resolve();
    const { id } = stepAry[preIndex];
    return Promise.all([outputs[`${id}${LEAVE}`]()]);
  };

  const getCurrentStep = (pre?): any => {
    return stepAry[data.current + (!!pre ? pre : 0)] || {};
  };

  const runCustomOperation = (id) => {
    if (runtime) {
      outputs[id](undefined);
    }
  };

  const prev = useCallback((_, relOutputs) => {
    if (runtime) {
      if (data.current > 0) {
        data.current -= 1;
        relOutputs['prevStepComplete']();
      }
    }
  }, []);

  const next = useCallback((item) => {
    if (runtime) {
      const { id } = item;
      outputs[id] && outputs[id](data.current);
    }
  }, []);

  const submit = () => {
    if (runtime) {
      outputs['submit'](data.fullSubmit ? getPreviousData() : undefined);
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
            {slots[id]?.render()}
          </div>
        );
      }
    }
    return rtn;
  };

  const renderButtons = () => {
    return data.toolbar.btns.map((btn) => {
      switch (btn.value) {
        case 'previous':
          return renderPreviousBtn();
        case 'next':
          return renderNextBtn();
        case 'submit':
          return renderSubmitBtn();
        default:
          return renderCustomBtn(btn.value);
      }
    });
  };

  const getButton = useCallback(
    (buttonType: string) => {
      return data.toolbar.btns.find((btn) => btn.value === buttonType);
    },
    [data.toolbar.btns]
  );

  const renderCustomBtn = (id: string) => {
    const customBtn = getButton(id);
    return customBtn?.visible ? (
      <Button key={`${id}`} onClick={() => runCustomOperation(id)} data-item-type={`custom-${id}`}>
        {env.i18n(customBtn.label)}
      </Button>
    ) : null;
  };

  const renderPreviousBtn = () => {
    const previousBtn = getButton('previous');
    return previousBtn?.visible && data.current > 0 ? (
      <Button key="previous" onClick={() => prev(getCurrentStep(-1))} data-item-type="pre">
        {env.i18n(previousBtn.label)}
      </Button>
    ) : null;
  };

  const renderNextBtn = () => {
    const nextBtn = getButton('next');
    if (data.current === stepAry.length - 1 || !nextBtn?.visible) return null;
    return (
      <Button
        key="next"
        type="primary"
        onClick={() => next(getCurrentStep())}
        data-item-type="next"
      >
        {env.i18n(nextBtn.label)}
      </Button>
    );
  };

  const renderSubmitBtn = () => {
    const submitBtn = getButton('submit');
    return data.current === stepAry.length - 1 && submitBtn?.visible ? (
      <Button key="submit" type="primary" onClick={submit} data-item-type="submit">
        {env.i18n(submitBtn.label)}
      </Button>
    ) : null;
  };

  const renderExtraBtn = () => {
    return data.toolbar.extraBtns?.length ? (
      <>
        {data.toolbar.extraBtns.map(({ id, text, type }) => (
          <div key={id} data-item-type="extraBtn">
            <Button type={type}>{text}</Button>
          </div>
        ))}
      </>
    ) : null;
  };

  const renderToolbar = () => {
    return data.toolbar.showActions ? (
      <div
        className={`step-toolbar ${css.stepsAction} ${isMobile ? css.mobilebtns : ''} ${
          data.toolbar.fixed ? css['fixed-toolbar'] : ''
        }`}
        data-item-type="stepActions"
        style={{
          justifyContent: data.toolbar.actionAlign,
          position: data.toolbar.fixed ? 'fixed' : 'static',
          bottom: data.toolbar.bottom
        }}
      >
        {renderButtons()}
        {renderExtraBtn()}
      </div>
    ) : null;
  };

  const { type, progressDot } = useMemo(() => {
    const type = data.steps.type as 'default' | 'navigation';
    const progressDot = data.steps.type === 'dotted';
    return { type, progressDot };
  }, [data.steps.type]);

  const onChange = useCallback(() => {
    return data.dynamicSteps
      ? (stepIndex: number) => {
          data.current = stepIndex;
          outputs?.onStepChange({ ...data.stepAry[stepIndex], index: stepIndex });
        }
      : void 0;
  }, [data.dynamicSteps]);

  return (
    <div className={css.stepbox}>
      <div
        className={`${direction === 'vertical' && css.verticalWrap} ${
          isMobile ? css.mobileWrap : ''
        }`}
      >
        <Steps
          current={data.current}
          size={isMobile ? 'small' : data.steps.size}
          type={type}
          progressDot={progressDot}
          direction={direction}
          labelPlacement={labelPlacement}
          onChange={onChange()}
        >
          {stepAry.map((item, index) => {
            const emptyNode = <div style={{ lineHeight: 32 }} />;
            const stepProps = {
              key: item.id,
              title: !!item.title ? env.i18n(item.title) : emptyNode,
              subTitle: !!item.subTitle ? env.i18n(item.subTitle) : emptyNode,
              'data-item-type': 'step'
            };
            if (data.steps.showDesc) {
              stepProps['description'] = !item.useCustomDesc
                ? env.i18n(item.description)
                : slots[`${item.id}_customDescSlot`]?.render();
            }
            if (env.edit || !!data.steps.canClick) {
              stepProps['onStepClick'] = () => {
                data.current = index;
                outputs[`${stepAry[index].id}${CLICK}`](stepAry[index]);
              };
            }
            if (item.useIcon) {
              if (item.customIcon) {
                const imageSize = {
                  width: item.iconSize ? item.iconSize[1] : 'unset',
                  height: item.iconSize ? item.iconSize[0] : 'unset'
                };
                stepProps['icon'] = <img {...imageSize} src={item.iconSrc} />;
              } else if (item.icon) {
                stepProps['icon'] = (
                  <span style={{ fontSize: item.iconSize ? item.iconSize[1] : 'unset' }}>
                    {Icons[item.icon]?.render()}
                  </span>
                );
              }
            }
            return <Step {...stepProps} />;
          })}
        </Steps>
        {!data.hideSlots ? (
          <div className={`${css.stepsContent} ${env.preview && css.preview}`}>
            <div className={css.content}>{renderSlots()}</div>
          </div>
        ) : null}
        {renderToolbar()}
      </div>
    </div>
  );
}
