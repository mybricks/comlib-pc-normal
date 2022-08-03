import { Button, Steps } from 'antd'
import React, { useCallback, useEffect } from 'react'
import classnames from 'classnames'
import { Data } from './constants'
import css from './steps.less'

const { Step } = Steps

export default function ({
  env,
  data,
  slots,
  outputs,
  inputs,
}: RuntimeParams<Data>) {
  const { runtime } = env
  const stepAry = data.stepAry.filter((item) => !item.hide)

  useEffect(() => {
    if (runtime) {
      data.current = 0
    }
  }, [])
  useEffect(() => {
    if (runtime) {
      inputs['nextStep']((ds: any) => {
        if (data.current !== stepAry.length - 1) {
          stepAry[data.current].content = ds
          data.current += 1
        } else {
          if (
            data.fullSubmit ||
            stepAry[data.current]?.id !==
              data.stepAry[data.stepAry.length - 1]?.id
          ) {
            const params = ds
            stepAry.forEach(({ content }) => {
              if (
                Object.prototype.toString.call(content) === '[object Object]'
              ) {
                Object.assign(params, content)
              }
            })
            outputs['submit'](params)
          }
        }
        outputs['nextStep'](ds)
      })

      inputs['prevStep'](() => {
        if (data.current > 0) {
          data.current -= 1
        }
      })

      inputs['submit']((ds: any) => {
        const params = ds
        stepAry.forEach(({ content }) => {
          if (Object.prototype.toString.call(content) === '[object Object]') {
            Object.assign(params, content)
          }
        })

        outputs['submit'](params)
      })

      inputs['reset']((ds: any) => {
        data.current = 0
        outputs['reset'](ds || {})
      })

      stepAry.forEach((item) => {
        if (item && item.useDynamicDisplay) {
          inputs[`show${item.id}`](() => {
            item.hide = false
          })
          inputs[`hide${item.id}`](() => {
            item.hide = true
          })
        }
      })
    }
  }, [stepAry])

  const getCurrentStep = (pre?): any => {
    const step = stepAry[data.current + (pre ? pre : 0)]

    return step || {}
  }

  const next = useCallback((item) => {
    if (env.runtime) {
      const { id } = item
      outputs[id] && outputs[id](data.current)

      // 兼容旧逻辑
      if (!outputs[id] && outputs[data.current]) {
        outputs[data.current](data.current)
      }
    }
  }, [])

  const prev = useCallback(({ id }) => {
    if (env.runtime) {
      data.current = data.current - 1
    }
  }, [])

  const onSubmit = () => {
    if (
      stepAry[data.current]?.id !== data.stepAry[data.stepAry.length - 1]?.id
    ) {
      next(getCurrentStep())
    } else {
      const params = {}
      stepAry.forEach(({ content }) => {
        if (Object.prototype.toString.call(content) === '[object Object]') {
          Object.assign(params, content)
        }
      })
      outputs['submit'](params)
    }
  }

  //计算所有slot，通过display:block|none实现显示隐藏，避免被卸载
  const renderSlots = () => {
    const rtn: any[] = []
    if (!env.preview) {
      for (const id in slots) {
        rtn.push(
          <div
            key={id}
            style={{
              display: `${getCurrentStep().id === id ? 'block' : 'none'}`,
              height: '100%',
            }}
          >
            {slots[id].render()}
          </div>
        )
      }
    }
    return rtn
  }

  const handleReset = () => {
    data.current = 0
    outputs['reset']({})
  }

  return (
    <div className={css.stepbox}>
      <div
        className={classnames(
          data.direction === 'vertical' && css.verticalWrap
        )}
      >
        <Steps
          current={data.current}
          size={data.toolbar.size}
          type={data.toolbar.type}
          direction={data.direction || 'horizontal'}
        >
          {stepAry.map((item: any) => {
            if (data.toolbar.showDesc) {
              return (
                <Step
                  key={item.id}
                  title={env.i18n(item.title)}
                  subTitle={env.i18n(item.subTitle)}
                  description={env.i18n(item.description)}
                  data-item-type="step"
                />
              )
            } else {
              return (
                <Step
                  key={item.id}
                  title={env.i18n(item.title)}
                  subTitle={env.i18n(item.subTitle)}
                  data-item-type="step"
                />
              )
            }
          })}
        </Steps>
        {!data.hideSlots ? (
          <div className={`${css.stepsContent} ${env.preview && css.preview}`}>
            <div className={css.content}>{renderSlots()}</div>
          </div>
        ) : null}
      </div>
      {typeof data.toolbar.showActions === 'undefined' ||
      data.toolbar.showActions ? (
        <div
          className={css.stepsAction}
          data-item-type="stepActions"
          style={{ display: 'flex', justifyContent: data.toolbar.actionAlign }}
        >
          {data.current < stepAry.length - 1 && (
            <Button
              type="primary"
              onClick={() => next(getCurrentStep())}
              data-item-type="next"
            >
              {env.i18n(data.toolbar.primaryBtnText || '下一步')}
            </Button>
          )}
          {data.current === stepAry.length - 1 && data.toolbar.submit && (
            <Button type="primary" onClick={onSubmit} data-item-type="submit">
              {env.i18n(data.toolbar.submitText || '提交')}
            </Button>
          )}
          {data.toolbar.showSecondBtn && data.current > 0 && (
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => prev(getCurrentStep(-1))}
              data-item-type="pre"
            >
              {env.i18n(data.toolbar.secondBtnText || '上一步')}
            </Button>
          )}
          {data.toolbar.reset && (
            <Button danger onClick={handleReset} data-item-type="resetBtn">
              {env.i18n(data.toolbar.resetText || '重置')}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}
