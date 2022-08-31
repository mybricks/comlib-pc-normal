import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Button, Modal } from 'antd';
import * as Icons from '@ant-design/icons';
import {
  Data,
  FOOTER_CONTENT_TYPE,
  Event,
  InputIds,
  OutputIds,
  Location,
  SlotIds
} from './constants';
import css from './runtime.less';

export default function Dialog({
  env,
  data,
  style,
  slots,
  inputs,
  outputs,
  logger,
  createPortal
}: RuntimeParams<Data>) {
  const ref = useRef<any>();
  const [visible, setVisible] = useState(style.display !== 'none');
  const [dataSource, setDataSource] = useState();
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);

  useEffect(() => {
    // 非编辑模式
    if (env.runtime && inputs) {
      slots['container'].outputs['close'](val=>{
        setVisible(false)
      })

      // 打开对话框
      inputs[InputIds.Open]((ds) => {
        setDataSource(ds);
        setVisible(true);
      });

      inputs[InputIds.SetTitle]((val: string) => {
        if (typeof val !== 'string') {
          logger.error('title 必须为string类型');
        } else {
          data.title = val;
        }
      });

      inputs[InputIds.HideFooter](() => {
        data.useFooter = false;
      });

      inputs[InputIds.ShowFooter](() => {
        data.useFooter = true;
      });

      inputs[InputIds.ShowTitle](() => {
        data.hideTitle = false;
      });

      inputs[InputIds.HideTitle](() => {
        data.hideTitle = true;
      });

      // 关闭对话框
      inputs[InputIds.Close](() => {
        if (visible) {
          close();
        }
      });

      // 底部按钮动态隐藏/禁用
      (data.footerBtns || []).forEach((item) => {
        if (item.dynamicDisabled) {
          inputs[`disable${item.id}`](() => {
            item.disabled = true;
          });
          inputs[`enable${item.id}`](() => {
            item.disabled = false;
          });
        }
        if (item.dynamicHidden) {
          inputs[`hidden${item.id}`](() => {
            item.hidden = true;
          });
          inputs[`show${item.id}`](() => {
            item.hidden = false;
          });
        }
      });
    }
  }, [visible]);

  // 关闭对话框
  const close: () => void = useCallback(() => {
    setVisible(false);
    outputs[OutputIds.Cancel]();
  }, []);

  // 【老】关闭对话框
  const cancel: () => void = useCallback(() => {
    close();
  }, []);

  const eventList = {};
  (data.footerBtns || []).forEach((item) => {
    const { id, outputDs } = item;
    eventList[id] = () => {
      if (outputs && outputs[id]) {
        outputs[id](outputDs ? dataSource : true);
      }
    };
  });
  if (edit) {
    return createPortal(
      <div className={css.container} ref={ref}>
        <RuntimeRender
          cfg={{
            ...data,
            bodyStyle: {
              ...data.bodyStyle,
              height: slots.container.size ? undefined : '100px'
            }
          }}
          visible={true}
          slots={slots}
          getContainer={() => {
            if (ref) {
              return ref.current;
            }
          }}
          env={env}
        />
      </div>
    );
  }
  if (debug) {
    return createPortal(
      <div className={css.container} ref={ref}>
        <RuntimeRender
          cfg={data}
          visible={visible}
          slots={slots}
          event={{
            ...eventList,
            cancel
          }}
          getContainer={() => {
            if (ref) {
              return ref.current;
            }
          }}
          env={env}
        />
      </div>
    );
  }
  if (runtime) {
    return (
      <div className={css.container}>
        <RuntimeRender
          cfg={data}
          visible={visible}
          slots={slots}
          event={{
            ...eventList,
            cancel
          }}
          env={env}
        />
      </div>
    );
  }
}

interface RuntimeRenderProps {
  cfg: Data;
  slots: any;
  event?: Event;
  visible?: boolean;
  getContainer?: any;
  env: Env;
}
const RuntimeRender = ({
  cfg,
  slots,
  event,
  visible,
  getContainer,
  env
}: RuntimeRenderProps): JSX.Element => {
  const {
    bodyStyle,
    hideTitle,
    title,
    okText,
    closable,
    centered,
    useFooter,
    cancelText,
    width,
    footerBtns
  } = cfg;

  const renderFooter = () => {
    if (cfg.footerType === FOOTER_CONTENT_TYPE.BUTTONS) {
      return (footerBtns || []).map((item) => {
        const {
          title,
          id,
          showText,
          icon,
          useIcon,
          disabled,
          hidden,
          location,
          ...res
        } = item;
        const Icon = useIcon && Icons && Icons[icon as string]?.render();
        return (
          <Button
            {...res}
            hidden={hidden}
            disabled={disabled}
            onClick={event?.[id]}
            data-btn-id={id}
            key={id}
          >
            {useIcon && location !== Location.BACK && Icon}
            {showText && env.i18n(title)}
            {useIcon && location === Location.BACK && Icon}
          </Button>
        );
      });
    }

    return (
      slots[SlotIds.Footer] &&
      slots[SlotIds.Footer].render({
        inputs: {
          slotProps(fn) {
            fn(cfg);
          }
        }
      })
    );
  };

  return (
    <Modal
      visible={visible}
      width={width}
      keyboard={false}
      maskClosable={false}
      title={hideTitle ? undefined : env.i18n(title)}
      okText={env.i18n(okText)}
      closable={closable}
      centered={centered}
      cancelText={env.i18n(cancelText)}
      wrapClassName={css.container}
      footer={useFooter ? renderFooter() : null}
      onCancel={event?.cancel}
      bodyStyle={bodyStyle}
      getContainer={getContainer}
    >
      {slots['container'] && slots['container'].render()}
    </Modal>
  );
};
