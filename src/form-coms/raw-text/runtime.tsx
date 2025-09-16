import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateFormItem } from '../utils/validator';
import css from './runtime.less';

export interface Data {
  content: string | undefined;
  expandRows: number;
}

function isIOS() {
  const u = navigator.userAgent;
  return (
    !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ||
    u.includes('iPhone') ||
    u.includes('iPad')
  );
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
    if (
      !!value &&
      textRef.current &&
      textRef.current?.getBoundingClientRect().height > data.expandRows * 22
    ) {
      setWithHiddenStyle(true);
      setToggleHiddenStyle(true);
    }
  }, [value, data.expandRows]);

  useEffect(() => {
    setValue(data.content);
  }, [data.content]);

  if (isIOS()) {
    return (
      <div className={css.textOverflowWrapperIOS}>
        <div
          className={css.textOverflowIOS + ' raw-text-content'}
          style={{
            WebkitLineClamp: !toggleHiddenStyle ? 999 : data.expandRows
          }}
          ref={textRef}
        >
          <span style={{wordBreak: 'break-word', whiteSpace: 'pre-wrap', letterSpacing: '0'}}>{value}</span>
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
        ref={textRef}
      >
        {withHiddenStyle && (
          <Button
            className={css.toggleHiddenBtn}
            onClick={() => {
              setToggleHiddenStyle((v) => !v);
            }}
            type="link"
          >
            {toggleHiddenStyle ? env.i18n('展开') : env.i18n('收起')}
          </Button>
        )}
        <span style={{wordBreak: 'break-word', whiteSpace: 'pre-wrap', letterSpacing: '0'}}>{value}</span>
      </div>
    </div>
  );
}
