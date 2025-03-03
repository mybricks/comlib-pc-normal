import React, { useEffect, useMemo, useRef, useState } from 'react';
import css from './index.less';

interface Props {
  maxLines: number;
  children: React.ReactNode;
}

const TextEllipsis: React.FC<Props> = ({ children, maxLines }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsExpanded(!isExpanded);
  };

  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!contentRef.current) return;
        console.log('Element is now in the viewport!');
        const contentHeight = contentRef.current.scrollHeight;
        const lineHeight = parseFloat(window.getComputedStyle(contentRef.current).lineHeight);
        const maxVisibleHeight = lineHeight * maxLines;

        // 根据内容高度判断是否需要显示展开/收起按钮
        setShowToggle(contentHeight > maxVisibleHeight);

        // 设置展开/收起状态
        if (!isExpanded && contentHeight > maxVisibleHeight) {
          setIsExpanded(false);
        } else if (isExpanded && contentHeight <= maxVisibleHeight) {
          setIsExpanded(true);
        }
      }
    });
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    // 清理函数，在组件卸载时停止观察
    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, [isExpanded, maxLines]);

  const style = useMemo(() => {
    return {
      lineHeight: '20px',
      maxHeight: isExpanded ? 'none' : `${maxLines * 20}px`,
      lineClamp: maxLines
    };
  }, [maxLines, isExpanded]);

  return (
    <div
      style={style}
      className={`${css['text-ellipsis']} ${isExpanded ? css.expanded : ''}`}
      ref={contentRef}
    >
      <div className={css.content}>{children}</div>
      {showToggle && (
        <div
          className={css['toggle-button']}
          onClick={handleToggle}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          {isExpanded ? '收起' : '展开'}
        </div>
      )}
    </div>
  );
};

export default TextEllipsis;
