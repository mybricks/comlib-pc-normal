import React from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import { IColumn } from '../../types';
import { route } from '../../../utils/history';
import css from './style.less';
import baseCss from '../../runtime.less';

interface Props {
  value: any;
  record: any;
  tableContent: any;
  columnItem: IColumn;
}

// 模版替换 {id}
function getTemplateHref(template: string, source: any) {
  return template
    .replace(/\{(.*?)\}/g, (match, key) => source[`${key}`.trim()])
    .trim();
}
const LinkRender = (props: Props): JSX.Element => {
  const { value, record, columnItem, tableContent } = props;
  const { linkConfig, key: colKey, ellipsis } = columnItem;
  const { href, rowKey, type, routeType } = linkConfig || {};

  const open = (url: string) => {
    if (url && typeof url === 'string') {
      route[routeType](url.trim(), tableContent.env);
    } else {
      console.warn('跳转链接不能为空', url);
    }
  };
  const onClick = () => {
    switch (type) {
      case 'rowKey':
        open(record[rowKey]);
        break;
      case 'href':
        try {
          open(getTemplateHref(href, record));
        } catch (e) {
          console.error('跳转链接非法', e);
        }
        break;
      case 'click':
        const key = `${colKey}-link-click`;
        tableContent.outputs[key]({ ...record });
        break;
    }
  };

  return (
    <Button type="link" onClick={onClick} className={css.linkBtn}>
      <span className={classnames(ellipsis && baseCss.ellipsisWrap)}>
        {value}
      </span>
    </Button>
  );
};

export default LinkRender;
