import React from 'react';
import { Data } from '../types';
import FormActions from '../components/FormActions';
import styles from '../styles.less';

interface InlineLayoutProps {
  data: Data;
  children?: React.ReactNode;
}

const InlineLayout = (props: InlineLayoutProps) => {
  const { children } = props;
  console.log('InlineLayout 渲染');
  return <div className={styles.slotInlineWrapper}>{children}</div>;
};

export default InlineLayout;
