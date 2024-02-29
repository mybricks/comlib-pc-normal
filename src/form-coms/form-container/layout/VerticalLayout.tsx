import React, { useCallback } from 'react';
import { Form, Col } from 'antd';
import { unitConversion } from '../../../utils';
import { Data } from '../types';
import styles from '../styles.less';

interface VerticalLayoutProps {
  data: Data;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  isEmpty: boolean;
  isMobile?: boolean;
}

const VerticalLayout = (props: VerticalLayoutProps) => {
  const { children, actions, data, isEmpty, isMobile } = props;
  const { align, widthOption, width, span, inlinePadding } = data.actions;

  const actionStyle: React.CSSProperties = {
    textAlign: align
    // padding: inlinePadding?.map(String).map(unitConversion).join(' ')
  };
  // const actionFlexBasis = widthOption === 'px' ? `${width}px` : `${(span * 100) / 24}%`;

  const getFlexValue = useCallback(() => {
    if (widthOption === 'px') {
      return `0 0 ${width || 0}px`;
    } else if (widthOption === 'flexFull') {
      return 1;
    }

    return `0 0 ${(span * 100) / 24}%`;
  }, [widthOption, width, span]);

  return (
    <>
      {children}
      {data.actions.visible && (
        <Col
          className={`${
            isEmpty
              ? data.formItemColumn === 1
                ? `${styles.emptyVerActions} ${styles.onlyone}`
                : styles.emptyVerActions
              : ''
          } formAction`}
          style={actionStyle}
          flex={getFlexValue()}
        >
          <Form.Item label={isMobile || data.formItemColumn === 1 ? undefined : ' '} colon={false}>
            {actions}
          </Form.Item>
        </Col>
      )}
    </>
  );
};

export default VerticalLayout;
