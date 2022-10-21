import React from 'react';
import { Row, Col } from 'antd';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import styles from './index.less';

export interface Data {
  gutter?: number;
  cols: Array<{
    id: string;
    flex: number | undefined;
    slot?: any;
  }>;
}

export default function ({ env, data, inputs, slots }: RuntimeParams<Data>) {
  const { runtime } = env;
  const renderResizeCol = () => {
    const dom: Array<JSX.Element> = [];
    data.cols.forEach(({ flex, id }, index) => {
      dom.push(
        <ReflexElement
          key={id}
          flex={flex}
          onStopResize={({ component }) => {
            data.cols[index].flex = component.props.flex;
          }}
        >
          <div className={styles.col}>col (resizeable)</div>
        </ReflexElement>
      );
      if (index < data.cols.length - 1) {
        dom.push(<ReflexSplitter key={index} />);
      }
    });
    return (
      <ReflexContainer orientation="vertical" className={styles.row}>
        {dom}
      </ReflexContainer>
    );
  };

  const renderGrid = () => {
    return (
      <Row gutter={data.gutter} justify={'center'} align="middle" className={styles.row}>
        {data.cols.map(({ id, flex }) => (
          <Col key={id} flex={flex}>
            <h1>{id}</h1>
          </Col>
        ))}
      </Row>
    );
  };

  return runtime ? renderGrid() : renderResizeCol();
}
