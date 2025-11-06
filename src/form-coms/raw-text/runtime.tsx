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
      const contentHeight = parseInt(textRef.current.getBoundingClientRect().height + '');
      const lineheight = parseInt(
        getComputedStyle(textRef.current).getPropertyValue('line-height').replace('px', '')
      );
      console.log(`直接内容-文本 内容高度:${contentHeight},行高:${lineheight},expandRows:${data.expandRows},比较结果:${contentHeight > lineheight * data.expandRows}%c注意！如果发现错误展示【展开/收起】按钮，请检查父元素是否存在导致宽度由小变大的过渡动画（例如antd的Modal），如果在动画过渡中获取高度，由于父元素宽度由小变大导致该组件高度获取的值过大从而错误展示【展开/收起】按钮 :)`, 'color: #fff;background:#f00;');
      if (contentHeight > lineheight * data.expandRows) {
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
          <span
            ref={textRef}
            className={css.textOverflowContent}
          >
            {value || data.placeholderValue}
          </span>
        </div>
        {withHiddenStyle && (
          <Button
            className={css.toggleHiddenBtnIOS + ' text-overflow-wrapper-toggle-hidden-btn'}
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
        {withHiddenStyle && (
          <Button
            className={css.toggleHiddenBtn + ' text-overflow-wrapper-toggle-hidden-btn'}
            onClick={() => {
              setToggleHiddenStyle((v) => !v);
            }}
            type="link"
          >
            {toggleHiddenStyle ? env.i18n('展开') : env.i18n('收起')}
          </Button>
        )}
        <span
          ref={textRef}
          className={css.textOverflowContent}
        >
          {value || data.placeholderValue}
        </span>
      </div>
    </div>
  );
}
