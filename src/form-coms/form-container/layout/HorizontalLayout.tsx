import React, { useCallback } from 'react';
import { Form, Col } from 'antd';
import { Data } from '../types';
import css from '../styles.less';

interface HorizontalLayoutProps {
  data: Data;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  isEmpty: boolean;
  isMobile?: boolean;
}

const HorizontalLayout = (props: HorizontalLayoutProps) => {
  const { children, actions, data, isEmpty, isMobile } = props;

  // const actionFlexBasis =
  //   data.actions.widthOption === 'px'
  //     ? `${data.actions.width}px`
  //     : `${(data.actions.span * 100) / 24}%`;
  const { widthOption, width, span } = data.actions;

  const getFlexValue = useCallback(() => {
    if (isMobile) return 1;
    if (widthOption === 'px') {
      return `0 0 ${width || 0}px`;
    } else if (widthOption === 'flexFull') {
      return 1;
    }

    return `0 0 ${(span * 100) / 24}%`;
  }, [widthOption, width, span, isMobile]);

  return (
    <>
      {children}
      {data.actions.visible && (
        <Col
          className={`${isEmpty ? css.emptyHorActions : ''} formAction`}
          flex={getFlexValue()}
          style={{
            textAlign: data.actions.align
          }}
        >
          <Form.Item label={isMobile ? '' : ' '} colon={false}>
            {actions}
          </Form.Item>
        </Col>
      )}
    </>
  );
};

export default HorizontalLayout;
