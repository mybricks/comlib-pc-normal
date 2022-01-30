import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Button, Modal } from 'antd';
import { Data, FOOTER_CONTENT_TYPE, Event } from './constants';
import css from './runtime.less';

export default function Dialog({
  env,
  data,
  style,
  slots,
  inputs,
  outputs,
  createPortal
}: RuntimeParams<Data>) {
  const ref = useRef();
  const [visible, setVisible] = useState(style.display !== 'none');
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);

  useEffect(() => {
    // 非编辑模式
    if (env.runtime && inputs) {
      // 打开对话框
      inputs['open'](() => {
        setVisible(true);
      });

      inputs['title']((val: string) => {
        if (typeof val !== 'string') {
          console.error('title 必须为string类型');
        } else {
          data.title = val;
        }
      });

      inputs['hideFooter'](() => {
        data.useFooter = false;
      });

      inputs['showFooter'](() => {
        data.useFooter = true;
      });

      inputs['showTitle'](() => {
        data.hideTitle = false;
      });

      inputs['hideTitle'](() => {
        data.hideTitle = true;
      });

      // 关闭对话框
      inputs['close'](() => {
        close();
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
  }, []);

  // 关闭对话框
  const close: () => void = useCallback(() => {
    setVisible(false);
  }, []);

  // 取消事件
  const cancel: () => void = useCallback(() => {
    close();
    if (outputs) {
      outputs['cancel'](true);
    }
  }, []);

  const eventList = {};
  (data.footerBtns || []).forEach((item) => {
    const { id } = item;
    eventList[id] = () => {
      if (outputs && outputs[id]) {
        outputs[id](true);
      }
    };
  });
  if (edit) {
    return createPortal(
      <div className={css.container} ref={ref}>
        <RuntimeRender
          cfg={{ ...data, bodyStyle: {
            ...data.bodyStyle,
            height: slots.container.size ? undefined : '100px'
          }}}
          visible={true}
          slots={slots}
          getContainer={() => {
            if (ref) {
              return ref.current;
            }
          }}
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
}
const RuntimeRender = ({
  cfg,
  slots,
  event,
  visible,
  getContainer
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
        const { title, id, showText, icon, disabled, hidden, ...res } =
          item;
        return (
          <Button
            {...res}
            hidden={hidden}
            disabled={disabled}
            onClick={event?.[id]}
            // icon={useIcon && <Icon type={icon} />}
            data-btn-id={id}
            key={id}
          >
            {showText && title}
          </Button>
        );
      });
    }

    return (
      slots.footer &&
      slots.footer.render({
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
      title={hideTitle ? undefined : title}
      okText={okText}
      closable={closable}
      centered={centered}
      cancelText={cancelText}
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
