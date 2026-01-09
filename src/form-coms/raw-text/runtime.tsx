import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';

export interface Data {
  content: string | undefined;
  placeholderValue?: string;
  expandRows: number;
}

function isIOS() {
  const u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.includes('iPhone') || u.includes('iPad');
}

export default function (props: RuntimeParams<Data>) {
  const { env, data, inputs, outputs, parentSlot } = props;
  const textRef = useRef<HTMLDivElement | null>(null);
  const [withHiddenStyle, setWithHiddenStyle] = useState(false);
  const [toggleHiddenStyle, setToggleHiddenStyle] = useState(false);
  const [value, setValue] = useState(data.content);

  useFormItemInputs(
    {
      id: props.id,
      name: props.name,
      parentSlot,
      inputs,
      outputs,
      configs: {
        setValue(val) {
          setValue(val);
        },
        setInitialValue(val) {
          setValue(val);
        },
        returnValue(output) {
          output(value);
        },
        resetValue() {
          setValue('');
        },
        validate(model, relOutput) {
          validateFormItem({
            value: value,
            env,
            model,
            rules: []
          }).then((r) => {
            relOutput(r);
          });
        }
      }
    },
    [value]
  );

  useEffect(() => {
    if (!!value && textRef.current) {
      // const lineHeight = getComputedStyle(textRef.current).lineHeight.match(/[0-9]+/)?.[0];
      // 这里如果行高被修改过，会导致样式出现问题（展开按钮无法对齐），因此先固定行高为22
      if (textRef.current?.getBoundingClientRect().height > data.expandRows * 22) {
        setWithHiddenStyle(true);
        setToggleHiddenStyle(true);
      } else {
        setWithHiddenStyle(false);
      }
    }
  }, [value, data.expandRows]);

  if (isIOS()) {
    return (
      <div className={css.textOverflowWrapperIOS}>
        <div
          className={css.textOverflowIOS + ' raw-text-content'}
          style={{
            WebkitLineClamp: !toggleHiddenStyle ? 999 : data.expandRows
          }}
        >
          <span ref={textRef} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', letterSpacing: '0' }}>
            {value || data.placeholderValue}
          </span>
        </div>
        {withHiddenStyle && (
          <Button
            className={css.toggleHiddenBtnIOS}
            onClick={() => {
              setToggleHiddenStyle((v) => !v);
            }}
            type="link"
          >
            {toggleHiddenStyle ? env.i18n('展开') : env.i18n('收起')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={css.textOverflowWrapper}>
      <div
        className={css.textOverflow + ' raw-text-content'}
        style={{
          WebkitLineClamp: !toggleHiddenStyle ? 999 : data.expandRows
        }}
      >
        {withHiddenStyle && toggleHiddenStyle && (
          <Button
            className={css.toggleHiddenBtn + ' text-overflow-wrapper-toggle-hidden-btn'}
            onClick={() => {
              setToggleHiddenStyle((v) => !v);
            }}
            type="link"
          >
            {env.i18n('展开')}
          </Button>
        )}
        <span ref={textRef} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', letterSpacing: '0' }}>
          {value || data.placeholderValue}
        </span>
        {withHiddenStyle && !toggleHiddenStyle && (
          <Button
            className={css.toggleHiddenBottomBtn + ' text-overflow-wrapper-toggle-hidden-btn'}
            onClick={() => {
              setToggleHiddenStyle((v) => !v);
            }}
            type="link"
          >
            {env.i18n('收起')}
          </Button>

      </div>
    </div>
  );
}
