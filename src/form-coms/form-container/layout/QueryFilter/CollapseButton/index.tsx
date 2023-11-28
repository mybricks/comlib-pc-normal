import React, { useMemo, useState, FC } from 'react';
import { Form, Button, Row, Col, Space } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './index.less';

interface Props {
  collapsed?: boolean;
  setCollapsed: (collapse: boolean) => void;
  outputs: any;
}

const CollapseButton: React.FC<Props> = (props) => {
  const { collapsed, setCollapsed, outputs } = props;
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
      <a className={styles.collapseButton} onClick={onClick}>
        <span>{collapsed ? '展开' : '收起'}</span>
        <span className={styles.icon}>{icon}</span>
      </a>
    </>
  );
};

export default CollapseButton;
