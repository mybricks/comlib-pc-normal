import React from 'react';
import styles from './styles.less';

export interface Data {
  styleType: string;
}

export default function (props: RuntimeParams<Data>) {
  const { slots, data } = props;

  return (
    <div className={styles.unorderedListWrapper}>
      <ul>
        {slots['content'].render({
          wrap(comAray: { id; jsx; def; inputs; outputs }[]) {
            return comAray?.map((item) => {
              return (
                <li
                  key={item.id}
                  className={styles.unorderedListItem}
                  style={{ listStyleType: data.styleType }}
                >
                  {item.jsx}
                </li>
              );
            });
          }
        })}
      </ul>
    </div>
  );
}
