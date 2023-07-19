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
  SlotIds,
  SlotInputIds,
  DefaultEvent,
  AlignEnum
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
      // 打开对话框
      inputs[InputIds.Open]((ds, relOutputs) => {
        setDataSource(ds);
        slots[SlotIds.Container].inputs[SlotInputIds.DataSource](ds); //推送数据
        setVisible(true);

        // 监听scope输出
        (data.footerBtns || []).forEach((item) => {
          const { id, visible, isConnected, autoClose } = item;
          if (visible === false) return;
          if (slots[SlotIds.Container] && slots[SlotIds.Container].outputs[id]) {
            slots[SlotIds.Container].outputs[id]((val) => {
              item.loading = false;
              isConnected && autoClose !== false && close();
              relOutputs[id](val);
            });
          }
        });
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

      // 底部按钮动态隐藏/禁用/关闭加载
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
        if (item.useBtnLoading) {
          inputs[`stopLoading${item.id}`](() => {
            item.loading = false;
          });
        }
      });
    }
  }, [visible]);

  // 关闭对话框
  const close: () => void = useCallback(() => {
    setVisible(false);
    // 对话框关闭后的回调
    outputs[OutputIds.AfterClose]();
  }, []);

  // 【老】关闭对话框
  const cancel: () => void = useCallback(() => {
    close();
  }, []);

  const eventList = {};
  (data.footerBtns || []).forEach((item) => {
    const { id, isConnected } = item;
    eventList[id] = () => {
      outputs[`${id}Click`]();
      if (isConnected) {
        item.loading = true;
      } else {
        item.autoClose !== false && close();
      }
      // if (slots[SlotIds.Container] && slots[SlotIds.Container].inputs[id]) {
      // slots[SlotIds.Container].inputs[id]();
      // }
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
    maskClosable,
    width,
    footerBtns,
    footerLayout
  } = cfg;
  const renderFooter = () => {
    return (
      <div
        className="toolbar"
        style={{
          justifyContent: footerLayout || AlignEnum.FlexEnd
        }}
      >
        {(footerBtns || []).map((item) => {
          const {
            title,
            id,
            showText,
            icon,
            useIcon,
            visible = true,
            dynamicDisabled,
            dynamicHidden,
            location,
            hidden,
            disabled,
            isConnected,
            loading,
            useBtnLoading,
            autoClose,
            ...res
          } = item;
          const Icon = useIcon && Icons && Icons[icon as string]?.render();
          return (
            <Button
              {...res}
              hidden={!visible || hidden}
              disabled={disabled}
              onClick={event?.[id]}
              data-btn-id={id}
              loading={useBtnLoading && loading}
              key={id}
            >
              {useIcon && location !== Location.BACK && Icon}
              {showText && env.i18n(title)}
              {useIcon && location === Location.BACK && Icon}
            </Button>
          );
        })}
      </div>
    );
  };
  return (
    <Modal
      visible={visible}
      width={width}
      keyboard={false}
      maskClosable={maskClosable}
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
      {slots[SlotIds.Container] && slots[SlotIds.Container].render()}
    </Modal>
  );
};
