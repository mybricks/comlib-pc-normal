import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { throttle } from 'lodash';
import { Data, DefaultStyle } from './constants';
import css from './style.less';

const getContainerId = (key) => `container-${key}`;
const getTitleId = (key) => `title-${key}`;

const isAllInClient = (el) => {
  const { top, bottom } = el.getBoundingClientRect();
  const clientHeight = window.innerHeight;
  return top >= 0 && top < clientHeight && bottom > 0 && bottom <= clientHeight;
};
const isPartInClient = (el) => {
  const { top, bottom } = el.getBoundingClientRect();
  const clientHeight = window.innerHeight;
  return (top >= 0 && top < clientHeight) || (bottom > 0 && bottom <= clientHeight);
};
export default function ({ data, slots, env }: RuntimeParams<Data>) {
  const [activeId, setActiveId] = useState<string>();
  const [isFixed, setIsFixed] = useState<boolean>();

  useEffect(() => {
    if (env.runtime && !env.runtime.debug) {
      const checkTitle = () => {
        if (data.useTitleFixed) {
          setIsFixed(!isAllInClient(document.getElementById(data.componentId)));
        }
      };
      const checkAllSlot = () => {
        checkTitle();
        let activeItem = data.slotList.find((item) =>
          isAllInClient(document.getElementById(getContainerId(item.key)))
        );
        if (!activeItem) {
          activeItem = data.slotList.find((item) =>
            isPartInClient(document.getElementById(getContainerId(item.key)))
          );
        }
        if (activeItem) {
          setActiveId(activeItem.key);
        }
      };
      checkAllSlot();
      const thCheck = throttle(checkAllSlot);
      window.addEventListener('scroll', thCheck);
      return () => {
        window.removeEventListener('scroll', thCheck);
      };
    }
  }, []);

  const onClick = (key) => {
    document.getElementById(getContainerId(key))?.scrollIntoView({
      behavior: data.scrollConfig.behavior,
      block: data.scrollConfig.block,
      inline: data.scrollConfig.inline
    });
  };

  const TitleRender = useCallback(
    ({ isFixed, isHidden }: { isFixed?: boolean; isHidden?: boolean }) => {
      return (
        <div
          id={isFixed ? undefined : data.componentId}
          className={classnames(
            css.titleWrap,
            isFixed && css.fixedTitle,
            isHidden && css.hiddenTitle
          )}
          style={{
            ...(data.titleStyle || {}),
            justifyContent: data.titleAlign
          }}
          data-menu-title
        >
          {data.slotList.map((item, idx) => {
            let targetStyle;
            if (env.edit) {
              targetStyle = item.styleCatelog === '激活样式' ? item.activeStyle : item.style;
            } else {
              targetStyle = activeId === item.key ? item.activeStyle : item.style;
            }
            return (
              <div
                className={classnames(css.titleItem, css.active)}
                key={getTitleId(item.key)}
                data-menu-title-item={item.key}
                style={{
                  marginRight: idx !== data.slotList.length - 1 ? data.titleMargin : 0,
                  ...(targetStyle || { ...DefaultStyle })
                }}
                onClick={() => onClick(item.key)}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      );
    },
    [activeId]
  );

  return (
    <div>
      {isFixed ? <TitleRender isFixed={true} /> : null}
      <TitleRender isHidden={isFixed} />
      {data.slotList.map((item) => {
        return (
          <div key={getContainerId(item.key)} id={getContainerId(item.key)}>
            {slots[item.slotId].render()}
          </div>
        );
      })}
    </div>
  );
}
