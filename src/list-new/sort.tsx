import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Data } from './constants';
import styles from './style.less';

const rowKey = '_itemKey';

type SortableItemProps<T> = { key: string; item: T; index: number };

interface SortableListProps<T = any> {
  list: Array<T>;
  data: Data;
  renderItem: ({ key, item, index }: SortableItemProps<T>) => void;
}

const SortableItem = SortableElement((props) => {
  return (
    <div className={styles['sort-item']} style={{ zIndex: 10000 }}>
      {props.children}
    </div>
  );
});

const SortableList = SortableContainer(({ list, data, renderItem }: SortableListProps) => {
  return (
    <div
      className={styles['sort-list']}
      style={{ rowGap: data.grid?.gutter ? data.grid?.gutter[1] : 8 }}
    >
      {list.map(({ [rowKey]: key, item }, index) => renderItem({ key, item, index }))}
    </div>
  );
});

export { SortableList, SortableItem };
