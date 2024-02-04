import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import css from './index.less';

export function Dropdown({ menus, children, overlayClassName }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        if (!show) {
          setShow(true);
        }
        setOpen(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
      }}
    >
      {children}
      {show &&
        createPortal(
          <Menus
            menus={menus}
            positionElement={ref.current}
            open={open}
            className={overlayClassName}
          />,
          document.body
        )}
    </div>
  );
}

function Menus({ menus, positionElement, open, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const menusContainer = ref.current;
    if (open) {
      const positionElementBct = positionElement.getBoundingClientRect();
      const menusContainerBct = ref.current.getBoundingClientRect();
      const totalHeight = window.innerHeight || document.documentElement.clientHeight;
      // const totalWidth = window.innerWidth || document.documentElement.clientWidth

      const top = positionElementBct.top + positionElementBct.height;
      const right = positionElementBct.left + positionElementBct.width;
      const letf = right - menusContainerBct.width;
      const bottom = top + menusContainerBct.height;

      if (bottom > totalHeight) {
        // 目前判断下方是否超出即可
        // 向上
        menusContainer.style.top = positionElementBct.top - menusContainerBct.height + 'px';
      } else {
        menusContainer.style.top = top + 'px';
      }

      menusContainer.style.left = letf + 'px';
      menusContainer.style.visibility = 'visible';
    } else {
      menusContainer.style.visibility = 'hidden';
    }
  }, [open]);

  return (
    <div ref={ref} className={`${css.menusContainer} ${className}`}>
      {menus.map(({ key, label }) => {
        return <div key={key}>{label}</div>;
      })}
    </div>
  );
}
