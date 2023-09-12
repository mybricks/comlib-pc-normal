import React, { useCallback } from 'react';
import { Breadcrumb } from 'antd';
import { Data } from './constants';
import css from './runtime.less';

export default function ({ data, outputs, env }: RuntimeParams<Data>) {
  const onItemClick = useCallback(({ event = {}, key }) => {
    const { value } = event;
    // 兼容老数据
    (outputs[key] || outputs['output'])(value);
  }, []);

  const BreadcrumbRender = () => {
    return (
      <Breadcrumb separator="">
        {data.children.map((child, idx) => {
          const { key, label, style } = child || {};
          return (
            <React.Fragment key={key}>
              <Breadcrumb.Item key={key} data-breadcrumb={key} onClick={() => onItemClick(child)}>
                <a className={key}>{env.i18n(label)}</a>
              </Breadcrumb.Item>
              {data.children.length - 1 !== idx && (
                <Breadcrumb.Separator>
                  {data.separator === 'custom' ? data.customSeparator : data.separator}
                </Breadcrumb.Separator>
              )}
            </React.Fragment>
          );
        })}
      </Breadcrumb>
    );
  };

  return (
    <div className={css.container} style={{ padding: data.padding }}>
      {data.children?.length ? (
        <BreadcrumbRender />
      ) : (
        <p className={css.suggestion}>在编辑栏中点击"添加"</p>
      )}
    </div>
  );
}
