import { Form, Input, InputProps } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useFormItemInputs from '../form-container/models/FormItem';
import { validateTrigger } from '../form-container/models/validate';
import { debounceValidateTrigger } from '../form-container/models/validate';
import { validateFormItem, RuleKeys } from '../utils/validator';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import css from './runtime.less';
export interface Data {
  content: string | undefined;
}

export default function ({
  env,
  data,
  _inputs,
  inputs,
  _outputs,
  outputs,
  parentSlot,
  id,
  name
}: RuntimeParams<Data>) {

  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
 
  const handleToggle = () => {
    if(env?.edit) return 
    setIsExpanded(!isExpanded);
  };
 
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      const lineHeight = parseFloat(window.getComputedStyle(contentRef.current).lineHeight);
      const maxLines = 3;
      const maxVisibleHeight = lineHeight * maxLines;
 
      // Initially set the state based on the content height
      if (!isExpanded && contentHeight > maxVisibleHeight) {
        setIsExpanded(false);
      } else if (isExpanded && contentHeight <= maxVisibleHeight) {
        setIsExpanded(true);
      }
    }
  }, [isExpanded]);
 
  return (
    <div className={`${css['content-container']} ${isExpanded ? css.expanded : ''}`} ref={contentRef}>
    <div className={css.content}>
      {data.content}
    </div>
    {!isExpanded && (
      <div className={css['toggle-button']} onClick={handleToggle}>
        展开
      </div>
    )}
    {isExpanded && (
      <div className={css["toggle-button"]} onClick={handleToggle}>
        收起
      </div>
    )}
  </div>
  );
}
