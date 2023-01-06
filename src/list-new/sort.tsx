import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import styles from './style.less';

const rowKey = '_itemKey';

const SortableItem = SortableElement(({ item, index, key, slots }) => (
  <div className={styles['sort-item']} style={{ zIndex: 100 }}>
    {slots['item'].render({
      inputValues: {
        itemData: item,
        index: index
      },
      key: key
    })}
  </div>
));

const SortableList = SortableContainer(({ items, slots, data }) => {
  return (
    <div className={styles['sort-list']} style={{ rowGap: data.grid?.gutter[1] }}>
      {items.map(({ [rowKey]: key, item }, index) => (
        <SortableItem key={key} index={index} item={item} slots={slots} />
      ))}
    </div>
  );
});

export { SortableList };
