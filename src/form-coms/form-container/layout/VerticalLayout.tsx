import React from 'react';
import { Data } from '../types';
import FormActions from '../components/FormActions';
import styles from '../styles.less';

interface VerticalLayoutProps {
  data: Data;
  children?: React.ReactNode;
}

const VerticalLayout = (props: VerticalLayoutProps) => {
  const { children } = props;
  console.log('VerticalLayout 渲染');
  return <div>{children}</div>;
};

export default VerticalLayout;
