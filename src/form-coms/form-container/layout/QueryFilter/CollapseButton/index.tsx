import React, { useMemo, useState, FC } from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Data } from '../../../types';
import styles from './index.less';

interface Props {
  collapsed?: boolean;
  setCollapsed: (collapse: boolean) => void;
  outputs: any;
  env: any;
  data: Data;
}

const CollapseButton: React.FC<Props> = (props) => {
  const { collapsed, setCollapsed, outputs, env, data } = props;
  // const [collapsed, setCollapsed] = useState(false)

  const onClick = () => {
    setCollapsed(!collapsed);
    outputs['onCollapse'] && outputs['onCollapse'](collapsed);
  };

  const icon = useMemo(() => {
    if (collapsed) {
      return <DownOutlined />;
    } else {
      return <UpOutlined />;
    }
  }, [collapsed]);

  return (
    <>
      <a className={`${styles.collapseButton} collapseButton`} onClick={onClick}>
        <span>{collapsed ? env.i18n(data.expandText) : env.i18n(data.collapsedText)}</span>
        <span className={styles.icon}>{icon}</span>
      </a>
    </>
  );
};

export default CollapseButton;
