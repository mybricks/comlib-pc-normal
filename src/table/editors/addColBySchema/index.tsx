import React, { useRef, useState } from 'react';
import { render } from 'react-dom';
import { Modal } from 'antd';
import Component from '@fangzhou/cloud/lib/Component';

let divEle;
export default (props): void => {
  divEle = document.createElement('div');
  document.body.appendChild(divEle);
  render(<ColModal {...props} />, divEle);
};
const ColModal = (props) => {
  const { columns, dataIndexOptions, onFinish } = props;
  const [def, setDef] = useState('21533@1.0.8');
  const [visible, setVisible] = useState(true);
  const ref = useRef<any>();

  const onClose = () => {
    setVisible(false);
    document.body.removeChild(divEle);
  };
  const onOk = () => {
    ref.current?.submit();
  };
  const onSubmit = (v) => {
    onFinish({ columns: v?.columns || [], noMatchSchema: v?.noMatchSchema });
    setVisible(false);
  };
  return (
    <Modal
      visible={visible}
      title='设置表格列'
      width={720}
      onCancel={onClose}
      onOk={onOk}
      okText='确定'
      cancelText='取消'
      closable={false}
    >
      <Component
        ref={ref}
        def={def}
        onFinish={onSubmit}
        defaultValue={columns}
        dataIndexOptions={dataIndexOptions}
      />
    </Modal>
  );
};
