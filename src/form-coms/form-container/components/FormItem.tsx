import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Form, Tooltip } from 'antd';
import { Data, FormControlProps } from '../types';
import { usePrevious } from '../../../utils/hooks';
import debounce from 'lodash/debounce';
import { templateRender } from '../../utils';
import css from '../styles.less';
import classnames from 'classnames';

interface FormItemProps {
  data: Data;
  com: any;
  item: any;
  // field: any;
  slots: any;
  isMobile: boolean;
}

const JSXWrapper = (props: FormControlProps) => {
  const { com, value, onChange, field } = props;
  // useLayoutEffect(() => { // 初始化表单项值
  //   com.inputs?.setValue(value) // 需求区分 表单API行为触发 与 用户行为触发 => inputs or _inputs
  // }, [value])

  return com.jsx;
};

const FormItem = (props) => {
  const { com, item, data, slots, isMobile, env } = props;
  const { dynamicStyle = {}, label } = item;
  const [isShowTips, setIsShowTips] = useState(false);
  const formColon = data.config?.colon || data.colon;
  const colon = item?.colon === 'default' ? formColon : item.colon;
  const labelRef = useRef<HTMLLabelElement>();
  const prevLabel = usePrevious(label);

  const labelAlign =
    dynamicStyle.labelAlign && dynamicStyle.labelAlign !== 'default'
      ? dynamicStyle?.labelAlign
      : void 0;
  const labelCol =
    item?.labelWidthType === 'default'
      ? void 0
      : { flex: `0 0 ${item.labelWidth ? item.labelWidth : 98}px` };

  const whiteSpace =
    dynamicStyle.labelAutoWrap && dynamicStyle.labelAutoWrap !== 'default'
      ? dynamicStyle.labelAutoWrap
        ? 'pre-wrap'
        : 'nowrap'
      : void 0;
  const ellipseConfig = useMemo(() => {
    const ellipseMode =
      typeof item.ellipseMode !== 'undefined' ? item.ellipseMode : data.ellipseMode;
    if (ellipseMode === 'ellipse') {
      return {
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        wordBreak: 'break-all',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: '-webkit-box !important'
      };
    }
    if (ellipseMode === 'wrap') {
      return {
        whiteSpace: 'pre-wrap'
      };
    }
    return {};
  }, [data.ellipseMode, item.ellipseMode]);

  //标签换行样式
  useEffect(() => {
    if (!labelRef.current) {
      return;
    }
    // 动态配置的labelAutoWrap 优先级高于表单组件的labelAutoWrap
    let flag = false;
    if (dynamicStyle.labelAutoWrap) {
      flag = true;
    }
    let ellipseMode = typeof item.ellipseMode !== 'undefined' ? item.ellipseMode : data.ellipseMode;
    flag = ellipseMode === 'wrap';
    // if(!flag) return;
    let targetLabel = labelRef.current.closest('.ant-form-item-label');
    if (targetLabel) {
      if (flag) {
        targetLabel.classList.add(css['ant-form-item-cus-wrap']);
      } else {
        targetLabel.classList.remove(css['ant-form-item-cus-wrap']);
      }
    }

    // return flag ? css['ant-form-item-wrap-1'] : ''
  }, [dynamicStyle.labelAutoWrap, data.ellipseMode, labelRef.current, item.ellipseMode]);

  const handleWindowResize = debounce(() => {
    // 一旦resize，将展示提示设为false，mouseEnter的时候，重新计算
    setIsShowTips(false);
  }, 300);

  useEffect(() => {
    if (env.runtime) {
      // 标题宽度类型
      let labelWidthType = getLabelWidthType();
      if (labelWidthType === 'span') {
        // px类型宽度固定，resize不影响label的宽度；span类型，resize，label的宽度时会变的，需要重置展示tip
        window.addEventListener('resize', handleWindowResize);
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }
    }
  }, [env.runtime, data.labelWidthType, item.labelWidthType]);

  useEffect(() => {
    let ellipseMode = typeof item.ellipseMode !== 'undefined' ? item.ellipseMode : data.ellipseMode;
    if (env.runtime && ellipseMode === 'ellipse' && labelRef.current) {
      let labelRefWidth = labelRef.current?.offsetWidth;
      if (labelRef.current.scrollWidth > labelRefWidth) {
        setIsShowTips(true);
      } else {
        setIsShowTips(false);
      }
    }
  }, [
    labelRef.current,
    env.runtime,
    data.ellipseMode,
    item.ellipseMode,
    item.label,
    dynamicStyle.labelAutoWrap
  ]);

  const getEllipseMode = () => {
    return typeof item.ellipseMode !== 'undefined' ? item.ellipseMode : data.ellipseMode;
  };

  const getLabelWidthType = () => {
    return typeof item.labelWidthType !== 'undefined' && item.labelWidthType !== 'default'
      ? item.labelWidthType
      : data.labelWidthType;
  };

  const handleMouseEnter = useCallback(() => {
    let ellipseMode = getEllipseMode();
    if (
      // data.layoutType === 'Form' ||
      env.edit ||
      dynamicStyle.labelAutoWrap === true ||
      ellipseMode === 'wrap' ||
      ellipseMode === 'default'
    ) {
      // 基础表单、编辑态、自动换行不做处理
      return;
    }
    if (isShowTips && prevLabel === item.label) {
      return;
    }
    try {
      const labelRefWidth = labelRef.current?.offsetWidth;
      if (labelRef.current.scrollWidth > labelRefWidth) {
        setIsShowTips(true);
      } else {
        setIsShowTips(false);
      }
    } catch (error) {
      setIsShowTips(false);
    }
  }, [data.layoutType, item.label, prevLabel, isShowTips]);

  const handleHelp = (msg: string) => {
    if (!msg) return '';
    return templateRender(msg, item);
  };

  return (
    <Form.Item
      label={
        item?.hiddenLabel || (isMobile && item?.label?.trim()?.length === 0) ? (
          void 0
        ) : item.labelSlot ? (
          slots[item.labelSlot]?.render({ scope: com.scope })
        ) : (
          <label
            ref={labelRef}
            data-form-item={com.name}
            className="custom-wrap-classname"
            onMouseEnter={handleMouseEnter}
            style={{ ...dynamicStyle.labelStyle, whiteSpace, ...ellipseConfig }}
          >
            <Tooltip
              placement="topLeft"
              title={isShowTips && env.runtime ? env.i18n(item?.label) : null}
            >
              {env.i18n(item?.label)}
            </Tooltip>
          </label>
        )
      }
      className={classnames({
        [css.customLabel]: !!item.labelSlot,
        [css.newRow]: item.titleNewRow
      })}
      // className={item.labelSlot ? css.customLabel : void 0}
      labelCol={labelCol}
      labelAlign={labelAlign || 'left'}
      name={item?.name}
      required={item?.required}
      validateStatus={item?.validateStatus}
      help={handleHelp(item?.help)}
      tooltip={
        item?.tooltip
          ? {
              title: env.i18n(item?.tooltip),
              style: {
                width: 200
              },
              placement: 'right'
            }
          : ''
      }
      colon={!!item?.label && colon}
      hidden={item?.hidden}
    >
      <div
        className={css.formItemControl}
        style={item.titleNewRow ? { paddingLeft: item.labelWidth || '98px' } : undefined}
      >
        <div className={css.formItemSlotContent}>
          <JSXWrapper com={com} />
        </div>
        {item.slotAfter && (
          <div
            className={classnames(
              css.formItemSlotAfter,
              env.edit && slots[item.slotAfter]?.size === 0 && css.formItemSlotAfterEmpty
            )}
          >
            {<Form.Item noStyle>{slots[item.slotAfter]?.render({ scope: com.scope })}</Form.Item>}
          </div>
        )}
      </div>

      {item.description && (
        <div className={`${css.formItemDesc}`}>
          <Form.Item noStyle>
            <span className="formItemDesc" style={dynamicStyle.descriptionStyle}>
              {env.i18n(item.description)}
            </span>
          </Form.Item>
        </div>
      )}
    </Form.Item>
  );
};

export default FormItem;
