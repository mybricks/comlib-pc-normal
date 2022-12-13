import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import css from './runtime.less';

interface Tool {
  id: string;
  title: string;
  outVal: any;
  margin: number[];
  btns?: Tool[];
  style?: string;
  color?: string;
  focusId?: string;
  dataType?: string;
  showText?: boolean;
  inputContent?: any;
  shape: 'circle' | 'round' | undefined;
  size: 'small' | 'middle' | 'large' | any;
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | any;
  hidden?: boolean;
  dynamicDisplay?: boolean;
  dynamicDisabled?: boolean;
  disabled?: boolean;
}

export interface Data {
  tools: Tool[];
  layout: string;
  height: number;
  parentId: string;
  inputContent?: any;
  width: string | number;
}

export default function BottomBar({ env, data, inputs, outputs, style }: RuntimeParams<Data>) {
  const ref = useRef(null);
  const containerRef = useRef(null);

  if (env.runtime && inputs) {
    data.tools.forEach((item) => {
      const { id } = item;
      item.dynamicDisplay &&
        inputs[`hidden${id}`](() => {
          item.hidden = true;
        });
      item.dynamicDisplay &&
        inputs[`display${id}`](() => {
          item.hidden = false;
        });
      item.dynamicDisabled &&
        inputs[`disable${id}`]((ds) => {
          item.disabled = ds;
        });
    });
  }

  const btnClick = useCallback((item: Tool, type = 'btn') => {
    if (env.runtime) {
      const outputVal: string | number =
        item.dataType === 'external' ? item.inputContent || data.inputContent : item.outVal;
      let outputId = '';
      switch (type) {
        case 'btn':
          outputId = item.id;
          break;
        case 'groupBtn':
          outputId = item.id.split('&&')[0];
          break;
      }
      outputs[outputId](outputVal, (_val: any) => {
        console.warn(`return val from (${item.title})`, _val);
      });
    }
  }, []);

  const renderBtn = (tool: Tool, fn: { (arg: Tool): void }) => {
    const { id, type, size, shape, title, margin, showText, disabled } = tool;
    const [left, right] = margin;
    const marginStyle: AnyMap = {
      marginLeft: left + 2,
      marginRight: right + 2,
      height: 'fit-content'
    };
    return !tool.hidden ? (
      <div key={id} data-btn-id={id} style={marginStyle} className={css.button}>
        <Button type={type} size={size} shape={shape} onClick={() => fn(tool)} disabled={disabled}>
          {showText && env.i18n(title)}
        </Button>
      </div>
    ) : null;
  };

  const renderTools = useCallback((tools) => {
    return tools.map((tool) => {
      const { type } = tool;
      const render = renderBtn(tool, btnClick);
      return render;
    });
  }, []);

  const setStyle = useCallback((node) => {
    if (!node) return;
    node.style.overflow = 'unset';
    node.style.height = `${data.height || 64}px`;
    node.style.bottom = 0;
    node.style.zIndex = 2;
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    setStyle(node.parentElement);
  }, []);

  if (env.runtime && !!document.getElementById(data.parentId)) {
    style.display = 'none';
    return ReactDOM.createPortal(
      <div style={{ position: 'relative' }}>
        <div
          className={css.toolbar}
          style={{
            justifyContent: data.layout,
            height: data.height || 64,
            bottom: 0
          }}
        >
          {data.tools?.length > 0 ? (
            renderTools(data.tools)
          ) : (
            <p className={css.suggestion}>在编辑栏中点击"添加按钮"</p>
          )}
        </div>
      </div>,
      document.getElementById(data.parentId)
    );
  }

  useLayoutEffect(() => {
    // @ts-ignore
    const parentElement = containerRef.current.parentElement;
    parentElement.style.bottom = 0;
    parentElement.style.removeProperty('top');
  }, []);

  return (
    <div ref={containerRef} className={css.toolbarWrapper}>
      <div
        className={css.toolbar}
        ref={ref}
        style={{
          justifyContent: data.layout,
          height: data.height || 64,
          width: data.width || '100%'
        }}
      >
        {data.tools?.length > 0 ? (
          renderTools(data.tools)
        ) : (
          <p className={css.suggestion}>在编辑栏中点击"添加按钮"</p>
        )}
      </div>
    </div>
  );
}
